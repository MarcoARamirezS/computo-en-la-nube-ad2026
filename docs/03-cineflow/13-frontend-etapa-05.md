# Frontend 5 — Crear y elegir perfiles

<!-- navigation:start -->

[← Anterior](./12-frontend-etapa-04.md) | [Índice CineFlow](./README.md) | [Siguiente →](./14-frontend-etapa-06.md)

[🏠 Índice general](../../README.md)

<!-- navigation:end -->

**Meta:** crear y elegir perfiles.

**Antes de comenzar:** Cuenta creada y documento de Firestore sincronizado.

## Paso 1 — Qué estás construyendo

La cuenta identifica a la persona; un perfil organiza sus listas. El perfil principal se llama Principal. Elegir otro cambia el contexto, no inicia otra identidad. Los nombres se validan en frontend y backend. Un perfil seleccionado se conserva durante la sesión de la app; al recargar vuelve a Principal para mantener simple el ejemplo.

## Paso 2 — Abrir la carpeta correcta

Trabaja en `cineflow-v2`, la aplicación. Conserva todos los archivos de las etapas anteriores. Si `npm run dev` está abierto, puedes dejarlo funcionando mientras guardas los cambios; espera a terminar todos los archivos de esta etapa antes de revisar errores transitorios.

## Paso 3 — Copiar los archivos de esta etapa


### Archivo: `apps/web/src/Profiles.tsx`

**Acción:** crear el archivo si no existe; si existe, reemplazar TODO su contenido por lo siguiente. Guardar antes de continuar.

```tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useSession } from "./Session";
export function Profiles() {
  const { user, loading, account, profile, call, refresh, select } =
    useSession();
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  async function change(path: string, method: string, name?: string) {
    setError("");
    setBusy(true);
    try {
      await call(path, {
        method,
        ...(name ? { body: JSON.stringify({ name }) } : {}),
      });
      await refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  if (loading) return <p>Cargando…</p>;
  if (!user)
    return (
      <Link className="btn" to="/acceso">
        Inicia sesión para gestionar perfiles
      </Link>
    );
  if (!account) return <Link to="/acceso">Sincroniza tu cuenta primero</Link>;
  return (
    <>
      <h1>¿Quién está viendo?</h1>
      <p>Cada perfil tiene su propia lista e historial.</p>
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        {account.profiles.map((p) => (
          <article className="panel" key={p.id}>
            <button
              className="btn primary"
              onClick={() => select(p.id)}
              aria-pressed={profile?.id === p.id}
            >
              {profile?.id === p.id ? "✓ " : ""}
              {p.name}
            </button>
            <form
              className="mt-4"
              onSubmit={(e) => {
                e.preventDefault();
                void change(
                  `/profiles/${p.id}`,
                  "PATCH",
                  String(new FormData(e.currentTarget).get("name")),
                );
              }}
            >
              <label>
                Nombre del perfil
                <input
                  name="name"
                  defaultValue={p.name}
                  maxLength={30}
                  required
                />
              </label>
              <button className="btn" disabled={busy}>
                Renombrar
              </button>
            </form>
            {p.id !== "main" && (
              <button
                className="btn mt-3"
                disabled={busy}
                onClick={() => {
                  if (
                    confirm(
                      "¿Eliminar este perfil y sus favoritos e historial?",
                    )
                  )
                    void change(`/profiles/${p.id}`, "DELETE");
                }}
              >
                Eliminar perfil
              </button>
            )}
          </article>
        ))}
      </div>
      <form
        className="panel mt-5"
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget;
          void change(
            "/profiles",
            "POST",
            String(new FormData(form).get("name")),
          ).then(() => form.reset());
        }}
      >
        <label>
          Nuevo perfil
          <input name="name" maxLength={30} required />
        </label>
        <button className="btn" disabled={busy || account.profiles.length >= 5}>
          Crear perfil ({account.profiles.length}/5)
        </button>
      </form>
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
          <Link to="/creditos">Créditos</Link>
        </nav>
        <p className="muted">
          {user ? `Perfil: ${profile?.name || "sincronizando"}` : "Visitante"}
        </p>
      </header>
      <main id="contenido" className="wrap">
        <Routes>
          <Route path="/" element={<Catalog />} />
          <Route path="/titulo/:type/:id" element={<Detail />} />
          <Route path="/acceso" element={<Access />} />
          <Route path="/perfiles" element={<Profiles />} />
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

**Resultado esperado:** Abre Perfiles. Crea Noche, selecciónalo y verifica el nombre en el encabezado. Renómbralo. Crea más perfiles hasta cinco: el botón y la API impiden un sexto. Principal no permite eliminación.

## Paso 6 — Ejercicio corto

Crea Invitado, selecciónalo y bórralo confirmando la acción. La interfaz vuelve a un perfil existente; no se queda apuntando a un ID borrado.

## Paso 7 — Cerrar la etapa

Guarda una captura o nota del resultado. Antes de continuar, revisa cambios:

```bash
git status
git add .
git commit -m "feat: cineflow etapa 5"
```

No agregues `.env` ni cuentas de servicio. La regla .gitignore de instalación protege .env y secrets/. Un archivo privado fuera del proyecto tampoco debe copiarse dentro para hacer commit.

**Si falla:** revisa la terminal del backend y la pestaña Network del navegador. Si faltan módulos, ejecuta npm install desde la raíz. Si cambiaste .env, reinicia npm run dev. No continúes si no puedes reproducir el resultado esperado.

---

<!-- navigation:start -->

[← Anterior](./12-frontend-etapa-04.md) | [Índice CineFlow](./README.md) | [Siguiente →](./14-frontend-etapa-06.md)

[🏠 Índice general](../../README.md)

<!-- navigation:end -->
