// API de tarjetas
export interface Card {
  id: string;
  title: string;
  description: string;
  user_id: string;
  [key: string]: any;
}

export async function fetchCardById(id: string): Promise<Card> {
  const response = await fetch(`/cards/${id}`);
  if (!response.ok) {
    const errorInfo = await response.text();
    throw new Error(`Error ${response.status}: ${response.statusText}. ${errorInfo}`);
  }
  const data = await response.json();
  // Asegura que el campo id esté presente
  return { ...data, id: data.id || data._id };
}

/**
 * Obtiene todas las tarjetas de un usuario específico desde el backend.
 * @param userId - El ID del usuario.
 */
export async function fetchCardsByUserId(userId: string): Promise<Card[]> {
  const response = await fetch(`/users/list_cards/${userId}`);
  if (!response.ok) {
    const errorInfo = await response.text();
    throw new Error(`Error ${response.status}: ${response.statusText}. ${errorInfo}`);
  }
  const data = await response.json();
  // Asegura que cada tarjeta tenga el campo id
  return data.map((card: any) => ({ ...card, id: card.id || card._id }));
}

/**
 * Crea una nueva tarjeta en el backend.
 * @param card - Objeto con los datos de la tarjeta.
 */
export async function createCard(card: Omit<Card, "id">): Promise<Card> {
  // Enviar todos los campos recibidos, permitiendo campos dinámicos
  const response = await fetch('/cards', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(card),
  });
  if (!response.ok) {
    const errorInfo = await response.text();
    throw new Error(`Error ${response.status}: ${response.statusText}. ${errorInfo}`);
  }
  const data = await response.json();
  // Asegura que el campo id esté presente
  return { ...data, id: data.id || data._id };
}

/**
 * Edita una tarjeta por su ID en el backend.
 * @param id - El ID de la tarjeta a editar.
 * @param card - Objeto con los datos actualizados de la tarjeta.
 */
export async function updateCard(id: string, card: Partial<Omit<Card, 'id'>>): Promise<void> {
  const response = await fetch(`/cards/${id}`, {
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
  const response = await fetch(`/cards/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorInfo = await response.text();
    throw new Error(`Error ${response.status}: ${response.statusText}. ${errorInfo}`);
  }
}
