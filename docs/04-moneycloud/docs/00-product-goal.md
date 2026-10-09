# Product Goal

Desarrollar una aplicación didáctica de finanzas personales que registre ingresos y egresos, liste movimientos, filtre por tipo, calcule el balance y demuestre el ciclo local → contenedor → nube.

## Alcance
- CRUD mínimo: crear, listar y eliminar movimientos (no edición).
- Resumen monetario calculado en centavos enteros.
- API REST, Docker, GitHub Actions, Render y Netlify.
- Persistencia local temporal con memoria y persistencia cloud opcional con Firestore.

## Fuera de alcance
Autenticación, multiusuario, transacciones bancarias, información real, reportes avanzados, facturación, uso productivo.

## Definition of Done
`npm test`, `npm run build`, `docker build` y pruebas manuales completas; no subir credenciales; capturas de URL y health.
