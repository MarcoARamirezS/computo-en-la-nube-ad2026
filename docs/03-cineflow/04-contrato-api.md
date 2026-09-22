# 04 — Contrato estable API v1

<!-- navigation:start -->

[← Anterior](./03-firebase-tmdb-y-variables.md) | [Índice del proyecto](./README.md) | [Siguiente →](./05-backend-completo.md)

[🏠 Índice general](../../README.md)

<!-- navigation:end -->

## Convenciones

Base /api/v1. JSON UTF-8. Authorization: Bearer <Firebase ID token> en operaciones privadas. uid se obtiene del token; nunca del body, query o profileId. IDs externos enteros positivos; mediaType sólo movie|tv. Los parámetros de ruta de perfiles y claves se validan antes de construir rutas de Firestore.

Respuesta individual: {"data": objeto}. Listas propias: {"data": [], "meta": {"nextCursor": null}}. Listas TMDB: {"data": [], "meta": {"page": 1, "totalPages": 1, "totalResults": 2}}. Error: {"error": {"code": "PROFILE_NOT_FOUND", "message": "Perfil no disponible", "requestId": "..."}}. No devolver stack traces ni cuerpos de error de proveedores.

Usar 200 para lectura/upsert existente, 201 para creación, 204 sin body para borrado, 400 validación, 401 falta/token inválido, 404 recurso inexistente o ajeno, 409 conflicto, 429 límite, 502 proveedor falló y 503 proveedor no disponible/timeout. Zod valida params, query y body; campos adicionales se rechazan en mutations. requestId se crea en API y se devuelve también como header.

## DTO de catálogo

```ts
interface MediaSummary {
  id: number;
  mediaType: 'movie' | 'tv';
  title: string;
  overview: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  year: number | null;
  rating: number | null;
  genreIds: number[];
}
interface MediaDetail extends MediaSummary {
  runtimeMinutes: number | null;
  genres: { id: number; name: string }[];
  cast: { id: number; name: string; character: string; imageUrl: string | null }[];
  seasonCount: number | null;
}
interface Trailer {
  videoId: string;
  name: string;
  language: string;
  site: 'YouTube';
  official: boolean;
}
```

No inventar runtime de una serie; null cuando no hay valor adecuado. Adaptar title/name y release_date/first_air_date en API. URLs de imágenes se construyen sólo con rutas del proveedor. El frontend no depende de la forma cruda de TMDB.

## Rutas públicas

| Método y ruta | Entrada | Salida/criterio |
|---|---|---|
| GET /health/live (fuera de /api/v1) | — | 200 proceso activo |
| GET /health/ready (fuera de /api/v1) | — | 200 Firestore disponible; 503 si no |
| GET /catalog/home | language | data.rows: [{key,title,items:MediaSummary[]}] |
| GET /catalog/discover | mediaType, genreId?, page?, language? | Lista paginada |
| GET /catalog/search | q, mediaType?, page?, language? | Películas y series; excluir personas |
| GET /catalog/genres | mediaType, language? | data: [{id,name}] |
| GET /catalog/:mediaType/:id | language? | MediaDetail |
| GET /catalog/:mediaType/:id/videos | language? | Trailer[]; vacío permitido |

Registrar rutas estáticas antes de las parametrizadas. home devuelve movies-popular y tv-popular; trending es una tercera fila opcional que debe filtrar personas. q se recorta y admite 2–100 caracteres; page 1–500; language allowlist es-MX/en-US. No confundir idioma con disponibilidad regional. No se anuncia disponibilidad en Netflix: ese dato queda fuera del contrato v1.

## Cuenta y perfiles (todas privadas)

| Método y ruta | Body | Resultado |
|---|---|---|
| PUT /me | {} | Crea cuenta y perfil principal si faltan; no duplica |
| GET /me | — | uid, displayName, locale, email, emailVerified |
| PATCH /me | {displayName?,locale?} | displayName 1–60; locale permitido |
| POST /me/revoke-sessions | {} | Revoca refresh tokens, 204 |
| GET /profiles | — | Perfiles activos propios, máximo 5 |
| POST /profiles | {name,avatarId} | name 1–30; avatarId del catálogo local |
| PATCH /profiles/:profileId | {name?,avatarId?} | Actualiza sólo campos permitidos |
| DELETE /profiles/:profileId | — | Borra dependencias; principal no borrable, 409 |

PUT /me es recuperación idempotente tras un registro incompleto. Email y emailVerified vienen de Auth; no se actualizan mediante PATCH /me. Revocar sesiones requiere auth_time de los últimos cinco minutos; si no, 401 REAUTH_REQUIRED. Cerrar sólo este dispositivo usa signOut del SDK y no llama a revocación global.

## Favoritos (privadas, pertenencia de perfil obligatoria)

| Método y ruta | Entrada | Resultado |
|---|---|---|
| GET /profiles/:profileId/favorites | limit=20, cursor? | Orden addedAt desc y documentId desc |
| GET /profiles/:profileId/favorites/:mediaType/:id | — | Favorite DTO o 404 si ausente |
| PUT /profiles/:profileId/favorites/:mediaType/:id | {} | Upsert idempotente |
| DELETE /profiles/:profileId/favorites/:mediaType/:id | — | 204 incluso si ya no existía |

Favorite DTO: mediaType, mediaId, addedAt ISO, media: MediaSummary. Identificador interno movie_550 o tv_1399. En primer PUT resolver metadata desde catálogo; no aceptar título o imagen arbitrarios del cliente. Repetir PUT conserva addedAt. Si el proveedor no responde durante alta nueva, fallar sin guardar datos parciales. Listar usa snapshot y no dispara una consulta externa por favorito.

## Historial (privadas)

| Método y ruta | Entrada | Resultado |
|---|---|---|
| GET /profiles/:profileId/history | limit=20, cursor? | Orden lastPlayedAt desc y documentId desc |
| GET /profiles/:profileId/history/:historyKey | — | Registro o 404 |
| PUT /profiles/:profileId/history/:historyKey | PlaybackUpdate | Upsert controlado |
| DELETE /profiles/:profileId/history/:historyKey | — | 204 idempotente |
| DELETE /profiles/:profileId/history | — | 204 al completar limpieza |

historyKey = mediaType_mediaId_videoId. Validar patrón y cotejar contra el body. videoId se restringe al formato de ID de YouTube y debe pertenecer a videos asociados por TMDB; fixture acepta sólo videos del fixture.

```json
{
  "mediaType": "movie",
  "mediaId": 550,
  "videoId": "EXAMPLE_ID1",
  "positionSeconds": 32,
  "durationSeconds": 120,
  "event": "progress",
  "expectedVersion": 0
}
```

EXAMPLE_ID1 es ilustrativo; usar un videoId real del endpoint de videos. Eventos start|progress|pause|ended. Números finitos; duration > 0 y <= 14400, position entre 0 y duration. expectedVersion entero >= 0; nuevo registro exige 0. API compara versión en transacción y devuelve 409 HISTORY_CONFLICT si cambió. Respuesta incluye version incrementada. Frente a conflicto, refrescar el registro; una nueva reproducción deliberada puede continuar enviando cambios sobre la nueva versión. No reintentar a ciegas posiciones antiguas.

GET de historial individual sólo devuelve el epoch actual; un registro de epoch anterior se trata como inexistente. En PUT una key existente de epoch anterior se recrea con expectedVersion=0.

History DTO: key, mediaType, mediaId, videoId, media (snapshot), positionSeconds, durationSeconds, completed, version, lastPlayedAt. completed se calcula: event=ended o posición >= 95% de duración; timestamps siempre del servidor. Si el usuario reinicia un tráiler completado, enviar start con posición 0 y versión actual: pasa a incompleto. No usar max(posición) porque impediría retroceder.

## Paginación y privacidad

limit admite 1–50. Cursor opaco codifica timestamp y documentId, se valida contra ruta/perfil y orden; nunca admite un path arbitrario. Puede implementarse como JSON base64url validado, sin tratarlo como autorización. Query siempre construida desde uid del token y profileId validado. Cursor de perfil ajeno produce 400. Paginar con startAfter y pedir limit+1 para determinar nextCursor; no usar offset.

## OpenAPI

Crear apps/api/openapi.yaml OpenAPI 3.0.3 con todas estas rutas, componentes DTO y bearerAuth. Cada ruta privada debe declarar security, respuestas 401/404 y ejemplos. GET /docs sirve Swagger UI sólo en desarrollo por defecto; /openapi.json expone el contrato en el mismo entorno. Probar Authorize pegando un ID token de emulador, nunca un token Admin ni una contraseña.

---

<!-- navigation:start -->

[← Anterior](./03-firebase-tmdb-y-variables.md) | [Índice del proyecto](./README.md) | [Siguiente →](./05-backend-completo.md)

[🏠 Índice general](../../README.md)

<!-- navigation:end -->
