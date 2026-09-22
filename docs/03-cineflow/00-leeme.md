# CineFlow — Guía de construcción evolutiva

<!-- navigation:start -->

[← Anterior](./README.md) | [Índice del proyecto](./README.md) | [Siguiente →](./01-arquitectura-y-alcance.md)

[🏠 Índice general](../../README.md)

<!-- navigation:end -->

Versión documental 1.0 · 22 de septiembre de 2026 · Marco Ramirez

## Qué recibes

Un paquete de instrucciones técnicas para implementar CineFlow: arquitectura, preparación, contrato de API, un bloque único de backend, modelo Firebase, diseño UI/UX, ocho etapas de frontend y verificación integral. Es documentación de implementación; no es un repositorio ejecutable ni afirma que la aplicación ya fue programada o probada.

El backend se construye y valida completo antes de conectar el frontend. Sus módulos no se reparten entre las sesiones. El frontend evoluciona desde una interfaz con fixtures hasta la experiencia integrada con usuarios reales, perfiles, favoritos e historial sincronizado. Los comandos de ejecución posteriores al scaffold presuponen haber implementado los archivos y scripts indicados.

## Decisiones cerradas

- Monorepo npm workspaces: React/TypeScript/Vite/Tailwind en apps/web; Node 24 LTS/Express 5/TypeScript en apps/api; esquemas Zod compartidos en packages/contracts.
- Firebase Authentication administra registro, acceso, recuperación y renovación de tokens. No se crea un sistema paralelo de contraseñas/JWT.
- Firestore guarda datos propios. Solamente la API accede a Firestore con Admin SDK.
- TMDB se consulta desde la API; su token jamás se entrega al navegador.
- YouTube reproduce tráilers insertables. No se ofrece streaming de películas completas.
- Cuenta y perfil son distintos: una cuenta puede tener hasta cinco perfiles. No son cinco usuarios independientes ni controles parentales.
- Favoritos e historial pertenecen a un perfil. Se sincronizan al consultar de nuevo; tiempo real queda fuera de v1.
- No se requieren pagos, Firebase Storage, cargas de archivos ni generación con IA para esta versión.

## Orden de lectura y ejecución

1. [Arquitectura y alcance](./01-arquitectura-y-alcance.md).
2. [Instalación del monorepo](./02-instalacion-monorepo.md).
3. [Configuración Firebase y TMDB](./03-firebase-tmdb-y-variables.md).
4. [Contrato de datos y API](./04-contrato-api.md).
5. [Backend completo en un bloque](./05-backend-completo.md).
6. [Modelo Firestore y reglas](./06-firestore-modelo-reglas.md).
7. [Sistema de diseño](./07-ui-ux.md).
8. [Ruta evolutiva del frontend](./08-ruta-frontend.md), después etapas 1 a 8.
9. [Pruebas y despliegue](./17-pruebas-y-despliegue.md).
10. [Instrucciones para implementar con asistencia de IA](./18-instrucciones-implementacion.md).
11. [Fuentes oficiales](./19-fuentes.md).

## Hitos

| Hito | Evidencia que lo cierra |
|---|---|
| B0 | API completa con contratos, pruebas contra emuladores y documentación OpenAPI |
| F1–F3 | Frontend navegable, catálogo y búsqueda conectados |
| F4–F6 | Identidad, perfiles y favoritos sincronizados |
| F7 | Tráilers con historial y reanudación |
| F8 | Flujo integral, accesibilidad y build desplegable |

El tiempo sugerido es 16–24 horas para implementar y verificar B0, y ocho etapas de tres horas para frontend, más práctica autónoma. Es una estimación para quien ya conoce JavaScript, HTTP y Git. Cada etapa puede dividirse en dos clases de 90 minutos.

## Cómo usar estos documentos

Trabajar sobre el mismo repositorio, conservar un único package-lock.json y hacer un commit por hito. Implementar primero contratos y backend. No empezar cada sesión con un proyecto nuevo. Los ejercicios usan fixtures inventados y los emuladores; la validación de TMDB real requiere tu credencial. Consultar 19_FUENTES para distinguir decisiones del proyecto de requisitos de los proveedores.

---

<!-- navigation:start -->

[← Anterior](./README.md) | [Índice del proyecto](./README.md) | [Siguiente →](./01-arquitectura-y-alcance.md)

[🏠 Índice general](../../README.md)

<!-- navigation:end -->
