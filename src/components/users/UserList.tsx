import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchUsers, type User } from '../../api';
import './UserList.css';

function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUsers = async () => {
      try {
        setLoading(true);
        const dataFromApi: any[] = await fetchUsers();
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
    <div className="user-list-container">
      <h1 className="user-list-title">Usuarios Registrados</h1>
      {loading && <p className="user-list-loading">Cargando...</p>}
      {error && <p className="user-list-error">{error}</p>}
      <div className="users-list">
        {users.length === 0 && !loading ? (
          <p className="user-list-empty">No hay usuarios registrados.</p>
        ) : (
          users.map((user) => (
            <Link to={`/users/${user._id}`} key={user._id} className="user-card-link">
              <div className="user-card">
                <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
                <div className="user-info">
                  <h2 className="user-name">{user.name}</h2>
                  <p className="user-email">{user.email}</p>
                  <span className="user-id">ID: {user._id}</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default UserList;
// ...mueve el contenido de UserList.tsx aquí...
