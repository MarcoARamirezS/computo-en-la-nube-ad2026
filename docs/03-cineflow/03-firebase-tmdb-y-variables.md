# 7. Conectar los servicios reales: TMDB y Firebase

<!-- navigation:start -->

[← Anterior](./11-frontend-etapa-03.md) | [Índice CineFlow](./README.md) | [Siguiente →](./12-frontend-etapa-04.md)

[🏠 Índice general](../../README.md)

<!-- navigation:end -->

**Haz este paso después de poder abrir una ficha del catálogo demo.** Vamos a cambiar la configuración, no el código del backend.

## Parte A — TMDB para películas y series reales

1. Crea una cuenta en [TMDB](https://www.themoviedb.org/).
2. Abre ajustes de cuenta → API y solicita acceso para el uso real de tu proyecto.
3. Copia **API Read Access Token**. No es la contraseña de tu cuenta.
4. En VS Code abre `cineflow-v2/apps/api/.env`.
5. Cambia únicamente estas dos variables:

```dotenv
CATALOG_MODE=tmdb
TMDB_READ_ACCESS_TOKEN=PEGA_AQUI_TU_TOKEN_DE_LECTURA
```

6. Detén `npm run dev` con Ctrl+C y vuelve a ejecutarlo desde la raíz.
7. Abre http://localhost:4000/api/catalog?type=movie. Debes ver títulos reales y URLs de carteles.
8. Abre el frontend y busca una película. Si TMDB no está accesible desde tu red, vuelve temporalmente a `CATALOG_MODE=demo`; no borres código.

**Comprobación:** hay carteles y títulos reales. El token de TMDB sólo existe en `apps/api/.env`, nunca en `apps/web`.

## Parte B — Crear el proyecto Firebase

1. Abre [Firebase Console](https://console.firebase.google.com/).
2. Crea un proyecto de desarrollo, por ejemplo CineFlow Curso. Google asignará un **Project ID**: cópialo.
3. En Authentication activa el proveedor **Email/Password**.
4. En ajustes de Authentication, dominios autorizados, agrega `localhost` si no aparece. Más adelante agregarás tu dominio de despliegue.
5. En Firestore Database crea una base de datos predeterminada, elige la región adecuada y usa reglas restringidas.
6. Abre la pestaña Rules de Firestore, reemplaza las reglas con el siguiente contenido y publica:

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

Esto bloquea clientes directos. Nuestro backend usa Firebase Admin y verifica identidad y pertenencia por su cuenta. No uses `allow read, write: if true` para resolver problemas.

## Parte C — Conectar el backend a Firebase

1. En ajustes del proyecto → cuentas de servicio, genera una clave privada para tu entorno de desarrollo.
2. Guarda el archivo JSON **fuera del repositorio**. No lo subas a Git ni lo compartas por chat.
3. Abre `apps/api/.env`, conserva PORT, CORS_ORIGIN y las variables TMDB, y completa:

Ejemplo macOS/Linux:

```dotenv
FIREBASE_PROJECT_ID=tu-project-id-real
GOOGLE_APPLICATION_CREDENTIALS=/Users/tuusuario/cineflow-secrets/admin.json
```

Ejemplo Windows (usa `/` incluso en Windows):

```dotenv
FIREBASE_PROJECT_ID=tu-project-id-real
GOOGLE_APPLICATION_CREDENTIALS=C:/Users/tuusuario/cineflow-secrets/admin.json
```

Reemplaza las rutas por la ubicación REAL del JSON. No pegues el contenido del JSON en la variable; escribe su ruta. Firebase Admin usa esa cuenta para acceder al proyecto, y sus permisos deben permitir Firestore y verificación de usuarios. En un despliegue se configurará mediante secretos del proveedor o identidad administrada, no un archivo público.

## Parte D — Conectar el frontend a Firebase Auth

1. En ajustes del proyecto registra una aplicación **Web** con nombre CineFlow Web.
2. Firebase mostrará `firebaseConfig`. Necesitas apiKey, authDomain, projectId y appId.
3. Abre `apps/web/.env` y completa los valores:

```dotenv
VITE_API_URL=http://localhost:4000/api
VITE_FIREBASE_API_KEY=valor_de_apiKey
VITE_FIREBASE_AUTH_DOMAIN=valor_de_authDomain
VITE_FIREBASE_PROJECT_ID=valor_de_projectId
VITE_FIREBASE_APP_ID=valor_de_appId
```

La configuración Web identifica el proyecto; no es la cuenta de servicio. Nunca agregues aquí `private_key` ni el token TMDB. Toda variable `VITE_` es visible en el navegador.

4. Verifica que Project ID de web, backend y JSON corresponde al mismo proyecto.
5. Reinicia `npm run dev`. Los cambios de `.env` requieren reinicio.

## Comprobación antes de seguir

- /health sigue respondiendo.
- El catálogo real se ve, o mantuviste demo explícitamente si aún no tienes TMDB.
- Ambos `.env` usan el mismo proyecto Firebase.
- Ningún secreto aparece en `git status` como archivo a subir.

Todavía no hay formulario de acceso: lo crearás en la siguiente etapa. Allí se comprobará el primer usuario y el primer documento de Firestore. Authentication, Firestore y TMDB tienen cuotas y condiciones propias; revisa su consumo en la consola, no se promete despliegue ilimitado gratuito.

---

<!-- navigation:start -->

[← Anterior](./11-frontend-etapa-03.md) | [Índice CineFlow](./README.md) | [Siguiente →](./12-frontend-etapa-04.md)

[🏠 Índice general](../../README.md)

<!-- navigation:end -->
