import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const API_URL = import.meta.env.VITE_API_URL;

const obtenerSesion = () => {
  const u = JSON.parse(localStorage.getItem("usuario") || "{}");

  const sucursalId =
    u.sucursalesId ||
    u.empleadosSucursalId ||
    u.empleadoSucursalId ||
    u.sucursalId;

  const rol =
    u.empleadosRol ||
    u.empleadoRol ||
    u.rol ||
    "Supervisor";

  const esAdmin = ["administrador", "admin", "superadmin"].includes(
    String(rol).toLowerCase()
  );

  return { u, sucursalId, rol, esAdmin };
};

const crearUrlReporte = (
  fechaInicial: string,
  fechaFinal: string,
  busqueda = ""
) => {
  const { sucursalId, rol, esAdmin } = obtenerSesion();

  const params = new URLSearchParams();
  params.append("rol", rol);
  params.append("fechaInicial", fechaInicial);
  params.append("fechaFinal", fechaFinal);

  if (!esAdmin && sucursalId) {
    params.append("sucursalId", String(sucursalId));
  }

  if (busqueda.trim()) {
    params.append("busqueda", busqueda.trim());
  }

  return `${API_URL}/tickets/reporte?${params.toString()}`;
};

export default function ListaTickets() {
  const hoy = new Date().toISOString().split("T")[0];

  const [tickets, setTickets] = useState<any[]>([]);
  const [fechaInicial, setFechaInicial] = useState(hoy);
  const [fechaFinal, setFechaFinal] = useState(hoy);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const obtenerTickets = async () => {
    try {
      setCargando(true);
      setError("");

      const url = crearUrlReporte(fechaInicial, fechaFinal, busqueda);
      console.log("URL REPORTE:", url);

      const res = await fetch(url);
      const text = await res.text();

      console.log("RESPUESTA BACKEND:", text);

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          "El backend no devolvió JSON. Revisa que exista la ruta GET /api/tickets/reporte en Express."
        );
      }

      if (!res.ok) {
        throw new Error(data.message || data.error || "Error al obtener tickets");
      }

      if (!res.ok) {
        throw new Error(data.message || data.error || "Error al obtener tickets");
      }

      setTickets(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || "Error desconocido");
      setTickets([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerTickets();
  }, []);

  const exportarExcel = () => {
    const datos = tickets.map((t) => ({
      Fecha_Ingreso: t.Fecha_Ingreso,
      Tiempo_Espera: t.Tiempo_Espera,
      Tiempo_Atencion: t.Tiempo_Atencion,
      TiempoPausa: t.TiempoPausa,
      Tiempo_Receptor: t.Tiempo_Receptor,
      Tipo_Atencion: t.Tipo_Atencion,
      Tipo_Numero: t.Tipo_Numero,
      Receptor: t.Receptor,
      Nombre_Cliente: t.Nombre_Cliente,
    }));

    const hoja = XLSX.utils.json_to_sheet(datos);
    const libro = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(libro, hoja, "Reporte Tickets");

    const buffer = XLSX.write(libro, {
      bookType: "xlsx",
      type: "array",
    });

    saveAs(
      new Blob([buffer], { type: "application/octet-stream" }),
      `Reporte_Tickets_${fechaInicial}_al_${fechaFinal}.xlsx`
    );
  };

  return (
    <div style={{ fontFamily: "'Barlow', sans-serif" }}>
      <h2>Reporte de Tickets</h2>

      <div style={{
        background: "#fff",
        padding: 16,
        borderRadius: 14,
        border: "1px solid #e2e8f0",
        display: "flex",
        gap: 12,
        flexWrap: "wrap",
        alignItems: "end",
        marginBottom: 16
      }}>
        <div>
          <label>Fecha inicial</label>
          <input type="date" value={fechaInicial} onChange={(e) => setFechaInicial(e.target.value)} />
        </div>

        <div>
          <label>Fecha final</label>
          <input type="date" value={fechaFinal} onChange={(e) => setFechaFinal(e.target.value)} />
        </div>

        <div>
          <label>Búsqueda</label>
          <input
            type="text"
            placeholder="Cliente, DNI o ticket"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && obtenerTickets()}
          />
        </div>

        <button onClick={obtenerTickets}>Buscar</button>
        <button onClick={exportarExcel} disabled={tickets.length === 0}>Exportar Excel</button>
      </div>

      {error && (
        <div style={{ color: "#dc2626", marginBottom: 12 }}>
          {error}
        </div>
      )}

      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", overflowX: "auto" }}>
        {cargando ? (
          <div style={{ padding: 24 }}>Cargando...</div>
        ) : tickets.length === 0 ? (
          <div style={{ padding: 24 }}>No hay tickets para mostrar.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>
                <th>Fecha_Ingreso</th>
                <th>Tiempo_Espera</th>
                <th>Tiempo_Atencion</th>
                <th>TiempoPausa</th>
                <th>Tiempo_Receptor</th>
                <th>Tipo_Atencion</th>
                <th>Tipo_Numero</th>
                <th>Receptor</th>
                <th>Nombre_Cliente</th>
                <th>Estado</th>
                <th>Sucursal</th>
              </tr>
            </thead>

            <tbody>
              {tickets.map((t, i) => (
                <tr key={t.ticketId || i}>
                  <td>{t.Fecha_Ingreso}</td>
                  <td>{t.Tiempo_Espera}</td>
                  <td>{t.Tiempo_Atencion}</td>
                  <td>{t.TiempoPausa}</td>
                  <td>{t.Tiempo_Receptor}</td>
                  <td>{t.Tipo_Atencion}</td>
                  <td>{t.Tipo_Numero}</td>
                  <td>{t.Receptor || "—"}</td>
                  <td>{t.Nombre_Cliente}</td>
                  <td>{t.ticketEstado}</td>
                  <td>{t.Sucursal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ marginTop: 10 }}>
        Total: {tickets.length} registros
      </div>
    </div>
  );
}