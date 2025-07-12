import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import UserList from './components/UserList';
import UserDetail from './components/UserDetail';
import CardDetail from './components/CardDetail';
import CardList from './components/CardList';
import CreateCard from './components/CreateCard';


function App() {
  return (
    <Routes>
      {/* Redirigimos la ruta principal a un perfil de usuario de ejemplo */}
      <Route path="/" element={<Navigate to="/users/u1" replace />} />

      {/* Ruta para el detalle de un usuario específico */}
      <Route path="/users/:id" element={<UserDetail />} />

       <Route path="/cards/:id" element={<CardDetail />} />

      {/* Ruta para ver todas las tarjetas de un usuario */}
      <Route path="/users/:id/cards" element={<CardList />} />

      {/* Ruta para crear una nueva tarjeta para un usuario */}
      <Route path="/users/:userId/cards/new" element={<CreateCard />} />

      {/* Opcional: Mantenemos la lista de usuarios en una ruta diferente */}
      <Route path="/users" element={<UserList />} />
    </Routes>
  )
}

export default App
