import { z } from "zod";
import { Problem, type Media, type Kind, type Video } from "./model.js";
export interface Catalog {
  list(type: Kind, q: string, page: number): Promise<Media[]>;
  detail(type: Kind, id: number): Promise<Media>;
  videos(type: Kind, id: number): Promise<Video[]>;
}
const demos: Media[] = [
  {
    id: 900001,
    type: "movie",
    title: "Órbita Azul",
    overview: "Una tripulación busca un nuevo hogar entre las estrellas.",
    poster: null,
  },
  {
    id: 900002,
    type: "movie",
    title: "La Última Estación",
    overview: "Dos viajeros coinciden al final de una larga ruta.",
    poster: null,
  },
  {
    id: 900003,
    type: "tv",
    title: "Código Aurora",
    overview: "Un equipo investiga señales que nadie puede explicar.",
    poster: null,
  },
];
const rawMedia = z.object({
  id: z.number(),
  title: z.string().optional(),
  name: z.string().optional(),
  overview: z.string().optional(),
  poster_path: z.string().nullable().optional(),
});
function normalize(value: unknown, type: Kind): Media {
  const m = rawMedia.parse(value);
  return {
    id: m.id,
    type,
    title: (m.title ?? m.name ?? "Sin título").slice(0, 120),
    overview: (m.overview ?? "Sin sinopsis").slice(0, 3000),
    poster: m.poster_path
      ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
      : null,
  };
}
async function request(
  path: string,
  params: Record<string, string> = {},
): Promise<unknown> {
  const token = process.env.TMDB_READ_ACCESS_TOKEN;
  if (!token) throw new Problem(503, "Falta el token de TMDB en el backend");
  const url = new URL(`https://api.themoviedb.org/3/${path}`);
  url.search = new URLSearchParams({
    language: "es-MX",
    include_adult: "false",
    ...params,
  }).toString();
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(8000),
    });
    if (res.status === 404) throw new Problem(404, "Título no encontrado");
    if (!res.ok)
      throw new Problem(
        503,
        "El catálogo no está disponible. Intenta más tarde.",
      );
    return await res.json();
  } catch (e) {
    if (e instanceof Problem) throw e;
    throw new Problem(503, "No se pudo conectar con TMDB");
  }
}
export function makeCatalog(mode: "demo" | "tmdb"): Catalog {
  return {
    async list(type, q, page) {
      if (mode === "demo")
        return page === 1
          ? demos.filter(
              (m) =>
                m.type === type &&
                m.title.toLowerCase().includes(q.toLowerCase()),
            )
          : [];
      const result = z
        .object({ results: z.array(z.unknown()) })
        .parse(
          await request(q ? `search/${type}` : `${type}/popular`, {
            query: q,
            page: String(page),
          }),
        );
      return result.results.map((m) => normalize(m, type));
    },
    async detail(type, id) {
      if (mode === "demo") {
        const m = demos.find((m) => m.type === type && m.id === id);
        if (!m) throw new Problem(404, "Título no encontrado");
        return m;
      }
      return normalize(await request(`${type}/${id}`), type);
    },
    async videos(type, id) {
      if (mode === "demo") return [];
      const schema = z.object({
        results: z.array(
          z.object({
            key: z.string(),
            name: z.string(),
            site: z.string(),
            type: z.string(),
          }),
        ),
      });
      for (const language of ["es-MX", "en-US"]) {
        const response = schema.parse(
          await request(`${type}/${id}/videos`, { language }),
        );
        const videos = response.results.filter(
          (v) =>
            v.site === "YouTube" &&
            v.type === "Trailer" &&
            /^[\w-]{11}$/.test(v.key),
        );
        if (videos.length)
          return videos.map((v) => ({ id: v.key, title: v.name }));
      }
      return [];
    },
  };
}
