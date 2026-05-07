import { Navigate } from "react-router-dom";

interface RutaProtegidaProps {
  children: React.ReactNode;
  rolesPermitidos: string[];
}

function RutaProtegida({ children, rolesPermitidos }: RutaProtegidaProps) {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  if (!usuario?.empleadosId) {
    return <Navigate to="/login" replace />;
  }

  if (!rolesPermitidos.includes(usuario.empleadosRol)) {
    return <Navigate to="/no-autorizado" replace />;
  }

  return children;
}

export default RutaProtegida;