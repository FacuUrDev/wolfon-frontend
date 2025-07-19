import { useState } from 'react';
import { updateCard, type Card } from '../../api/cards';

interface InlineCardEditProps {
  card: Card;
  onSave: (cardId: string, title: string, description: string) => void;
  onCancel: () => void;
}

function InlineCardEdit({ card, onSave, onCancel }: InlineCardEditProps) {
  const [editTitle, setEditTitle] = useState(card.title || '');
  const [editDescription, setEditDescription] = useState(card.description || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateCard(card.id, { title: editTitle, description: editDescription });
      onSave(card.id, editTitle, editDescription);
    } catch (err) {
      alert('Error al editar la tarjeta');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-edit-form">
      <input
        type="text"
        value={editTitle}
        onChange={e => setEditTitle(e.target.value)}
        placeholder="Título"
        disabled={loading}
      />
      <input
        type="text"
        value={editDescription}
        onChange={e => setEditDescription(e.target.value)}
        placeholder="Descripción"
        disabled={loading}
      />
      <button onClick={handleSave} disabled={loading}>Guardar</button>
      <button onClick={onCancel} disabled={loading}>Cancelar</button>
    </div>
  );
}

export default InlineCardEdit;
