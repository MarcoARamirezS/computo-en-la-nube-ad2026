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
