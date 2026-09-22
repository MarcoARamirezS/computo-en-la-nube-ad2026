import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { useData } from "./useData";
import type { Media } from "./types";
export function Detail({ extra }: { extra?: (media: Media) => ReactNode }) {
  const { type, id } = useParams();
  const { data, error, loading } = useData<Media>(`/catalog/${type}/${id}`);
  if (loading) return <p role="status">Cargando ficha…</p>;
  if (error || !data)
    return (
      <p className="error" role="alert">
        {error || "No disponible"}
      </p>
    );
  return (
    <section className="panel">
      <Link to="/">← Catálogo</Link>
      <h1>{data.title}</h1>
      <div className="grid gap-6 md:grid-cols-[220px_1fr]">
        <div className="poster">
          {data.poster ? (
            <img src={data.poster} alt={`Cartel de ${data.title}`} />
          ) : (
            <span>Sin cartel</span>
          )}
        </div>
        <div>
          <p>{data.overview}</p>
          <p className="muted">
            {data.type === "movie" ? "Película" : "Serie"} · La reproducción
            corresponde a tráilers.
          </p>
          {extra?.(data)}
        </div>
      </div>
    </section>
  );
}
