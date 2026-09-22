# 08 — Matriz maestra del frontend

<!-- navigation:start -->

[← Anterior](./07-ui-ux.md) | [Índice del proyecto](./README.md) | [Siguiente →](./09-frontend-etapa-01.md)

[🏠 Índice general](../../README.md)

<!-- navigation:end -->

## Preparación

Backend B0 completo disponible. Las etapas 1 y 2 pueden usar fixtures desde la API; para etapa 3 elegir modo tmdb y comprobar credencial o continuar con fixtures dejando constancia. Los tests automatizados no dependen de Internet. Se presupone JavaScript, funciones, arrays, módulos, HTML/CSS y HTTP.

Cada etapa propone 180 minutos: diagnóstico 10, teoría 25, demostración 20, práctica guiada 80, pausa 10, práctica autónoma 25 y cierre 10. Total 180; dividir en dos clases de 90 cuando sea conveniente. La implementación extra que no quepa se termina como trabajo autónomo sin declarar el hito cerrado antes de verificarlo.

| Etapa | Resultado observable | Conceptos | Evidencia |
|---|---|---|---|
| 1 | Montar interfaz responsive | JSX, props, composición y Tailwind | Home con fixtures y estados |
| 2 | Navegar y consultar catálogo | Router, fetch, hooks, efectos | Home conectado |
| 3 | Buscar y abrir títulos | URL state, debounce y cancelación | Búsqueda y detalle |
| 4 | Acceder con cuenta real | Context, Auth y rutas protegidas | Registro/acceso/recuperación |
| 5 | Separar experiencia por perfil | Caché por identidad y CRUD | Dos perfiles aislados |
| 6 | Persistir favoritos | Mutations e invalidación | Mi lista sincronizada |
| 7 | Guardar reproducción | Refs, lifecycle y concurrencia | Historial/reanudación |
| 8 | Verificar y publicar build | Pruebas, accesibilidad y entorno | Flujo integral |

## Reglas de evolución

- Mantener un solo App, router y QueryClient; no copiar un proyecto distinto en cada etapa.
- Separar estado remoto (TanStack Query), identidad (AuthProvider), perfil activo (ProfileProvider) y estado efímero de UI (useState).
- LocalStorage sólo guarda preferencia de perfil por uid y preferencias de interfaz. Favoritos/historial viven en API; no mantener dos fuentes de verdad.
- No guardar manualmente tokens. El SDK Auth gestiona su persistencia; pedir getIdToken cuando se llama a la API.
- Cada hito incluye loading/error/empty y cleanup de efectos. React StrictMode permanece activado para detectar efectos incorrectos.

## Evaluación del proyecto (propuesta, no calificación institucional)

| Dimensión | Peso |
|---|---|
| Funcionalidad de flujos | 35 |
| Integridad de datos y aislamiento | 25 |
| UI responsive y accesibilidad | 20 |
| Pruebas y manejo de errores | 15 |
| Documentación y reproducibilidad | 5 |

Cada dimensión se califica completa si todos sus criterios de 17 pasan; parcial si quedan fallas documentadas; cero si falta evidencia. No aprobar el proyecto con acceso cruzado entre cuentas aunque el puntaje total sea alto.

---

<!-- navigation:start -->

[← Anterior](./07-ui-ux.md) | [Índice del proyecto](./README.md) | [Siguiente →](./09-frontend-etapa-01.md)

[🏠 Índice general](../../README.md)

<!-- navigation:end -->
