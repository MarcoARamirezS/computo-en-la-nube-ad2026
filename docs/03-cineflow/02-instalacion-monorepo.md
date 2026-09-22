# 02 — Instalación y primera prueba

<!-- navigation:start -->

[← Anterior](./01-arquitectura-y-alcance.md) | [Índice del proyecto](./README.md) | [Siguiente →](./03-firebase-tmdb-y-variables.md)

[🏠 Índice general](../../README.md)

<!-- navigation:end -->

## Requisitos y política de versiones

Instalar Node 24 LTS, npm, Git, editor y Java compatible con la versión instalada de Firebase CLI; usar Java 21 como base para los emuladores. Registrar node --version, npm --version y java --version en docs/entorno.md. Node 24 es la línea elegida, no se afirma que sea la última versión disponible.

Usar React 19, Tailwind 4, Express 5, TypeScript estricto y ESM. Vite y herramientas se resuelven al preparar el repositorio; conservar el lockfile y registrar las versiones exactas con npm ls --depth=0. No volver a ejecutar instalaciones con latest en cada sesión. En equipos nuevos usar npm ci.

## 1. Crear base (Bash, macOS/Linux o Git Bash)

```bash
mkdir cineflow
cd cineflow
git init
npm init -y
npm pkg set private=true --json
npm pkg set 'workspaces[0]=apps/*' 'workspaces[1]=packages/*'
mkdir -p apps/api/src packages/contracts/src docs firebase
npm create vite@latest apps/web -- --template react-ts
```

Crear apps/api/package.json con name @cineflow/api, version 1.0.0, private true y type module. Crear packages/contracts/package.json con name @cineflow/contracts y los mismos campos; agregar main ./dist/index.js, types ./dist/index.d.ts y exports con condiciones types/import. Renombrar el paquete de Vite a @cineflow/web. Estos manifiestos deben existir antes del siguiente paso.

## 2. Instalar dependencias desde la raíz

```bash
npm install -w @cineflow/api express@5 cors helmet express-rate-limit zod firebase-admin dotenv pino pino-http swagger-ui-express yaml
npm install -D -w @cineflow/api typescript tsx vitest supertest @types/node @types/express @types/cors @types/supertest @types/swagger-ui-express
npm install -w @cineflow/contracts zod
npm install -D -w @cineflow/contracts typescript
npm install -w @cineflow/api @cineflow/contracts@1.0.0
npm install -w @cineflow/web @cineflow/contracts@1.0.0 firebase react-router-dom @tanstack/react-query lucide-react zod
npm install -D -w @cineflow/web tailwindcss@4 @tailwindcss/vite @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom vitest @playwright/test
npm install -D concurrently firebase-tools eslint @eslint/js typescript-eslint @firebase/rules-unit-testing
```

No ejecutar npm install dentro de cada carpeta generando lockfiles adicionales. npm enlaza los workspaces locales cuya versión coincide.

## 3. TypeScript y scripts

En API y contracts: target ES2022, module NodeNext, moduleResolution NodeNext, strict true, declaration true, outDir dist. API rootDir src; contracts rootDir src. Usar extensiones .js en imports relativos del código TS para salida ESM. API excluye tests del build; las pruebas usan Vitest. Web conserva los tsconfig de Vite y activa strict.

Crear estos scripts en los respectivos package.json:

| Paquete | Script | Comando |
|---|---|---|
| contracts | build | tsc -p tsconfig.json |
| contracts | dev | tsc -p tsconfig.json --watch |
| api | dev | tsx watch --env-file=.env src/server.ts |
| api | build | tsc -p tsconfig.json |
| api | start | node dist/server.js |
| api | typecheck | tsc --noEmit |
| api | test | vitest run |
| api | seed | tsx --env-file=.env scripts/seed.ts |
| web | dev | vite --port 5173 --strictPort |
| web | build | tsc -b && vite build |
| web | typecheck | tsc -b --pretty false |
| web | test | vitest run |
| web | test:e2e | playwright test |
| raíz | build:contracts | npm run build -w @cineflow/contracts |
| raíz | predev | npm run build:contracts |
| raíz | dev | concurrently -k "npm run dev -w @cineflow/contracts" "npm run dev -w @cineflow/api" "npm run dev -w @cineflow/web" |
| raíz | build | npm run build:contracts && npm run build -w @cineflow/api && npm run build -w @cineflow/web |
| raíz | typecheck | npm run build:contracts && npm run typecheck -w @cineflow/api && npm run typecheck -w @cineflow/web |
| raíz | lint | eslint apps packages |
| raíz | emulators | firebase emulators:start --project demo-cineflow --only auth,firestore |
| raíz | test:api | npm run build:contracts && npm run test -w @cineflow/api |
| raíz | test:web | npm run test -w @cineflow/web |
| raíz | test:e2e | npm run test:e2e -w @cineflow/web |

Configurar ESLint con flat config, soporte TS/React y exclusión de dist, node_modules y reportes. No usar --if-present para ocultar gates faltantes. Los scripts de test deben tener sus configuraciones y casos antes de considerarlos funcionales.

## 4. Tailwind 4

En apps/web/vite.config.ts mantener react() y agregar import tailwindcss from '@tailwindcss/vite'; registrar tailwindcss() en plugins. En src/styles/index.css escribir:

```css
@import "tailwindcss";
@theme {
  --color-cinema-bg: #0b0f19;
  --color-cinema-surface: #161d2b;
  --color-cinema-accent: #f43f5e;
}
```

Importar el CSS desde main.tsx. No usar tailwindcss init -p ni directivas de Tailwind 3. Comprobar una tarjeta con clases bg-cinema-surface, rounded-xl y p-6.

## 5. Archivos de higiene

.nvmrc contiene 24. .gitignore debe incluir node_modules/, dist/, coverage/, playwright-report/, test-results/, .env, .env.*, !.env.example, *service-account*.json, .firebase/ y firebase-debug.log. Revisar manualmente antes de git add que no existan claves privadas.

## 6. Primera verificación

Antes de que B0 exista, iniciar solamente npm run dev -w @cineflow/web para comprobar Vite. Tras implementar contratos y backend: copiar .env.example a .env en api y web, iniciar emuladores en otra terminal y ejecutar npm run dev desde la raíz. Esperar API en 4000 y web en 5173. Consultar GET http://localhost:4000/health/live.

Si contracts no resuelve, compilarlo y verificar exports/version; si hay EADDRINUSE, liberar el puerto sin cambiar silenciosamente las URLs. Si Tailwind no aparece, comprobar import del CSS y plugin. Si falla Java, corregir JAVA_HOME conforme a la instalación local.

---

<!-- navigation:start -->

[← Anterior](./01-arquitectura-y-alcance.md) | [Índice del proyecto](./README.md) | [Siguiente →](./03-firebase-tmdb-y-variables.md)

[🏠 Índice general](../../README.md)

<!-- navigation:end -->
