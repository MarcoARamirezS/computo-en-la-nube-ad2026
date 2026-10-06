# Frontend 7 — Reproducir y guardar historial

<!-- navigation:start -->

[← Anterior](./14-frontend-etapa-06.md) | [Índice CineFlow](./README.md) | [Siguiente →](./16-frontend-etapa-08.md)

[🏠 Índice general](../../README.md)

<!-- navigation:end -->

**Meta:** reproducir y guardar historial.

**Antes de comenzar:** Favoritos funcionando y CATALOG_MODE=tmdb con token válido. El modo demo no incluye videos: verás un aviso correcto, pero no podrás completar la prueba de reproducción real.

## Paso 1 — Qué estás construyendo

YouTube entrega una instancia externa del reproductor. useRef conserva su contenedor y useEffect crea/destruye player y temporizador. El historial se guarda cuando empieza PLAYING, cada 15 segundos mientras reproduce y al pausar. Abrir una ficha no cuenta como reproducción. Cada guardado envía version para detectar cambios de otra pestaña.

## Paso 2 — Abrir la carpeta correcta

Trabaja en `cineflow-v2`, la aplicación. Conserva todos los archivos de las etapas anteriores. Si `npm run dev` está abierto, puedes dejarlo funcionando mientras guardas los cambios; espera a terminar todos los archivos de esta etapa antes de revisar errores transitorios.

## Paso 3 — Copiar los archivos de esta etapa


### Archivo: `apps/web/src/Player.tsx`

**Acción:** crear el archivo si no existe; si existe, reemplazar TODO su contenido por lo siguiente. Guardar antes de continuar.

```tsx
import { useEffect, useRef, useState } from "react";
import { useData } from "./useData";
import { useSession } from "./Session";
import { auth } from "./firebase";
import type { History, Media, Video } from "./types";
interface YTPlayer {
  getCurrentTime(): number;
  getDuration(): number;
  getPlayerState(): number;
  destroy(): void;
}
interface YTApi {
  Player: new (
    el: HTMLElement,
    options: {
      videoId: string;
      playerVars: { origin: string; start: number };
      events: {
        onStateChange: (event: { data: number }) => void;
        onError: () => void;
      };
    },
  ) => YTPlayer;
}
declare global {
  interface Window {
    YT?: YTApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}
let loader: Promise<YTApi> | null = null;
function youtube() {
  if (window.YT) return Promise.resolve(window.YT);
  if (!loader)
    loader = new Promise((resolve, reject) => {
      window.onYouTubeIframeAPIReady = () => resolve(window.YT!);
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.onerror = () => {
        loader = null;
        reject(new Error("No se pudo cargar YouTube"));
      };
      document.head.append(script);
    });
  return loader;
}
function Screen({
  media,
  video,
  start,
}: {
  media: Media;
  video: Video;
  start: number;
}) {
  const host = useRef<HTMLDivElement>(null);
  const { user, profile, call, refresh } = useSession();
  const [message, setMessage] = useState("");
  const uid = user?.uid,
    pid = profile?.id,
    key = `${media.type}_${media.id}_${video.id}`,
    initialVersion = profile?.history[key]?.version ?? 0;
  useEffect(() => {
    let alive = true,
      player: YTPlayer | undefined,
      timer: ReturnType<typeof setInterval> | undefined,
      version = initialVersion,
      busy = false,
      stopped = false,
      started = false,
      pending = false;
    async function save() {
      if (
        !alive ||
        !started ||
        stopped ||
        !uid ||
        !pid ||
        auth?.currentUser?.uid !== uid ||
        !player
      )
        return;
      if (busy) {
        pending = true;
        return;
      }
      const duration = player.getDuration();
      if (!Number.isFinite(duration) || duration <= 0) return;
      const position = Math.min(duration, Math.max(0, player.getCurrentTime()));
      busy = true;
      try {
        const record = await call<History>(
          `/profiles/${pid}/history/${media.type}/${media.id}`,
          {
            method: "PUT",
            body: JSON.stringify({
              videoId: video.id,
              position,
              duration,
              version,
            }),
          },
        );
        version = record.version;
        if (alive) setMessage(`Guardado: ${Math.floor(position)} s`);
        await refresh();
      } catch (e) {
        stopped = true;
        if (alive)
          setMessage(
            `${(e as Error).message} Cierra y vuelve a abrir el tráiler para reintentar.`,
          );
      } finally {
        busy = false;
        if (pending) {
          pending = false;
          void save();
        }
      }
    }
    youtube()
      .then((api) => {
        if (!alive || !host.current) return;
        const el = document.createElement("div");
        host.current.append(el);
        player = new api.Player(el, {
          videoId: video.id,
          playerVars: {
            origin: window.location.origin,
            start: Math.floor(start),
          },
          events: {
            onStateChange: (event) => {
              if (event.data === 1) started = true;
              if (event.data === 1 || event.data === 2 || event.data === 0)
                void save();
            },
            onError: () =>
              setMessage(
                "El video no permite reproducirse aquí. Usa el enlace de YouTube.",
              ),
          },
        });
        timer = setInterval(() => {
          if (player?.getPlayerState() === 1) void save();
        }, 15000);
      })
      .catch((e) => {
        if (alive) setMessage(e.message);
      });
    return () => {
      alive = false;
      clearInterval(timer);
      player?.destroy();
    };
  }, [uid, pid, media.type, media.id, video.id, start]);
  return (
    <section className="mt-5">
      <div ref={host} />
      <p role="status">
        {message ||
          "Pulsa reproducir. El progreso se guarda cada 15 segundos y al pausar."}
      </p>
      <a
        className="btn"
        href={`https://www.youtube.com/watch?v=${video.id}`}
        target="_blank"
        rel="noreferrer"
      >
        Abrir en YouTube
      </a>
      <p className="muted">
        La reproducción externa no se registra. Pausa antes de cerrar para
        guardar.
      </p>
    </section>
  );
}
export function Player({ media }: { media: Media }) {
  const { profile, user } = useSession();
  const { data, error, loading } = useData<Video[]>(
    `/catalog/${media.type}/${media.id}/videos`,
  );
  const [selection, setSelection] = useState<{
    video: Video;
    start: number;
  } | null>(null);
  if (loading) return <p>Buscando tráiler…</p>;
  if (error) return <p role="alert">{error}</p>;
  if (!data?.length)
    return (
      <p>
        Este título no tiene un tráiler disponible. El catálogo de demostración
        no incluye videos.
      </p>
    );
  const video = data[0],
    record = profile?.history[`${media.type}_${media.id}_${video.id}`];
  return (
    <div className="mt-5">
      <h2>Tráiler</h2>
      {selection ? (
        <>
          <button className="btn" onClick={() => setSelection(null)}>
            Cerrar tráiler
          </button>
          <Screen
            key={`${user?.uid}_${profile?.id}_${selection.video.id}`}
            media={media}
            {...selection}
          />
        </>
      ) : (
        <>
          <button
            className="btn primary"
            onClick={() =>
              setSelection({
                video,
                start: record && !record.completed ? record.position : 0,
              })
            }
          >
            {record && !record.completed
              ? `Continuar desde ${Math.floor(record.position)} s`
              : "Ver tráiler"}
          </button>
          {record && (
            <button
              className="btn"
              onClick={() => setSelection({ video, start: 0 })}
            >
              Desde el inicio
            </button>
          )}
        </>
      )}
      {!user && <p>Inicia sesión para guardar tu progreso.</p>}
    </div>
  );
}
```

### Archivo: `apps/web/src/History.tsx`

**Acción:** crear el archivo si no existe; si existe, reemplazar TODO su contenido por lo siguiente. Guardar antes de continuar.

```tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useSession } from "./Session";
export function History() {
  const { profile, call, refresh } = useSession();
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  if (!profile)
    return <Link to="/acceso">Inicia sesión y selecciona un perfil</Link>;
  const items = Object.entries(profile.history).sort((a, b) =>
    b[1].updatedAt.localeCompare(a[1].updatedAt),
  );
  return (
    <>
      <h1>Historial · {profile.name}</h1>
      <p>
        Últimos 50 tráilers. El progreso corresponde a la última muestra
        confirmada.
      </p>
      <button
        className="btn mb-4"
        onClick={() => void refresh().catch((e) => setError(e.message))}
      >
        Actualizar
      </button>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {!items.length && <p>Aún no has reproducido tráilers.</p>}
      <div className="grid gap-4">
        {items.map(([key, item]) => (
          <article key={key} className="panel">
            <h2>{item.media.title}</h2>
            <p>
              {item.completed
                ? "Completado"
                : `${Math.floor(item.position)} de ${Math.floor(item.duration)} segundos`}
            </p>
            <progress
              value={item.position}
              max={item.duration}
              aria-label={`Progreso de ${item.media.title}`}
            />
            <div className="flex flex-wrap gap-3 mt-3">
              <Link
                className="btn"
                to={`/titulo/${item.media.type}/${item.media.id}`}
              >
                Abrir ficha para continuar
              </Link>
              <button
                className="btn"
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  try {
                    await call(`/profiles/${profile.id}/history/${key}`, {
                      method: "DELETE",
                    });
                    await refresh();
                  } catch (e) {
                    setError((e as Error).message);
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                Quitar del historial
              </button>
            </div>
          </article>
        ))}
      </div>
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
import { Player } from "./Player";
import { History } from "./History";
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
          <Link to="/historial">Historial</Link>
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
                    <Player media={media} />
                  </>
                )}
              />
            }
          />
          <Route path="/acceso" element={<Access />} />
          <Route path="/perfiles" element={<Profiles />} />
          <Route path="/mi-lista" element={<Favorites />} />
          <Route path="/historial" element={<History />} />
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

**Resultado esperado:** Abre un título con tráiler disponible. Pulsa Ver tráiler y después el control de reproducción de YouTube. Reproduce 20 segundos, PAUSA y espera el mensaje Guardado. Cierra el tráiler, abre Historial y vuelve a la ficha. Debe ofrecer Continuar desde la última posición guardada. Desde el inicio permite reiniciar.

## Paso 6 — Ejercicio corto

Abre el mismo tráiler con el mismo perfil en dos pestañas. Si hay conflicto, el player muestra aviso y detiene escrituras. Cierra y abre de nuevo para refrescar la versión. Si YouTube bloquea el embed, prueba otro título; el enlace externo no registra historial.

## Paso 7 — Cerrar la etapa

Guarda una captura o nota del resultado. Antes de continuar, revisa cambios:

```bash
git status
git add .
git commit -m "feat: cineflow etapa 7"
```

No agregues `.env` ni cuentas de servicio. La regla .gitignore de instalación protege .env y secrets/. Un archivo privado fuera del proyecto tampoco debe copiarse dentro para hacer commit.

**Si falla:** revisa la terminal del backend y la pestaña Network del navegador. Si faltan módulos, ejecuta npm install desde la raíz. Si cambiaste .env, reinicia npm run dev. No continúes si no puedes reproducir el resultado esperado.

---

<!-- navigation:start -->

[← Anterior](./14-frontend-etapa-06.md) | [Índice CineFlow](./README.md) | [Siguiente →](./16-frontend-etapa-08.md)

[🏠 Índice general](../../README.md)

<!-- navigation:end -->
