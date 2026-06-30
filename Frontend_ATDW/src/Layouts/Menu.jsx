import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';

function Menu() {
  // Revisamos si hay un usuario logueado en el almacenamiento
  const emailLogueado = localStorage.getItem("emailUsuario");

  return (
    <nav className="menu-nav">
      <ul>
        {/* Tu logo intacto para el SCSS */}
        <img src={logo} alt="logo cencosud" className="logo"/>
        
        {/* Oculta el botón de Login si el usuario ya inició sesión */}
        {!emailLogueado && (
          <li>
            <Link to="/">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Menu;