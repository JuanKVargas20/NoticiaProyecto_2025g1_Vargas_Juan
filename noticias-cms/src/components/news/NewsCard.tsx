import React from "react";
import "./NewsCard.css";
import useAuth from "../../hooks/useAuth";
import { updateNewsStatus } from "../../services/news";

type Props = {
  noticia: any;
  onEdit?: (id: string, initial?: any) => void;
  onPublish?: (item: any) => void;
  onDeactivate?: (item: any) => void;
};

const NewsCard: React.FC<Props> = ({ noticia, onEdit, onPublish, onDeactivate }) => {
  const { hasRole, user } = useAuth();
  const rawEstado = String(noticia?.estado ?? "");
  // normaliza (quita acentos, pasa a minúsculas y trim)
  const estadoNormalized = rawEstado
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
  const estado = noticia.estado ?? "Edición";

  const isIncomplete = !(
    noticia &&
    (noticia.titulo || noticia.title) &&
    (noticia.contenido || noticia.content) &&
    (noticia.autor || noticia.author)
  );

  const formatDate = (v: any) => {
    if (!v) return "";
    if (typeof v.toDate === "function") return v.toDate().toLocaleString();
    const d = new Date(v);
    return isNaN(d.getTime()) ? String(v) : d.toLocaleString();
  };

  const internalPublish = async () => {
    try {
      await updateNewsStatus(noticia.id, "Publicado");
    } catch (err) {
      console.error(err);
    }
  };
  const internalDeactivate = async () => {
    try {
      await updateNewsStatus(noticia.id, "Desactivado");
    } catch (err) {
      console.error(err);
    }
  };

  const handlePublish = () => {
    if (isIncomplete) return;
    if (onPublish) return onPublish(noticia);
    return internalPublish();
  };
  const handleDeactivate = () => {
    if (onDeactivate) return onDeactivate(noticia);
    return internalDeactivate();
  };

  const canEdit =
    hasRole("editor") || (user && user.uid && user.uid === noticia.uid);

  // clase según estado (ajusta los strings si tu campo usa otro valor)
  const stateClass =
    estadoNormalized.includes("edicion") || estadoNormalized.includes("edit")
      ? "status-edicion"
      : estadoNormalized.includes("public") || estadoNormalized.includes("publicado")
      ? "status-publicado"
      : "status-desactivado";

  return (
    <article className={`news-card ${stateClass}`}>
      {noticia.imageURL && (
        <div className="card-image-wrap">
          <img className="card-image" src={noticia.imageURL} alt={noticia.titulo ?? ""} />
        </div>
      )}

      <div className="card-body">
        <h2>{noticia.titulo ?? "Sin título"}</h2>
        {noticia.subtitulo && <h4 className="card-subtitle">{noticia.subtitulo}</h4>}
        <p>{noticia.contenido ?? ""}</p>

        <div className="card-meta">
          <span>Por: {noticia.autor ?? noticia.author ?? "Anónimo"}</span>
          <span>{formatDate(noticia.fechaCreacion)}</span>
          <span>Estado: {estado}</span>
        </div>

        <div className="card-actions">
          {canEdit && (
            <>
              {estado !== "Publicado" && (
                <button
                  className="btn action-publish"
                  onClick={handlePublish}
                  disabled={isIncomplete}
                  title={isIncomplete ? "Noticia incompleta: no se puede publicar" : "Publicar"}
                >
                  Publicar
                </button>
              )}
              {estado === "Publicado" && (
                <button
                  className="btn action-deactivate"
                  onClick={handleDeactivate}
                >
                  Desactivar
                </button>
              )}

              {/* Restaurado: botón Editar como antes (usa onEdit si se pasa) */}
              <button
                className="btn action-edit"
                onClick={() => onEdit?.(noticia.id, noticia)}
                disabled={isIncomplete}
                title={isIncomplete ? "Noticia incompleta: no se puede editar" : "Editar"}
              >
                Editar
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
};

export default NewsCard;