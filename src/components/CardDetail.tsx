import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCardById, type Card } from '../api';
import './CardDetail.css';

function CardDetail() {
  const { id } = useParams<{ id: string }>();
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const getCard = async () => {
      try {
        setLoading(true);
        // La API devuelve un objeto con `_id`, lo casteamos a `any` para poder accederlo.
        const dataFromApi: any = await fetchCardById(id);
        // Agregamos un console.log para depurar el objeto recibido
        console.log('Datos de la tarjeta recibidos:', dataFromApi);
        // Mapeamos `_id` a `id` para que sea consistente, usando `id` si existe, o `_id` como fallback.
        setCard({ ...dataFromApi, id: dataFromApi.id || dataFromApi._id });
        setError(null);
      } catch (err: any) {
        // Diferenciamos el error 404 de otros posibles errores.
        if (err.response && err.response.status === 404) {
          setError(`La tarjeta con ID: ${id} no fue encontrada. Por favor, verifica que el ID es correcto.`);
        } else {
          // Para otros errores (red, error del servidor, etc.)
          setError('Ocurrió un error al cargar los detalles de la tarjeta.');
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getCard();
  }, [id]);

  if (loading) return <p>Cargando detalles de la tarjeta...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="card-detail-container">
      <div className="card-detail-card">
        <h1>Detalles de Tarjeta</h1>
        <p><strong>ID Usuario:</strong> {card?.user_id}</p>
        <p><strong>ID Tarjeta:</strong> {card?.id}</p>
        <p><strong>Titulo:</strong> {card?.title}</p>
        <p><strong>Descripción:</strong> {card?.description}</p>
        {/* El enlace ahora vuelve al perfil del usuario dueño de la tarjeta */}
        <Link to={`/users/${card?.user_id}`} className="back-link">← Volver al perfil</Link>
      </div>
    </div>
  );
}

export default CardDetail;