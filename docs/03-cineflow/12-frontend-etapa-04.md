# Frontend 4 — Crear usuarios e iniciar sesión

<!-- navigation:start -->

[← Anterior](./03-firebase-tmdb-y-variables.md) | [Índice CineFlow](./README.md) | [Siguiente →](./13-frontend-etapa-05.md)

[🏠 Índice general](../../README.md)

<!-- navigation:end -->

**Meta:** crear usuarios e iniciar sesión.

**Antes de comenzar:** Ya completaste el documento de configuración TMDB/Firebase que aparece antes de esta etapa en la navegación. Conserva tus .env; no los reemplaces con plantillas vacías.

## Paso 1 — Qué estás construyendo

El SDK de Firebase registra e inicia sesiones. Session guarda la identidad y la cuenta para que varias pantallas puedan consultarlas. Después del acceso, PUT /me crea el documento inicial en Firestore. Si falla Firestore después de crear la identidad, Reintentar sincronización recupera el paso sin registrar otra cuenta. El SDK administra los tokens: no los copiamos a LocalStorage.

## Paso 2 — Abrir la carpeta correcta

Trabaja en `cineflow-v2`, la aplicación. Conserva todos los archivos de las etapas anteriores. Si `npm run dev` está abierto, puedes dejarlo funcionando mientras guardas los cambios; espera a terminar todos los archivos de esta etapa antes de revisar errores transitorios.

## Paso 3 — Copiar los archivos de esta etapa


### Archivo: `apps/web/src/firebase.ts`

**Acción:** crear el archivo si no existe; si existe, reemplazar TODO su contenido por lo siguiente. Guardar antes de continuar.

```ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const key = import.meta.env.VITE_FIREBASE_API_KEY;
export const auth = key
  ? getAuth(
      initializeApp({
        apiKey: key,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
      }),
    )
  : null;
```

### Archivo: `apps/web/src/Session.tsx`

**Acción:** crear el archivo si no existe; si existe, reemplazar TODO su contenido por lo siguiente. Guardar antes de continuar.

```tsx
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "./firebase";
import { request } from "./api";
import type { Account, Profile } from "./types";
interface SessionValue {
  user: User | null;
  loading: boolean;
  account: Account | null;
  profile: Profile | null;
  error: string;
  refresh: () => Promise<void>;
  select: (id: string) => void;
  call: <T>(path: string, init?: RequestInit) => Promise<T>;
}
const Context = createContext<SessionValue | null>(null);
export function Session({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null),
    [loading, setLoading] = useState(!!auth),
    [account, setAccount] = useState<Account | null>(null),
    [active, setActive] = useState("main"),
    [error, setError] = useState("");
  const epoch = useRef(0);
  async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
    const u = auth?.currentUser;
    if (!u) throw new Error("Inicia sesión");
    return request<T>(path, {
      ...init,
      headers: {
        ...init.headers,
        Authorization: `Bearer ${await u.getIdToken()}`,
      },
    });
  }
  async function refresh() {
    const u = auth?.currentUser;
    if (!u) return;
    const current = epoch.current;
    const data = await call<Account>("/me");
    if (auth?.currentUser?.uid === u.uid && epoch.current === current)
      setAccount(data);
  }
  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, (u) => {
      const current = ++epoch.current;
      setUser(u);
      setAccount(null);
      setActive("main");
      setError("");
      setLoading(!!u);
      if (u) {
        u.getIdToken()
          .then((token) =>
            request<Account>("/me", {
              method: "PUT",
              body: "{}",
              headers: { Authorization: `Bearer ${token}` },
            }),
          )
          .then((data) => {
            if (current === epoch.current) setAccount(data);
          })
          .catch((e) => {
            if (current === epoch.current) setError(e.message);
          })
          .finally(() => {
            if (current === epoch.current) setLoading(false);
          });
      }
    });
  }, []);
  const profile =
    account?.profiles.find((p) => p.id === active) ??
    account?.profiles[0] ??
    null;
  return (
    <Context.Provider
      value={{
        user,
        loading,
        account,
        profile,
        error,
        call,
        refresh,
        select: setActive,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useSession() {
  const value = useContext(Context);
  if (!value) throw new Error("Falta Session");
  return value;
}
```

### Archivo: `apps/web/src/Access.tsx`

**Acción:** crear el archivo si no existe; si existe, reemplazar TODO su contenido por lo siguiente. Guardar antes de continuar.

```tsx
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "./firebase";
import { useSession } from "./Session";
export function Access() {
  const {
    user,
    loading,
    account,
    error: sessionError,
    refresh,
    call,
  } = useSession();
  const [register, setRegister] = useState(false),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  async function run(action: () => Promise<unknown>, success = "") {
    setBusy(true);
    setMessage("");
    try {
      await action();
      setMessage(success);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "No se pudo completar");
    } finally {
      setBusy(false);
    }
  }
  if (!auth)
    return (
      <p className="error">
        Completa la configuración WEB de Firebase en apps/web/.env y reinicia
        Vite.
      </p>
    );
  if (loading) return <p role="status">Recuperando sesión…</p>;
  return (
    <section className="panel max-w-xl mx-auto">
      <h1>
        {user ? "Mi cuenta" : register ? "Crear cuenta" : "Iniciar sesión"}
      </h1>
      {user ? (
        <>
          <p>{user.email}</p>
          <p>Cuenta: {account?.name || "Pendiente de sincronizar"}</p>
          {sessionError && <p className="error">{sessionError}</p>}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const name = String(new FormData(e.currentTarget).get("name"));
              void run(async () => {
                await call("/me", {
                  method: "PATCH",
                  body: JSON.stringify({ name }),
                });
                await refresh();
              }, "Nombre actualizado");
            }}
          >
            <label>
              Nombre
              <input
                key={account?.name}
                name="name"
                defaultValue={account?.name}
                required
                maxLength={30}
              />
            </label>
            <button className="btn" disabled={busy}>
              Guardar nombre
            </button>
          </form>
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              className="btn"
              disabled={busy}
              onClick={() =>
                void run(async () => {
                  await call("/me", { method: "PUT", body: "{}" });
                  await refresh();
                }, "Cuenta sincronizada")
              }
            >
              Reintentar sincronización
            </button>
            <button
              className="btn"
              disabled={busy}
              onClick={() =>
                void run(() => sendEmailVerification(user), "Revisa tu correo")
              }
            >
              Enviar verificación
            </button>
            <button
              className="btn"
              disabled={busy}
              onClick={() => void run(() => signOut(auth!))}
            >
              Cerrar sesión
            </button>
          </div>
        </>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const values = new FormData(e.currentTarget),
              email = String(values.get("email")),
              password = String(values.get("password"));
            void run(() =>
              register
                ? createUserWithEmailAndPassword(auth!, email, password)
                : signInWithEmailAndPassword(auth!, email, password),
            );
          }}
        >
          <label>
            Correo
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            Contraseña
            <input
              name="password"
              type="password"
              minLength={6}
              autoComplete={register ? "new-password" : "current-password"}
              required
            />
          </label>
          <button className="btn primary" disabled={busy}>
            {register ? "Registrarme" : "Entrar"}
          </button>
          <button
            className="btn"
            type="button"
            onClick={() => setRegister(!register)}
          >
            {register ? "Ya tengo cuenta" : "Crear cuenta"}
          </button>
          <button
            className="btn"
            type="button"
            disabled={busy}
            onClick={(e) => {
              const form = e.currentTarget.form;
              if (!form) return;
              const email = String(new FormData(form).get("email"));
              if (!email) {
                setMessage("Escribe tu correo primero");
                return;
              }
              void run(
                () => sendPasswordResetEmail(auth!, email),
                "Si la cuenta es válida, recibirás instrucciones.",
              );
            }}
          >
            Recuperar contraseña
          </button>
        </form>
      )}
      {message && <p role="status">{message}</p>}
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
import { Session, useSession } from "./Session";
import { Access } from "./Access";
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

**Resultado esperado:** Abre Cuenta / Acceso, pulsa Crear cuenta y registra un correo de prueba propio. Debe verse tu correo y Mi cuenta. Comprueba el usuario en Firebase Auth y el documento cineflowUsers en Firestore. Cierra sesión, vuelve a entrar y recarga. El acceso se conserva según la persistencia del SDK.

## Paso 6 — Ejercicio corto

Intenta una contraseña incorrecta y observa el mensaje. Prueba recuperar contraseña con tu correo. Si se creó Auth pero falla la cuenta, revisa la ruta del JSON Admin y pulsa Reintentar sincronización.

## Paso 7 — Cerrar la etapa

Guarda una captura o nota del resultado. Antes de continuar, revisa cambios:

```bash
git status
git add .
git commit -m "feat: cineflow etapa 4"
```

No agregues `.env` ni cuentas de servicio. La regla .gitignore de instalación protege .env y secrets/. Un archivo privado fuera del proyecto tampoco debe copiarse dentro para hacer commit.

**Si falla:** revisa la terminal del backend y la pestaña Network del navegador. Si faltan módulos, ejecuta npm install desde la raíz. Si cambiaste .env, reinicia npm run dev. No continúes si no puedes reproducir el resultado esperado.

---

<!-- navigation:start -->

[← Anterior](./03-firebase-tmdb-y-variables.md) | [Índice CineFlow](./README.md) | [Siguiente →](./13-frontend-etapa-05.md)

[🏠 Índice general](../../README.md)

<!-- navigation:end -->
