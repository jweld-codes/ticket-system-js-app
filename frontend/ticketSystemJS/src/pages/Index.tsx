import { Link } from "react-router-dom";

function Index() {
  return (
    <div>
      <h1>Panel Administrativo</h1>

      <ul>
        <li><Link to="/clientes">Clientes</Link></li>
        <li><Link to="/sucursales">Sucursales</Link></li>
        <li><Link to="/empleados">Empleados</Link></li>
        <li><Link to="/estaciones">Estaciones</Link></li>
        <li><Link to="/usuarios">Usuarios</Link></li>
        <li><Link to="/kioskos">Kioskos</Link></li>
        <li><Link to="/login-kiosko">Login de Kiosko</Link></li>
        <li><Link to="/tickets">Tickets</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
    </div>
  );
}

export default Index;