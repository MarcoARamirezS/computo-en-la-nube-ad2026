# Cómputo en la Nube — Proyectos evolutivos

Repositorio de guías y proyectos evolutivos con **Nuxt 4**, **Vue 3**, **React**, **TypeScript**, **Tailwind CSS 4**, **Node.js** y servicios en la nube. Cada proyecto conserva su propio recorrido de aprendizaje.

---

## 📚 Proyectos y prácticas

### 01. Nuxt 4 - Componentes y Eventos

Introducción al desarrollo con Nuxt 4 utilizando componentes Vue, propiedades, eventos y Tailwind CSS.

📖 [Ir a la práctica](./docs/01-preparacion-nuxt4-eventos.md)

---

### 02. Parking Control

Proyecto evolutivo Full Stack para desarrollar un sistema de administración y control de estacionamiento.

El proyecto utiliza una arquitectura basada en monorepo con:

- Nuxt 4
- Vue 3
- TypeScript
- Tailwind CSS 4
- Node.js
- Express
- API REST
- JWT
- Bcrypt
- Cloudinary
- Generación de PDF
- Pruebas automatizadas

📖 [Ir al proyecto Parking Control](./docs/02-parking-control/README.md)

---

### 03. CineFlow

Clon visual de una plataforma de catálogo cinematográfico, con identidad propia, usuarios, perfiles, favoritos e historial de tráilers. **Guía v2 sencilla: backend completo en un bloque y frontend React en ocho etapas, con código listo para copiar.**

- React, TypeScript, Vite y Tailwind CSS.
- Node.js/Express, Firebase Authentication y Firestore.
- Catálogo TMDB y tráilers de YouTube.
- 20 documentos revisados: comandos puntuales, archivos completos, comprobaciones y ocho etapas. Código de referencia incluido.

📖 [Ir al proyecto CineFlow](./docs/03-cineflow/README.md) · [Comenzar la guía](./docs/03-cineflow/00-leeme.md)

---

### 04. MoneyCloud — Finanzas personales con Docker y despliegue cloud

Proyecto ágil de **4 sesiones de 90 minutos**. Los estudiantes construyen una aplicación de ingresos y egresos copiando el código desde las guías Markdown: HTML5, Tailwind CSS, JavaScript, Express, Firestore, Docker, Render y Netlify.

- Instalación y comandos para **macOS y Windows**.
- Product Goal, backlog, arquitectura y contrato API.
- Cuatro laboratorios progresivos con rutas, comandos, código y verificaciones.
- Guía de errores frecuentes y validación final.
- **Modalidad:** repositorio docente de guías; cada estudiante crea su aplicación en su propio repositorio.

📖 [Ir al proyecto MoneyCloud](./docs/04-moneycloud/README.md) · [Preparación](./docs/04-moneycloud/docs/00-preparacion.md)

---

## 📂 Estructura del repositorio

```text
/
├── README.md
└── docs/
    ├── 01-preparacion-nuxt4-eventos.md
    ├── 02-parking-control/
    │   ├── README.md
    │   ├── 01-foundation-monorepo-nuxt-express.md
    │   ├── 02-frontend-parking-dashboard.md
    │   ├── 03-firestore-parking-spaces.md
    │   ├── 04-auth-bcrypt-jwt.md
    │   └── 05-checkin-parking-session.md
    ├── 03-cineflow/
        ├── README.md
        ├── 00-leeme.md
        ├── 01-arquitectura-y-alcance.md
        ├── 02-instalacion-monorepo.md
        ├── 03-firebase-tmdb-y-variables.md
        ├── 04-contrato-api.md
        ├── 05-backend-completo.md
        ├── 06-firestore-modelo-reglas.md
        ├── 07-ui-ux.md
        ├── 08-ruta-frontend.md
        ├── 09-frontend-etapa-01.md
        ├── 10-frontend-etapa-02.md
        ├── 11-frontend-etapa-03.md
        ├── 12-frontend-etapa-04.md
        ├── 13-frontend-etapa-05.md
        ├── 14-frontend-etapa-06.md
        ├── 15-frontend-etapa-07.md
        ├── 16-frontend-etapa-08.md
        ├── 17-pruebas-y-despliegue.md
        ├── 18-instrucciones-implementacion.md
        ├── 19-fuentes.md
        └── codigo-referencia/  # Aplicación final de apoyo
    └── 04-moneycloud/
        ├── README.md
        └── docs/
            ├── 00-preparacion.md
            ├── 00-product-goal.md
            ├── 01-product-backlog.md
            ├── 02-architecture.md
            ├── 03-api-contract.md
            ├── 05-troubleshooting.md
            ├── 06-validation.md
            └── sesiones/  # 4 guías de laboratorio
```

---

## 🛠 Tecnologías

### Frontend

- React (CineFlow)
- Nuxt 4
- Vue 3
- TypeScript
- Tailwind CSS 4
- Vite

### Backend

- Node.js
- Express
- API REST
- JWT
- Bcrypt

### Servicios

- Firebase Authentication y Firestore
- TMDB y YouTube (CineFlow)
- Cloudinary
- Generación de PDF

### Testing

- Vitest
- Supertest
- Playwright

### Herramientas

- npm
- Git
- GitHub
- VS Code

---

## 🌳 Flujo de trabajo

Los proyectos se desarrollan de forma evolutiva utilizando Git.

Flujo recomendado:

```text
main
 │
 └── develop
      │
      ├── feature/session-01
      ├── feature/session-02
      ├── feature/session-03
      └── ...
```

Cada sesión incorpora nuevas funcionalidades al proyecto.

---

## 📖 Organización de la documentación

La documentación utiliza una estructura jerárquica:

```text
README principal
       │
       ▼
Proyecto
README.md
       │
       ▼
Sesión
01-xxxx.md
       │
       ▼
Sesión siguiente
```

El `README.md` principal funciona como índice general del repositorio.

Cada proyecto dentro de `docs/` contiene su propio `README.md`, que funciona como índice de las sesiones correspondientes.

---

## 🧭 Navegación

Cada documento incluye enlaces al inicio y al final: **Anterior**, **Índice del proyecto**, **Siguiente** e **Índice general**. Los índices permiten entrar directamente a cualquier sesión. Las sesiones de Parking Control que aún no están disponibles se muestran como pendientes sin enlaces rotos.

- [Empezar por Componentes y Eventos](./docs/01-preparacion-nuxt4-eventos.md).
- [Abrir Parking Control](./docs/02-parking-control/README.md).
- [Abrir CineFlow](./docs/03-cineflow/README.md).

---

## 📝 Convención de nombres

Para mantener el repositorio organizado se recomienda:

- Utilizar nombres en minúsculas.
- Evitar espacios en nombres de carpetas y archivos.
- Utilizar guiones `-` para separar palabras.
- Numerar los proyectos.
- Numerar las sesiones dentro de cada proyecto.
- Utilizar `README.md` como índice de cada proyecto.

Ejemplo real: `docs/03-cineflow/09-frontend-etapa-01.md`. Conservar los nombres de archivos al copiar la guía, porque los enlaces son relativos.

---

## 🚀 Flujo recomendado para cada práctica

1. Leer el `README.md` del proyecto.
2. Revisar los objetivos de la sesión.
3. Crear la rama correspondiente.
4. Implementar los cambios.
5. Ejecutar las pruebas.
6. Realizar el commit de la sesión.
7. Continuar con la siguiente sesión.

Ejemplo:

```bash
git checkout develop

git checkout -b feature/session-01
```

Después de completar la sesión:

```bash
git add .

git commit -m "feat: complete session 01 foundation"

git checkout develop

git merge feature/session-01
```

---

## 📌 Proyectos disponibles

| # | Proyecto | Tipo | Estado |
|---|---|---|---|
| 01 | Nuxt 4 - Componentes y Eventos | Frontend | Disponible |
| 02 | [Parking Control](./docs/02-parking-control/README.md) | Full Stack | En desarrollo |
| 03 | [CineFlow](./docs/03-cineflow/README.md) | Backend completo + frontend evolutivo | Guía v2 paso a paso + código de referencia |

---

## 🎯 Objetivo del repositorio

Este repositorio tiene como objetivo servir como material práctico para desarrollar habilidades en:

- Arquitectura de aplicaciones web
- Desarrollo frontend moderno
- Desarrollo backend
- Diseño de APIs REST
- Autenticación y autorización
- Manejo de archivos e imágenes
- Generación de documentos
- Pruebas automatizadas
- Git y GitHub
- Desarrollo evolutivo por sesiones


---

## Integrar esta actualización en tu repositorio

Copiar `README.md` y la carpeta `docs/` sobre la copia local del repositorio, conservando los archivos adicionales que puedas tener. El ZIP no incluye el historial `.git`: conserva el de tu repositorio existente. Revisar `git diff` antes de hacer commit.

CineFlow se reescribió como guía paso a paso y ahora incluye `docs/03-cineflow/codigo-referencia/`. Copia toda esa carpeta al actualizar para que no falten archivos. El contenido de Nuxt y Parking Control se conserva; sus sesiones pendientes siguen pendientes.

[Comenzar recorrido →](./docs/01-preparacion-nuxt4-eventos.md) · [Abrir CineFlow →](./docs/03-cineflow/README.md)
