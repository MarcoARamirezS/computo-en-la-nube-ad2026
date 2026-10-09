# Sesión 3 — Docker y Docker Compose (90 minutos)

**Objetivo:** construir la imagen de la API y ejecutarla como contenedor.

**Agenda:** 0–20 conceptos de imagen/contenedor; 20–45 Dockerfile; 45–70 Compose; 70–85 pruebas; 85–90 commit.

## Paso 1. Crear archivos

### Archivo: `apps/api/Dockerfile`

Crea el archivo exactamente en esa ruta y pega **todo** el siguiente contenido:

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY apps/api/package*.json ./
RUN npm install --omit=dev --no-audit --no-fund
COPY apps/api/src ./src
ENV NODE_ENV=production
EXPOSE 3001
USER node
CMD ["node","src/server.js"]
```

### Archivo: `.dockerignore`

Crea este archivo **en la raíz del monorepo**, porque el contexto de construcción Docker es `.`.

```dockerignore
**/node_modules
**/.env
**/.env.*
!**/.env.example
.git
**/dist
**/coverage
**/*service-account*.json
```

### Archivo: `compose.yaml`

Crea el archivo exactamente en esa ruta y pega **todo** el siguiente contenido:

```yaml
services:
  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    ports:
      - "3001:3001"
    environment:
      PORT: 3001
      STORAGE_DRIVER: memory
      CORS_ORIGIN: http://localhost:5173
    restart: unless-stopped
```

## Paso 2. Ejecutar contenedor

Para este laboratorio usa `STORAGE_DRIVER=memory` en `apps/api/.env`, evitando compartir credenciales dentro de la imagen.

**macOS:**
```bash
docker build -f apps/api/Dockerfile -t moneycloud-api .
docker compose up --build -d
docker compose ps
docker compose logs api
```
**Windows PowerShell:**
```powershell
docker build -f apps/api/Dockerfile -t moneycloud-api .
docker compose up --build -d
docker compose ps
docker compose logs api
```

## Paso 3. Validar

Abre `http://localhost:3001/health` y revisa la respuesta JSON. Ejecuta `docker compose down` y verifica que el contenedor se detuvo.

```bash
git add .
git commit -m "build: dockerizar API MoneyCloud"
git push
```
**Evidencia:** `docker compose ps`, `/health` y explicación de imagen vs. contenedor.
