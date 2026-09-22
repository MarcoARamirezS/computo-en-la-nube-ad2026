# Consulta — Rutas que ya incluye el backend

<!-- navigation:start -->

[← Anterior](./README.md) | [Índice CineFlow](./README.md) | [Siguiente →](./06-firestore-modelo-reglas.md)

[🏠 Índice general](../../README.md)

<!-- navigation:end -->

Este documento ayuda a encontrar un endpoint. **No tienes que programar rutas adicionales:** el código completo está en Backend completo. La versión sencilla usa `/api`, reemplazando el contrato `/api/v1` de la guía anterior.

## Qué significa cada parte

GET consulta, POST crea, PUT guarda de forma repetible, PATCH modifica y DELETE elimina. Una respuesta correcta devuelve `{"data":...}`, salvo DELETE que devuelve 204 sin contenido. Un error devuelve `{"error":"mensaje"}`. `/health` devuelve `{"ok":true}`.

| Ruta | Uso | Acceso |
|---|---|---|
| GET /health | Proceso activo | Público |
| GET /api/catalog?type=movie&q=texto&page=1 | Catálogo/búsqueda | Público |
| GET /api/catalog/:type/:id | Ficha | Público |
| GET /api/catalog/:type/:id/videos | Tráilers | Público |
| PUT /api/me | Guardar cuenta inicial si falta | ID token |
| GET /api/me | Cuenta, perfiles y sus listas | ID token |
| PATCH /api/me | Cambiar nombre de cuenta | ID token |
| POST /api/profiles | Crear perfil | ID token |
| PATCH /api/profiles/:profileId | Renombrar perfil | ID token |
| DELETE /api/profiles/:profileId | Eliminar perfil secundario y sus datos | ID token |
| PUT /api/profiles/:profileId/favorites/:type/:id | Guardar favorito | ID token |
| DELETE /api/profiles/:profileId/favorites/:type/:id | Quitar favorito | ID token |
| PUT /api/profiles/:profileId/history/:type/:id | Guardar progreso | ID token |
| DELETE /api/profiles/:profileId/history/:key | Quitar un tráiler del historial | ID token |

`type` admite movie o tv. Las rutas privadas usan `Authorization: Bearer ID_TOKEN`. El SDK Web entrega ese token después de iniciar sesión. No envíes la clave privada Admin como Bearer.

## Ejemplos de body

Crear/renombrar perfil o cuenta:

```json
{ "name": "Noche" }
```

Guardar favorito o provisionar cuenta:

```json
{}
```

Guardar historial (videoId ilustrativo, debe existir en el título):

```json
{ "videoId": "abcdefghijk", "position": 30, "duration": 120, "version": 0 }
```

Cada respuesta de historial incrementa version. La siguiente actualización envía la versión recibida. Si otra pestaña guardó primero, la API responde 409. El player detiene escrituras y pide volver a abrir; no sobrescribe en silencio.

## Qué estados verás

| Estado | Interpretación |
|---|---|
| 400 | Datos incorrectos |
| 401 | Falta sesión o token inválido |
| 404 | Título/perfil no disponible |
| 409 | Límite o conflicto de versión |
| 429 | Demasiadas solicitudes |
| 500 | Configuración o fallo interno por diagnosticar |
| 503 | Proveedor/configuración no disponible |

El catálogo demo es público y no contiene videos. No permite iniciar sesiones falsas. Las pruebas automatizadas sustituyen Auth y el almacén únicamente dentro del proceso de test.

---

<!-- navigation:start -->

[← Anterior](./README.md) | [Índice CineFlow](./README.md) | [Siguiente →](./06-firestore-modelo-reglas.md)

[🏠 Índice general](../../README.md)

<!-- navigation:end -->
