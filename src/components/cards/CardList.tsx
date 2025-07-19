import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCardsByUserId, type Card } from '../../api/cards';
import InlineCardEdit from './InlineCardEdit';
import './CardList.css';

function CardList() {
  const { _id: userId } = useParams<{ _id: string }>();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const getCards = async () => {
      try {
        setLoading(true);
        const dataFromApi: any[] = await fetchCardsByUserId(userId);
        const formattedCards = dataFromApi.map((card: any) => ({ ...card, id: card.id || card._id }));
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

  const handleDelete = async (cardId: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta tarjeta?')) return;
    try {
      setCards((prev: Card[]) => prev.filter((card: Card) => card.id !== cardId));
    } catch (err) {
      alert('Error al eliminar la tarjeta');
      console.error(err);
    }
  };

  const startEditing = (card: Card) => {
    setEditingId(card.id);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const saveEdit = (cardId: string, title: string, description: string) => {
    setCards((prev: Card[]) =>
      prev.map((card: Card) =>
        card.id === cardId ? { ...card, title, description } : card
      )
    );
    setEditingId(null);
  };

  return (
    <div className="card-list-container">
      <div className="card-list-header">
        <h1>Tarjetas del Usuario</h1>
        <Link to={`/users/${userId}/cards/new`} className="create-card-button">Crear Tarjeta</Link>
      </div>
      {cards.length > 0 ? (
        <div className="cards-grid">
          {cards.map((card: Card) => (
            <div key={card.id} className="card-item" style={{ position: 'relative' }}>
              <button
                className="delete-card-btn"
                style={{ position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', cursor: 'pointer', zIndex: 2 }}
                title="Eliminar tarjeta"
                onClick={() => handleDelete(card.id)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m5 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
              </button>
              {/* Botón editar */}
              <button
                className="edit-card-btn"
                style={{ position: 'absolute', top: 8, left: 8, background: 'none', border: 'none', cursor: 'pointer', zIndex: 2 }}
                title="Editar tarjeta"
                onClick={() => startEditing(card)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                </svg>
              </button>
              {/* Edición inline desde componente externo */}
              {editingId === card.id ? (
                <InlineCardEdit
                  card={card}
                  onSave={saveEdit}
                  onCancel={cancelEditing}
                />
              ) : (
                <Link to={`/cards/${card.id}`} className="card-item-link" style={{ display: 'block' }}>
                  <h2>{card.title}</h2>
                  <p>{card.description}</p>
                </Link>
              )}
            </div>
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
