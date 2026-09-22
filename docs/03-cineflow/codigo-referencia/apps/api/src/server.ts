import "dotenv/config";
import { z } from "zod";
import { createApp } from "./app.js";
import { makeCatalog } from "./catalog.js";
import { store, verify } from "./store.js";
const env = z
  .object({
    PORT: z.coerce.number().default(4000),
    CORS_ORIGIN: z.string().url().default("http://localhost:5173"),
    CATALOG_MODE: z.enum(["demo", "tmdb"]).default("demo"),
  })
  .parse(process.env);
if (process.env.NODE_ENV === "production" && env.CATALOG_MODE !== "tmdb")
  throw new Error("Producción requiere CATALOG_MODE=tmdb");
createApp({
  store,
  verify,
  catalog: makeCatalog(env.CATALOG_MODE),
  origin: env.CORS_ORIGIN,
}).listen(env.PORT, () =>
  console.log(
    `CineFlow API: http://localhost:${env.PORT} — catálogo ${env.CATALOG_MODE}`,
  ),
);
