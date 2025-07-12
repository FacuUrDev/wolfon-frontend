// Definimos un tipo para los datos que esperamos recibir.
// Ajústalo a la estructura de tus datos reales.
export interface User {
  id: string;
  name: string;
  email: string;
}
// Definimos un tipo para los datos de la tarjeta.
export interface Card {
  id: string;
  title: string;
  description: string;
  user_id: string;
}

/**
 * Obtiene una lista de usuarios desde el backend.
 */
export async function fetchUsers(): Promise<User[]> {
  // Usamos la ruta relativa que configuramos en el proxy de Vite.
  const response = await fetch('/api/users'); // Cambiado a la ruta plural
  if (!response.ok) {
    // Lanzamos un error más descriptivo que incluye el status code.
    const errorInfo = await response.text();
    throw new Error(`Error ${response.status}: ${response.statusText}. ${errorInfo}`);
  }
  return response.json();
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
 * Obtiene un solo usuario por su ID desde el backend.
 * @param id - El ID del usuario a obtener.
 */
export async function fetchUserById(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
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
  const response = await fetch(`/api/users/${userId}/cards`);
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