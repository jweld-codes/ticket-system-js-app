import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Inicio() {
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");

    if (usuarioGuardado) {
      const usuario = JSON.parse(usuarioGuardado);

      if (usuario.empleadosRol === "Gestor") {
        navigate(
          `/gestor?kioskoId=${usuario.kioskoId}&kioskoNumero=${usuario.kioskoNumero}&sucursalId=${usuario.sucursalesId}&estacionID=${usuario.estacionId}`,
          { replace: true }
        );
      } else if (usuario.empleadosRol === "Administrador") {
        navigate("/admin", { replace: true });
      } else if (usuario.empleadosRol === "Supervisor") {
        navigate("/supervisor", { replace: true });
      }
    }
  }, [navigate]);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f1f5f9",
      fontFamily: "Arial"
    }}>
      <div style={{
        background: "#fff",
        padding: 40,
        borderRadius: 16,
        width: 380,
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        textAlign: "center"
      }}>
        <h1 style={{ marginBottom: 10 }}>Sistema de Turnos</h1>
        <p style={{ color: "#64748b", marginBottom: 30 }}>
          Seleccione el tipo de acceso
        </p>

        <button
          onClick={() => navigate("/login")}
          style={btnStyle}
        >
          Ingresar como Usuario
        </button>

        <button
          onClick={() => navigate("/login-kiosko")}
          style={{ ...btnStyle, background: "#0f172a", marginTop: 12 }}
        >
          Ingresar como Kiosko
        </button>
      </div>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px",
  border: "none",
  borderRadius: 10,
  background: "#1536ea",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
  fontSize: 15
};

export default Inicio;