// API de tarjetas
export interface Card {
  id: string;
  title: string;
  description: string;
  user_id: string;
}

export async function fetchCardById(id: string): Promise<Card> {
  const response = await fetch(`/api/cards/${id}`);
  if (!response.ok) {
    const errorInfo = await response.text();
    throw new Error(`Error ${response.status}: ${response.statusText}. ${errorInfo}`);
  }
  return response.json();
}

/**
 * Obtiene todas las tarjetas de un usuario específico desde el backend.
 * @param userId - El ID del usuario.
 */
export async function fetchCardsByUserId(userId: string): Promise<Card[]> {
  const response = await fetch(`/api/users/list_cards/${userId}`);
  if (!response.ok) {
    const errorInfo = await response.text();
    throw new Error(`Error ${response.status}: ${response.statusText}. ${errorInfo}`);
  }
  return response.json();
}

/**
 * Crea una nueva tarjeta en el backend.
 * @param card - Objeto con los datos de la tarjeta.
 */
export async function createCard(card: Omit<Card, "id">): Promise<Card> {
  const response = await fetch('/api/cards', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(card),
  });
  if (!response.ok) {
    const errorInfo = await response.text();
    throw new Error(`Error ${response.status}: ${response.statusText}. ${errorInfo}`);
  }
  return response.json();
}

/**
 * Edita una tarjeta por su ID en el backend.
 * @param id - El ID de la tarjeta a editar.
 * @param card - Objeto con los datos actualizados de la tarjeta.
 */
export async function updateCard(id: string, card: Partial<Omit<Card, 'id'>>): Promise<void> {
  const response = await fetch(`/api/cards/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(card),
  });
  if (!response.ok) {
    const errorInfo = await response.text();
    throw new Error(`Error ${response.status}: ${response.statusText}. ${errorInfo}`);
  }
}

/**
 * Elimina una tarjeta por su ID en el backend.
 * @param id - El ID de la tarjeta a eliminar.
 */
export async function deleteCard(id: string): Promise<void> {
  const response = await fetch(`/api/cards/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorInfo = await response.text();
    throw new Error(`Error ${response.status}: ${response.statusText}. ${errorInfo}`);
  }
}
