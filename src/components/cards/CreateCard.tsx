import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
  import { createCard } from '../../api';
import './CreateCard.css';

function CreateCard() {
  const { _id: userId } = useParams<{ _id: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!userId) {
      setError('No se ha especificado un ID de usuario.');
      return;
    }
    if (!title.trim()) {
      setError('El título es obligatorio.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createCard({
        title,
        description,
        user_id: userId,
      });
      // Redirige a la lista de tarjetas del usuario si la creación es exitosa
      navigate(`/users/${userId}/cards`);
    } catch (err: any) {
      // Este bloque se ejecuta si la API devuelve un error o si hay un problema al procesar la respuesta.
      console.error('Detalles del error:', err);
      if (err instanceof SyntaxError) {
        // Este error ocurre si el backend devuelve una respuesta vacía o no-JSON.
        setError('La creación fue exitosa, pero hubo un error al procesar la respuesta del servidor.');
      } else {
        setError('Error al crear la tarjeta. Por favor, inténtalo de nuevo.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-card-container">
      <form onSubmit={handleSubmit} className="create-card-form">
        <h2>Crear Nueva Tarjeta</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label htmlFor="title">Título</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            disabled={loading}
          />
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Creando...' : 'Crear'}
        </button>
        <Link to={`/users/${userId}/cards`} className="back-link">Volver a las tarjetas</Link>
      </form>
    </div>
  );
}

export default CreateCard;
// ...mueve el contenido de CreateCard.tsx aquí...
