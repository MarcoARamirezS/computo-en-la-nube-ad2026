# ParkingFlow — Sesión 01
## Foundation: Monorepo + Nuxt 4 + Tailwind CSS 4 + Express 5 + pruebas

---

## Objetivo

Crear el monorepo y dejar funcionando:

```text
Nuxt 4 :3000 → GET /api/v1/health → Express :3001
```

Al terminar tendremos frontend, Tailwind, API Express, TypeScript, CORS, variables de entorno y pruebas básicas.

## 1. Requisitos

Usar Node.js 24 LTS.

### macOS / Linux

```bash
node --version
npm --version
git --version
```

### Windows PowerShell

```powershell
node --version
npm --version
git --version
```

## 2. Crear proyecto raíz

### macOS

```bash
mkdir parking-flow
cd parking-flow
npm init -y
mkdir -p apps packages/shared docs
```

### Windows PowerShell

```powershell
mkdir parking-flow
cd parking-flow
npm init -y
New-Item -ItemType Directory -Force apps
New-Item -ItemType Directory -Force packages/shared
New-Item -ItemType Directory -Force docs
```

## 3. Crear Nuxt 4

```bash
npm create nuxt@latest apps/web
```

Seleccionar npm como package manager y no crear otro repositorio Git.

## 4. Instalar frontend

```bash
npm install -w apps/web tailwindcss @tailwindcss/vite pinia @pinia/nuxt
npm install -D -w apps/web vitest @nuxt/test-utils @vue/test-utils happy-dom
```

## 5. Crear backend

### macOS

```bash
mkdir -p apps/api/src/config apps/api/src/routes apps/api/src/shared/middleware apps/api/tests
cd apps/api
npm init -y
cd ../..
```

### Windows

```powershell
New-Item -ItemType Directory -Force apps/api/src/config
New-Item -ItemType Directory -Force apps/api/src/routes
New-Item -ItemType Directory -Force apps/api/src/shared/middleware
New-Item -ItemType Directory -Force apps/api/tests
cd apps/api
npm init -y
cd ../..
```

```bash
npm install -w apps/api express cors dotenv zod
npm install -D -w apps/api typescript tsx vitest supertest @types/node @types/express @types/cors @types/supertest
```

## 6. `package.json` raíz

```json
{
  "name": "parking-flow",
  "private": true,
  "version": "1.0.0",
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev:web": "npm run dev -w apps/web",
    "dev:api": "npm run dev -w apps/api",
    "build": "npm run build -w apps/web && npm run build -w apps/api",
    "test": "npm run test -w apps/web && npm run test -w apps/api"
  },
  "engines": { "node": ">=24" }
}
```

## 7. `apps/api/package.json`

```json
{
  "name": "@parking-flow/api",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc -p tsconfig.json",
    "start": "node dist/server.js",
    "test": "vitest run"
  }
}
```

> npm conservará automáticamente `dependencies` y `devDependencies` instaladas.

## 8. `apps/api/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "src",
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "noUncheckedIndexedAccess": true
  },
  "include": ["src/**/*.ts"]
}
```

## 9. `apps/api/.env`

```env
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

Crear `.env.example` con los mismos nombres.

## 10. `apps/api/src/config/env.ts`

```ts
import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().default(3001),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
})

export const env = envSchema.parse(process.env)
```

## 11. `apps/api/src/routes/health.routes.ts`

```ts
import { Router } from 'express'

export const healthRouter = Router()

healthRouter.get('/', (_request, response) => {
  response.status(200).json({
    ok: true,
    service: 'parking-flow-api',
  })
})
```

## 12. `apps/api/src/app.ts`

```ts
import cors from 'cors'
import express from 'express'
import { env } from './config/env.js'
import { healthRouter } from './routes/health.routes.js'

export const createApp = () => {
  const app = express()

  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }))
  app.use(express.json())

  app.use('/api/v1/health', healthRouter)

  app.use((_request, response) => {
    response.status(404).json({ message: 'Route not found' })
  })

  return app
}
```

## 13. `apps/api/src/server.ts`

```ts
import { createApp } from './app.js'
import { env } from './config/env.js'

const app = createApp()

app.listen(env.PORT, () => {
  console.log(`ParkingFlow API running on http://localhost:${env.PORT}`)
})
```

## 14. `apps/api/tests/health.test.ts`

```ts
import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { createApp } from '../src/app.js'

describe('GET /api/v1/health', () => {
  it('returns API health', async () => {
    const response = await request(createApp())
      .get('/api/v1/health')
      .expect(200)

    expect(response.body).toEqual({
      ok: true,
      service: 'parking-flow-api',
    })
  })
})
```

## 15. `apps/web/nuxt.config.ts`

```ts
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api/v1',
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
```

## 16. `apps/web/.env`

```env
NUXT_PUBLIC_API_BASE_URL=http://localhost:3001/api/v1
```

## 17. `apps/web/app/assets/css/main.css`

```css
@import "tailwindcss";

html {
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
}

body {
  margin: 0;
  min-width: 320px;
  background: #f8fafc;
}
```

## 18. `apps/web/app/app.vue`

```vue
<template>
  <NuxtPage />
</template>
```

## 19. `apps/web/app/composables/useApi.ts`

```ts
export const useApi = () => {
  const config = useRuntimeConfig()

  return $fetch.create({
    baseURL: config.public.apiBaseUrl,
  })
}
```

## 20. `apps/web/app/pages/index.vue`

```vue
<script setup lang="ts">
const api = useApi()

const { data, error, status, refresh } = await useAsyncData(
  'api-health',
  () => api('/health'),
)
</script>

<template>
  <main class="min-h-screen bg-slate-50">
    <div class="mx-auto max-w-5xl px-6 py-16">
      <p class="text-sm font-bold uppercase tracking-widest text-indigo-600">
        ParkingFlow
      </p>
      <h1 class="mt-3 text-4xl font-black tracking-tight text-slate-900">
        Nuxt 4 + Express 5
      </h1>
      <section class="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 class="font-bold text-slate-900">Estado de la API</h2>
        <p v-if="status === 'pending'" class="mt-4 text-slate-500">Consultando...</p>
        <div v-else-if="error" class="mt-4">
          <p class="font-semibold text-red-600">API no disponible.</p>
          <button class="mt-3 rounded-lg bg-slate-900 px-4 py-2 text-white" @click="refresh()">
            Reintentar
          </button>
        </div>
        <pre v-else class="mt-4 overflow-auto rounded-xl bg-slate-900 p-4 text-sm text-emerald-300">{{ data }}</pre>
      </section>
    </div>
  </main>
</template>
```

## 21. Configurar test frontend

Agregar en `apps/web/package.json`:

```json
"test": "vitest run"
```

Crear `apps/web/vitest.config.ts`:

```ts
import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: { environment: 'nuxt' },
})
```

Crear `apps/web/tests/app.test.ts`:

```ts
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import App from '~/app.vue'

describe('App', () => {
  it('mounts', async () => {
    const wrapper = await mountSuspended(App)
    expect(wrapper.exists()).toBe(true)
  })
})
```

## 22. Ejecutar

Terminal 1:

```bash
npm run dev:api
```

Terminal 2:

```bash
npm run dev:web
```

Abrir `http://localhost:3000` y `http://localhost:3001/api/v1/health`.

## 23. Pruebas

```bash
npm run test -w apps/api
npm run test -w apps/web
npm test
```

## 24. Build

```bash
npm run build
```

## 25. Commit

```bash
git init
git add .
git commit -m "chore: initialize ParkingFlow monorepo"
```

---

[← Regresar al índice](./README.md)
