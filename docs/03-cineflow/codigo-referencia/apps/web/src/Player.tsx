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
