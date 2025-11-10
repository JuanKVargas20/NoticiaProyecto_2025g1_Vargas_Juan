import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import NewsCard from "../components/news/NewsCard";
import NewsForm from "../components/news/NewsForm";
import { createNews, getPublishedNews, subscribeNewsForUser, updateNews } from "../services/news";
import "./Dashboard.css";

const Dashboard: React.FC = () => {
  const { user, hasRole, loading, roles, primaryRole } = useAuth();
  const [noticias, setNoticias] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // state que controla qué noticia se está editando / si el panel está abierto
  const [editing, setEditing] = useState<any | null>(null);
  const openEditor = (noticia: any) => setEditing(noticia);
  const closeEditor = () => setEditing(null);

  // Estados para controlar el formulario/editor (restaurados)
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingInitial, setEditingInitial] = useState<any | null>(null);

  useEffect(() => {
    if (loading) return;
    const role = primaryRole ?? (roles[0] ?? "usuario");

    let unsub: (() => void) | null = null;

    if (role === "editor" || role === "reportero") {
      unsub = subscribeNewsForUser(user?.uid, role, setNoticias) as () => void;
    } else {
      (async () => {
        try {
          const items = await getPublishedNews();
          setNoticias(items);
        } catch (err: any) {
          setError(String(err?.message ?? err));
        }
      })();
    }

    return () => { if (unsub) unsub(); };
  }, [user, loading, roles, primaryRole]);

  if (loading) return <div>Cargando...</div>;

  const isEditor = hasRole("editor");
  const isReportero = hasRole("reportero");

  // Abrir/ cerrar creación
  const handleOpenCreate = () => {
    if (showForm) {
      // cerrar
      setShowForm(false);
      setEditingId(null);
      setEditingInitial(null);
    } else {
      // abrir creación (sin inicial)
      setEditingId(null);
      setEditingInitial(undefined);
      setShowForm(true);
    }
  };

  // Abrir editor para una noticia existente
  const handleEdit = (id: string, initial: any) => {
    setEditingId(id);
    setEditingInitial(initial);
    setShowForm(true);
  };

  // Cerrar editor (onCancel) — usado por NewsForm para "Volver sin cambios"
  const handleCloseEditor = () => {
    setShowForm(false);
    setEditingId(null);
    setEditingInitial(null);
  };

  const handleSubmit = async (payload: any) => {
    try {
      if (!user) return;
      if (editingId) {
        await updateNews(editingId, payload);
      } else {
        await createNews({
          ...payload,
          uid: user.uid,
          autor: payload.autor || user.displayName || user.email || "Anónimo",
          categoria: payload.categoria || "General",
          estado: payload.estado || "Edición"
        });
      }
      setShowForm(false);
      setEditingId(null);
      setEditingInitial(null);
      if (!isEditor && !isReportero) {
        const items = await getPublishedNews();
        setNoticias(items);
      }
    } catch (err) {
      console.error("Error guardando noticia:", err);
      setError(String((err as any)?.message ?? err));
    }
  };

  return (
    <main className="dashboard-page">
      <h1 className="dashboard-title">Dashboard</h1>
      <p className="dashboard-subtitle">{isEditor ? "Vista Editor" : isReportero ? "Vista Reportero" : "Vista Usuario"}</p>
      {error && <div className="error-box">{error}</div>}

      {isReportero && (
        <div style={{ marginBottom: 16 }}>
          <button className="btn" onClick={handleOpenCreate}>{showForm ? "Cerrar" : "Crear noticia"}</button>
        </div>
      )}

      {showForm && (isReportero || isEditor) && (
        <div className="container" style={{ marginBottom: 16 }}>
          <NewsForm initial={editingInitial} onSubmit={handleSubmit} onCancel={handleCloseEditor} />
        </div>
      )}

      {/* Siempre renderizamos el grid; si el formulario está abierto lo atenuamos con la clase 'dimmed' */}
      <section className={`news-grid ${showForm ? "dimmed" : ""}`}>
        {noticias.length === 0 ? (
          <div>No hay noticias para mostrar.</div>
        ) : (
          noticias.map(n => <NewsCard key={n.id} noticia={n} onEdit={handleEdit} />)
        )}
      </section>
    </main>
  );
};

export default Dashboard;