import { z } from "zod";
export type Kind = "movie" | "tv";
export interface Media {
  id: number;
  type: Kind;
  title: string;
  overview: string;
  poster: string | null;
}
export interface Video {
  id: string;
  title: string;
}
export interface Favorite {
  media: Media;
  addedAt: string;
}
export interface History {
  media: Media;
  videoId: string;
  position: number;
  duration: number;
  version: number;
  completed: boolean;
  updatedAt: string;
}
export interface Profile {
  id: string;
  name: string;
  favorites: Record<string, Favorite>;
  history: Record<string, History>;
}
export interface Account {
  name: string;
  profiles: Profile[];
}
export const emptyAccount = (): Account => ({
  name: "Mi cuenta",
  profiles: [{ id: "main", name: "Principal", favorites: {}, history: {} }],
});
export class Problem extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export const nameSchema = z
  .object({ name: z.string().trim().min(1).max(30) })
  .strict();
export const mediaSchema = z.object({
  type: z.enum(["movie", "tv"]),
  id: z.coerce.number().int().positive(),
});
export const progressSchema = z
  .object({
    videoId: z.string().regex(/^[\w-]{11}$/),
    position: z.number().finite().min(0),
    duration: z.number().finite().positive().max(14400),
    version: z.number().int().min(0),
  })
  .strict()
  .refine((v) => v.position <= v.duration, "La posición supera la duración");
export function profileOf(account: Account, id: string): Profile {
  const p = account.profiles.find((p) => p.id === id);
  if (!p) throw new Problem(404, "Perfil no disponible");
  return p;
}
export function addProfile(account: Account, id: string, name: string) {
  if (account.profiles.length >= 5)
    throw new Problem(409, "Máximo cinco perfiles");
  account.profiles.push({ id, name, favorites: {}, history: {} });
}
export function saveHistory(
  profile: Profile,
  media: Media,
  input: z.infer<typeof progressSchema>,
): History {
  const key = `${media.type}_${media.id}_${input.videoId}`;
  const old = profile.history[key];
  if ((old?.version ?? 0) !== input.version)
    throw new Problem(
      409,
      "El progreso cambió. Cierra el reproductor y vuelve a abrirlo.",
    );
  const item = {
    media,
    videoId: input.videoId,
    position: input.position,
    duration: input.duration,
    version: input.version + 1,
    completed: input.position / input.duration >= 0.95,
    updatedAt: new Date().toISOString(),
  };
  profile.history[key] = item;
  const keys = Object.keys(profile.history).sort((a, b) =>
    profile.history[b].updatedAt.localeCompare(profile.history[a].updatedAt),
  );
  for (const key of keys.slice(50)) delete profile.history[key];
  return item;
}
