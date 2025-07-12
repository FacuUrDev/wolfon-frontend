import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchUsers, type User } from '../api';

function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUsers = async () => {
      try {
        setLoading(true);
        // La API devuelve un array de objetos con `_id`.
        const dataFromApi: any[] = await fetchUsers();
        // Mapeamos cada usuario para que tenga la propiedad `id`, usando `id` si existe, o `_id` como fallback.
        const formattedUsers = dataFromApi.map(user => ({ ...user, id: user.id || user._id }));
        setUsers(formattedUsers);
        setError(null);
      } catch (err) {
        setError('Ocurrió un error al obtener los datos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, []);

  return (
    <>
      <h1>Wolfon - Lista de Usuarios</h1>
      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="users-list">
        {users.map((user) => (
          <Link to={`/users/${user.id}`} key={user.id} className="user-card-link">
            <div className="user-card">
              <h2>{user.name}</h2>
              <p>{user.email}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

export default UserList;