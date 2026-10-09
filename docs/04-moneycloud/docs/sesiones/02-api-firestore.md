# Sesión 2 — API REST, pruebas y Firestore (90 minutos)

**Objetivo:** comprender la validación, las operaciones CRUD y la persistencia remota.

**Agenda:** 0–20 analizar rutas; 20–35 pruebas; 35–70 configurar Firestore; 70–85 verificar persistencia; 85–90 commit.

## Paso 1. Revisar el código existente

Abre `apps/api/src/app.js` y localiza GET `/health`, GET/POST/DELETE `/api/v1/transactions`, GET `/api/v1/summary`. Abre `apps/api/src/store.js` para comparar `memory` y `firestore`. Los archivos ya se crearon en sesión 1: **no los dupliques**.

## Paso 2. Agregar pruebas automáticas

### Archivo: `apps/api/tests/api.test.js`

Crea el archivo exactamente en esa ruta y pega **todo** el siguiente contenido:

```javascript
import { describe,it,expect,beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { resetMemoryForTests } from '../src/store.js';
process.env.STORAGE_DRIVER='memory';
beforeEach(()=>resetMemoryForTests());
describe('API MoneyCloud',()=>{
 it('responde health',async()=>{const r=await request(app).get('/health');expect(r.status).toBe(200);expect(r.body.status).toBe('ok');});
 it('crea, lista, resume y elimina movimientos',async()=>{const created=await request(app).post('/api/v1/transactions').send({type:'income',description:'Beca',category:'Otros',amountCents:12345});expect(created.status).toBe(201);const id=created.body.data.id;const list=await request(app).get('/api/v1/transactions');expect(list.body.data).toHaveLength(1);const summary=await request(app).get('/api/v1/summary');expect(summary.body.data.balanceCents).toBe(12345);expect((await request(app).delete('/api/v1/transactions/'+id)).status).toBe(204);});
 it('rechaza monto inválido',async()=>{const r=await request(app).post('/api/v1/transactions').send({type:'expense',description:'Café',category:'Comida',amountCents:-5});expect(r.status).toBe(400);});
});
```

## Paso 3. Ejecutar pruebas

**macOS:** `npm test`

**Windows PowerShell:** `npm.cmd test`

Las pruebas usan memoria y no requieren credenciales Firebase.

## Paso 4. Configurar Firebase Firestore

1. En Firebase Console crea un proyecto de laboratorio y habilita Firestore.
2. Crea una cuenta de servicio para el backend desde la consola de Firebase/Google Cloud con permisos mínimos adecuados. **No subas su archivo JSON al repositorio**.
3. Para desarrollo local puedes configurar `GOOGLE_APPLICATION_CREDENTIALS` apuntando al JSON guardado fuera del repositorio o usar `FIREBASE_SERVICE_ACCOUNT_JSON` como variable de entorno privada.
4. En `apps/api/.env`, establece `STORAGE_DRIVER=firestore` y `FIREBASE_PROJECT_ID` con el ID real. Si usas `GOOGLE_APPLICATION_CREDENTIALS`, debe estar disponible en el proceso que ejecuta Node.
5. Reinicia la API y verifica que puedes crear, listar y eliminar movimientos; reinicia de nuevo y comprueba que los movimientos persisten.

**macOS, ejemplo con credencial externa:**
```bash
export GOOGLE_APPLICATION_CREDENTIALS="$HOME/.config/moneycloud/firebase-service-account.json"
npm run dev:api
```
**Windows PowerShell, ejemplo con credencial externa:**
```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS="$HOME\.config\moneycloud\firebase-service-account.json"
npm.cmd run dev:api
```
Ajusta la ruta al archivo real. La ruta es un ejemplo, no un archivo que debas versionar.

**Importante:** el código de ejemplo usa Admin SDK en el servidor y acceso privilegiado a Firestore. No publiques la API de escritura abierta con información real.

## Paso 5. Validación

- POST inválido devuelve HTTP 400.
- GET lista movimientos.
- DELETE devuelve 204 si existe y 404 si no existe.
- GET summary suma centavos correctamente.
- Con Firestore, los movimientos persisten tras reiniciar la API.

```bash
git add .
git commit -m "test(api): validar REST y persistencia Firestore"
git push
```
**Evidencia:** pruebas y captura de Firestore con datos ficticios.
