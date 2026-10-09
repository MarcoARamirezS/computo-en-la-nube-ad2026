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
 "name":"moneycloud","private":true,"workspaces":["apps/*"],"scripts":{"dev:api":"npm run dev -w @moneycloud/api","dev:web":"npm run dev -w @moneycloud/web","test":"npm run test -w @moneycloud/api","build":"npm run build -w @moneycloud/web"},"engines":{"node":">=22"}}
```

### Archivo: `apps/web/package.json`

Crea el archivo exactamente en esa ruta y pega **todo** el siguiente contenido:

```json
{"name":"@moneycloud/web","version":"1.0.0","type":"module","scripts":{"dev":"vite --host 0.0.0.0","build":"vite build","preview":"vite preview"},"dependencies":{"tailwindcss":"^4.1.0","@tailwindcss/vite":"^4.1.0","vite":"^6.2.0"}}
```

### Archivo: `apps/web/index.html`

Crea el archivo exactamente en esa ruta y pega **todo** el siguiente contenido:

```html
<!doctype html><html lang="es"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>MoneyCloud | Finanzas</title></head><body class="bg-slate-50 text-slate-900"><div id="app"></div><script type="module" src="/src/main.js"></script></body></html>
```

### Archivo: `apps/web/vite.config.js`

Crea el archivo exactamente en esa ruta y pega **todo** el siguiente contenido:

```javascript
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({plugins:[tailwindcss()]});
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
const api=(import.meta.env.VITE_API_URL||'http://localhost:3001').replace(/\/$/,'');
const $=(id)=>document.getElementById(id);
const money=(c)=>new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'}).format(c/100);
const escapeHtml=(s)=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function request(path,opts={}){const res=await fetch(api+path,{...opts,headers:{'Content-Type':'application/json',...(opts.headers||{})}});if(!res.ok)throw new Error('Error HTTP '+res.status);return res.status===204?null:res.json();}
$('app').innerHTML=`<main class="mx-auto max-w-5xl p-5 md:p-10"><header class="mb-8"><p class="text-teal-700 font-semibold">MONEYCLOUD · LABORATORIO CLOUD</p><h1 class="text-3xl font-bold mt-2">Mis finanzas</h1><p class="text-slate-500">Demo académica. No introduzcas datos financieros reales.</p></header><div id="error" role="alert" class="hidden rounded bg-red-100 p-3 text-red-900 mb-5"></div><section class="grid gap-4 md:grid-cols-3 mb-8"><article class="rounded-xl bg-white p-5 shadow-sm"><p>Ingresos</p><strong id="income" class="text-2xl text-teal-700">—</strong></article><article class="rounded-xl bg-white p-5 shadow-sm"><p>Egresos</p><strong id="expense" class="text-2xl text-rose-700">—</strong></article><article class="rounded-xl bg-slate-900 p-5 text-white"><p>Balance</p><strong id="balance" class="text-2xl">—</strong></article></section><section class="grid gap-6 md:grid-cols-5"><form id="form" class="md:col-span-2 rounded-xl bg-white p-5 shadow-sm space-y-4"><h2 class="font-bold text-xl">Nuevo movimiento</h2><label class="block">Tipo<select id="type" class="block w-full border rounded p-2 mt-1"><option value="income">Ingreso</option><option value="expense">Egreso</option></select></label><label class="block">Descripción<input id="description" required minlength="2" maxlength="100" class="block w-full border rounded p-2 mt-1" placeholder="Ej. Transporte"/></label><label class="block">Categoría<input id="category" required minlength="2" maxlength="40" class="block w-full border rounded p-2 mt-1" placeholder="Ej. Escuela"/></label><label class="block">Monto (MXN)<input id="amount" type="number" min="0.01" max="1000000" step="0.01" required class="block w-full border rounded p-2 mt-1" placeholder="150.00"/></label><button class="bg-teal-700 text-white rounded px-5 py-3 w-full hover:bg-teal-800">Guardar movimiento</button></form><div class="md:col-span-3 rounded-xl bg-white p-5 shadow-sm"><div class="flex items-center justify-between gap-3 mb-4"><h2 class="font-bold text-xl">Movimientos</h2><select id="filter" aria-label="Filtrar movimientos" class="border rounded p-2"><option value="all">Todos</option><option value="income">Ingresos</option><option value="expense">Egresos</option></select></div><div id="list" class="space-y-3">Cargando...</div></div></section></main>`;
let transactions=[];
function showError(message){$('error').textContent=message;$('error').classList.remove('hidden');}
function render(){const selected=$('filter').value;const items=transactions.filter(t=>selected==='all'||t.type===selected);$('list').innerHTML=items.length?items.map(t=>`<article class="flex items-center justify-between gap-2 border-b pb-3"><div><p class="font-semibold">${escapeHtml(t.description)}</p><p class="text-xs text-slate-500">${escapeHtml(t.category)} · ${escapeHtml(t.createdAt.slice(0,10))}</p></div><div class="text-right"><p class="font-bold ${t.type==='income'?'text-teal-700':'text-rose-700'}">${t.type==='income'?'+':'−'}${money(t.amountCents)}</p><button class="delete text-xs underline" data-id="${t.id}">Eliminar</button></div></article>`).join(''):'<p class="text-slate-500">Sin movimientos</p>';}
async function refresh(){try{const [list,summary]=await Promise.all([request('/api/v1/transactions'),request('/api/v1/summary')]);transactions=list.data;$('income').textContent=money(summary.data.incomeCents);$('expense').textContent=money(summary.data.expenseCents);$('balance').textContent=money(summary.data.balanceCents);render();$('error').classList.add('hidden');}catch(e){showError('No se pudo conectar con la API: '+e.message);}}
$('filter').addEventListener('change',render);
$('form').addEventListener('submit',async(e)=>{e.preventDefault();const amount=Number($('amount').value);const amountCents=Math.round(amount*100);if(!Number.isSafeInteger(amountCents)||amountCents<=0)return showError('Monto inválido');const btn=e.target.querySelector('button');btn.disabled=true;try{await request('/api/v1/transactions',{method:'POST',body:JSON.stringify({type:$('type').value,description:$('description').value,category:$('category').value,amountCents})});e.target.reset();await refresh();}catch(err){showError('No se pudo guardar: '+err.message);}finally{btn.disabled=false;}});
$('list').addEventListener('click',async(e)=>{const btn=e.target.closest('.delete');if(!btn||!confirm('¿Eliminar este movimiento?'))return;try{await request('/api/v1/transactions/'+encodeURIComponent(btn.dataset.id),{method:'DELETE'});await refresh();}catch(err){showError('No se pudo eliminar: '+err.message);}});
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
{"name":"@moneycloud/api","version":"1.0.0","type":"module","scripts":{"dev":"node --watch src/server.js","start":"node src/server.js","test":"vitest run"},"dependencies":{"cors":"^2.8.5","dotenv":"^16.4.7","express":"^4.21.2","firebase-admin":"^13.0.2","helmet":"^8.0.0","zod":"^3.24.2"},"devDependencies":{"supertest":"^7.0.0","vitest":"^3.0.0"},"engines":{"node":">=22"}}
```

### Archivo: `apps/api/src/store.js`

Crea el archivo exactamente en esa ruta y pega **todo** el siguiente contenido:

```javascript
import { randomUUID } from 'node:crypto';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, applicationDefault, cert } from 'firebase-admin/app';

const memory = new Map();
const collectionName = 'moneycloud_demo_transactions';
function db() {
  if (!getApps().length) {
    const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    initializeApp({ credential: json ? cert(JSON.parse(json)) : applicationDefault(), projectId: process.env.FIREBASE_PROJECT_ID });
  }
  return getFirestore();
}
const cloud = () => process.env.STORAGE_DRIVER === 'firestore';
export async function listTransactions() {
  if (!cloud()) return [...memory.values()].sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
  const snapshot = await db().collection(collectionName).orderBy('createdAt','desc').limit(200).get();
  return snapshot.docs.map(doc=>doc.data());
}
export async function createTransaction(data) {
  const item={ id:randomUUID(),...data,createdAt:new Date().toISOString() };
  if (cloud()) await db().collection(collectionName).doc(item.id).set(item);
  else memory.set(item.id,item);
  return item;
}
export async function deleteTransaction(id) {
  if (!cloud()) return memory.delete(id);
  const ref=db().collection(collectionName).doc(id);const snap=await ref.get();
  if(!snap.exists) return false;await ref.delete();return true;
}
export function resetMemoryForTests(){memory.clear();}
```

### Archivo: `apps/api/src/app.js`

Crea el archivo exactamente en esa ruta y pega **todo** el siguiente contenido:

```javascript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { z } from 'zod';
import { listTransactions, createTransaction, deleteTransaction } from './store.js';

const schema=z.object({type:z.enum(['income','expense']),description:z.string().trim().min(2).max(100),category:z.string().trim().min(2).max(40),amountCents:z.number().int().positive().max(100000000)}).strict();
export const app=express();
app.disable('x-powered-by');app.use(helmet());
const origins=(process.env.CORS_ORIGIN||'http://localhost:5173').split(',').map(s=>s.trim());
app.use(cors({origin(orig,cb){if(!orig||origins.includes(orig)) return cb(null,true);return cb(new Error('Origen CORS no permitido'));}}));
app.use(express.json({limit:'16kb'}));
app.get('/health',(_req,res)=>res.json({status:'ok',service:'moneycloud-api'}));
app.get('/api/v1/transactions',async (_req,res,next)=>{try{res.json({data:await listTransactions()});}catch(e){next(e);}});
app.post('/api/v1/transactions',async(req,res,next)=>{try{const parsed=schema.safeParse(req.body);if(!parsed.success)return res.status(400).json({error:'Datos inválidos',details:parsed.error.flatten()});res.status(201).json({data:await createTransaction(parsed.data)});}catch(e){next(e);}});
app.delete('/api/v1/transactions/:id',async(req,res,next)=>{try{const deleted=await deleteTransaction(req.params.id);if(!deleted)return res.status(404).json({error:'Movimiento no encontrado'});res.status(204).end();}catch(e){next(e);}});
app.get('/api/v1/summary',async(_req,res,next)=>{try{const tx=await listTransactions();const incomeCents=tx.filter(x=>x.type==='income').reduce((s,x)=>s+x.amountCents,0);const expenseCents=tx.filter(x=>x.type==='expense').reduce((s,x)=>s+x.amountCents,0);res.json({data:{incomeCents,expenseCents,balanceCents:incomeCents-expenseCents,count:tx.length}});}catch(e){next(e);}});
app.use((err,_req,res,_next)=>{console.error('API error:',err.message);res.status(err.message==='Origen CORS no permitido'?403:500).json({error:'No fue posible completar la operación'});});
```

### Archivo: `apps/api/src/server.js`

Crea el archivo exactamente en esa ruta y pega **todo** el siguiente contenido:

```javascript
import 'dotenv/config';
import { app } from './app.js';
const port=Number(process.env.PORT||3001);
app.listen(port,'0.0.0.0',()=>console.log(`MoneyCloud API en puerto ${port}`));
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

Abre `http://localhost:5173`; comprueba `http://localhost:3000/health` (o el puerto de `apps/api/.env`).

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
