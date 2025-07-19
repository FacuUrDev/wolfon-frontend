import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
        <Link to="/" className="navbar-brand">
            <img src="wolfonlogo1.svg" alt="Wolfon Logo" className="navbar-logo-img" />
            <span className="navbar-logo">Wolfon</span>
        </Link>
      
      <ul className="navbar-links">
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/users/list">Usuarios</Link></li>
        <li><Link to="/contact">Contacto</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
