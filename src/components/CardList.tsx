import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCardsByUserId, type Card } from '../api';
import './CardList.css';

function CardList() {
  const { id: userId } = useParams<{ id: string }>();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const getCards = async () => {
      try {
        setLoading(true);
        // La API devuelve un array de objetos con `_id`.
        const dataFromApi: any[] = await fetchCardsByUserId(userId);
        // Mapeamos cada tarjeta para que tenga la propiedad `id`, usando `id` si existe, o `_id` como fallback.
        const formattedCards = dataFromApi.map(card => ({ ...card, id: card.id || card._id }));
        setCards(formattedCards);
        setError(null);
      } catch (err) {
        setError(`Ocurrió un error al obtener las tarjetas del usuario ${userId}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getCards();
  }, [userId]);

  if (loading) return <p>Cargando tarjetas...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="card-list-container">
      <div className="card-list-header">
        <h1>Tarjetas del Usuario</h1>
        <Link to={`/users/${userId}/cards/new`} className="create-card-button">Crear Tarjeta</Link>
      </div>
      {cards.length > 0 ? (
        <div className="cards-grid">
        {cards.map((card) => (
            <Link to={`/cards/${card.id}`} key={card.id} className="card-item-link">
              <div className="card-item">
                <h2>{card.title}</h2>
                <p>{card.description}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p>Este usuario no tiene tarjetas.</p>
      )}
      <Link to={`/users/${userId}`} className="back-link">← Volver al perfil</Link>
    </div>
  );
}

export default CardList;