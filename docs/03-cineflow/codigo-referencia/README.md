# CineFlow v2 — Código de referencia final

[← Guía paso a paso](../README.md) · [Instalación desde cero](../02-instalacion-monorepo.md)

Este directorio es una aplicación completa de referencia. Para aprender, sigue los MD y construye una carpeta nueva por etapas. Para arrancar la versión final, copia **todo este directorio** a una carpeta independiente llamada cineflow-v2.

## Arranque rápido

Con Node 24 instalado, abre la terminal en la carpeta copiada:

```bash
npm ci
node -e "const fs=require('node:fs'); for(const p of ['apps/api','apps/web']) if(!fs.existsSync(p+'/.env')) fs.copyFileSync(p+'/.env.example',p+'/.env')"
npm run dev
```

Abre http://localhost:5173. El catálogo demo funciona sin credenciales. Cuenta/Acceso muestra que falta configurar Firebase. No hay cuentas ficticias para saltarse el acceso.

Para cuentas reales, configura los dos .env según [Firebase y TMDB](../03-firebase-tmdb-y-variables.md) antes de copiar este directorio, o conserva ese documento por separado. Para tráilers necesitas TMDB y un video que permita inserción. Las instrucciones enlazadas son relativas al repositorio de guías; después de copiar sólo la aplicación, vuelve al repositorio para consultarlas.

## Verificación

```bash
npm run typecheck
npm test
npm run build
```

Las pruebas incluidas usan dependencias de prueba en memoria; la aplicación normal usa Firebase Admin/Firestore. No incluyen verificación real del proyecto Firebase, E2E ni publicación automática.

## Modelo educativo acotado

Cinco perfiles por cuenta, 50 favoritas y 50 entradas recientes de historial por perfil. Datos dentro de cineflowUsers/{uid}, con transacciones. Este modelo no es una plataforma comercial de streaming. No contiene secretos ni películas completas.
