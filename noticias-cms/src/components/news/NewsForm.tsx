import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import './NewsForm.css';

interface NewsFormProps {
  initial?: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel?: () => void;
}

const CATEGORIAS = [
  'Tecnología',
  'Política',
  'Deportes',
];

const NewsForm: React.FC<NewsFormProps> = ({ initial, onSubmit, onCancel }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    titulo: initial?.titulo || '',
    subtitulo: initial?.subtitulo || '',
    contenido: initial?.contenido || '',
    categoria: initial?.categoria || CATEGORIAS[0],
    imageURL: initial?.imageURL || '',
    autor: initial?.autor || user?.displayName || '',
    estado: initial?.estado || 'Edición'
  });

  // -> Añadido: sincronizar al cambiar initial (cuando se edita)
  useEffect(() => {
    setFormData({
      titulo: initial?.titulo || '',
      subtitulo: initial?.subtitulo || '',
      contenido: initial?.contenido || '',
      categoria: initial?.categoria || CATEGORIAS[0],
      imageURL: initial?.imageURL || '',
      autor: initial?.autor || user?.displayName || '',
      estado: initial?.estado || 'Edición'
    });
  }, [initial, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!formData.titulo.trim()) {
        throw new Error('El título es obligatorio');
      }
      if (!formData.contenido.trim()) {
        throw new Error('El contenido es obligatorio');
      }
      if (!formData.autor.trim()) {
        throw new Error('El autor es obligatorio');
      }

      const now = new Date().toISOString();
      const payload = {
        ...formData,
        fechaCreacion: initial?.fechaCreacion || now,
        fechaActualizacion: now
      };

      await onSubmit(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar la noticia');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Cerrar solo si el padre provee onCancel (como el comportamiento de "Cerrar" en creación).
    if (typeof onCancel === "function") {
      onCancel();
      return;
    }
    // Si no hay onCancel, no hacemos nada (evita navegar al login u otras rutas).
    // Opcional: mostrar advertencia en consola para detectar usos que requieren onCancel.
    console.warn("NewsForm: onCancel no proporcionado — no se realizará navegación.");
  };

  return (
    <form onSubmit={handleSubmit} className="news-form">
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="titulo">Título *</label>
        <input
          id="titulo"
          name="titulo"
          type="text"
          value={formData.titulo}
          onChange={handleChange}
          required
          placeholder="Título de la noticia"
        />
      </div>

      <div className="form-group">
        <label htmlFor="subtitulo">Subtítulo</label>
        <input
          id="subtitulo"
          name="subtitulo"
          type="text"
          value={formData.subtitulo}
          onChange={handleChange}
          placeholder="Subtítulo o bajada de la noticia"
        />
      </div>

      <div className="form-group">
        <label htmlFor="categoria">Categoría *</label>
        <select
          id="categoria"
          name="categoria"
          value={formData.categoria}
          onChange={handleChange}
          required
        >
          {CATEGORIAS.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="imageURL">URL de la imagen</label>
        <input
          id="imageURL"
          name="imageURL"
          type="url"
          value={formData.imageURL}
          onChange={handleChange}
          placeholder="https://ejemplo.com/imagen.jpg"
        />
      </div>

      <div className="form-group">
        <label htmlFor="autor">Autor *</label>
        <input
          id="autor"
          name="autor"
          type="text"
          value={formData.autor}
          onChange={handleChange}
          required
          placeholder="Nombre del autor"
        />
      </div>

      <div className="form-group">
        <label htmlFor="contenido">Contenido *</label>
        <textarea
          id="contenido"
          name="contenido"
          value={formData.contenido}
          onChange={handleChange}
          required
          rows={6}
          placeholder="Contenido de la noticia"
        />
      </div>

      <div className="form-actions">
        <button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : initial ? 'Actualizar' : 'Crear'}
        </button>

        <button
          type="button"
          className="btn-cancel"
          onClick={handleCancel}
          disabled={loading}
        >
          Volver sin cambios
        </button>
      </div>
    </form>
  );
};

export default NewsForm;