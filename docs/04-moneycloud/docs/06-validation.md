# Validación final y rúbrica

## Checklist funcional
- [ ] Se abre el frontend en `http://localhost:5173`.
- [ ] `GET /health` responde `status: ok`.
- [ ] POST crea ingreso de $1,000.00 y gasto de $125.50.
- [ ] GET resumen muestra 100000, 12550 y 87450 centavos.
- [ ] Filtro de egresos funciona.
- [ ] Eliminar actualiza lista y balance.
- [ ] `npm test` pasa.
- [ ] `npm run build` genera `apps/web/dist`.
- [ ] `docker build` funciona.
- [ ] `docker compose up -d` expone API.
- [ ] Render `/health` responde HTTPS.
- [ ] Netlify consume API Render, sin mixed content ni CORS.
- [ ] GitHub Actions pasa.
- [ ] No hay secretos en Git ni en el bundle frontend.

## Rúbrica (100 puntos)
- Frontend y UX: 20.
- API y validación: 25.
- Docker y Compose: 25.
- Render, Netlify y CI: 25.
- Evidencia y buenas prácticas Git: 5.

## Entrega del alumno
Repositorio GitHub, URLs públicas temporales, cuatro capturas (dashboard, Docker, Render health, Actions), breve reflexión sobre volatilidad de contenedores y persistencia.
