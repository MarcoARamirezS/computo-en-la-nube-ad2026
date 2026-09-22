# 05 — Backend completo: una sola entrega B0

<!-- navigation:start -->

[← Anterior](./04-contrato-api.md) | [Índice del proyecto](./README.md) | [Siguiente →](./06-firestore-modelo-reglas.md)

[🏠 Índice general](../../README.md)

<!-- navigation:end -->

## Objetivo y condición de cierre

Implementar en un único bloque todos los módulos del contrato 04. El frontend podrá desarrollarse después sin agregar endpoints por sesión. “Completo” significa que rutas, persistencia, autorización, pruebas, configuración y documentación están implementadas; este archivo es la especificación para lograrlo.

Resultado requerido: apps/api, packages/contracts, configuración de emuladores, seed idempotente, OpenAPI y pruebas reproducibles. No dejar TODO, rutas vacías, respuestas hardcodeadas en modo tmdb ni mocks activos en producción.

## 1. Contratos primero

Crear packages/contracts/src/{common,me,profiles,catalog,favorites,history}.ts e index.ts. Definir esquemas de request y response, exportar tipos mediante z.infer. Usar transformaciones explícitas en query strings; un page vacío no debe volverse cero. Schemas de salida deben admitir imágenes null y arrays vacíos. Las fechas viajan como ISO, no como Timestamp de Firestore.

Compilar contracts antes de API. Los esquemas compartidos no importan Node, Admin SDK ni React. Cambiar un DTO requiere actualizar OpenAPI y prueba de contrato dentro de B0.

## 2. Configuración y arranque

Crear config/env.ts para validar entorno, config/firebase.ts para inicializar Admin una vez y integrations/tmdb/client.ts para la conexión externa. Separar app.ts (crea Express sin listen) de server.ts (abre puerto). Así Supertest usa app sin puertos reales.

Orden de middleware: requestId; logger con redacción de secretos; helmet; CORS allowlist; límites por IP; parser JSON máximo 32 KB; rutas; notFound; errorHandler. Al confiar en un proxy configurar únicamente el número/topología conocida de saltos; no confiar indiscriminadamente en X-Forwarded-For.

Errores asíncronos llegan al manejador de Express 5. Traducir Zod, Auth, Firestore y proveedor a códigos estables. No registrar Authorization, tokens, contraseñas, cuerpo completo de Auth ni account credentials. Pino registra requestId, método, ruta normalizada, status y duración.

## 3. Identidad y autorización

middleware/auth.ts extrae Bearer, verifica mediante getAuth().verifyIdToken(token, true) y agrega sólo uid y claims necesarios al contexto. Un token revocado o usuario deshabilitado devuelve 401. En emulador se usa la configuración oficial, nunca un bypass propio que acepte cualquier JWT.

Para cada operación privada resolver primero users/{uid}; después profiles/{profileId} bajo ese usuario. Perfil ajeno e inexistente devuelven el mismo 404. Las reglas de Firestore no protegen Admin SDK: las comprobaciones de API son obligatorias.

El registro y login se realizan con SDK Auth del cliente. No crear POST /login que guarde contraseñas ni tokens propios. El backend completo incluye integración con Auth y revocación global; el cliente aporta las pantallas después.

## 4. Módulo me

Crear me.routes.ts, me.controller.ts, me.service.ts y me.repository.ts. PUT /me inicia transacción: si usuario no existe, crear users/{uid} con profileCount=1 y perfil main; si existe, devolver sin sobrescribir preferencias. Obtener nombre/email de Auth cuando corresponda; valor inicial del nombre: displayName de Auth o “Mi cuenta”. Perfil main se llama “Principal”.

No hay transacción distribuida entre Auth y Firestore. Si Auth crea identidad y Firestore falla, UI informa que la cuenta existe y reintenta PUT /me; no vuelve a registrarla. PATCH sólo cambia displayName/locale permitidos. POST revoke-sessions valida auth_time, revoca refresh tokens y devuelve 204; luego web llama signOut.

## 5. Perfiles y eliminación

Crear/contar perfiles en transacción sobre documento usuario para impedir que dos peticiones concurrentes excedan cinco. Avatar se elige de avatar-01 a avatar-08, recursos locales sin subida. main no se borra.

Al borrar un perfil secundario: transacción marca status=deleting. Todas las mutations de favoritos/historial deben leer ese documento dentro de su propia transacción para bloquear escrituras concurrentes cuando cambia el estado. Borrar subcolecciones por lotes de tamaño acotado (por ejemplo 200), luego transacción borra el padre y decrementa profileCount sólo si todavía existe. Decrementar una sola vez. Si falla la limpieza, devolver error y permitir reintentar DELETE; GET /profiles excluye deleting. No permitir crear perfiles extra contando uno que todavía está eliminándose.

Esta secuencia evita datos huérfanos y una eliminación aparente. No existe borrado en cascada automático de subcolecciones al borrar el documento padre.

## 6. Adaptador TMDB

Construir métodos home, discover, search, genres, detail y videos. Usar host fijo y rutas permitidas, encodeURIComponent para query, timeout de 8 s con AbortController. Nunca aceptar URLs suministradas por el usuario.

Cache en memoria acotada a 500 entradas: listas 5 minutos, detalle/videos 15 minutos. Clave incluye endpoint, parámetros normalizados e idioma. Sólo cachear respuestas válidas, nunca datos privados ni errores de credenciales. En despliegue de una instancia esta cache es suficiente; múltiples instancias requieren revisar presupuesto de solicitudes.

Ante 429 respetar Retry-After y responder estado controlado; no hacer reintentos ilimitados. Un fallo parcial en home deja fila vacía con mensaje de indisponibilidad identificado, o falla toda la respuesta de forma documentada; v1 adopta fallo total 503 para simplificar el contrato. Las demás páginas siguen siendo accesibles.

Normalizar DTO, filtrar personas en búsquedas mixtas, no emitir tarjetas sin id/mediaType. Videos: sólo YouTube, priorizar Trailer y official, español y después inglés; si no hay, devolver []. No garantizar inserción: YouTube puede rechazarla al reproducir. Imágenes null se conservan, no se inventan paths.

## 7. Favoritos

Crear documentos con clave determinista movie_ID/tv_ID. Para primer alta obtener snapshot validado del catálogo fuera de la transacción; luego transacción comprueba perfil activo y existencia del favorito. Si ya existe, conservar addedAt y devolver el existente. Repeticiones concurrentes generan un documento.

GET individual comprueba perfil activo y busca la clave determinista, devolviendo DTO o 404; evita recorrer páginas para conocer pertenencia. DELETE comprueba perfil activo y elimina idempotentemente. GET usa snapshots almacenados, paginación y timestamps serializados. No sincronizar todas las imágenes consultando TMDB por cada tarjeta; un snapshot puede quedar anticuado, detalle siempre consulta el adaptador vigente.

## 8. Historial y progreso

Verificar asociación video/título mediante catálogo antes de aceptar nuevo historial. En transacción leer perfil activo, registro de historial y, si existe, su version. Validar expectedVersion, actualizar campos y serverTimestamp e incrementar version. DTO devuelto después de resolver timestamp.

Guardar cada 15 segundos de reproducción activa y al pausar/finalizar desde web. No guardar cada frame. Un intervalo por player, cleanup al desmontar. La API es autoridad sobre completed, timestamps y version; duración/posición reportadas por cliente se validan pero no son prueba de consumo real ni sirven para premios/pagos.

GET devuelve historial paginado. Borrar elemento es idempotente. Para limpiar historial entero exigir que UI detenga player primero; API usa profile.historyEpoch interno: cada mutation de progreso lee epoch en transacción, limpieza incrementa epoch y borra registros de épocas anteriores. Nuevos eventos después del inicio de limpieza pertenecen al epoch nuevo y se conservan. El filtrado/listado debe limitarse al epoch actual. Este campo es interno y no lo decide el cliente. El borrado físico de registros anteriores es reintentable.

## 9. Seguridad operativa

Política inicial elegida: catálogo 120 requests/min/IP, privado 120/min/uid, progreso 20/min/uid. Responder 429 con Retry-After. Rate limiter de memoria sólo garantiza límites en una instancia; producción con réplicas necesita almacenamiento compartido. CORS no es autenticación.

No aceptar roles, uid, emailVerified, addedAt, lastPlayedAt ni campos internos del body. Recortar textos y límites. CSP de API para docs debe permitir los assets necesarios sólo cuando docs habilitado. La CSP de la web se define aparte para imágenes TMDB y YouTube.

## 10. Fixtures y seed

CATALOG_MODE=fixture implementa la misma interfaz del adaptador sin red. Datos inventados: movie 900001 “Órbita Azul”, género 878, año 2025; movie 900002 “La Última Estación”, género 18, año 2024; tv 900003 “Código Aurora”, género 9648, año 2026. Imágenes null, overview de una frase inventada, rating 7.5, 8.0 y null respectivamente; videos [] por defecto.

Seed sólo funciona con emuladores y demo-cineflow. Crear dos identidades de prueba ana@example.test y bruno@example.test con contraseña local CineFlowDemo2026!, documentos y perfiles main usando lógica de provisionamiento. Repetir seed no duplica ni elimina datos existentes. Esas credenciales son exclusivas del emulador y nunca se despliegan.

Para pruebas de player usar un adaptador simulado del reproductor que emita eventos, sin necesidad de un video externo. Para la prueba manual real obtener un video actual mediante /videos; los IDs pueden dejar de estar disponibles.

## 11. Verificación B0

Implementar pruebas de 17 antes de declarar listo. Swagger permite explorar rutas mientras el front aún no existe. Crear script de prueba que use SDK cliente Auth conectado al emulador, acceda como Ana, obtenga getIdToken y llame PUT /me; no incluir tokens persistentes en archivos.

Ejecutar build de contracts, typecheck/lint de API, tests contra emuladores y smoke de catálogo real con credencial local. Documentar cada resultado real en docs/validacion-b0.md; si falta credencial, registrar “smoke TMDB pendiente”, no “todo verde”. Crear tag backend-v1.0 sólo tras cumplir gates. Las ocho etapas frontend consumen este mismo contrato.

---

<!-- navigation:start -->

[← Anterior](./04-contrato-api.md) | [Índice del proyecto](./README.md) | [Siguiente →](./06-firestore-modelo-reglas.md)

[🏠 Índice general](../../README.md)

<!-- navigation:end -->
