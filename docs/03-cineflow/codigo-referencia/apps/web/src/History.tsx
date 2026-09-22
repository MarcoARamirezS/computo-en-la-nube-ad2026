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
