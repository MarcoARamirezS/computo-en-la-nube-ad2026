# Instalación completa y creación del laboratorio — macOS y Windows

> **Antes de la sesión 1:** instala herramientas y comprueba versiones. Todos los comandos se ejecutan en terminal integrada de VS Code, salvo que se indique otra cosa.

## 1. Herramientas y enlaces oficiales

| Herramienta | Instalación | Comprobación |
| --- | --- | --- |
| Git | https://git-scm.com/downloads | `git --version` |
| Node.js 22 LTS (laboratorio) | https://nodejs.org/en/download | `node --version` |
| VS Code | https://code.visualstudio.com/download | Abrir editor |
| Docker Desktop | https://docs.docker.com/desktop/ | `docker version` |
| Cuenta GitHub | https://github.com | Inicio de sesión |
| Firebase | https://console.firebase.google.com | Sesión 2 |
| Render | https://dashboard.render.com | Sesión 4 |
| Netlify | https://app.netlify.com | Sesión 4 |

### macOS

1. Descarga Git, Node.js y VS Code desde los enlaces oficiales. Si ya utilizas Homebrew, también puedes instalar Git y Node con `brew install git node@22` y configurar tu PATH según las instrucciones de Homebrew.
2. Descarga Docker Desktop para **Apple Silicon** o **Intel**, según tu procesador. Abre Docker Desktop y espera a que el motor esté disponible.
3. En Terminal, comprueba:

```bash
git --version
node --version
npm --version
docker --version
docker compose version
docker run --rm hello-world
```

4. Para habilitar `code .`, abre VS Code, pulsa `Cmd + Shift + P` y ejecuta **Shell Command: Install 'code' command in PATH**.

### Windows 10/11 (PowerShell)

1. Instala Git for Windows, Node.js LTS y VS Code desde sus instaladores oficiales. Reinicia la terminal después de instalar.
2. Instala Docker Desktop con motor WSL 2. Si WSL no está disponible, abre PowerShell **como administrador**, ejecuta `wsl --install` y reinicia; consulta los requisitos oficiales de Docker Desktop.
3. Abre PowerShell normal y comprueba:

```powershell
git --version
node --version
npm.cmd --version
docker --version
docker compose version
docker run --rm hello-world
```

Usa `npm.cmd` si PowerShell bloquea `npm.ps1`; no es necesario cambiar la política de ejecución.

## 2. Preparar Git

En ambos sistemas (sustituye por tu información):

```bash
git config --global user.name "Nombre Apellido"
git config --global user.email "correo@example.com"
git config --global --list
```

## 3. Crear repositorio propio del estudiante

1. GitHub → **New repository** → nombre `moneycloud-alumno` → **Private** (recomendado para la demo) → Create repository.
2. Copia la URL HTTPS de GitHub; reemplaza `TU-USUARIO` en los siguientes comandos.

**macOS:**

```bash
git clone https://github.com/TU-USUARIO/moneycloud-alumno.git
cd moneycloud-alumno
code .
```

**Windows (PowerShell):**

```powershell
git clone https://github.com/TU-USUARIO/moneycloud-alumno.git
Set-Location moneycloud-alumno
code .
```

> Si el repositorio está vacío, Git avisará que no hay commits; es normal. Si `code` no se reconoce, abre VS Code manualmente y usa **Archivo → Abrir carpeta**.

## 4. Carpeta inicial y estructura esperada

En la raíz de `moneycloud-alumno`, crea las carpetas:

**macOS:**

```bash
mkdir -p apps/web/src apps/api/src apps/api/tests
```

**Windows (PowerShell):**

```powershell
New-Item -ItemType Directory -Force apps/web/src, apps/api/src, apps/api/tests
```

Después abre [Sesión 1](sesiones/01-frontend.md) y crea **cada archivo** con su ruta exacta y su bloque de código. No copies los delimitadores de Markdown (tres acentos graves).

## 5. Ejecutar al terminar la sesión 1

**macOS, terminal A:**

```bash
npm install
npm run dev:api
```

**macOS, terminal B:**

```bash
npm run dev:web
```

**Windows, PowerShell A:**

```powershell
npm.cmd install
npm.cmd run dev:api
```

**Windows, PowerShell B:**

```powershell
npm.cmd run dev:web
```

Visita `http://localhost:5173` y `http://localhost:3001/health`. Si el frontend indica error de conexión, revisa que ambos procesos estén activos y que `apps/api/.env` tenga `PORT=3001`.

## 6. Git: publicar tu avance

**macOS / Windows:**

```bash
git status
git add .
git commit -m "feat: completar sesión 1 MoneyCloud"
git push -u origin HEAD
```

Confirma en GitHub que aparecen `apps/`, `package.json` y `.gitignore`, pero **no** `.env`, `node_modules` ni credenciales.

## 7. Preparación por sesión

- **Sesión 1:** Node.js, VS Code, Git; código y dashboard.
- **Sesión 2:** Firebase Console, Firestore y cuenta de servicio guardada **fuera del repositorio**; ejecutar `npm test`.
- **Sesión 3:** Docker Desktop activo; construir y probar el contenedor.
- **Sesión 4:** cuentas Render y Netlify; desplegar, configurar `VITE_API_URL`, `CORS_ORIGIN` y revisar GitHub Actions.

## 8. Errores frecuentes

- `npm: command not found`: instala Node.js y reinicia la terminal.
- `docker daemon not running`: inicia Docker Desktop y espera a que el motor arranque.
- `EADDRINUSE`: otro proceso ocupa el puerto; detén ese proceso o ajusta la configuración de ambos servicios.
- Error CORS: verifica que `CORS_ORIGIN` coincida exactamente con la URL del frontend.
- `Cannot GET /`: usa `/health` en la API; la interfaz se abre en el puerto 5173.
- `git push` rechazado: verifica que el remoto sea tu repositorio y que tengas permisos.
