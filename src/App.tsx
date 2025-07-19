import { Routes, Route, Navigate } from 'react-router-dom'
import './styles/App.css'
import UserList from './components/users/UserList';
import UserDetail from './components/users/UserDetail';
import CardDetail from './components/cards/CardDetail';
import CardList from './components/cards/CardList';
import CreateCard from './components/cards/CreateCard';
import Layout from './components/common/Layout';
import Home from './pages/Home';


function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
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
    </Layout>
  );
}

export default App
