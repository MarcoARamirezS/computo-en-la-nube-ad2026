import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import {
  addProfile,
  mediaSchema,
  nameSchema,
  Problem,
  profileOf,
  progressSchema,
  saveHistory,
  type Media,
} from "./model.js";
import type { Store } from "./store.js";
import type { Catalog } from "./catalog.js";
export function createApp(deps: {
  store: Store;
  verify: (token: string) => Promise<string>;
  catalog: Catalog;
  origin: string;
}) {
  const app = express();
  app.disable("x-powered-by");
  app.use(helmet());
  app.use(cors({ origin: deps.origin }));
  app.use(express.json({ limit: "8kb" }));
  app.use(
    rateLimit({
      windowMs: 60000,
      limit: 120,
      standardHeaders: "draft-8",
      legacyHeaders: false,
    }),
  );
  app.get("/health", (_req, res) => res.json({ ok: true }));
  app.get("/api/catalog", async (req, res) => {
    const query = z
      .object({
        type: z.enum(["movie", "tv"]).default("movie"),
        q: z.string().trim().max(100).default(""),
        page: z.coerce.number().int().min(1).max(500).default(1),
      })
      .parse(req.query);
    res.json({
      data: await deps.catalog.list(query.type, query.q, query.page),
    });
  });
  app.get("/api/catalog/:type/:id", async (req, res) => {
    const m = mediaSchema.parse(req.params);
    res.json({ data: await deps.catalog.detail(m.type, m.id) });
  });
  app.get("/api/catalog/:type/:id/videos", async (req, res) => {
    const m = mediaSchema.parse(req.params);
    res.json({ data: await deps.catalog.videos(m.type, m.id) });
  });
  app.use("/api", async (req, res, next) => {
    const token = req.headers.authorization?.match(/^Bearer (.+)$/)?.[1];
    if (!token) throw new Problem(401, "Inicia sesión");
    res.locals.uid = await deps.verify(token);
    next();
  });
  app.put("/api/me", async (_req, res) =>
    res.json({ data: await deps.store.change(res.locals.uid, (a) => a) }),
  );
  app.get("/api/me", async (_req, res) =>
    res.json({ data: await deps.store.read(res.locals.uid) }),
  );
  app.patch("/api/me", async (req, res) => {
    const { name } = nameSchema.parse(req.body);
    res.json({
      data: await deps.store.change(res.locals.uid, (a) => {
        a.name = name;
        return a;
      }),
    });
  });
  app.post("/api/profiles", async (req, res) => {
    const { name } = nameSchema.parse(req.body);
    const id = randomUUID();
    res.status(201).json({
      data: await deps.store.change(res.locals.uid, (a) => {
        addProfile(a, id, name);
        return a;
      }),
    });
  });
  app.patch("/api/profiles/:profileId", async (req, res) => {
    const { name } = nameSchema.parse(req.body);
    res.json({
      data: await deps.store.change(res.locals.uid, (a) => {
        profileOf(a, String(req.params.profileId)).name = name;
        return a;
      }),
    });
  });
  app.delete("/api/profiles/:profileId", async (req, res) => {
    await deps.store.change(res.locals.uid, (a) => {
      const p = profileOf(a, String(req.params.profileId));
      if (p.id === "main")
        throw new Problem(409, "El perfil principal no se puede borrar");
      a.profiles = a.profiles.filter((v) => v.id !== p.id);
    });
    res.status(204).end();
  });
  function compact(m: Media): Media {
    return { ...m, overview: "" };
  }
  app.put("/api/profiles/:profileId/favorites/:type/:id", async (req, res) => {
    const m = mediaSchema.parse(req.params);
    const id = String(req.params.profileId);
    profileOf(await deps.store.read(res.locals.uid), id);
    const media = compact(await deps.catalog.detail(m.type, m.id));
    await deps.store.change(res.locals.uid, (a) => {
      const p = profileOf(a, id);
      const key = `${m.type}_${m.id}`;
      if (!p.favorites[key] && Object.keys(p.favorites).length >= 50)
        throw new Problem(409, "Máximo 50 favoritos por perfil");
      p.favorites[key] ??= { media, addedAt: new Date().toISOString() };
    });
    res.json({ data: { saved: true } });
  });
  app.delete(
    "/api/profiles/:profileId/favorites/:type/:id",
    async (req, res) => {
      const m = mediaSchema.parse(req.params);
      await deps.store.change(res.locals.uid, (a) => {
        delete profileOf(a, String(req.params.profileId)).favorites[
          `${m.type}_${m.id}`
        ];
      });
      res.status(204).end();
    },
  );
  app.put("/api/profiles/:profileId/history/:type/:id", async (req, res) => {
    const m = mediaSchema.parse(req.params);
    const input = progressSchema.parse(req.body);
    const id = String(req.params.profileId);
    profileOf(await deps.store.read(res.locals.uid), id);
    if (
      !(await deps.catalog.videos(m.type, m.id)).some(
        (v) => v.id === input.videoId,
      )
    )
      throw new Problem(400, "El video no pertenece al título");
    const media = compact(await deps.catalog.detail(m.type, m.id));
    res.json({
      data: await deps.store.change(res.locals.uid, (a) =>
        saveHistory(profileOf(a, id), media, input),
      ),
    });
  });
  app.delete("/api/profiles/:profileId/history/:key", async (req, res) => {
    const key = z
      .string()
      .regex(/^(movie|tv)_\d+_[\w-]{11}$/)
      .parse(req.params.key);
    await deps.store.change(res.locals.uid, (a) => {
      delete profileOf(a, String(req.params.profileId)).history[key];
    });
    res.status(204).end();
  });
  app.use((_req, _res, next) => next(new Problem(404, "Ruta no encontrada")));
  app.use(
    (
      error: unknown,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction,
    ) => {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Revisa los datos enviados" });
        return;
      }
      if (error instanceof SyntaxError && "body" in error) {
        res.status(400).json({ error: "JSON inválido" });
        return;
      }
      const status = error instanceof Problem ? error.status : 500;
      if (status === 500)
        console.error(
          "Error interno de la API; revisa la configuración de Firebase y sus permisos.",
        );
      res
        .status(status)
        .json({
          error:
            error instanceof Problem
              ? error.message
              : "Error interno del servidor",
        });
    },
  );
  return app;
}
