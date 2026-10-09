# Sesión 4 — Render, Netlify y GitHub Actions (90 minutos)

**Objetivo:** publicar la API Docker y el frontend estático y automatizar las pruebas.

**Agenda:** 0–15 build/test; 15–45 Render; 45–65 Netlify; 65–80 integración; 80–90 CI.

## Paso 1. Crear archivos de despliegue

### Archivo: `netlify.toml`

Crea el archivo exactamente en esa ruta y pega **todo** el siguiente contenido:

```toml
[build]
  command = "npm run build -w @moneycloud/web"
  publish = "apps/web/dist"
```

### Archivo: `.github/workflows/ci.yml`

Crea el archivo exactamente en esa ruta y pega **todo** el siguiente contenido:

```yaml
name: MoneyCloud CI
on:
  push:
  pull_request:
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: npm
      - run: npm install
      - run: npm test
      - run: npm run build
      - run: docker build -f apps/api/Dockerfile -t moneycloud-api .
```

## Paso 2. Validar antes de publicar

**macOS:**
```bash
npm test
npm run build
git add .
git commit -m "ci: preparar despliegue MoneyCloud"
git push
```
**Windows PowerShell:**
```powershell
npm.cmd test
npm.cmd run build
git add .
git commit -m "ci: preparar despliegue MoneyCloud"
git push
```
Si no hay cambios, omite el commit. Versiona `package-lock.json`.

## Paso 3. Render — API Docker

1. Abre https://dashboard.render.com, conecta GitHub y crea un Web Service.
2. Selecciona el repositorio del estudiante; runtime Docker.
3. Configura Dockerfile `apps/api/Dockerfile` y contexto de build raíz `.`.
4. Variables: `NODE_ENV=production`, `STORAGE_DRIVER=memory` para demo efímera, `CORS_ORIGIN=https://TU-SITIO.netlify.app`. Para persistencia real de laboratorio cambia a `firestore` y configura `FIREBASE_PROJECT_ID` y `FIREBASE_SERVICE_ACCOUNT_JSON` como secretos de Render, nunca en Git.
5. Comprueba `https://TU-API.onrender.com/health`. El plan gratuito puede suspender el servicio por inactividad.

## Paso 4. Netlify — frontend

1. Conecta el mismo repositorio desde https://app.netlify.com.
2. Deja **Base directory vacía** (raíz del repositorio); usa build `npm run build -w @moneycloud/web` y publicación `apps/web/dist`. Esto conserva los npm workspaces del monorepo.
3. Define `VITE_API_URL=https://TU-API.onrender.com` en las variables de build de Netlify.
4. Despliega, copia la URL del sitio y actualiza `CORS_ORIGIN` en Render con esa URL exacta (sin `/` final).
5. Verifica desde la pestaña Network que las peticiones se dirijan a Render por HTTPS.

## Paso 5. GitHub Actions

En GitHub abre Actions y verifica que el workflow ejecute pruebas y build. Si falla, abre los logs, corrige y vuelve a hacer push.

## Paso 6. Checklist final

- API `/health` devuelve HTTP 200.
- Frontend publicado carga sin errores de consola.
- Un movimiento ficticio se registra y aparece en el dashboard.
- CORS permite el origen real de Netlify.
- GitHub Actions termina correctamente.
- Ninguna credencial privada está versionada.

**Evidencia:** enlaces públicos, captura del workflow y explicación de la arquitectura.


### Seguridad y límites del laboratorio

El MVP no implementa autenticación ni aislamiento por usuario. **No habilites escritura pública persistente con información real**. Para una demostración pública usa datos ficticios y `STORAGE_DRIVER=memory` (se perderán al reiniciar); para practicar Firestore, restringe el acceso a un entorno de laboratorio y elimina los datos al terminar.

**Render:** selecciona el Dockerfile `apps/api/Dockerfile`, contexto de construcción `.` y confirma que el servicio escucha en `0.0.0.0` con la variable `PORT` proporcionada por Render.

**Netlify:** `VITE_API_URL` es una variable de **compilación**, por lo que debes iniciar un nuevo deploy al cambiarla.
