# Frontend 3 — Abrir la ficha de un título

<!-- navigation:start -->

[← Anterior](./10-frontend-etapa-02.md) | [Índice CineFlow](./README.md) | [Siguiente →](./03-firebase-tmdb-y-variables.md)

[🏠 Índice general](../../README.md)

<!-- navigation:end -->

**Meta:** abrir la ficha de un título.

**Antes de comenzar:** Catálogo y búsqueda de etapa 2 funcionan.

## Paso 1 — Qué estás construyendo

useParams obtiene type e id desde /titulo/:type/:id. Una película y una serie pueden tener el mismo número, por eso ambos valores identifican el recurso. useData consulta una ficha y muestra carga/error. El espacio extra de Detail permitirá agregar favoritos y player después sin reescribir toda la página.

## Paso 2 — Abrir la carpeta correcta

Trabaja en `cineflow-v2`, la aplicación. Conserva todos los archivos de las etapas anteriores. Si `npm run dev` está abierto, puedes dejarlo funcionando mientras guardas los cambios; espera a terminar todos los archivos de esta etapa antes de revisar errores transitorios.

## Paso 3 — Copiar los archivos de esta etapa


### Archivo: `apps/web/src/Detail.tsx`

**Acción:** crear el archivo si no existe; si existe, reemplazar TODO su contenido por lo siguiente. Guardar antes de continuar.

```tsx
import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { useData } from "./useData";
import type { Media } from "./types";
export function Detail({ extra }: { extra?: (media: Media) => ReactNode }) {
  const { type, id } = useParams();
  const { data, error, loading } = useData<Media>(`/catalog/${type}/${id}`);
  if (loading) return <p role="status">Cargando ficha…</p>;
  if (error || !data)
    return (
      <p className="error" role="alert">
        {error || "No disponible"}
      </p>
    );
  return (
    <section className="panel">
      <Link to="/">← Catálogo</Link>
      <h1>{data.title}</h1>
      <div className="grid gap-6 md:grid-cols-[220px_1fr]">
        <div className="poster">
          {data.poster ? (
            <img src={data.poster} alt={`Cartel de ${data.title}`} />
          ) : (
            <span>Sin cartel</span>
          )}
        </div>
        <div>
          <p>{data.overview}</p>
          <p className="muted">
            {data.type === "movie" ? "Película" : "Serie"} · La reproducción
            corresponde a tráilers.
          </p>
          {extra?.(data)}
        </div>
      </div>
    </section>
  );
}
```

## Paso 4 — Reemplazar App.tsx

Este es el archivo COMPLETO para esta etapa. Conecta las pantallas que ya existen; no debes combinar fragmentos manualmente.

### Archivo: `apps/web/src/App.tsx`

**Acción:** crear el archivo si no existe; si existe, reemplazar TODO su contenido por lo siguiente. Guardar antes de continuar.

```tsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Catalog } from "./Catalog";
import { Detail } from "./Detail";
function Layout() {
  return (
    <>
      <a className="skip" href="#contenido">
        Saltar al contenido
      </a>
      <header className="wrap border-b border-slate-700">
        <strong className="text-2xl text-rose-300">CINEFLOW</strong>
        <nav className="mt-4">
          <Link to="/">Catálogo</Link>
          <Link to="/creditos">Créditos</Link>
        </nav>
      </header>
      <main id="contenido" className="wrap">
        <Routes>
          <Route path="/" element={<Catalog />} />
          <Route path="/titulo/:type/:id" element={<Detail />} />
          <Route
            path="/creditos"
            element={
              <section className="panel">
                <h1>Créditos</h1>
                <p>CineFlow es un proyecto educativo de catálogo y tráilers.</p>
                <p>
                  This product uses the TMDB API but is not endorsed or
                  certified by TMDB.
                </p>
                <p>
                  <a href="https://www.themoviedb.org/">
                    Datos e imágenes: TMDB
                  </a>
                  . Reproducción: YouTube.
                </p>
                <p>
                  Antes de publicar, agrega aquí el logo oficial aprobado de
                  TMDB según su guía de atribución.
                </p>
              </section>
            }
          />
          <Route
            path="*"
            element={
              <p>
                Página no encontrada. <Link to="/">Ir al inicio</Link>
              </p>
            }
          />
        </Routes>
      </main>
      <footer className="wrap muted">
        CineFlow · Catálogo educativo y tráilers
      </footer>
    </>
  );
}
export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
```

## Paso 5 — Ejecutar y comprobar

Si no está abierto, ejecuta desde `cineflow-v2`:

```bash
npm run dev
```

No ejecutes dos copias de este comando a la vez. En otra terminal puedes comprobar tipos:

```bash
npm run typecheck
```

**Resultado esperado:** Pulsa Órbita Azul, lee su sinopsis, vuelve al catálogo y abre La Última Estación. Recarga dentro de una ficha: sigue funcionando en Vite. Un ID inexistente devuelve un mensaje, no una pantalla en blanco.

## Paso 6 — Ejercicio corto

Prueba /titulo/movie/1 en catálogo demo: debe mostrar título no encontrado. Vuelve usando Catálogo.

## Paso 7 — Cerrar la etapa

Guarda una captura o nota del resultado. Antes de continuar, revisa cambios:

```bash
git status
git add .
git commit -m "feat: cineflow etapa 3"
```

No agregues `.env` ni cuentas de servicio. La regla .gitignore de instalación protege .env y secrets/. Un archivo privado fuera del proyecto tampoco debe copiarse dentro para hacer commit.

**Si falla:** revisa la terminal del backend y la pestaña Network del navegador. Si faltan módulos, ejecuta npm install desde la raíz. Si cambiaste .env, reinicia npm run dev. No continúes si no puedes reproducir el resultado esperado.

---

<!-- navigation:start -->

[← Anterior](./10-frontend-etapa-02.md) | [Índice CineFlow](./README.md) | [Siguiente →](./03-firebase-tmdb-y-variables.md)

[🏠 Índice general](../../README.md)

<!-- navigation:end -->
