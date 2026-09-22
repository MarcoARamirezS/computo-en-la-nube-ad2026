# CineFlow — Guía sencilla paso a paso (v2)

[🏠 Índice general](../../README.md) · [← Parking Control](../02-parking-control/README.md)

**Empieza por un solo documento y sigue Siguiente.** Cada capítulo tiene rutas exactas, archivos completos, comandos y una comprobación visible. No necesitas pedir a otra IA que complete código faltante.

**[EMPEZAR AQUÍ →](./00-leeme.md)**

## Ruta principal

Los números de archivo se conservan para no romper enlaces antiguos. **El orden correcto es esta tabla y los botones Anterior/Siguiente**, no ordenar por nombre. Configuramos Firebase cuando ya se ve el catálogo y está por comenzar la etapa de usuarios.

| Paso | Documento |
|---|---|
| 1 | [Empieza aquí — CineFlow sencillo, versión 2](./00-leeme.md) |
| 2 | [1. Entender el proyecto en cinco minutos](./01-arquitectura-y-alcance.md) |
| 3 | [2. Instalar y ver la primera pantalla](./02-instalacion-monorepo.md) |
| 4 | [3. Copiar el backend completo una sola vez](./05-backend-completo.md) |
| 5 | [Frontend 1 — Crear la interfaz](./09-frontend-etapa-01.md) |
| 6 | [Frontend 2 — Conectar catálogo y navegación](./10-frontend-etapa-02.md) |
| 7 | [Frontend 3 — Abrir la ficha de un título](./11-frontend-etapa-03.md) |
| 8 | [7. Conectar los servicios reales: TMDB y Firebase](./03-firebase-tmdb-y-variables.md) |
| 9 | [Frontend 4 — Crear usuarios e iniciar sesión](./12-frontend-etapa-04.md) |
| 10 | [Frontend 5 — Crear y elegir perfiles](./13-frontend-etapa-05.md) |
| 11 | [Frontend 6 — Guardar favoritas en la nube](./14-frontend-etapa-06.md) |
| 12 | [Frontend 7 — Reproducir y guardar historial](./15-frontend-etapa-07.md) |
| 13 | [Frontend 8 — Verificar la aplicación completa](./16-frontend-etapa-08.md) |
| 14 | [Consulta — Pruebas, errores frecuentes y publicación](./17-pruebas-y-despliegue.md) |

## Consultas opcionales

No bloquean el camino principal; ábrelas cuando necesites una explicación.

- [Consulta — Rutas que ya incluye el backend](./04-contrato-api.md)
- [Consulta — Qué guarda Firestore en la versión sencilla](./06-firestore-modelo-reglas.md)
- [Consulta — Diseño visual explicado sin herramientas extra](./07-ui-ux.md)
- [Consulta — Mapa de las ocho etapas frontend](./08-ruta-frontend.md)
- [Consulta — Cómo trabajar, actualizar y guardar avances](./18-instrucciones-implementacion.md)
- [Consulta — Fuentes oficiales y glosario](./19-fuentes.md)

## Código de referencia incluido

[Ver instrucciones del proyecto terminado](./codigo-referencia/README.md). Contiene archivos reales, lockfile y pruebas. Puedes compararlo con tus avances o abrirlo como aplicación independiente. No hace falta ejecutarlo para leer la guía.

## Alcance

Backend completo en un bloque; frontend en ocho etapas; cuentas, hasta cinco perfiles, 50 favoritas y 50 tráilers recientes por perfil. Firebase se configura desde Console; TMDB entrega catálogo y YouTube reproduce tráilers. **No es streaming de películas completas.**

## Diferencias frente a v1

Ahora se incluyen archivos completos y comprobaciones. Se quitaron requisitos de emuladores, Java, contracts y varias librerías avanzadas del arranque. La versión sencilla usa `/api` y `cineflowUsers`. No es un parche compatible para una aplicación v1 ya programada; si ya empezaste código, usa una nueva carpeta y conserva tu trabajo anterior.

[Comenzar →](./00-leeme.md) · [Índice general](../../README.md)
