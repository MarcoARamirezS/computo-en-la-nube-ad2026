# Frontend 6 — Guardar favoritas en la nube

<!-- navigation:start -->

[← Anterior](./13-frontend-etapa-05.md) | [Índice CineFlow](./README.md) | [Siguiente →](./15-frontend-etapa-07.md)

[🏠 Índice general](../../README.md)

<!-- navigation:end -->

**Meta:** guardar favoritas en la nube.

**Antes de comenzar:** Puedes seleccionar perfiles. Mantén el mismo modo de catálogo mientras haces las pruebas para no mezclar IDs demo con títulos reales.

## Paso 1 — Qué estás construyendo

PUT guarda el favorito con clave movie_ID o tv_ID; repetirlo no crea copias. DELETE lo elimina. Después de confirmar, refresh vuelve a consultar la cuenta. Aquí el servidor es la fuente de verdad: no guardamos una copia independiente de favoritos en LocalStorage. Si falla el servidor, el botón informa error y no anuncia éxito.

## Paso 2 — Abrir la carpeta correcta

Trabaja en `cineflow-v2`, la aplicación. Conserva todos los archivos de las etapas anteriores. Si `npm run dev` está abierto, puedes dejarlo funcionando mientras guardas los cambios; espera a terminar todos los archivos de esta etapa antes de revisar errores transitorios.

## Paso 3 — Copiar los archivos de esta etapa


### Archivo: `apps/web/src/Favorites.tsx`

**Acción:** crear el archivo si no existe; si existe, reemplazar TODO su contenido por lo siguiente. Guardar antes de continuar.

```tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useSession } from "./Session";
import type { Media } from "./types";
import { Card } from "./Catalog";
export function FavoriteButton({ media }: { media: Media }) {
  const { user, profile, call, refresh } = useSession();
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  if (!user)
    return (
      <Link className="btn" to="/acceso">
        Inicia sesión para guardar
      </Link>
    );
  if (!profile) return <Link to="/acceso">Sincroniza tu cuenta</Link>;
  const saved = !!profile.favorites[`${media.type}_${media.id}`];
  return (
    <div className="my-4">
      <button
        className="btn primary"
        aria-pressed={saved}
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setError("");
          try {
            await call(
              `/profiles/${profile.id}/favorites/${media.type}/${media.id}`,
              {
                method: saved ? "DELETE" : "PUT",
                ...(saved ? {} : { body: "{}" }),
              },
            );
            await refresh();
          } catch (e) {
            setError((e as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      >
        {saved ? "Quitar de mi lista" : "+ Mi lista"}
      </button>
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
export function Favorites() {
  const { profile, refresh } = useSession();
  const [error, setError] = useState("");
  if (!profile)
    return <Link to="/acceso">Inicia sesión y selecciona un perfil</Link>;
  const items = Object.values(profile.favorites).sort((a, b) =>
    b.addedAt.localeCompare(a.addedAt),
  );
  return (
    <>
      <h1>Mi lista · {profile.name}</h1>
      <button
        className="btn mb-4"
        onClick={() => void refresh().catch((e) => setError(e.message))}
      >
        Actualizar desde la nube
      </button>
      {error && <p role="alert">{error}</p>}
      {items.length === 0 ? (
        <p>Tu lista está vacía. Abre una ficha y pulsa “Mi lista”.</p>
      ) : (
        <div className="grid-media">
          {items.map(({ media }) => (
            <div key={`${media.type}_${media.id}`}>
              <Card media={media} />
              <FavoriteButton media={media} />
            </div>
          ))}
        </div>
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
import { Detail } from "./Detail";
import { Session, useSession } from "./Session";
import { Access } from "./Access";
import { Profiles } from "./Profiles";
import { Favorites, FavoriteButton } from "./Favorites";
function Layout() {
  const { profile, user } = useSession();
  return (
    <>
      <a className="skip" href="#contenido">
        Saltar al contenido
      </a>
      <header className="wrap border-b border-slate-700">
        <strong className="text-2xl text-rose-300">CINEFLOW</strong>
        <nav className="mt-4">
          <Link to="/">Catálogo</Link>
          <Link to="/acceso">Cuenta / Acceso</Link>
          <Link to="/perfiles">Perfiles</Link>
          <Link to="/mi-lista">Mi lista</Link>
          <Link to="/creditos">Créditos</Link>
        </nav>
        <p className="muted">
          {user ? `Perfil: ${profile?.name || "sincronizando"}` : "Visitante"}
        </p>
      </header>
      <main id="contenido" className="wrap">
        <Routes>
          <Route path="/" element={<Catalog />} />
          <Route
            path="/titulo/:type/:id"
            element={
              <Detail
                extra={(media) => (
                  <>
                    <FavoriteButton media={media} />
                  </>
                )}
              />
            }
          />
          <Route path="/acceso" element={<Access />} />
          <Route path="/perfiles" element={<Profiles />} />
          <Route path="/mi-lista" element={<Favorites />} />
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
      <Session>
        <Layout />
      </Session>
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

**Resultado esperado:** Selecciona Noche, abre una ficha y pulsa + Mi lista. En Mi lista aparece el título. Cambia a Principal y su lista queda independiente. Vuelve a Noche: el favorito continúa. En otro navegador con la misma cuenta selecciona Noche y pulsa Actualizar desde la nube.

## Paso 6 — Ejercicio corto

Quita un favorito y recarga. No debe reaparecer. Cambia de cuenta y verifica que no se muestran las listas anteriores.

## Paso 7 — Cerrar la etapa

Guarda una captura o nota del resultado. Antes de continuar, revisa cambios:

```bash
git status
git add .
git commit -m "feat: cineflow etapa 6"
```

No agregues `.env` ni cuentas de servicio. La regla .gitignore de instalación protege .env y secrets/. Un archivo privado fuera del proyecto tampoco debe copiarse dentro para hacer commit.

**Si falla:** revisa la terminal del backend y la pestaña Network del navegador. Si faltan módulos, ejecuta npm install desde la raíz. Si cambiaste .env, reinicia npm run dev. No continúes si no puedes reproducir el resultado esperado.

---

<!-- navigation:start -->

[← Anterior](./13-frontend-etapa-05.md) | [Índice CineFlow](./README.md) | [Siguiente →](./15-frontend-etapa-07.md)

[🏠 Índice general](../../README.md)

<!-- navigation:end -->
