// API de usuarios
export interface User {
  id: string;
  _id: string;
  name: string;
  email: string;
}

/*** Siguientes pasos /
- Implementar la función para crear un nuevo usuario.
- Implementar la función para actualizar un usuario existente.
- Implementar la función para eliminar un usuario.
*/


/**
 * Obtiene una lista de usuarios desde el backend.
 */
export async function fetchUsers(): Promise<User[]> {
  const response = await fetch('/api/users/list');
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
