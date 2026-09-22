import { Link, useSearchParams } from "react-router-dom";
import { useData } from "./useData";
import type { Media } from "./types";
export function Card({ media }: { media: Media }) {
  return (
    <article className="panel">
      <Link to={`/titulo/${media.type}/${media.id}`}>
        <div className="poster">
          {media.poster ? (
            <img
              src={media.poster}
              alt=""
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <span aria-hidden="true" className="text-5xl">
              ▶
            </span>
          )}
        </div>
        <h2 className="mt-3 text-lg">{media.title}</h2>
      </Link>
      <p className="muted">{media.type === "movie" ? "Película" : "Serie"}</p>
    </article>
  );
}
export function Catalog() {
  const [params, setParams] = useSearchParams();
  const type = params.get("tipo") === "tv" ? "tv" : "movie";
  const q = params.get("q") || "";
  const page = Math.max(1, Number(params.get("pagina")) || 1);
  const { data, error, loading, reload } = useData<Media[]>(
    `/catalog?type=${type}&q=${encodeURIComponent(q)}&page=${page}`,
  );
  return (
    <>
      <section className="panel mb-6">
        <p className="text-rose-300">DESCUBRE TU PRÓXIMA HISTORIA</p>
        <h1>CineFlow</h1>
        <p>
          Explora películas y series. Guarda tus favoritas y descubre sus
          tráilers.
        </p>
      </section>
      <form
        className="panel mb-6"
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          setParams({
            tipo: String(f.get("tipo")),
            q: String(f.get("q")),
            pagina: "1",
          });
        }}
      >
        <label>
          Buscar por título
          <input
            key={q}
            name="q"
            defaultValue={q}
            maxLength={100}
            placeholder="Ejemplo: Órbita"
          />
        </label>
        <label>
          Tipo
          <select key={type} name="tipo" defaultValue={type}>
            <option value="movie">Películas</option>
            <option value="tv">Series</option>
          </select>
        </label>
        <button className="btn primary">Buscar</button>
      </form>
      {loading ? (
        <p role="status">Cargando catálogo…</p>
      ) : error ? (
        <div className="error" role="alert">
          {error}{" "}
          <button className="btn" onClick={reload}>
            Reintentar
          </button>
        </div>
      ) : (
        <>
          <div className="grid-media">
            {data?.map((m) => (
              <Card key={`${m.type}_${m.id}`} media={m} />
            ))}
          </div>
          {data?.length === 0 && <p>No hay resultados. Prueba otro título.</p>}
          <nav className="mt-6">
            <button
              className="btn"
              disabled={page <= 1}
              onClick={() =>
                setParams({ tipo: type, q, pagina: String(page - 1) })
              }
            >
              Anterior
            </button>
            <span>Página {page}</span>
            <button
              className="btn"
              disabled={!data?.length || page >= 500}
              onClick={() =>
                setParams({ tipo: type, q, pagina: String(page + 1) })
              }
            >
              Siguiente
            </button>
          </nav>
        </>
      )}
    </>
  );
}
