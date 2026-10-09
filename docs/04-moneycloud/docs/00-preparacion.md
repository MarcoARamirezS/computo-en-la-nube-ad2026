# Preparación — macOS y Windows

## 1. Requisitos

Instala [Git](https://git-scm.com/downloads), [Node.js LTS](https://nodejs.org/), [VS Code](https://code.visualstudio.com/), [Docker Desktop](https://docs.docker.com/desktop/) y crea una cuenta en [GitHub](https://github.com). Para la sesión 2 crea un proyecto de [Firebase](https://console.firebase.google.com); para la sesión 4 cuentas en [Render](https://render.com) y [Netlify](https://www.netlify.com).

### macOS (Terminal)
```bash
git --version
node --version
npm --version
docker --version
docker compose version
docker run --rm hello-world
```
Instala la versión de Docker Desktop correspondiente a Apple Silicon o Intel; abre Docker Desktop antes de ejecutar Docker.

### Windows (PowerShell)
```powershell
git --version
node --version
npm.cmd --version
docker --version
docker compose version
docker run --rm hello-world
```
Docker Desktop normalmente requiere WSL2; si no está instalado, abre PowerShell como administrador, ejecuta `wsl --install`, reinicia y consulta los requisitos oficiales. Si PowerShell bloquea `npm.ps1`, utiliza `npm.cmd` sin cambiar políticas globales.

## 2. Crear el repositorio en GitHub

Docente: este laboratorio ya forma parte de `computo-en-la-nube-ad2026`. Publica el repositorio guía y comparte su URL. **Cada estudiante debe crear un repositorio propio vacío** (por ejemplo `moneycloud-alumno`) y trabajar allí; no debe crear el código dentro de la carpeta `docs/04-moneycloud` del repositorio guía. Usa las instrucciones siguientes en su propio repositorio.

**macOS:**
```bash
git clone https://github.com/TU-USUARIO/moneycloud-alumno.git
cd moneycloud-alumno
code .
```
**Windows PowerShell:**
```powershell
git clone https://github.com/TU-USUARIO/moneycloud-alumno.git
Set-Location moneycloud-alumno
code .
```
Sustituye `TU-USUARIO`. Si VS Code no reconoce `code`, abre la carpeta con Archivo → Abrir carpeta.

**Nota:** crea `moneycloud-alumno` en GitHub sin README inicial, o bien inicializa localmente con `git init` y conecta el remoto. Si GitHub lo crea vacío, `git clone` mostrará un aviso normal.

## 3. Reglas del laboratorio

1. Sigue los pasos en orden; no saltes archivos.
2. Crea cada ruta desde VS Code o con los comandos indicados.
3. Copia el bloque completo de cada archivo, sin los delimitadores ``` de Markdown.
4. Guarda y verifica antes de hacer commit.
5. Nunca subas `.env`, credenciales JSON, `node_modules` o `dist`.
6. No uses datos financieros reales: la API demo carece de autenticación.

## 4. Git

```bash
git status
git add .
git commit -m "docs: iniciar laboratorio MoneyCloud"
git push
```
Si Git solicita identidad, configura `git config --global user.name "Tu Nombre"` y `git config --global user.email "tu-email@example.com"`.
