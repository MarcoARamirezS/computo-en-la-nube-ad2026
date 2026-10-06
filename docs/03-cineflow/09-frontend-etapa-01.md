# Frontend 1 — Crear la interfaz

<!-- navigation:start -->

[← Anterior](./05-backend-completo.md) | [Índice CineFlow](./README.md) | [Siguiente →](./10-frontend-etapa-02.md)

[🏠 Índice general](../../README.md)

<!-- navigation:end -->

**Meta:** crear la interfaz.

**Antes de comenzar:** Terminaste el backend y /health responde. Hoy no conectamos consultas ni cuentas.

## Paso 1 — Qué estás construyendo

Un componente es una función que devuelve JSX. React repite tarjetas mediante map; cada tarjeta tiene una key estable. Tailwind aplica clases como p-10, text-4xl o grid. El CSS común define colores y botones para que no tengas que diseñar cada pantalla desde cero.

## Paso 2 — Abrir la carpeta correcta

Trabaja en `cineflow-v2`, la aplicación. Conserva todos los archivos de las etapas anteriores. Si `npm run dev` está abierto, puedes dejarlo funcionando mientras guardas los cambios; espera a terminar todos los archivos de esta etapa antes de revisar errores transitorios.

## Paso 3 — Copiar los archivos de esta etapa


### Archivo: `apps/web/src/styles.css`

**Acción:** crear el archivo si no existe; si existe, reemplazar TODO su contenido por lo siguiente. Guardar antes de continuar.

```css
@import "tailwindcss";
:root {
  font-family: system-ui, sans-serif;
  color: #f8fafc;
  background: #0b0f19;
  color-scheme: dark;
}
body {
  margin: 0;
}
* {
  box-sizing: border-box;
}
a {
  color: inherit;
}
button,
input,
select {
  font: inherit;
}
button,
a,
input,
select {
  outline-offset: 4px;
}
button:focus-visible,
a:focus-visible,
input:focus-visible,
select:focus-visible {
  outline: 3px solid #fde047;
}
button {
  cursor: pointer;
}
button:disabled {
  opacity: 0.5;
  cursor: wait;
}
input,
select {
  border: 1px solid #64748b;
  background: #161d2b;
  color: white;
  padding: 0.75rem;
  border-radius: 0.6rem;
  max-width: 100%;
}
label {
  display: grid;
  gap: 0.4rem;
}
nav {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
}
.btn {
  display: inline-block;
  padding: 0.75rem 1rem;
  border: 1px solid #64748b;
  border-radius: 0.7rem;
  background: #172033;
  color: white;
  text-decoration: none;
  min-height: 44px;
}
.primary {
  background: #fb7185;
  color: #160811;
  border: 0;
  font-weight: 700;
}
.wrap {
  max-width: 1180px;
  margin: auto;
  padding: 1.25rem;
}
.panel {
  background: #161d2b;
  border: 1px solid #334155;
  border-radius: 1rem;
  padding: 1.25rem;
}
.grid-media {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
}
.poster {
  aspect-ratio: 2/3;
  background: linear-gradient(135deg, #1e3a5f, #74284e);
  display: grid;
  place-items: center;
  overflow: hidden;
  border-radius: 0.75rem;
}
.poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.error {
  padding: 1rem;
  border: 1px solid #fb7185;
  background: #421e2b;
  border-radius: 0.7rem;
}
.muted {
  color: #cbd5e1;
}
.skip {
  position: absolute;
  top: -100px;
}
.skip:focus {
  top: 0;
  z-index: 5;
  background: #0b0f19;
  padding: 1rem;
}
h1 {
  font-size: clamp(1.8rem, 4vw, 3rem);
  font-weight: 800;
}
h2 {
  font-size: 1.4rem;
  font-weight: 700;
}
p {
  margin: 0.8rem 0;
}
main {
  min-height: 65vh;
}
form {
  display: grid;
  gap: 1rem;
}
button + button {
  margin-left: 0.5rem;
}
iframe {
  width: 100%;
  height: clamp(220px, 50vw, 520px);
  border: 0;
}
progress {
  width: 100%;
  accent-color: #fb7185;
}
@media (prefers-reduced-motion: reduce) {
  * {
    scroll-behavior: auto !important;
  }
}
```

## Paso 4 — Reemplazar App.tsx

Este es el archivo COMPLETO para esta etapa. Conecta las pantallas que ya existen; no debes combinar fragmentos manualmente.

### Archivo: `apps/web/src/App.tsx`

**Acción:** crear el archivo si no existe; si existe, reemplazar TODO su contenido por lo siguiente. Guardar antes de continuar.

```tsx
export default function App() {
  return (
    <main className="wrap">
      <p className="text-rose-300 font-bold">CINEFLOW · ETAPA 1</p>
      <section className="panel">
        <h1>Tu próxima historia comienza aquí</h1>
        <p>Películas, series y tráilers. Primero construimos la interfaz.</p>
      </section>
      <h2 className="my-6">Nuestro catálogo de práctica</h2>
      <div className="grid-media">
        {["Órbita Azul", "La Última Estación", "Código Aurora"].map((title) => (
          <article className="panel" key={title}>
            <div className="poster">
              <span className="text-5xl">▶</span>
            </div>
            <h2 className="mt-4 text-lg">{title}</h2>
          </article>
        ))}
      </div>
      <p className="muted">
        Datos inventados para aprender. En la etapa 2 conectamos el backend.
      </p>
    </main>
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

**Resultado esperado:** Abrir http://localhost:5173. Debes ver tres tarjetas inventadas y el encabezado de CineFlow. Reduce la ventana: las columnas se acomodan sin salir de la pantalla.

## Paso 6 — Ejercicio corto

Cambia el texto del encabezado y agrega un cuarto título al array. Comprueba que se crea otra tarjeta sin duplicar el JSX.

## Paso 7 — Cerrar la etapa

Guarda una captura o nota del resultado. Antes de continuar, revisa cambios:

```bash
git status
git add .
git commit -m "feat: cineflow etapa 1"
```

No agregues `.env` ni cuentas de servicio. La regla .gitignore de instalación protege .env y secrets/. Un archivo privado fuera del proyecto tampoco debe copiarse dentro para hacer commit.

**Si falla:** revisa la terminal del backend y la pestaña Network del navegador. Si faltan módulos, ejecuta npm install desde la raíz. Si cambiaste .env, reinicia npm run dev. No continúes si no puedes reproducir el resultado esperado.

---

<!-- navigation:start -->

[← Anterior](./05-backend-completo.md) | [Índice CineFlow](./README.md) | [Siguiente →](./10-frontend-etapa-02.md)

[🏠 Índice general](../../README.md)

<!-- navigation:end -->
