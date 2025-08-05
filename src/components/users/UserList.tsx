import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchUsers, createUser, updateUser, deleteUser, type User } from '../../api';
import './UserList.css';


// Formulario reutilizable para crear/editar usuario
function UserForm({
  onSubmit,
  initialData,
  onCancel,
}: {
  onSubmit: (data: { name: string; email: string }) => void;
  initialData?: { name: string; email: string };
  onCancel?: () => void;
}) {
  const [name, setName] = useState(initialData?.name || '');
  const [email, setEmail] = useState(initialData?.email || '');

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmit({ name, email });
      }}
      className="user-form"
      style={{ marginBottom: 16 }}
    >
      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <button type="submit">Guardar</button>
      {onCancel && (
        <button type="button" onClick={onCancel} style={{ marginLeft: 8 }}>
          Cancelar
        </button>
      )}
    </form>
  );
}

function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

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

  const handleCreate = async (data: { name: string; email: string }) => {
    try {
      const newUser = await createUser(data);
      setUsers(prev => [...prev, newUser]);
      setShowCreate(false);
    } catch (err) {
      alert('Error al crear usuario');
    }
  };

  const handleEdit = async (data: { name: string; email: string }) => {
    if (!editUser) return;
    try {
      await updateUser(editUser._id, data);
      setUsers(prev =>
        prev.map(u => u._id === editUser._id ? { ...u, ...data } : u)
      );
      setEditUser(null);
    } catch (err) {
      alert('Error al editar usuario');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Eliminar este usuario?')) return;
    try {
      await deleteUser(id);
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch (err) {
      alert('Error al eliminar usuario');
    }
  };

  return (
    <div className="user-list-container">
      <h1 className="user-list-title">Usuarios Registrados</h1>
      <button onClick={() => setShowCreate(true)} style={{ marginBottom: 16 }}>
        Crear usuario
      </button>
      {showCreate && (
        <UserForm
          onSubmit={handleCreate}
          onCancel={() => setShowCreate(false)}
        />
      )}
      {editUser && (
        <UserForm
          initialData={editUser}
          onSubmit={handleEdit}
          onCancel={() => setEditUser(null)}
        />
      )}
      {loading && <p className="user-list-loading">Cargando...</p>}
      {error && <p className="user-list-error">{error}</p>}
      <div className="users-list">
        {users.length === 0 && !loading ? (
          <p className="user-list-empty">No hay usuarios registrados.</p>
        ) : (
          users.map((user) => (
            <div key={user._id} className="user-card-link">
              <div className="user-card">
                <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
                <div className="user-info">
                  <h2 className="user-name">{user.name}</h2>
                  <p className="user-email">{user.email}</p>
                  <span className="user-id">ID: {user._id}</span>
                </div>
                <button onClick={() => setEditUser(user)}>Editar</button>
                <button onClick={() => handleDelete(user._id)}>Eliminar</button>
                <Link to={`/users/${user._id}`} className="action-link" style={{ marginLeft: 8 }}>
                  Ver detalle
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default UserList;
// ...mueve el contenido de UserList.tsx aquí...
