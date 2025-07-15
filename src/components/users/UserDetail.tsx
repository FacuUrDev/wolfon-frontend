import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchUserById, type User } from '../../api';
import './UserDetail.css';

function UserDetail() {
  const { _id } = useParams<{ _id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!_id) return;

    const getUser = async () => {
      try {
        setLoading(true);
        // La API devuelve un objeto con `_id`.
        const dataFromApi: any = await fetchUserById(_id);
        // Mapeamos `_id` a `id` para que sea consistente, usando _id como id.
        const formattedUser = { ...dataFromApi, id: dataFromApi._id };
        setUser(formattedUser);
        setError(null);
      } catch (err: any) {
        if (err.response && err.response.status === 404) {
          setError(`El usuario con _id: ${_id} no fue encontrado. Por favor, verifica que el _id es correcto.`);
        } else {
          // Para otros errores (red, error del servidor, etc.)
          setError('Ocurrió un error al cargar los detalles del usuario.');
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [_id]);

  if (loading) return <p>Cargando detalles del usuario...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="user-detail-container">
      <div className="user-detail-card">
        <div className="avatar-placeholder">
          <span>{user?.name?.charAt(0)}</span>
        </div>
        <div className="user-info">
          <h1>{user?.name}</h1>
          <p className="user-email">{user?.email}</p>
          <p className="user-id">ID: {user?.id}</p>
        </div>
        <Link to={`/users/${user?._id}/cards`} className="action-link">Ver tarjetas de este usuario →</Link>

      </div>
    </div>
  );
}

export default UserDetail;
