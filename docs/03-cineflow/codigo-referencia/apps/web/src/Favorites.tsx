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
