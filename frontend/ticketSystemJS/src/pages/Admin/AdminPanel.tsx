import { useNavigate } from "react-router-dom";

function AdminPanel() {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      background: "#f1f5f9",
      fontFamily: "Arial"
    }}>

      <aside style={{
        width: 260,
        background: "#0f172a",
        color: "#fff",
        padding: 24
      }}>
        <h2 style={{ marginBottom: 30 }}>Admin</h2>

        <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button style={menuBtn} onClick={() => navigate("/admin")}>
            Panel
          </button>

          <button style={menuBtn} onClick={() => navigate("/empleados")}>
            Empleados
          </button>

          <button style={menuBtn} onClick={() => navigate("/tickets")}>
            Tickets
          </button>

          <button style={menuBtn} onClick={() => navigate("/usuarios")}>
            Usuarios
          </button>

          <button style={menuBtn} onClick={() => navigate("/sucursales")}>
            Sucursales
          </button>

          <button style={menuBtn} onClick={() => navigate("/estaciones")}>
            Estaciones
          </button>

          <button style={menuBtn} onClick={() => navigate("/nuevo-kiosko")}>
            Kiosko
          </button>
        </nav>

        <button
          onClick={cerrarSesion}
          style={{
            ...menuBtn,
            marginTop: 40,
            background: "#7f1d1d"
          }}
        >
          Cerrar sesión
        </button>
      </aside>

      <main style={{
        flex: 1,
        padding: 40
      }}>
        <h1>Panel del Administrador</h1>
        <p style={{ color: "#64748b", marginTop: 8 }}>
          Bienvenido al panel administrativo del sistema.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 20,
          marginTop: 30
        }}>
          <Card titulo="Empleados" texto="Gestión de empleados" />
          <Card titulo="Tickets" texto="Consulta de tickets generados" />
          <Card titulo="Usuarios" texto="Gestión de accesos" />
          <Card titulo="Sucursales" texto="Administración de sucursales" />
        </div>
      </main>
    </div>
  );
}

const menuBtn: React.CSSProperties = {
  padding: "12px 14px",
  border: "none",
  borderRadius: 10,
  background: "rgba(255,255,255,0.08)",
  color: "#fff",
  textAlign: "left",
  cursor: "pointer",
  fontWeight: 600
};

function Card({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <div style={{
      background: "#fff",
      padding: 24,
      borderRadius: 16,
      boxShadow: "0 4px 14px rgba(0,0,0,0.06)"
    }}>
      <h3>{titulo}</h3>
      <p style={{ color: "#64748b", marginTop: 8 }}>{texto}</p>
    </div>
  );
}

export default AdminPanel;