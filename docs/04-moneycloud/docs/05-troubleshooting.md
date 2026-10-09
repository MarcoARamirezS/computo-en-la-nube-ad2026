# Solución de problemas

| Síntoma | Causa probable | Solución |
|---|---|---|
| `node` no existe | Node no instalado/PATH | Instalar Node LTS y abrir terminal nueva |
| `npm.ps1 cannot be loaded` | PowerShell ExecutionPolicy | Usar `npm.cmd` o Git Bash |
| Puerto 3001 ocupado | API local y Docker a la vez | Detener proceso anterior o contenedor |
| `docker daemon` no responde | Docker Desktop cerrado | Abrir Docker Desktop y esperar engine |
| `COPY failed` | Contexto de build equivocado | Desde raíz: `docker build -f apps/api/Dockerfile -t moneycloud-api .` |
| Error CORS | Dominio de Netlify distinto | Ajustar `CORS_ORIGIN` exacto en Render |
| Frontend intenta localhost en producción | Falta `VITE_API_URL` | Definir URL HTTPS en Netlify y reconstruir |
| Firebase `permission-denied` | Proyecto/credenciales erróneos | Revisar ID, IAM y credencial en Render |
| Render tarda en responder | Suspensión de instancia gratuita | Esperar arranque; repetir health |
| Datos desaparecen | STORAGE_DRIVER=memory | Activar Firestore para persistencia |
| `npm ci` falla | No existe lockfile | Ejecutar `npm install` en raíz, versionar `package-lock.json` |
| Build Netlify no encuentra dist | Directorio incorrecto | Confirmar `apps/web/dist` como publish efectivo |
| HTTP 500 | Credenciales Firestore inválidas | Revisar logs Render sin imprimir secretos |

## Diagnóstico
```bash
npm test
npm run build
docker compose ps
docker compose logs --tail=50 api
git status
```
En Windows PowerShell y macOS los comandos anteriores son equivalentes.
