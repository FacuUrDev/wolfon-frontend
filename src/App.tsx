import { Routes, Route, Navigate } from 'react-router-dom'
import './styles/App.css'
import UserList from './components/users/UserList';
import UserDetail from './components/users/UserDetail';
import CardDetail from './components/cards/CardDetail';
import CardList from './components/cards/CardList';
import CreateCard from './components/cards/CreateCard';


function App() {
  return (
    <Routes>
      {/* Redirigimos la ruta principal a un perfil de usuario de ejemplo */}
      <Route path="/" element={<Navigate to="/users/u1" replace />} />

      {/* Ruta para el detalle de un usuario específico */}
      <Route path="/users/:_id" element={<UserDetail />} />

      <Route path="/cards/:id" element={<CardDetail />} />

      {/* Ruta para ver todas las tarjetas de un usuario */}
      <Route path="/users/:_id/cards" element={<CardList />} />

      {/* Ruta para crear una nueva tarjeta para un usuario */}
      <Route path="/users/:_id/cards/new" element={<CreateCard />} />

      {/* Opcional: Mantenemos la lista de usuarios en una ruta diferente */}
      <Route path="/users/list" element={<UserList />} />
    </Routes>
  )
}

export default App
