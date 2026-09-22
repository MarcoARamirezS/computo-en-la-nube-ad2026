# 2. Instalar y ver la primera pantalla

<!-- navigation:start -->

[← Anterior](./01-arquitectura-y-alcance.md) | [Índice CineFlow](./README.md) | [Siguiente →](./05-backend-completo.md)

[🏠 Índice general](../../README.md)

<!-- navigation:end -->

**Meta:** abrir “CineFlow instalado” en el navegador. No necesitas Firebase ni TMDB todavía.

## Paso 1 — Requisitos

Instala Node.js 24 LTS, Git y VS Code. Cierra y vuelve a abrir la terminal después de instalar Node. Comprueba:

```bash
node --version
npm --version
git --version
```

Node debe mostrar `v24...`. Los números menores pueden variar. No necesitas instalar React globalmente.

## Paso 2 — Crear una carpeta nueva

En Windows usa PowerShell o la terminal de VS Code. En macOS/Linux usa Terminal. Estos comandos sirven en ambos:

```bash
mkdir cineflow-v2
cd cineflow-v2
git init
node -e "for (const p of ['apps/api/src','apps/api/tests','apps/web/src']) require('node:fs').mkdirSync(p,{recursive:true})"
```

El último comando crea las carpetas sin depender de `mkdir -p`, que no funciona igual en todas las terminales de Windows. Abre esta carpeta en VS Code: Archivo → Abrir carpeta. Si tienes el comando disponible, puedes ejecutar `code .`.

**Comprobación:** VS Code muestra `apps/api` y `apps/web`. Todo archivo de los siguientes pasos se crea dentro de `cineflow-v2`, no dentro del repositorio de guías.

## Paso 3 — Crear los tres package.json

Copia los siguientes archivos completos. Incluyen las versiones que se usaron para comprobar esta entrega; no ejecutes `npm create vite@latest` encima de ellos.

### Archivo: `package.json`

**Acción:** crear el archivo si no existe; si existe, reemplazar TODO su contenido por lo siguiente. Guardar antes de continuar.

```json
{
  "name": "cineflow",
  "version": "2.0.0",
  "private": true,
  "workspaces": [
    "apps/*"
  ],
  "scripts": {
    "dev": "concurrently -k \"npm run dev:api\" \"npm run dev:web\"",
    "dev:api": "npm run dev -w @cineflow/api",
    "dev:web": "npm run dev -w @cineflow/web",
    "typecheck": "npm run typecheck --workspaces",
    "build": "npm run build --workspaces",
    "test": "npm run test -w @cineflow/api"
  },
  "engines": {
    "node": ">=24 <25"
  },
  "devDependencies": {
    "concurrently": "10.0.5"
  }
}
```

### Archivo: `apps/api/package.json`

**Acción:** crear el archivo si no existe; si existe, reemplazar TODO su contenido por lo siguiente. Guardar antes de continuar.

```json
{
  "name": "@cineflow/api",
  "version": "2.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "node --watch --import tsx --env-file=.env src/server.ts",
    "typecheck": "tsc --noEmit",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "node --import tsx --test tests/*.test.ts"
  },
  "dependencies": {
    "cors": "2.8.6",
    "dotenv": "18.0.2",
    "express": "5.2.1",
    "express-rate-limit": "8.7.0",
    "firebase-admin": "14.4.0",
    "helmet": "8.3.0",
    "zod": "4.6.5"
  },
  "devDependencies": {
    "@types/cors": "2.8.19",
    "@types/express": "5.0.6",
    "@types/node": "24.13.6",
    "@types/supertest": "7.2.1",
    "supertest": "7.2.2",
    "tsx": "4.23.15",
    "typescript": "5.9.3"
  }
}
```

### Archivo: `apps/web/package.json`

**Acción:** crear el archivo si no existe; si existe, reemplazar TODO su contenido por lo siguiente. Guardar antes de continuar.

```json
{
  "name": "@cineflow/web",
  "version": "2.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite --port 5173 --strictPort",
    "typecheck": "tsc --noEmit",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview --port 4173"
  },
  "dependencies": {
    "firebase": "12.19.0",
    "react": "19.3.0",
    "react-dom": "19.3.0",
    "react-router-dom": "7.18.4"
  },
  "devDependencies": {
    "@tailwindcss/vite": "4.3.3",
    "@types/react": "19.3.0",
    "@types/react-dom": "19.3.0",
    "@vitejs/plugin-react": "6.1.1",
    "tailwindcss": "4.3.3",
    "typescript": "5.9.3",
    "vite": "8.3.0"
  }
}
```

## Paso 4 — Configurar TypeScript y Vite

TypeScript revisa tipos; Vite arranca el navegador; el plugin de Tailwind convierte sus clases en estilos. No necesitas `tailwind.config.js` para esta configuración básica.

### Archivo: `apps/api/tsconfig.json`

**Acción:** crear el archivo si no existe; si existe, reemplazar TODO su contenido por lo siguiente. Guardar antes de continuar.

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

### Archivo: `apps/web/tsconfig.json`

**Acción:** crear el archivo si no existe; si existe, reemplazar TODO su contenido por lo siguiente. Guardar antes de continuar.

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "jsx": "react-jsx",
    "lib": ["ES2022", "DOM"],
    "skipLibCheck": true,
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "types": ["vite/client"]
  },
  "include": ["src", "vite.config.ts"]
}
```

### Archivo: `apps/web/vite.config.ts`

**Acción:** crear el archivo si no existe; si existe, reemplazar TODO su contenido por lo siguiente. Guardar antes de continuar.

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";
export default defineConfig({ plugins: [react(), tailwind()] });
```

### Archivo: `apps/web/index.html`

**Acción:** crear el archivo si no existe; si existe, reemplazar TODO su contenido por lo siguiente. Guardar antes de continuar.

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>CineFlow</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

## Paso 5 — Crear la pantalla mínima

Esta App temporal se reemplaza en la etapa 1.

### Archivo: `apps/web/src/App.tsx`

**Acción:** crear el archivo si no existe; si existe, reemplazar TODO su contenido por lo siguiente. Guardar antes de continuar.

```tsx
export default function App() { return <h1 className="p-10 text-4xl font-bold text-rose-400">CineFlow instalado</h1>; }
```

### Archivo: `apps/web/src/styles.css`

**Acción:** crear el archivo si no existe; si existe, reemplazar TODO su contenido por lo siguiente. Guardar antes de continuar.

```css
@import "tailwindcss";
body { margin: 0; background: #0b0f19; color: white; font-family: system-ui, sans-serif; }
```

### Archivo: `apps/web/src/main.tsx`

**Acción:** crear el archivo si no existe; si existe, reemplazar TODO su contenido por lo siguiente. Guardar antes de continuar.

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

## Paso 6 — Archivos de entorno y Git

En los `.env.example` no hay claves reales. Conserva esta plantilla y crea la copia `.env` del paso siguiente.

### Archivo: `.gitignore`

**Acción:** crear el archivo si no existe; si existe, reemplazar TODO su contenido por lo siguiente. Guardar antes de continuar.

```text
node_modules/
dist/
.env
.env.*
!.env.example
secrets/
playwright-report/
test-results/
```

### Archivo: `.nvmrc`

**Acción:** crear el archivo si no existe; si existe, reemplazar TODO su contenido por lo siguiente. Guardar antes de continuar.

```text
24
```

### Archivo: `apps/api/.env.example`

**Acción:** crear el archivo si no existe; si existe, reemplazar TODO su contenido por lo siguiente. Guardar antes de continuar.

```text
PORT=4000
CORS_ORIGIN=http://localhost:5173
CATALOG_MODE=demo
TMDB_READ_ACCESS_TOKEN=
FIREBASE_PROJECT_ID=
# Ruta absoluta al JSON descargado de Firebase, sólo al activar usuarios:
# GOOGLE_APPLICATION_CREDENTIALS=/ruta/privada/cineflow-admin.json
```

### Archivo: `apps/web/.env.example`

**Acción:** crear el archivo si no existe; si existe, reemplazar TODO su contenido por lo siguiente. Guardar antes de continuar.

```text
VITE_API_URL=http://localhost:4000/api
# Completar en la etapa 4 con la configuración WEB de Firebase:
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_APP_ID=
```

## Paso 7 — Crear copias de configuración

En la terminal, desde `cineflow-v2`:

```bash
node -e "const fs=require('node:fs'); for(const p of ['apps/api','apps/web']) if(!fs.existsSync(p+'/.env')) fs.copyFileSync(p+'/.env.example',p+'/.env')"
npm install
npm run dev:web
```

El comando de copia no sobrescribe un `.env` existente. `npm install` instala todas las dependencias y genera un único package-lock.json en la raíz. Guarda ese lockfile en Git. En una copia que ya lo incluya usa `npm ci`.

Abre **http://localhost:5173**. Debes ver **CineFlow instalado** en color rosa. Si el puerto está ocupado, detén el proceso anterior; no cambies de puerto sin actualizar configuración.

## Paso 8 — Detener y continuar

En la terminal presiona Ctrl+C. Todavía no ejecutes `npm run dev` porque falta copiar los archivos del backend. Continúa al documento Backend completo mediante Siguiente.

## Si algo falla

| Problema | Acción concreta |
|---|---|
| npm no se reconoce | Reinstala Node y abre una terminal nueva |
| npm.ps1 bloqueado | En PowerShell ejecuta `npm.cmd install` y `npm.cmd run dev:web` |
| Falta package.json | Estás en otra carpeta: vuelve a cineflow-v2 |
| JSON inválido | Revisa comas y comillas dobles; copia el bloque completo |
| Pantalla sin color | Comprueba import de styles.css y plugin tailwind en vite.config.ts |

**No continúes hasta ver la pantalla.**

---

<!-- navigation:start -->

[← Anterior](./01-arquitectura-y-alcance.md) | [Índice CineFlow](./README.md) | [Siguiente →](./05-backend-completo.md)

[🏠 Índice general](../../README.md)

<!-- navigation:end -->
