# Frontend 2 — Conectar catálogo y navegación

<!-- navigation:start -->

[← Anterior](./09-frontend-etapa-01.md) | [Índice CineFlow](./README.md) | [Siguiente →](./11-frontend-etapa-03.md)

[🏠 Índice general](../../README.md)

<!-- navigation:end -->

**Meta:** conectar catálogo y navegación.

**Antes de comenzar:** La interfaz de etapa 1 funciona y API usa CATALOG_MODE=demo.

## Paso 1 — Qué estás construyendo

fetch hace una petición HTTP. api.ts revisa si la respuesta fue correcta; useData controla carga, error y cancelación. El router cambia la pantalla sin recargar todo el sitio. La búsqueda queda en la URL: puedes copiarla o volver con Atrás. Para simplificar, se busca al pulsar Buscar, no en cada tecla.

## Paso 2 — Abrir la carpeta correcta

Trabaja en `cineflow-v2`, la aplicación. Conserva todos los archivos de las etapas anteriores. Si `npm run dev` está abierto, puedes dejarlo funcionando mientras guardas los cambios; espera a terminar todos los archivos de esta etapa antes de revisar errores transitorios.

## Paso 3 — Copiar los archivos de esta etapa


### Archivo: `apps/web/src/types.ts`

**Acción:** crear el archivo si no existe; si existe, reemplazar TODO su contenido por lo siguiente. Guardar antes de continuar.

```ts
export interface Media {
  id: number;
  type: "movie" | "tv";
  title: string;
  overview: string;
  poster: string | null;
}
export interface Video {
  id: string;
  title: string;
}
export interface Favorite {
  media: Media;
  addedAt: string;
}
export interface History {
  media: Media;
  videoId: string;
  position: number;
  duration: number;
  completed: boolean;
  version: number;
  updatedAt: string;
}
export interface Profile {
  id: string;
  name: string;
  favorites: Record<string, Favorite>;
  history: Record<string, History>;
}
export interface Account {
  name: string;
  profiles: Profile[];
}
```

### Archivo: `apps/web/src/api.ts`

**Acción:** crear el archivo si no existe; si existe, reemplazar TODO su contenido por lo siguiente. Guardar antes de continuar.

```ts
export async function request<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL || "http://localhost:4000/api"}${path}`,
    {
      ...init,
      headers: { "Content-Type": "application/json", ...init.headers },
    },
  );
  if (response.status === 204) return undefined as T;
  const body = await response
    .json()
    .catch(() => ({ error: "Respuesta inesperada del servidor" }));
  if (!response.ok)
    throw new Error(body.error || `Error HTTP ${response.status}`);
  return body.data as T;
}
```

### Archivo: `apps/web/src/useData.ts`

**Acción:** crear el archivo si no existe; si existe, reemplazar TODO su contenido por lo siguiente. Guardar antes de continuar.

```ts
import { useEffect, useState } from "react";
import { request } from "./api";
export function useData<T>(path: string) {
  const [state, setState] = useState<{
    path: string;
    data?: T;
    error?: string;
    loading: boolean;
  }>({ path, loading: true });
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setState({ path, loading: true });
    request<T>(path, { signal: controller.signal })
      .then((data) => setState({ path, data, loading: false }))
      .catch((e) => {
        if (!controller.signal.aborted)
          setState({
            path,
            error: e instanceof Error ? e.message : "Error de conexión",
            loading: false,
          });
      });
    return () => controller.abort();
  }, [path, retry]);
  return {
    ...(state.path === path ? state : { path, loading: true }),
    reload: () => setRetry((x) => x + 1),
  };
}
```

### Archivo: `apps/web/src/Catalog.tsx`

**Acción:** crear el archivo si no existe; si existe, reemplazar TODO su contenido por lo siguiente. Guardar antes de continuar.

```tsx
import { Link, useSearchParams } from "react-router-dom";
import { useData } from "./useData";
import type { Media } from "./types";
export function Card({ media }: { media: Media }) {
  return (
    <article className="panel">
      <Link to={`/titulo/${media.type}/${media.id}`}>
        <div className="poster">
          {media.poster ? (
            <img
              src={media.poster}
              alt=""
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <span aria-hidden="true" className="text-5xl">
              ▶
            </span>
          )}
        </div>
        <h2 className="mt-3 text-lg">{media.title}</h2>
      </Link>
      <p className="muted">{media.type === "movie" ? "Película" : "Serie"}</p>
    </article>
  );
}
export function Catalog() {
  const [params, setParams] = useSearchParams();
  const type = params.get("tipo") === "tv" ? "tv" : "movie";
  const q = params.get("q") || "";
  const page = Math.max(1, Number(params.get("pagina")) || 1);
  const { data, error, loading, reload } = useData<Media[]>(
    `/catalog?type=${type}&q=${encodeURIComponent(q)}&page=${page}`,
  );
  return (
    <>
      <section className="panel mb-6">
        <p className="text-rose-300">DESCUBRE TU PRÓXIMA HISTORIA</p>
        <h1>CineFlow</h1>
        <p>
          Explora películas y series. Guarda tus favoritas y descubre sus
          tráilers.
        </p>
      </section>
      <form
        className="panel mb-6"
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          setParams({
            tipo: String(f.get("tipo")),
            q: String(f.get("q")),
            pagina: "1",
          });
        }}
      >
        <label>
          Buscar por título
          <input
            key={q}
            name="q"
            defaultValue={q}
            maxLength={100}
            placeholder="Ejemplo: Órbita"
          />
        </label>
        <label>
          Tipo
          <select key={type} name="tipo" defaultValue={type}>
            <option value="movie">Películas</option>
            <option value="tv">Series</option>
          </select>
        </label>
        <button className="btn primary">Buscar</button>
      </form>
      {loading ? (
        <p role="status">Cargando catálogo…</p>
      ) : error ? (
        <div className="error" role="alert">
          {error}{" "}
          <button className="btn" onClick={reload}>
            Reintentar
          </button>
        </div>
      ) : (
        <>
          <div className="grid-media">
            {data?.map((m) => (
              <Card key={`${m.type}_${m.id}`} media={m} />
            ))}
          </div>
          {data?.length === 0 && <p>No hay resultados. Prueba otro título.</p>}
          <nav className="mt-6">
            <button
              className="btn"
              disabled={page <= 1}
              onClick={() =>
                setParams({ tipo: type, q, pagina: String(page - 1) })
              }
            >
              Anterior
            </button>
            <span>Página {page}</span>
            <button
              className="btn"
              disabled={!data?.length || page >= 500}
              onClick={() =>
                setParams({ tipo: type, q, pagina: String(page + 1) })
              }
            >
              Siguiente
            </button>
          </nav>
        </>
      )}
    </>
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
          <Route
            path="/titulo/:type/:id"
            element={
              <p>
                La ficha se incorpora en la siguiente etapa.{" "}
                <Link to="/">Volver</Link>
              </p>
            }
          />
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

**Resultado esperado:** Ver dos películas en inicio y Código Aurora al seleccionar Series y pulsar Buscar. Escribe un término que no exista: aparece un mensaje de lista vacía. Abrir una tarjeta muestra temporalmente el aviso de que la ficha se construye en etapa 3.

## Paso 6 — Ejercicio corto

Detén sólo el backend y recarga. Debe aparecer error con Reintentar. Arráncalo y comprueba recuperación. La falta de red no se presenta como si fuera un catálogo vacío.

## Paso 7 — Cerrar la etapa

Guarda una captura o nota del resultado. Antes de continuar, revisa cambios:

```bash
git status
git add .
git commit -m "feat: cineflow etapa 2"
```

No agregues `.env` ni cuentas de servicio. La regla .gitignore de instalación protege .env y secrets/. Un archivo privado fuera del proyecto tampoco debe copiarse dentro para hacer commit.

**Si falla:** revisa la terminal del backend y la pestaña Network del navegador. Si faltan módulos, ejecuta npm install desde la raíz. Si cambiaste .env, reinicia npm run dev. No continúes si no puedes reproducir el resultado esperado.

---

<!-- navigation:start -->

[← Anterior](./09-frontend-etapa-01.md) | [Índice CineFlow](./README.md) | [Siguiente →](./11-frontend-etapa-03.md)

[🏠 Índice general](../../README.md)

<!-- navigation:end -->
