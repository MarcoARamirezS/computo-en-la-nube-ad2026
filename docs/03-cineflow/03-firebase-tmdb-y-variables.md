# 03 — Firebase, TMDB y variables

<!-- navigation:start -->

[← Anterior](./02-instalacion-monorepo.md) | [Índice del proyecto](./README.md) | [Siguiente →](./04-contrato-api.md)

[🏠 Índice general](../../README.md)

<!-- navigation:end -->

## Desarrollo local primero

Crear firebase.json en raíz:

```json
{
  "firestore": {
    "rules": "firebase/firestore.rules",
    "indexes": "firebase/firestore.indexes.json"
  },
  "emulators": {
    "auth": { "port": 9099 },
    "firestore": { "port": 8080 },
    "ui": { "enabled": true, "port": 4001 },
    "singleProjectMode": true
  }
}
```

Usar demo-cineflow en CLI, backend y configuración web. El proyecto demo evita usar una base real por accidente; TMDB sigue siendo un servicio externo cuando CATALOG_MODE=tmdb. En modo fixture no se necesita cuenta externa.

## apps/api/.env.example

```dotenv
NODE_ENV=development
PORT=4000
CORS_ORIGINS=http://localhost:5173
FIREBASE_PROJECT_ID=demo-cineflow
USE_FIREBASE_EMULATORS=true
FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099
FIRESTORE_EMULATOR_HOST=127.0.0.1:8080
CATALOG_MODE=fixture
TMDB_READ_ACCESS_TOKEN=
LOG_LEVEL=info
```

Hosts Admin SDK sin http://. En emuladores inicializar Admin con projectId sin cuenta de servicio. Validar variables con Zod al arrancar; leer flags comparando con 'true', porque Boolean('false') es true. En producción rechazar USE_FIREBASE_EMULATORS=true y cualquier host de emulador presente. Rechazar CATALOG_MODE=fixture en producción salvo un despliegue demo identificado explícitamente que no se use como validación real.

## apps/web/.env.example

```dotenv
VITE_API_BASE_URL=http://localhost:4000/api/v1
VITE_USE_FIREBASE_EMULATORS=true
VITE_FIREBASE_API_KEY=demo-key
VITE_FIREBASE_AUTH_DOMAIN=demo-cineflow.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=demo-cineflow
VITE_FIREBASE_APP_ID=demo-app
VITE_AUTH_EMULATOR_URL=http://127.0.0.1:9099
```

Conectar Auth Emulator una sola vez antes de usar Auth. El web no inicializa Firestore. La configuración pública de Firebase identifica el proyecto y no reemplaza la autorización. Nunca agregar VITE_TMDB_TOKEN, claves privadas ni cuentas de servicio. Los valores VITE_* quedan visibles en el bundle.

## Proyecto Firebase real

1. Crear un proyecto de desarrollo en Firebase Console y registrar una aplicación web.
2. Activar Authentication con Email/Password; configurar política de contraseñas. Configurar dominios autorizados incluyendo el dominio real del frontend y localhost si se necesita.
3. Crear Firestore en modo restringido, seleccionar región apropiada para usuarios y backend y desplegar las reglas de 06.
4. Copiar la configuración de la aplicación web a su .env; poner VITE_USE_FIREBASE_EMULATORS=false y quitar la URL del emulador.
5. En API poner FIREBASE_PROJECT_ID real y USE_FIREBASE_EMULATORS=false; eliminar ambas variables *_EMULATOR_HOST.
6. Usar Application Default Credentials. En proveedor externo montar un archivo de cuenta de servicio fuera del repositorio y definir GOOGLE_APPLICATION_CREDENTIALS con la ruta absoluta al archivo. En infraestructura con identidad administrada usar su identidad y permisos IAM mínimos necesarios.
7. Configurar plantillas y URL de retorno para verificación de email y recuperación de contraseña. Probarlas con una cuenta propia de prueba.
8. Desplegar reglas e índices al proyecto seleccionado con firebase deploy --only firestore:rules,firestore:indexes --project ID_REAL.

No reutilizar demo-cineflow con credenciales reales. Mantener desarrollo y producción separados. No se promete gratuidad del despliegue; revisar cuotas y consumo del proyecto antes de publicarlo.

## TMDB

1. Crear cuenta en TMDB y solicitar acceso API desde ajustes, preferentemente en escritorio.
2. Leer sus condiciones y registrar CineFlow como proyecto educativo/no comercial si ese es el uso real.
3. Copiar API Read Access Token únicamente a TMDB_READ_ACCESS_TOKEN del backend.
4. Cambiar CATALOG_MODE=tmdb. La API envía Authorization: Bearer al host fijo https://api.themoviedb.org/3.
5. Probar popular, búsqueda y detalle. Usar language=es-MX donde sea admitido; si faltan textos o tráilers, consultar en-US como alternativa explícita.
6. Incorporar logo aprobado y atribución de TMDB en Créditos. Consultar el aviso exacto en 19_FUENTES.

No crear una ruta /proxy?url=...: sólo permitir endpoints y parámetros definidos. Un usuario nunca decide el host que consulta el servidor.

## Diagnóstico

| Síntoma | Comprobación |
|---|---|
| 401 privado | ID token del SDK, proyecto correcto y emuladores consistentes |
| TMDB 401 | Token de lectura en API, reinicio y CATALOG_MODE |
| permission-denied en web | No usar SDK Firestore; la app llama a Express |
| Cuenta existe pero /me falla | Reintentar PUT /me; debe ser idempotente |
| CORS | Origen exacto, puerto y protocolo incluidos en allowlist |
| Auth persiste pero UI pierde usuario | Esperar resolución inicial de onAuthStateChanged |

---

<!-- navigation:start -->

[← Anterior](./02-instalacion-monorepo.md) | [Índice del proyecto](./README.md) | [Siguiente →](./04-contrato-api.md)

[🏠 Índice general](../../README.md)

<!-- navigation:end -->
