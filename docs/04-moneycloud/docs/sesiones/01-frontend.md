# Sesión 1 — Construir frontend y API de apoyo (90 minutos)

**Objetivo:** crear archivos manualmente, ejecutar el dashboard y registrar movimientos con una API local en memoria.

**Agenda:** 0–15 arquitectura y Git; 15–30 carpetas; 30–65 pegar código; 65–80 ejecutar y probar; 80–90 commit. Preparar las instalaciones antes de clase.

## Paso 1. Crear carpetas vacías

**macOS:**
```bash
mkdir -p apps/web/src apps/api/src apps/api/tests
```
**Windows PowerShell:**
```powershell
New-Item -ItemType Directory -Force apps/web/src, apps/api/src, apps/api/tests
```
En VS Code verifica `apps/web/src` y `apps/api/src`.

## Paso 2. Crear los archivos y copiar el código

**Nota:** la API local de apoyo es necesaria desde la sesión 1 para que el formulario no falle. La sesión 2 profundiza en este código y habilita Firestore.

### Archivo: `package.json`

Crea el archivo exactamente en esa ruta y pega **todo** el siguiente contenido:

```json
{
  "name": "moneycloud",
  "private": true,
  "workspaces": [
    "apps/*"
  ],
  "scripts": {
    "dev:api": "npm run dev -w @moneycloud/api",
    "dev:web": "npm run dev -w @moneycloud/web",
    "test": "npm run test -w @moneycloud/api",
    "build": "npm run build -w @moneycloud/web"
  },
  "engines": {
    "node": ">=22"
  }
}
```

### Archivo: `apps/web/package.json`

Crea el archivo exactamente en esa ruta y pega **todo** el siguiente contenido:

```json
{
  "name": "@moneycloud/web",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host 0.0.0.0",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "tailwindcss": "^4.1.0",
    "@tailwindcss/vite": "^4.1.0",
    "vite": "^6.2.0"
  }
}
```

### Archivo: `apps/web/index.html`

Crea el archivo exactamente en esa ruta y pega **todo** el siguiente contenido:

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>MoneyCloud | Finanzas</title>
  </head>
  <body class="bg-slate-50 text-slate-900">
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

### Archivo: `apps/web/vite.config.js`

Crea el archivo exactamente en esa ruta y pega **todo** el siguiente contenido:

```javascript
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
});
```

### Archivo: `apps/web/src/style.css`

Crea el archivo exactamente en esa ruta y pega **todo** el siguiente contenido:

```css
@import "tailwindcss";
```

### Archivo: `apps/web/src/main.js`

Crea el archivo exactamente en esa ruta y pega **todo** el siguiente contenido:

```javascript
import './style.css';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/$/, '');
const element = (id) => document.getElementById(id);
const money = (cents) => new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
}).format(cents / 100);

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Error HTTP ${response.status}`);
  }
  return response.status === 204 ? null : response.json();
}

element('app').innerHTML = `
  <main class="mx-auto max-w-5xl p-5 md:p-10">
    <header class="mb-8">
      <p class="font-semibold text-teal-700">MONEYCLOUD · LABORATORIO CLOUD</p>
      <h1 class="mt-2 text-3xl font-bold">Mis finanzas</h1>
      <p class="text-slate-500">Demo académica. No introduzcas datos financieros reales.</p>
    </header>

    <div id="error" role="alert" class="mb-5 hidden rounded bg-red-100 p-3 text-red-900"></div>

    <section class="mb-8 grid gap-4 md:grid-cols-3">
      <article class="rounded-xl bg-white p-5 shadow-sm">
        <p>Ingresos</p>
        <strong id="income" class="text-2xl text-teal-700">—</strong>
      </article>
      <article class="rounded-xl bg-white p-5 shadow-sm">
        <p>Egresos</p>
        <strong id="expense" class="text-2xl text-rose-700">—</strong>
      </article>
      <article class="rounded-xl bg-slate-900 p-5 text-white">
        <p>Balance</p>
        <strong id="balance" class="text-2xl">—</strong>
      </article>
    </section>

    <section class="grid gap-6 md:grid-cols-5">
      <form id="form" class="space-y-4 rounded-xl bg-white p-5 shadow-sm md:col-span-2">
        <h2 class="text-xl font-bold">Nuevo movimiento</h2>
        <label class="block">Tipo
          <select id="type" class="mt-1 block w-full rounded border p-2">
            <option value="income">Ingreso</option>
            <option value="expense">Egreso</option>
          </select>
        </label>
        <label class="block">Descripción
          <input id="description" required minlength="2" maxlength="100"
            class="mt-1 block w-full rounded border p-2" placeholder="Ej. Transporte" />
        </label>
        <label class="block">Categoría
          <input id="category" required minlength="2" maxlength="40"
            class="mt-1 block w-full rounded border p-2" placeholder="Ej. Escuela" />
        </label>
        <label class="block">Monto (MXN)
          <input id="amount" type="number" min="0.01" max="1000000" step="0.01" required
            class="mt-1 block w-full rounded border p-2" placeholder="150.00" />
        </label>
        <button class="w-full rounded bg-teal-700 px-5 py-3 text-white hover:bg-teal-800">
          Guardar movimiento
        </button>
      </form>

      <div class="rounded-xl bg-white p-5 shadow-sm md:col-span-3">
        <div class="mb-4 flex items-center justify-between gap-3">
          <h2 class="text-xl font-bold">Movimientos</h2>
          <select id="filter" aria-label="Filtrar movimientos" class="rounded border p-2">
            <option value="all">Todos</option>
            <option value="income">Ingresos</option>
            <option value="expense">Egresos</option>
          </select>
        </div>
        <div id="list" class="space-y-3">Cargando...</div>
      </div>
    </section>
  </main>
`;

let transactions = [];

function showError(message) {
  element('error').textContent = message;
  element('error').classList.remove('hidden');
}

function render() {
  const selected = element('filter').value;
  const items = transactions.filter((item) => selected === 'all' || item.type === selected);

  element('list').innerHTML = items.length
    ? items.map((item) => `
        <article class="flex items-center justify-between gap-2 border-b pb-3">
          <div>
            <p class="font-semibold">${escapeHtml(item.description)}</p>
            <p class="text-xs text-slate-500">
              ${escapeHtml(item.category)} · ${escapeHtml(item.createdAt.slice(0, 10))}
            </p>
          </div>
          <div class="text-right">
            <p class="font-bold ${item.type === 'income' ? 'text-teal-700' : 'text-rose-700'}">
              ${item.type === 'income' ? '+' : '−'}${money(item.amountCents)}
            </p>
            <button class="delete text-xs underline" data-id="${item.id}">Eliminar</button>
          </div>
        </article>
      `).join('')
    : '<p class="text-slate-500">Sin movimientos</p>';
}

async function refresh() {
  try {
    const [list, summary] = await Promise.all([
      request('/api/v1/transactions'),
      request('/api/v1/summary'),
    ]);
    transactions = list.data;
    element('income').textContent = money(summary.data.incomeCents);
    element('expense').textContent = money(summary.data.expenseCents);
    element('balance').textContent = money(summary.data.balanceCents);
    render();
    element('error').classList.add('hidden');
  } catch (error) {
    showError(`No se pudo conectar con la API: ${error.message}`);
  }
}

element('filter').addEventListener('change', render);

element('form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const amountCents = Math.round(Number(element('amount').value) * 100);
  if (!Number.isSafeInteger(amountCents) || amountCents <= 0) {
    showError('Monto inválido');
    return;
  }

  const button = event.target.querySelector('button');
  button.disabled = true;
  try {
    await request('/api/v1/transactions', {
      method: 'POST',
      body: JSON.stringify({
        type: element('type').value,
        description: element('description').value,
        category: element('category').value,
        amountCents,
      }),
    });
    event.target.reset();
    await refresh();
  } catch (error) {
    showError(`No se pudo guardar: ${error.message}`);
  } finally {
    button.disabled = false;
  }
});

element('list').addEventListener('click', async (event) => {
  const button = event.target.closest('.delete');
  if (!button || !confirm('¿Eliminar este movimiento?')) return;

  try {
    await request(`/api/v1/transactions/${encodeURIComponent(button.dataset.id)}`, {
      method: 'DELETE',
    });
    await refresh();
  } catch (error) {
    showError(`No se pudo eliminar: ${error.message}`);
  }
});

refresh();
```

### Archivo: `apps/web/.env.example`

Crea el archivo exactamente en esa ruta y pega **todo** el siguiente contenido:

```dotenv
VITE_API_URL=http://localhost:3001
```

### Archivo: `apps/api/package.json`

Crea el archivo exactamente en esa ruta y pega **todo** el siguiente contenido:

```json
{
  "name": "@moneycloud/api",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "node --watch src/server.js",
    "start": "node src/server.js",
    "test": "vitest run"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "firebase-admin": "^13.0.2",
    "helmet": "^8.0.0",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "supertest": "^7.0.0",
    "vitest": "^3.0.0"
  },
  "engines": {
    "node": ">=22"
  }
}
```

### Archivo: `apps/api/src/store.js`

Crea el archivo exactamente en esa ruta y pega **todo** el siguiente contenido:

```javascript
import { randomUUID } from 'node:crypto';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, applicationDefault, cert } from 'firebase-admin/app';

const memory = new Map();
const collectionName = 'moneycloud_demo_transactions';
const useFirestore = () => process.env.STORAGE_DRIVER === 'firestore';

function database() {
  if (!getApps().length) {
    const credentials = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    initializeApp({
      credential: credentials ? cert(JSON.parse(credentials)) : applicationDefault(),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
  }
  return getFirestore();
}

export async function listTransactions() {
  if (!useFirestore()) {
    return [...memory.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  const snapshot = await database()
    .collection(collectionName)
    .orderBy('createdAt', 'desc')
    .limit(200)
    .get();
  return snapshot.docs.map((document) => document.data());
}

export async function createTransaction(data) {
  const item = {
    id: randomUUID(),
    ...data,
    createdAt: new Date().toISOString(),
  };
  if (useFirestore()) {
    await database().collection(collectionName).doc(item.id).set(item);
  } else {
    memory.set(item.id, item);
  }
  return item;
}

export async function deleteTransaction(id) {
  if (!useFirestore()) return memory.delete(id);

  const reference = database().collection(collectionName).doc(id);
  const snapshot = await reference.get();
  if (!snapshot.exists) return false;

  await reference.delete();
  return true;
}

export function resetMemoryForTests() {
  memory.clear();
}
```

### Archivo: `apps/api/src/app.js`

Crea el archivo exactamente en esa ruta y pega **todo** el siguiente contenido:

```javascript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { z } from 'zod';
import { listTransactions, createTransaction, deleteTransaction } from './store.js';

const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  description: z.string().trim().min(2).max(100),
  category: z.string().trim().min(2).max(40),
  amountCents: z.number().int().positive().max(100000000),
}).strict();

export const app = express();
app.disable('x-powered-by');
app.use(helmet());

const origins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim());

app.use(cors({
  origin(origin, callback) {
    if (!origin || origins.includes(origin)) return callback(null, true);
    return callback(new Error('Origen CORS no permitido'));
  },
}));
app.use(express.json({ limit: '16kb' }));

app.get('/health', (_request, response) => {
  response.json({ status: 'ok', service: 'moneycloud-api' });
});

app.get('/api/v1/transactions', async (_request, response, next) => {
  try {
    response.json({ data: await listTransactions() });
  } catch (error) {
    next(error);
  }
});

app.post('/api/v1/transactions', async (request, response, next) => {
  try {
    const parsed = transactionSchema.safeParse(request.body);
    if (!parsed.success) {
      return response.status(400).json({
        error: 'Datos inválidos',
        details: parsed.error.flatten(),
      });
    }
    return response.status(201).json({ data: await createTransaction(parsed.data) });
  } catch (error) {
    return next(error);
  }
});

app.delete('/api/v1/transactions/:id', async (request, response, next) => {
  try {
    const deleted = await deleteTransaction(request.params.id);
    if (!deleted) return response.status(404).json({ error: 'Movimiento no encontrado' });
    return response.status(204).end();
  } catch (error) {
    return next(error);
  }
});

app.get('/api/v1/summary', async (_request, response, next) => {
  try {
    const transactions = await listTransactions();
    const incomeCents = transactions
      .filter((item) => item.type === 'income')
      .reduce((total, item) => total + item.amountCents, 0);
    const expenseCents = transactions
      .filter((item) => item.type === 'expense')
      .reduce((total, item) => total + item.amountCents, 0);

    response.json({
      data: {
        incomeCents,
        expenseCents,
        balanceCents: incomeCents - expenseCents,
        count: transactions.length,
      },
    });
  } catch (error) {
    next(error);
  }
});

app.use((error, _request, response, _next) => {
  console.error('API error:', error.message);
  const status = error.message === 'Origen CORS no permitido' ? 403 : 500;
  response.status(status).json({ error: 'No fue posible completar la operación' });
});
```

### Archivo: `apps/api/src/server.js`

Crea el archivo exactamente en esa ruta y pega **todo** el siguiente contenido:

```javascript
import 'dotenv/config';
import { app } from './app.js';

const port = Number(process.env.PORT || 3001);
app.listen(port, '0.0.0.0', () => {
  console.log(`MoneyCloud API en puerto ${port}`);
});
```

### Archivo: `apps/api/.env.example`

Crea el archivo exactamente en esa ruta y pega **todo** el siguiente contenido:

```dotenv
PORT=3001
STORAGE_DRIVER=memory
CORS_ORIGIN=http://localhost:5173
# Para Render: STORAGE_DRIVER=firestore
# FIREBASE_PROJECT_ID=tu-proyecto
# FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
```

### Archivo: `.gitignore`

Crea el archivo en la raíz del proyecto y pega:

```gitignore
node_modules/
**/node_modules/
.env
.env.*
!.env.example
**/.env
**/.env.*
!**/.env.example
dist/
**/dist/
coverage/
.DS_Store
*.log
firebase-service-account*.json
```

**Verificación:** `git status --ignored` debe mostrar los `.env` y `node_modules` como ignorados.

## Paso 3. Crear `.env` locales

**macOS:**
```bash
cp apps/web/.env.example apps/web/.env
cp apps/api/.env.example apps/api/.env
npm install
```
**Windows PowerShell:**
```powershell
Copy-Item apps/web/.env.example apps/web/.env
Copy-Item apps/api/.env.example apps/api/.env
npm.cmd install
```
Revisa `apps/api/.env` y deja `STORAGE_DRIVER=memory` para esta sesión.

## Paso 4. Ejecutar

**macOS, Terminal A:** `npm run dev:api`

**macOS, Terminal B:** `npm run dev:web`

**Windows, PowerShell A:** `npm.cmd run dev:api`

**Windows, PowerShell B:** `npm.cmd run dev:web`

Abre `http://localhost:5173`; comprueba `http://localhost:3001/health` (o el puerto de `apps/api/.env`).

## Paso 5. Prueba funcional

1. Registra ingreso MXN 1,000 y gasto MXN 125.50.
2. Verifica balance MXN 874.50.
3. Filtra ingresos y egresos; elimina un movimiento.
4. Abre DevTools → Network y observa las peticiones HTTP.
5. Reinicia la API y explica por qué desaparecen los datos en memoria.

## Paso 6. Git

```bash
git add .
git commit -m "feat: moneycloud dashboard y API en memoria"
git push
```
**Evidencia:** captura del dashboard, `GET /health` y commit publicado.
