# Empieza aquí — CineFlow sencillo, versión 2

<!-- navigation:start -->

[← Anterior](./README.md) | [Índice CineFlow](./README.md) | [Siguiente →](./01-arquitectura-y-alcance.md)

[🏠 Índice general](../../README.md)

<!-- navigation:end -->

Esta guía se reescribió para que puedas construir la aplicación sin adivinar archivos, configuraciones ni comandos. Cada paso dice **dónde trabajar**, **qué copiar** y **qué debes ver**. Sigue el botón Siguiente; no necesitas abrir todos los documentos a la vez.

## Qué cambió

La guía anterior era una especificación: pedía implementar módulos sin entregar su código. Ahora incluye los archivos completos y un proyecto de referencia. Se mantienen React, Tailwind, TypeScript, Node/Express, Firebase, TMDB, usuarios, perfiles, favoritos e historial. Se elimina la instalación obligatoria de contracts, TanStack Query, Swagger, Pino, emuladores, Java y herramientas de CI durante el arranque.

## Dos carpetas diferentes

- **Repositorio de guías:** `computo-en-la-nube-ad2026`. Aquí lees Markdown; NO ejecutes npm install en su raíz.
- **Aplicación que vas a construir:** una carpeta nueva `cineflow-v2`, fuera del repositorio de guías. Aquí sí ejecutas npm.

No borres una aplicación anterior. Usa una carpeta nueva para seguir esta versión: cambian algunas rutas y el modelo de datos. La nueva aplicación guarda datos en `cineflowUsers`; no migra ni sobrescribe colecciones de la propuesta anterior.

## Tu recorrido

| Paso | Acción | Resultado visible |
|---|---|---|
| 1 | Entender la estructura | Saber qué hace web y qué hace api |
| 2 | Crear carpetas y pegar configuraciones | Pantalla “CineFlow instalado” |
| 3 | Copiar el backend completo | /health devuelve ok |
| 4 | Frontend 1: interfaz | Tarjetas de ejemplo |
| 5 | Frontend 2: API | Catálogo servido desde Express |
| 6 | Frontend 3: detalle | Abrir una ficha |
| 7 | Configurar TMDB y Firebase | Catálogo real y servicios preparados |
| 8 | Frontend 4: cuentas | Registro, acceso y recuperación |
| 9 | Frontend 5: perfiles | Seleccionar y renombrar perfiles |
| 10 | Frontend 6: favoritos | Mi lista en la nube |
| 11 | Frontend 7: historial | Tráiler, pausa y reanudación |
| 12 | Frontend 8: comprobación | Compilar y comprobar recorrido |

Los documentos de API, modelo, diseño y fuentes son **consulta**, no tareas previas que debas memorizar. El backend se copia completo una sola vez; no se modifica por cada etapa del front.

## Si quieres comparar con una solución terminada

La carpeta [codigo-referencia](./codigo-referencia/README.md) contiene la aplicación final. Úsala como apoyo para localizar diferencias. Su README tiene una ruta rápida, pero para aprender sigue los pasos principales.

## Regla para no perderte

En una terminal, confirma siempre que estás en `cineflow-v2`. Un bloque marcado como Archivo se pega en VS Code; un bloque marcado como Terminal se ejecuta en la terminal. Nunca pegues JSON o TypeScript como si fuera un comando.

Tiempo orientativo: instalación 30–45 min; backend completo 60–120 min de copia y explicación; cada etapa frontend 60–120 min más práctica. No avanzar cuando falle el punto de comprobación.

---

<!-- navigation:start -->

[← Anterior](./README.md) | [Índice CineFlow](./README.md) | [Siguiente →](./01-arquitectura-y-alcance.md)

[🏠 Índice general](../../README.md)

<!-- navigation:end -->
