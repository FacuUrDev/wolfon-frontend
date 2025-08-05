
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
 * Crea un nuevo usuario en el backend.
 * @param user - Objeto con los datos del usuario.
 */
export async function createUser(user: Omit<User, "id" | "_id">): Promise<User> {
  const response = await fetch('/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...user, subscription: null }),
  });
  if (!response.ok) {
    const errorInfo = await response.text();
    throw new Error(`Error ${response.status}: ${response.statusText}. ${errorInfo}`);
  }
  const data = await response.json();
  return { ...data, id: data.id || data._id };
}

/**
 * Edita un usuario por su ID en el backend.
 * @param id - El ID del usuario a editar.
 * @param user - Objeto con los datos actualizados del usuario.
 */
export async function updateUser(id: string, user: Partial<Omit<User, 'id' | '_id'>>): Promise<void> {
  const payload = { ...user, _id: id };
  const response = await fetch(`/users`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorInfo = await response.text();
    throw new Error(`Error ${response.status}: ${response.statusText}. ${errorInfo}`);
  }
}

/**
 * Elimina un usuario por su ID en el backend.
 * @param id - El ID del usuario a eliminar.
 */
export async function deleteUser(id: string): Promise<void> {
  const response = await fetch(`/users/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorInfo = await response.text();
    throw new Error(`Error ${response.status}: ${response.statusText}. ${errorInfo}`);
  }
}

/**
 * Obtiene una lista de usuarios desde el backend.
 */
export async function fetchUsers(): Promise<User[]> {
  const response = await fetch('/users/list');
  if (!response.ok) {
    const errorInfo = await response.text();
    throw new Error(`Error ${response.status}: ${response.statusText}. ${errorInfo}`);
  }
  const data = await response.json();
  // Asegura que cada usuario tenga el campo id
  return data.map((user: any) => ({ ...user, id: user.id || user._id }));
}

/**
 * Obtiene un solo usuario por su ID desde el backend.
 * @param id - El ID del usuario a obtener.
 */
export async function fetchUserById(id: string): Promise<User> {
  const response = await fetch(`/users/${id}`);
  if (!response.ok) {
    const errorInfo = await response.text();
    throw new Error(`Error ${response.status}: ${response.statusText}. ${errorInfo}`);
  }
  const data = await response.json();
  // Asegura que el usuario tenga el campo id
  return { ...data, id: data.id || data._id };
}
