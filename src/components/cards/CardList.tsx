import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCardsByUserId, deleteCard, type Card } from '../../api/cards';
import { fetchUserById, type User } from '../../api/users';
import InlineCardEdit from './InlineCardEdit';
import './CardList.css';

type SortField = 'created_at' | 'updated_at' | 'title';
type SortOrder = 'asc' | 'desc';

function CardList() {
  const { _id: userId } = useParams<{ _id: string }>();
  const [cards, setCards] = useState<Card[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
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
    const getUser = async () => {
      try {
        const userData = await fetchUserById(userId);
        setUser(userData);
      } catch (err) {
        setUser(null);
      }
    };
    getCards();
    getUser();
  }, [userId]);

  const handleDelete = async (cardId: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta tarjeta?')) return;
    try {
      await deleteCard(cardId);
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

  // Función de ordenamiento
  const sortedCards = [...cards].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    if (sortField === 'title') {
      aValue = (aValue || '').toLowerCase();
      bValue = (bValue || '').toLowerCase();
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    } else {
      // Para fechas, convierte a Date si es string
      const aDate = aValue ? new Date(aValue) : new Date(0);
      const bDate = bValue ? new Date(bValue) : new Date(0);
      return sortOrder === 'asc' ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime();
    }
  });

  return (
    <div className="card-list-container">
      <div className="card-list-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <h1>Tarjetas del Usuario{user ? `: ${user.name}` : ''}</h1>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to={`/users/${userId}/cards/new`} className="create-card-button">Crear Tarjeta</Link>
          <Link to="/cards/templates" className="edit-templates-button" style={{ background: '#1976d2', color: '#fff', padding: '8px 16px', borderRadius: 6, textDecoration: 'none', fontWeight: 500 }}>Editar plantillas</Link>
        </div>
      </div>
      <div style={{ margin: '16px 0', display: 'flex', gap: 16, alignItems: 'center' }}>
        <label>
          Ordenar por:
          <select value={sortField} onChange={e => setSortField(e.target.value as SortField)} style={{ marginLeft: 8 }}>
            <option value="created_at">Fecha de creación</option>
            <option value="updated_at">Fecha de modificación</option>
            <option value="title">Título (A-Z)</option>
          </select>
        </label>
        <button onClick={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')} style={{ marginLeft: 8 }}>
          {sortOrder === 'asc' ? 'Ascendente ↑' : 'Descendente ↓'}
        </button>
      </div>
      {sortedCards.length > 0 ? (
        <div className="cards-grid">
          {sortedCards.map((card: Card) => (
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
                style={{ position: 'absolute', bottom: 8, right: 8, background: '#43a047', border: 'none', cursor: 'pointer', zIndex: 2, borderRadius: '50%', padding: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Editar tarjeta"
                onClick={() => startEditing(card)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                  {/* Visualización de atributos adicionales */}
                  <table className="card-attr-table">
                    <tbody>
                      {Object.entries(card)
                        .filter(([key]) => !['id', '_id', 'title', 'description', 'user_id', 'created_at', 'updated_at', '__v'].includes(key))
                        .map(([key, value]) => (
                          <tr key={key}>
                            <td className="attr-key">{key}</td>
                            <td>
                              <span className={
                                key === 'precio' || key === 'kg' || key === 'stock' ? 'badge badge-num' :
                                key === 'vencimiento' ? 'badge badge-date' :
                                'badge'
                              }>
                                {value}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
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
