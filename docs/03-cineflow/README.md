# CineFlow — Guía del proyecto

<!-- navigation:start -->

[← Anterior](../02-parking-control/README.md) | [Índice del proyecto](./README.md) | [Siguiente →](./00-leeme.md)

[🏠 Índice general](../../README.md)

<!-- navigation:end -->

Monorepo con **React, TypeScript y Tailwind CSS**, backend completo con **Node.js/Express**, **Firebase Authentication**, **Firestore** y catálogo **TMDB**. Usuarios, perfiles, favoritos e historial de tráilers sincronizados.

Este proyecto contiene instrucciones de implementación. El backend se construye en un bloque completo y el frontend evoluciona en ocho etapas; los documentos no son el código ejecutable de la aplicación.

**[Comenzar la guía →](./00-leeme.md)**

## Cómo recorrer la guía

Los enlaces **Anterior** y **Siguiente** recorren los documentos en el orden de la tabla. Están disponibles arriba y abajo. **Índice del proyecto** regresa aquí e **Índice general** abre la portada del repositorio. En el último documento, Siguiente cierra el recorrido volviendo a este índice.

Primero se preparan arquitectura, entorno y contratos; después se implementa y verifica B0 con el modelo Firestore. Las etapas del frontend consumen ese backend. Los documentos de pruebas y fuentes pueden consultarse desde el inicio como referencia.

## Preparación y backend completo

| Orden | Documento |
|---|---|
| 00 | [CineFlow — Guía de construcción evolutiva](./00-leeme.md) |
| 01 | [01 — Arquitectura y alcance](./01-arquitectura-y-alcance.md) |
| 02 | [02 — Instalación y primera prueba](./02-instalacion-monorepo.md) |
| 03 | [03 — Firebase, TMDB y variables](./03-firebase-tmdb-y-variables.md) |
| 04 | [04 — Contrato estable API v1](./04-contrato-api.md) |
| 05 | [05 — Backend completo: una sola entrega B0](./05-backend-completo.md) |
| 06 | [06 — Modelo de Firestore](./06-firestore-modelo-reglas.md) |
| 07 | [07 — Sistema de diseño y experiencia](./07-ui-ux.md) |
| 08 | [08 — Matriz maestra del frontend](./08-ruta-frontend.md) |

## Frontend evolutivo: ocho etapas

| Etapa | Documento |
|---|---|
| 1 | [Etapa 1 — Base React, Tailwind y UI](./09-frontend-etapa-01.md) |
| 2 | [Etapa 2 — Router y catálogo conectado](./10-frontend-etapa-02.md) |
| 3 | [Etapa 3 — Búsqueda, filtros y detalle](./11-frontend-etapa-03.md) |
| 4 | [Etapa 4 — Usuarios y autenticación](./12-frontend-etapa-04.md) |
| 5 | [Etapa 5 — Perfiles y estado aislado](./13-frontend-etapa-05.md) |
| 6 | [Etapa 6 — Favoritos sincronizados](./14-frontend-etapa-06.md) |
| 7 | [Etapa 7 — Tráilers, historial y reanudación](./15-frontend-etapa-07.md) |
| 8 | [Etapa 8 — Calidad, integración y entrega](./16-frontend-etapa-08.md) |

## Validación, implementación y referencias

- [17 — Verificación, corrida completa y despliegue](./17-pruebas-y-despliegue.md)
- [18 — Instrucciones de implementación para editor o asistente](./18-instrucciones-implementacion.md)
- [19 — Fuentes oficiales y decisiones](./19-fuentes.md)

## Alcance de reproducción

El catálogo permite descubrir películas y series; la reproducción integrada corresponde a tráilers disponibles en YouTube. El historial registra esos tráilers, no películas completas.

---

<!-- navigation:start -->

[← Anterior](../02-parking-control/README.md) | [Índice del proyecto](./README.md) | [Siguiente →](./00-leeme.md)

[🏠 Índice general](../../README.md)

<!-- navigation:end -->
