# 1. Entender el proyecto en cinco minutos

<!-- navigation:start -->

[← Anterior](./00-leeme.md) | [Índice CineFlow](./README.md) | [Siguiente →](./02-instalacion-monorepo.md)

[🏠 Índice general](../../README.md)

<!-- navigation:end -->

## ¿Qué vas a crear?

CineFlow es un catálogo visual de películas y series. Permite crear una cuenta, elegir perfiles, guardar favoritos y registrar el avance de **tráilers**. TMDB no entrega las películas completas.

| Pieza | Para qué sirve | Ejemplo |
|---|---|---|
| React | Construye pantallas con componentes | Tarjeta de una película |
| Tailwind | Aplica estilos | Colores, márgenes y columnas |
| Vite | Arranca y compila el frontend | localhost:5173 |
| Node + Express | Atiende solicitudes del frontend | Guardar un favorito |
| Firebase Auth | Identifica a la persona | Email y contraseña |
| Firestore | Guarda información propia | Perfiles, listas e historial |
| TMDB | Entrega catálogo e imágenes | Buscar una película |
| YouTube | Reproduce un tráiler insertable | Pausar y retomar |

## Así viaja una acción

Cuando guardas un favorito, React envía una petición a Express con tu ID token. Express verifica la identidad con Firebase Admin, localiza la cuenta por su uid y guarda el cambio en Firestore. Después React consulta el estado actualizado.

El navegador usa Firebase Auth, pero **no usa Firestore directamente**. El token privado de TMDB y la cuenta de servicio de Firebase quedan en el backend.

## Estructura sencilla

```text
cineflow-v2/
  package.json           Comandos para todo el proyecto
  apps/
    api/                 Backend completo
      package.json
      src/
    web/                 Frontend por etapas
      package.json
      src/
```

Monorepo significa que ambos proyectos viven en la misma carpeta y comparten un comando de instalación. `npm workspaces` permite instalar sus dependencias desde la raíz. No implica que frontend y backend se ejecuten en el mismo proceso.

## Decisiones para facilitar el aprendizaje

- Dos workspaces; sin paquete contracts durante esta versión.
- Consultas con fetch y un hook pequeño; sin una segunda librería de caché.
- Catálogo demo al inicio; datos reales cuando configures TMDB.
- Firebase real al activar usuarios; sin instalar Java ni emuladores para seguir el camino principal.
- Pruebas incluidas con el ejecutor de Node y Supertest.
- Hasta cinco perfiles, 50 favoritos y los 50 tráilers más recientes por perfil.

Los límites son deliberados para el ejemplo educativo. En una aplicación comercial grande se migrarían listas a subcolecciones y se agregarían paginación, pruebas contra Firebase y operación más avanzada. Consulta el modelo sólo cuando lo necesites.

**Comprobación:** puedes explicar qué vive en `apps/web` y qué vive en `apps/api`. Continúa a instalación.

---

<!-- navigation:start -->

[← Anterior](./00-leeme.md) | [Índice CineFlow](./README.md) | [Siguiente →](./02-instalacion-monorepo.md)

[🏠 Índice general](../../README.md)

<!-- navigation:end -->
