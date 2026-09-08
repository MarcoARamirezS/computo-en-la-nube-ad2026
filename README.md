# Prácticas Nuxt 4

Repositorio de prácticas y proyectos evolutivos desarrollados con **Nuxt 4**, **Vue 3**, **TypeScript**, **Tailwind CSS 4** y tecnologías relacionadas con desarrollo Full Stack.

---

## 📚 Proyectos y prácticas

### 01. Nuxt 4 - Componentes y Eventos

Introducción al desarrollo con Nuxt 4 utilizando componentes Vue, propiedades, eventos y Tailwind CSS.

📖 [Ir a la práctica](./docs/01-nuxt4-eventos/README.md)

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

## 📂 Estructura del repositorio

```text
/
├── README.md
│
└── docs/
    │
    ├── 01-nuxt4-eventos/
    │   └── README.md
    │
    └── 02-parking-control/
        ├── README.md
        ├── 01-foundation-monorepo-nuxt-express.md
        ├── 02-backend-express.md
        ├── 03-auth-jwt.md
        ├── 04-parking-spaces.md
        └── ...
```

---

## 🛠 Tecnologías

### Frontend

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

La navegación recomendada dentro de cada proyecto es:

```text
README principal
        │
        ▼
README del proyecto
        │
        ├── Sesión 01
        ├── Sesión 02
        ├── Sesión 03
        └── ...
```

Al final de cada documento de sesión se recomienda utilizar:

```md
---

## 🧭 Navegación

[← Índice del proyecto](./README.md) | [🏠 Índice principal](../../README.md)
```

Cuando exista una sesión anterior y una siguiente:

```md
---

## 🧭 Navegación

[← Sesión anterior](./01-sesion-anterior.md) | [Índice del proyecto](./README.md) | [Sesión siguiente →](./03-sesion-siguiente.md)

[🏠 Índice principal](../../README.md)
```

---

## 📝 Convención de nombres

Para mantener el repositorio organizado se recomienda:

- Utilizar nombres en minúsculas.
- Evitar espacios en nombres de carpetas y archivos.
- Utilizar guiones `-` para separar palabras.
- Numerar los proyectos.
- Numerar las sesiones dentro de cada proyecto.
- Utilizar `README.md` como índice de cada proyecto.

Ejemplo:

```text
docs/
│
├── 01-nuxt4-eventos/
│   └── README.md
│
├── 02-parking-control/
│   ├── README.md
│   ├── 01-foundation-monorepo-nuxt-express.md
│   ├── 02-backend-foundation.md
│   ├── 03-authentication-jwt.md
│   └── 04-parking-spaces.md
│
├── 03-taskflow/
│   ├── README.md
│   └── ...
│
└── 04-helpdesk/
    ├── README.md
    └── ...
```

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
| 02 | Parking Control | Full Stack | En desarrollo |

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
