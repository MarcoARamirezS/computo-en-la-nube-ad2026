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
