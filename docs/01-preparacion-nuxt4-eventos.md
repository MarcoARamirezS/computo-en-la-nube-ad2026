# Nuxt 4 + Tailwind CSS 4
## Instalación, configuración y estructura inicial
### Preparación previa a la práctica de Componentes, Props y Eventos

---

# 1. Objetivo

Preparar desde cero un proyecto moderno con:

- Nuxt 4
- Vue 3
- TypeScript
- Tailwind CSS 4
- Vite
- Node.js
- npm
- Git
- Visual Studio Code

Al terminar esta guía el proyecto deberá quedar:

- instalado,
- ejecutándose correctamente,
- con Tailwind CSS instalado y configurado,
- con la estructura de carpetas preparada,
- con Git inicializado,
- con el build validado,
- listo para comenzar la práctica de componentes, propiedades y eventos.

> **Importante:** esta guía sí incluye código de configuración del proyecto, pero no contiene código de componentes o páginas Vue.

Por lo tanto, no se desarrollarán todavía:

- `ProductCard.vue`
- `index.vue`
- componentes visuales
- props
- eventos
- `defineProps`
- `defineEmits`
- lógica reactiva

---

# 2. Arquitectura tecnológica

La práctica utilizará:

```text
Node.js
   │
   ▼
Nuxt 4
   │
   ├── Vue 3
   ├── TypeScript
   └── Vite
          │
          ▼
   Tailwind CSS 4
```

---

# 3. Tecnologías

| Tecnología | Responsabilidad |
|---|---|
| Node.js | Entorno de ejecución |
| npm | Administrador de paquetes |
| Nuxt 4 | Framework principal |
| Vue 3 | Framework de componentes |
| TypeScript | Tipado estático |
| Vite | Servidor de desarrollo y bundler |
| Tailwind CSS 4 | Framework CSS |
| Git | Control de versiones |
| VS Code | Editor recomendado |

---

# 4. Requisitos

Antes de crear el proyecto deben estar instalados:

- Node.js
- npm
- Git
- Visual Studio Code

Se recomienda utilizar una versión LTS moderna de Node.js.

Ejemplo:

```text
Node.js 24 LTS
```

---

# 5. Verificar Node.js y npm

## macOS

Abrir Terminal:

```bash
node --version
```

```bash
npm --version
```

---

## Windows PowerShell

```powershell
node --version
```

```powershell
npm --version
```

---

# 6. Instalar Node.js en macOS

## Opción recomendada: NVM

Verificar Homebrew:

```bash
brew --version
```

Si Homebrew no está instalado:

```text
https://brew.sh
```

Instalar NVM:

```bash
brew install nvm
```

Crear la carpeta:

```bash
mkdir ~/.nvm
```

Configurar NVM en:

```text
~/.zshrc
```

Después recargar la terminal:

```bash
source ~/.zshrc
```

Instalar Node.js:

```bash
nvm install 24
```

Activarlo:

```bash
nvm use 24
```

Definirlo como predeterminado:

```bash
nvm alias default 24
```

Validar:

```bash
node --version
npm --version
```

---

# 7. Instalar Node.js en Windows

## Opción 1 — Instalador oficial

Descargar desde:

```text
https://nodejs.org
```

Instalar la versión LTS.

Cerrar y volver a abrir PowerShell.

Validar:

```powershell
node --version
```

```powershell
npm --version
```

---

## Opción 2 — Winget

```powershell
winget install OpenJS.NodeJS.LTS
```

Después:

```powershell
node --version
npm --version
```

---

# 8. Verificar Git

## macOS

```bash
git --version
```

## Windows

```powershell
git --version
```

---

# 9. Instalar Git en macOS

Si Git no está disponible:

```bash
brew install git
```

Después:

```bash
git --version
```

---

# 10. Instalar Git en Windows

Descargar desde:

```text
https://git-scm.com
```

Después validar:

```powershell
git --version
```

---

# 11. Visual Studio Code

Descargar:

```text
https://code.visualstudio.com
```

Extensiones recomendadas:

1. Vue - Official
2. ESLint
3. Tailwind CSS IntelliSense
4. GitLens — opcional
5. Error Lens — opcional

---

# 12. Crear el proyecto Nuxt 4

Nombre utilizado:

```text
nuxt-props-events
```

---

## macOS

```bash
cd ~/Desktop
```

```bash
npm create nuxt@latest nuxt-props-events
```

---

## Windows PowerShell

```powershell
cd $HOME\Desktop
```

```powershell
npm create nuxt@latest nuxt-props-events
```

---

# 13. Opciones del asistente

El asistente puede cambiar ligeramente según la versión instalada.

Seleccionar:

```text
Package manager:
npm
```

Si pregunta:

```text
Initialize git repository?
```

Seleccionar:

```text
Yes
```

Si solicita módulos adicionales, para esta práctica se pueden omitir.

Tailwind CSS se instalará manualmente.

---

# 14. Entrar al proyecto

## macOS

```bash
cd nuxt-props-events
```

## Windows

```powershell
cd nuxt-props-events
```

---

# 15. Abrir en Visual Studio Code

```bash
code .
```

Si `code` no funciona:

1. Abrir Visual Studio Code.
2. File.
3. Open Folder.
4. Seleccionar `nuxt-props-events`.

---

# 16. Primera ejecución

Antes de realizar cambios:

```bash
npm run dev
```

Abrir:

```text
http://localhost:3000
```

Si Nuxt se ejecuta correctamente, detener:

```text
Ctrl + C
```

---

# 17. Instalar Tailwind CSS 4

Ejecutar desde la raíz del proyecto:

```bash
npm install tailwindcss @tailwindcss/vite
```

Las dos dependencias relevantes son:

```text
tailwindcss
@tailwindcss/vite
```

---

# 18. Verificar Tailwind CSS

```bash
npm list tailwindcss
```

Después:

```bash
npm list @tailwindcss/vite
```

Ambos paquetes deben aparecer instalados.

---

# 19. Tailwind CSS 4 y Vite

Para esta práctica utilizaremos:

```text
@tailwindcss/vite
```

No se utilizará la configuración antigua basada en:

```text
tailwind.config.js
```

Tampoco necesitamos ejecutar:

```text
npx tailwindcss init
```

Para este escenario básico Tailwind CSS 4 puede trabajar con detección automática de clases.

---

# 20. Configurar Nuxt

Abrir:

```text
nuxt.config.ts
```

Dejarlo de la siguiente manera:

```ts
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: {
    enabled: true,
  },

  css: [
    '~/assets/css/main.css',
  ],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})
```

---

# 21. Explicación de `nuxt.config.ts`

## Importación de Tailwind

```ts
import tailwindcss from '@tailwindcss/vite'
```

Carga el plugin oficial de Tailwind para Vite.

---

## `defineNuxtConfig`

```ts
export default defineNuxtConfig({
})
```

Es la configuración principal del proyecto Nuxt.

---

## `compatibilityDate`

```ts
compatibilityDate: '2025-07-15'
```

Permite fijar el comportamiento de compatibilidad utilizado por Nuxt/Nitro.

---

## Nuxt DevTools

```ts
devtools: {
  enabled: true,
},
```

Activa las herramientas de desarrollo de Nuxt.

Son útiles para inspeccionar:

- componentes,
- rutas,
- imports,
- módulos,
- configuración,
- estado de la aplicación.

---

## CSS global

```ts
css: [
  '~/assets/css/main.css',
],
```

Indica a Nuxt que:

```text
app/assets/css/main.css
```

será cargado globalmente.

---

## Plugin de Tailwind

```ts
vite: {
  plugins: [
    tailwindcss(),
  ],
},
```

Integra Tailwind CSS con Vite.

---

# 22. Crear estructura de assets

Crear:

```text
app/assets/css/
```

## macOS

```bash
mkdir -p app/assets/css
```

## Windows PowerShell

```powershell
New-Item -ItemType Directory -Force app/assets/css
```

---

# 23. Crear `main.css`

Crear:

```text
app/assets/css/main.css
```

Contenido:

```css
@import "tailwindcss";
```

Esta línea carga Tailwind CSS 4.

---

# 24. ¿Por qué no se utiliza `@tailwind base`?

En configuraciones antiguas de Tailwind CSS era común encontrar:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

En Tailwind CSS 4 utilizamos:

```css
@import "tailwindcss";
```

Por lo tanto, para esta práctica no utilizaremos la sintaxis de Tailwind CSS 3.

---

# 25. ¿Necesitamos `tailwind.config.js`?

No para esta práctica.

No crear:

```text
tailwind.config.js
```

No ejecutar:

```bash
npx tailwindcss init
```

Más adelante podría crearse configuración adicional si el proyecto requiriera personalizaciones específicas.

---

# 26. Crear carpeta de componentes

Crear:

```text
app/components/
```

## macOS

```bash
mkdir -p app/components
```

## Windows

```powershell
New-Item -ItemType Directory -Force app/components
```

Esta carpeta almacenará posteriormente componentes Vue reutilizables.

Ejemplo futuro:

```text
ProductCard.vue
```

> No crear todavía el código del componente.

---

# 27. Crear carpeta de páginas

Crear:

```text
app/pages/
```

## macOS

```bash
mkdir -p app/pages
```

## Windows

```powershell
New-Item -ItemType Directory -Force app/pages
```

Aquí se crearán posteriormente las páginas de Nuxt.

Ejemplo futuro:

```text
index.vue
```

> En esta etapa no agregaremos código Vue.

---

# 28. Crear carpeta layouts

Crear:

```text
app/layouts/
```

## macOS

```bash
mkdir -p app/layouts
```

## Windows

```powershell
New-Item -ItemType Directory -Force app/layouts
```

Los layouts permiten definir estructuras reutilizables para páginas.

---

# 29. Crear carpeta composables

Crear:

```text
app/composables/
```

## macOS

```bash
mkdir -p app/composables
```

## Windows

```powershell
New-Item -ItemType Directory -Force app/composables
```

Los composables se utilizarán posteriormente para encapsular lógica reutilizable.

---

# 30. Crear carpeta types

Crear:

```text
app/types/
```

## macOS

```bash
mkdir -p app/types
```

## Windows

```powershell
New-Item -ItemType Directory -Force app/types
```

Su responsabilidad será almacenar:

- interfaces,
- tipos TypeScript,
- contratos.

---

# 31. Crear carpeta utils

Crear:

```text
app/utils/
```

## macOS

```bash
mkdir -p app/utils
```

## Windows

```powershell
New-Item -ItemType Directory -Force app/utils
```

Se utilizará para:

- funciones auxiliares,
- formateadores,
- utilidades.

---

# 32. Estructura preparada

Después de esta etapa:

```text
nuxt-props-events/
│
├── app/
│   │
│   ├── assets/
│   │   └── css/
│   │       └── main.css
│   │
│   ├── components/
│   │
│   ├── composables/
│   │
│   ├── layouts/
│   │
│   ├── pages/
│   │
│   ├── types/
│   │
│   ├── utils/
│   │
│   └── app.vue
│
├── public/
│
├── node_modules/
│
├── .gitignore
├── nuxt.config.ts
├── package.json
├── package-lock.json
├── README.md
└── tsconfig.json
```

---

# 33. Estructura que utilizaremos posteriormente

La práctica de componentes utilizará principalmente:

```text
app/
│
├── assets/
│   └── css/
│       └── main.css
│
├── components/
│   └── ProductCard.vue
│
├── pages/
│   └── index.vue
│
└── app.vue
```

Los nombres de los archivos `.vue` quedan definidos, pero todavía no se implementan.

---

# 34. Revisar `package.json`

Nuxt genera automáticamente:

```text
package.json
```

Se deberán encontrar scripts equivalentes a:

```json
{
  "scripts": {
    "build": "nuxt build",
    "dev": "nuxt dev",
    "generate": "nuxt generate",
    "preview": "nuxt preview",
    "postinstall": "nuxt prepare"
  }
}
```

> No es necesario reemplazar todo el `package.json`; únicamente verificar que Nuxt haya generado sus scripts correctamente.

---

# 35. Scripts principales

## Desarrollo

```bash
npm run dev
```

Inicia el servidor de desarrollo.

---

## Build

```bash
npm run build
```

Compila la aplicación para producción.

---

## Generate

```bash
npm run generate
```

Genera una versión estática cuando el proyecto lo permite.

---

## Preview

```bash
npm run preview
```

Permite revisar localmente el resultado construido.

---

# 36. Archivo `tsconfig.json`

Nuxt genera automáticamente:

```text
tsconfig.json
```

No se requiere modificarlo para esta práctica.

Nuxt administra internamente la configuración TypeScript necesaria.

---

# 37. Archivo `.gitignore`

Nuxt también genera:

```text
.gitignore
```

Debe impedir que elementos generados localmente sean enviados al repositorio.

Entre ellos normalmente:

```text
node_modules
.nuxt
.output
```

No se debe subir:

```text
node_modules/
```

al repositorio.

---

# 38. Validar Nuxt después de Tailwind

Ejecutar:

```bash
npm run dev
```

La terminal debe iniciar Nuxt sin errores.

Abrir:

```text
http://localhost:3000
```

En este punto todavía no necesitamos desarrollar ninguna interfaz nueva.

La validación busca comprobar que:

```text
Nuxt
+
Vite
+
Tailwind
```

pueden iniciar correctamente.

---

# 39. Validar el build

Detener el servidor:

```text
Ctrl + C
```

Ejecutar:

```bash
npm run build
```

El build debe finalizar sin errores.

---

# 40. Git

Verificar:

```bash
git status
```

Si el proyecto no tiene Git:

```bash
git init
```

---

# 41. Configurar identidad de Git

Solo si todavía no se ha configurado en la computadora:

```bash
git config --global user.name "Tu Nombre"
```

```bash
git config --global user.email "correo@ejemplo.com"
```

Verificar:

```bash
git config --global --list
```

---

# 42. Primer commit

Cuando:

- Nuxt funcione,
- Tailwind esté instalado,
- `nuxt.config.ts` esté configurado,
- `main.css` exista,
- la estructura esté creada,
- el build termine correctamente,

realizar:

```bash
git add .
```

Después:

```bash
git commit -m "chore: setup Nuxt 4 and Tailwind CSS"
```

---

# 43. Rama `develop`

Si la práctica utiliza GitFlow:

```bash
git switch -c develop
```

---

# 44. Rama para la funcionalidad

Antes de comenzar a crear componentes:

```bash
git switch -c feature/props-events
```

Aquí se desarrollará posteriormente:

- `ProductCard.vue`,
- props,
- eventos,
- página principal.

---

# 45. Posible secuencia Git

```text
main
  │
  ▼
develop
  │
  ▼
feature/props-events
```

---

# 46. Comandos completos — macOS

## Crear el proyecto

```bash
cd ~/Desktop
npm create nuxt@latest nuxt-props-events
cd nuxt-props-events
```

## Instalar Tailwind CSS

```bash
npm install tailwindcss @tailwindcss/vite
```

## Crear estructura

```bash
mkdir -p app/assets/css
mkdir -p app/components
mkdir -p app/pages
mkdir -p app/layouts
mkdir -p app/composables
mkdir -p app/types
mkdir -p app/utils
```

## Abrir VS Code

```bash
code .
```

## Ejecutar

```bash
npm run dev
```

## Validar build

```bash
npm run build
```

## Git

```bash
git status
git add .
git commit -m "chore: setup Nuxt 4 and Tailwind CSS"
```

---

# 47. Comandos completos — Windows PowerShell

## Crear proyecto

```powershell
cd $HOME\Desktop

npm create nuxt@latest nuxt-props-events

cd nuxt-props-events
```

## Instalar Tailwind CSS

```powershell
npm install tailwindcss @tailwindcss/vite
```

## Crear estructura

```powershell
New-Item -ItemType Directory -Force app/assets/css
New-Item -ItemType Directory -Force app/components
New-Item -ItemType Directory -Force app/pages
New-Item -ItemType Directory -Force app/layouts
New-Item -ItemType Directory -Force app/composables
New-Item -ItemType Directory -Force app/types
New-Item -ItemType Directory -Force app/utils
```

## Abrir VS Code

```powershell
code .
```

## Ejecutar

```powershell
npm run dev
```

## Build

```powershell
npm run build
```

## Git

```powershell
git status
git add .
git commit -m "chore: setup Nuxt 4 and Tailwind CSS"
```

---

# 48. Archivos que SÍ deben estar configurados

Al terminar esta etapa:

```text
nuxt.config.ts
```

debe tener configurado:

- Tailwind Vite Plugin,
- CSS global,
- DevTools,
- compatibilityDate.

También debe existir:

```text
app/assets/css/main.css
```

con la importación de Tailwind CSS.

---

# 49. Archivos Vue que NO desarrollaremos todavía

No agregar todavía lógica a:

```text
app/components/ProductCard.vue
```

No desarrollar todavía:

```text
app/pages/index.vue
```

No agregar todavía:

- `defineProps`
- `defineEmits`
- `ref`
- `computed`
- `v-for`
- eventos personalizados
- datos de productos

Eso pertenece a la siguiente etapa.

---

# 50. Checklist final

## Entorno

- [ ] Node.js instalado.
- [ ] npm instalado.
- [ ] Git instalado.
- [ ] Visual Studio Code instalado.

## Nuxt

- [ ] Proyecto Nuxt 4 creado.
- [ ] Proyecto abierto en VS Code.
- [ ] `npm run dev` funciona.

## Tailwind CSS

- [ ] `tailwindcss` instalado.
- [ ] `@tailwindcss/vite` instalado.
- [ ] `nuxt.config.ts` configurado.
- [ ] `main.css` creado.
- [ ] `@import "tailwindcss";` agregado.
- [ ] No se utilizó la configuración antigua de Tailwind 3.

## Estructura

- [ ] `app/assets/css/`
- [ ] `app/components/`
- [ ] `app/pages/`
- [ ] `app/layouts/`
- [ ] `app/composables/`
- [ ] `app/types/`
- [ ] `app/utils/`

## Validación

- [ ] `npm run dev` funciona después de instalar Tailwind.
- [ ] `npm run build` termina sin errores.

## Git

- [ ] Repositorio inicializado.
- [ ] Primer commit realizado.
- [ ] Rama `develop` creada si se utiliza GitFlow.

---

# 51. Punto exacto donde termina esta guía

El proyecto queda en:

```text
INSTALACIÓN
     ↓
NUXT 4
     ↓
TAILWIND CSS 4
     ↓
CONFIGURACIÓN
     ↓
ESTRUCTURA
     ↓
VALIDACIÓN
     ↓
GIT
     ↓
LISTO PARA DESARROLLAR
```

No se ha desarrollado todavía ningún componente funcional.

---

# 52. Siguiente etapa

La siguiente práctica puede comenzar directamente con:

```text
1. Crear la página principal.
2. Crear ProductCard.
3. Definir las primeras propiedades.
4. Enviar props desde el padre.
5. Reutilizar ProductCard.
6. Crear eventos personalizados.
7. Escuchar eventos en el padre.
8. Enviar payloads.
9. Actualizar estado reactivo.
10. Analizar Padre → Hijo → Padre.
```

---

# 53. Resultado esperado antes de programar

El alumno debe poder ejecutar:

```bash
npm run dev
```

y:

```bash
npm run build
```

sin errores.

Además debe comprender dónde se desarrollarán posteriormente:

```text
Configuración
nuxt.config.ts

Estilos globales
app/assets/css/main.css

Componentes
app/components/

Páginas
app/pages/

Tipos
app/types/

Lógica reutilizable
app/composables/

Utilidades
app/utils/
```

---

# 54. Conclusión

Esta etapa establece la base técnica del proyecto antes de introducir conceptos de Vue.

El proyecto queda preparado siguiendo la separación:

```text
ETAPA 1
Instalación + Configuración + Arquitectura

             ↓

ETAPA 2
Componentes + Props + Eventos
```

Esto permite que los problemas de instalación y configuración se resuelvan antes de trabajar con la comunicación entre componentes.


[← Regresar al índice](../README.md)
