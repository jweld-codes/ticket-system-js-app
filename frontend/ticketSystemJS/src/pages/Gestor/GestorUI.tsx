import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Iconos ────────────────────────────────────────────────────────────────────
const IconChevron = ({ open }: { open: boolean }) => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
    style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const IconMail = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 7L2 7" />
  </svg>
);
const IconSettings = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);
const IconLogout = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);
const IconCoffee = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
    <line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
  </svg>
);
const IconPause = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
  </svg>
);
const IconPlay = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);
const IconChevronDown = ({ open }: { open: boolean }) => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
    style={{ transition: "transform 0.25s", transform: open ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// ── Botón ─────────────────────────────────────────────────────────────────────
const Btn = ({
  onClick, disabled, children,
  variant = "primary", full = false,
}: {
  onClick: () => void; disabled?: boolean; children: React.ReactNode;
  variant?: "primary" | "danger" | "ghost" | "success" | "warning" | "pause";
  full?: boolean;
}) => {
  const variants: Record<string, React.CSSProperties> = {
    primary: { background: "#1536ea", color: "#fff" },
    danger:  { background: "#fee2e2", color: "#dc2626" },
    ghost:   { background: "#f1f5f9", color: "#334155" },
    success: { background: "#dcfce7", color: "#16a34a" },
    warning: { background: "#fef3c7", color: "#92400e" },
    pause:   { background: "#f3e8ff", color: "#7c3aed" },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: full ? "100%" : "auto",
      padding: "11px 14px",
      border: "none", borderRadius: "9px",
      fontFamily: "'Barlow', sans-serif",
      fontSize: "13px",
      fontWeight: 600, letterSpacing: "0.3px",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.4 : 1,
      transition: "all 0.15s ease",
      display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
      touchAction: "manipulation", WebkitTapHighlightColor: "transparent",
      whiteSpace: "nowrap",
      ...variants[variant],
    }}>
      {children}
    </button>
  );
};

// ── Interfaces ────────────────────────────────────────────────────────────────
interface TicketPausado {
  ticket: any;
  segundosPausa: number; 
  intervaloPausa: any;  
}

// ── Componente principal ──────────────────────────────────────────────────────
function GestorTickets() {
  const navigate = useNavigate();
  const API_URL  = import.meta.env.VITE_API_URL;

  const usuarioSesion  = JSON.parse(localStorage.getItem("usuario") || "{}");
  const empleadoId     = usuarioSesion.empleadosId;
  const sucursalId     = usuarioSesion.sucursalesId;
  const kioskoId       = usuarioSesion.kioskoId;
  const kioskoNumero   = usuarioSesion.kioskoNumero;
  const estacionId     = usuarioSesion.estacionId;
  const nombreEmpleado = `${usuarioSesion.empleadosPNombre ?? ""} ${usuarioSesion.empleadosPApellido ?? ""}`.trim();
  const correoEmpleado = usuarioSesion.empleadosCorreo ?? "";
  const rolEmpleado    = usuarioSesion.empleadosRol ?? "Gestor";
  const estacionCodigo = usuarioSesion.estacionCodigo ?? `Estación ${estacionId}`;

  // ── State ─────────────────────────────────────────────────────────────────
  const [tickets,           setTickets]           = useState<any[]>([]);
  const [estaciones,        setEstaciones]        = useState<any[]>([]);
  const [ticketActual,      setTicketActual]      = useState<any>(null);
  const [atencionIniciada,  setAtencionIniciada]  = useState(false);
  const [segundos,          setSegundos]          = useState(0);
  const [mostrarFinalizar,  setMostrarFinalizar]  = useState(false);
  const [mostrarCancelar,   setMostrarCancelar]   = useState(false);
  const [motivoCancelacion, setMotivoCancelacion] = useState("");
  const [tipoAtencionId,    setTipoAtencionId]    = useState("");
  const [tiposAtencion,     setTiposAtencion]     = useState<any[]>([]);
  const [dropdownOpen,      setDropdownOpen]      = useState(false);
  const [ticketsAtendidos,  setTicketsAtendidos]  = useState(0);
  const [ticketsPorTipo,    setTicketsPorTipo]    = useState<any[]>([]);
  const [tabActivo,         setTabActivo]         = useState<"todo"|"atencion"|"acciones"|"espera">("todo");
  const [statsExpandido,    setStatsExpandido]    = useState(false);
  const [esMovilTablet,     setEsMovilTablet]     = useState(() => window.innerWidth <= 1024);
  const [ticketsPausados,   setTicketsPausados]   = useState<TicketPausado[]>([]);
  const [enDescanso,        setEnDescanso]        = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const ticketsSucursal = tickets.filter(t => Number(t.ticketSucursalId) === Number(sucursalId));
  const iniciales = nombreEmpleado.split(" ").slice(0, 2).map((n: string) => n[0] ?? "").join("").toUpperCase() || "G";

  // ── Efectos ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => {
    const detect = () => setEsMovilTablet(window.innerWidth <= 1024);
    window.addEventListener("resize", detect);
    return () => window.removeEventListener("resize", detect);
  }, []);

  useEffect(() => {
    let t: any;
    if (atencionIniciada) t = setInterval(() => setSegundos(p => p + 1), 1000);
    return () => clearInterval(t);
  }, [atencionIniciada]);

  // ── API ───────────────────────────────────────────────────────────────────
  const obtenerTicketsPendientes = async () => {
    if (!sucursalId) return;
    try {
      const r = await fetch(`${API_URL}/tickets/pendientes?sucursalId=${sucursalId}`);
      const d = await r.json();
      setTickets(Array.isArray(d) ? d : []);
    } catch { setTickets([]); }
  };

  const obtenerEstacionesSucursal = async () => {
    if (!sucursalId) return;
    try {
      const r = await fetch(`${API_URL}/estaciones/sucursal/${sucursalId}`);
      const d = await r.json();
      const lista = Array.isArray(d) ? d : [];
      setEstaciones(lista);

      if (estacionId) {
        const miEstacion = lista.find((e: any) => Number(e.estacionId) === Number(estacionId));
        setEnDescanso(miEstacion.estacionEstado === "No Disponible");
    }
    } catch { setEstaciones([]); }
  };

  const obtenerTiposAtencion = async () => {
    try {
      const r = await fetch(`${API_URL}/tipos-atencion`);
      const d = await r.json();
      setTiposAtencion(Array.isArray(d) ? d : []);
    } catch { setTiposAtencion([]); }
  };

  const obtenerEstadisticasEstacion = async () => {
    if (!estacionId) return;
    try {
      const r = await fetch(`${API_URL}/tickets/estadisticas/${estacionId}`);
      const d = await r.json();
      if (!r.ok) { setTicketsAtendidos(0); setTicketsPorTipo([]); return; }
      setTicketsAtendidos(d.totalAtendidos ?? 0);
      setTicketsPorTipo(Array.isArray(d.porTipo) ? d.porTipo : []);
    } catch { setTicketsAtendidos(0); setTicketsPorTipo([]); }
  };

  useEffect(() => {
    if (!usuarioSesion.empleadosId) { navigate("/login"); return; }
    obtenerTicketsPendientes();
    obtenerTiposAtencion();
    obtenerEstacionesSucursal();
    obtenerEstadisticasEstacion();
    const i1 = setInterval(obtenerTicketsPendientes,    3000);
    const i2 = setInterval(obtenerEstacionesSucursal,   5000);
    const i3 = setInterval(obtenerEstadisticasEstacion, 5000);
    return () => { clearInterval(i1); clearInterval(i2); clearInterval(i3); };
  }, []);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const formatoTiempo = (s: number) =>
    `${String(Math.floor(s/3600)).padStart(2,"0")}:${String(Math.floor((s%3600)/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  const obtenerNumeroEstacion = (codigo: string) => {
    const n = codigo.match(/\d+/);
    return n ? `Estación ${parseInt(n[0], 10)}` : codigo;
  };

  const reproducirGemini = async (texto: string) => {
    try {
      const res = await fetch(`${API_URL}/voz/tts`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto }),
      });
      const data = await res.json();
      if (!res.ok || !data.audio) return;
      const audio = new Audio(`data:audio/wav;base64,${data.audio}`);
      audio.oncanplaythrough = () => audio.play();
    } catch {}
  };

  const colorEstacion = (estado: string) => {
    const m: Record<string, any> = {
      "Disponible":        { bg: "#dcfce7", text: "#16a34a", border: "#86efac" },
      "En Espera":         { bg: "#fef9c3", text: "#854d0e", border: "#fde047" },
      "En Atención":       { bg: "#dbeafe", text: "#1d4ed8", border: "#93c5fd" },
      "Fuera de Servicio": { bg: "#f3f4f6", text: "#6b7280", border: "#d1d5db" },
      "No Disponible":     { bg: "#fee2e2", text: "#dc2626", border: "#fca5a5" },
      "En Pausa":          { bg: "#f3e8ff", text: "#7c3aed", border: "#d8b4fe" },
    };
    return m[estado] || { bg: "#f3f4f6", text: "#6b7280", border: "#d1d5db" };
  };

  // ── Acciones ──────────────────────────────────────────────────────────────
  const cerrarSesion = async () => {
    try {
      if (estacionId) await fetch(`${API_URL}/estaciones/${estacionId}/estado`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: "Fuera de Servicio" }),
      });
    } catch {}
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  const tomarDescanso = async () => {
    if (!estacionId) return;
    const nuevoEstado = enDescanso ? "Disponible" : "No Disponible";
    const r = await fetch(`${API_URL}/estaciones/${estacionId}/estado`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: nuevoEstado }),
    });
    if (r.ok) { setEnDescanso(!enDescanso); obtenerEstacionesSucursal(); }
  };

  const llamarTicket = async () => {
    if (!ticketActual) return;
    const estacionTexto = obtenerNumeroEstacion(estacionCodigo);
    await reproducirGemini(`Ticket número ${ticketActual.ticketNumero}. Favor pasar a ${estacionTexto}`);
  };

  const agarrarTicket = async () => {
    if (!estacionId) { alert("No existe estación asignada."); return; }
    if (enDescanso) { alert("Debe volver del descanso antes de tomar tickets."); return; }
    if (atencionIniciada) { alert("Finalice la atención actual primero."); return; }

    const tf = tickets.filter(t => Number(t.ticketSucursalId) === Number(sucursalId));
    if (tf.length === 0) {
      setTicketActual(null);
      await obtenerTicketsPendientes();
      await obtenerEstacionesSucursal();
      return;
    }

    if (ticketActual?.ticketEstado === "Tomado") {
      await fetch(`${API_URL}/tickets/${ticketActual.ticketId}/cancelar`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ empleadoId, estacionId: Number(estacionId), motivo: "Cliente no respondió" }),
      });
    }

    const sig = tf[0];
    const r = await fetch(`${API_URL}/tickets/${sig.ticketId}/tomar`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estacionId: Number(estacionId), empleadoId: Number(empleadoId) }),
    });
    if (!r.ok) { alert("Error al tomar ticket."); return; }

    setTicketActual({ ...sig, ticketEstado: "Tomado" });
    setAtencionIniciada(false);
    setSegundos(0);

    const estacionTexto = obtenerNumeroEstacion(estacionCodigo);
    await reproducirGemini(`Ticket número ${sig.ticketNumero}. Favor pasar a ${estacionTexto}`);

    obtenerTicketsPendientes();
    obtenerEstacionesSucursal();
  };

  const iniciarAtencion = async () => {
    if (!ticketActual || !estacionId) return;
    const r = await fetch(`${API_URL}/tickets/${ticketActual.ticketId}/iniciar`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estacionId: Number(estacionId), empleadoId: Number(empleadoId) }),
    });
    if (!r.ok) { alert("Error al iniciar atención."); return; }
    setTicketActual({ ...ticketActual, ticketEstado: "En Atencion" });
    setAtencionIniciada(true);
    setSegundos(0);
    obtenerTicketsPendientes();
    obtenerEstacionesSucursal();
  };

  // FIX: Pausar ticket — guarda en lista local, libera estación
  const pausarTicket = async () => {
    if (!ticketActual || !atencionIniciada) return;

    const r = await fetch(`${API_URL}/tickets/${ticketActual.ticketId}/pausar`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estacionId: Number(estacionId) }),
    });
    if (!r.ok) { alert("Error al pausar ticket."); return; }

    // Iniciar contador de pausa para este ticket
    const nuevoTicketPausado: TicketPausado = {
      ticket: { ...ticketActual, ticketEstado: "En Pausa" },
      segundosPausa: 0,
      intervaloPausa: null,
    };

    // Arrancamos el intervalo de pausa
    nuevoTicketPausado.intervaloPausa = setInterval(() => {
      setTicketsPausados(prev => prev.map(tp =>
        tp.ticket.ticketId === ticketActual.ticketId
          ? { ...tp, segundosPausa: tp.segundosPausa + 1 }
          : tp
      ));
    }, 1000);

    setTicketsPausados(prev => [...prev, nuevoTicketPausado]);
    setTicketActual(null);
    setAtencionIniciada(false);
    setSegundos(0);

    obtenerTicketsPendientes();
    obtenerEstacionesSucursal();
  };

  // Reanudar ticket pausado
  const reanudarTicketPausado = async (tp: TicketPausado) => {
    if (atencionIniciada) { alert("Finalice la atención actual antes de reanudar."); return; }
    if (ticketActual?.ticketEstado === "Tomado") {
      await fetch(`${API_URL}/tickets/${ticketActual.ticketId}/cancelar`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ empleadoId, estacionId: Number(estacionId), motivo: "Reemplazado por ticket reanudado" }),
      });
    }

    const r = await fetch(`${API_URL}/tickets/${tp.ticket.ticketId}/reanudar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          estacionId: Number(estacionId),
          empleadoId: Number(empleadoId)
        }),
      });
    if (!r.ok) { alert("Error al reanudar ticket."); return; }

    // Detener el intervalo de pausa
    clearInterval(tp.intervaloPausa);
    setTicketsPausados(prev => prev.filter(t => t.ticket.ticketId !== tp.ticket.ticketId));

    setTicketActual({ ...tp.ticket, ticketEstado: "En Atencion" });
    setAtencionIniciada(true);
    setSegundos(0);

    obtenerEstacionesSucursal();
  };

  const confirmarCancelarTicket = async () => {
    if (!ticketActual) return;
    try {
      const res = await fetch(`${API_URL}/tickets/${ticketActual.ticketId}/cancelar`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empleadoId: Number(empleadoId),
          estacionId: estacionId ? Number(estacionId) : null,
          sucursalId: Number(sucursalId),
          motivo: motivoCancelacion || "Cancelado por gestor",
        }),
      });
      if (!res.ok) { const d = await res.json(); alert(d.error || d.message || "Error"); return; }
      setTicketActual(null); setAtencionIniciada(false); setSegundos(0);
      setMotivoCancelacion(""); setMostrarCancelar(false);
      obtenerTicketsPendientes(); obtenerEstacionesSucursal();
    } catch { alert("No se pudo conectar."); }
  };

  const finalizarTicket = async () => {
    if (!tipoAtencionId) { alert("Seleccione el tipo de atención."); return; }
    if (!ticketActual) return;
    const r = await fetch(`${API_URL}/tickets/${ticketActual.ticketId}/finalizar`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        empleadoId: Number(empleadoId),
        estacionId: Number(estacionId),
        sucursalId: Number(sucursalId),
        ticketEstado: "Finalizado",
        tipoAtencionId: Number(tipoAtencionId),
        tiempoAtencion: Math.floor(segundos / 60),
      }),
    });
    if (!r.ok) { const d = await r.json(); alert(d.message || "Error al finalizar."); return; }

    setTicketActual(null); setAtencionIniciada(false); setSegundos(0);
    setTipoAtencionId(""); setMostrarFinalizar(false);

    // FIX: incrementar contador local inmediatamente + refrescar desde API
    setTicketsAtendidos(p => p + 1);

    obtenerTicketsPendientes();
    obtenerEstacionesSucursal();
    obtenerEstadisticasEstacion();
  };

  // ── Sub-componentes de secciones ──────────────────────────────────────────

  // Tarjeta "Atendiendo ahora"
  const CardAtencion = () => (
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden" }}>
      <div style={{
        padding: "10px 26px",
        background: atencionIniciada ? "linear-gradient(135deg,#1536ea 0%,#3b5bf7 100%)" : "#fff",
        borderBottom: "1px solid #f1f5f9",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, flexWrap: "wrap",
      }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase",
            color: atencionIniciada ? "rgba(255,255,255,0.65)" : "#94a3b8", marginBottom: 4 }}>
            Atendiendo Ahora
          </div>
          <div style={{ fontSize: "clamp(16px,3.5vw,22px)", fontWeight: 800, color: atencionIniciada ? "#fff" : "#0f172a", lineHeight: 1.2 }}>
            {ticketActual?.clienteNombre || "Sin cliente"}
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: atencionIniciada ? "rgba(255,255,255,0.7)" : "#64748b", marginTop: 2 }}>
            DNI: {ticketActual?.clienteDNI || "—"}
          </div>
        </div>
        {ticketActual && (
          <span style={{
            fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap", flexShrink: 0,
            background: atencionIniciada ? "rgba(255,255,255,0.2)" : "#eef2ff",
            color: atencionIniciada ? "#fff" : "#1536ea",
            border: atencionIniciada ? "1px solid rgba(255,255,255,0.3)" : "1px solid #c7d2fe",
          }}>
            {ticketActual.ticketEstado}
          </span>
        )}
      </div>

      {/* Ticket · Tiempo · Atendidos */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
        {[
          { label: "Ticket",    value: ticketActual ? ticketActual.ticketNumero : "——",
            style: { fontFamily: "'Barlow Condensed',sans-serif", fontSize: "clamp(32px,8vw,52px)", fontWeight: 800, color: ticketActual ? "#1536ea" : "#cbd5e1", letterSpacing: -1, lineHeight: 1 } },
          { label: "Tiempo",   value: formatoTiempo(segundos),
            style: { fontFamily: "'Barlow Condensed',sans-serif", fontSize: "clamp(16px,4vw,26px)", fontWeight: 700, color: atencionIniciada ? "#1536ea" : "#94a3b8", letterSpacing: 1, lineHeight: 1 } },
          { label: "Atendidos", value: ticketsAtendidos,
            style: { fontFamily: "'Barlow Condensed',sans-serif", fontSize: "clamp(32px,8vw,52px)", fontWeight: 800, color: "#0f172a", lineHeight: 1 } },
        ].map((col, idx) => (
          <div key={col.label} style={{ textAlign: "center", padding: "14px 6px", borderRight: idx < 2 ? "1px solid #f1f5f9" : "none" }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "#94a3b8", marginBottom: 6 }}>{col.label}</div>
            <div style={col.style}>{col.value}</div>
          </div>
        ))}
      </div>

      {/* Estadísticas colapsables */}
      <button onClick={() => setStatsExpandido(p => !p)} style={{
        width: "100%", padding: "10px 14px", background: "none", border: "none",
        borderTop: "1px solid #f1f5f9",
        borderBottom: statsExpandido ? "1px solid #f1f5f9" : "none",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        cursor: "pointer", fontFamily: "'Barlow',sans-serif", touchAction: "manipulation",
      }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#94a3b8" }}>
          Estadísticas por tipo
        </span>
        <IconChevronDown open={statsExpandido} />
      </button>
      {statsExpandido && (
        <div style={{ padding: "10px 14px 14px" }}>
          {ticketsPorTipo.length > 0
            ? ticketsPorTipo.map(item => (
              <div key={item.tiposAtencionNombre} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "5px 0", color: "#334155", fontWeight: 600, borderBottom: "1px solid #f8fafc" }}>
                <span>{item.tiposAtencionNombre}</span>
                <span style={{ fontWeight: 700, color: "#1536ea" }}>{item.cantidad}</span>
              </div>
            ))
            : <div style={{ fontSize: 12, color: "#94a3b8" }}>Aún no hay tickets finalizados hoy</div>
          }
        </div>
      )}
    </div>
  );

  const CardAcciones = () => (
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden" }}>
      <div style={{ padding: "10px 14px", borderBottom: "1px solid #f1f5f9" }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#94a3b8" }}>Acciones</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 12 }}>

        {/* Grupo 1: tomar / llamar */}
        <Btn full variant="primary" onClick={agarrarTicket} disabled={atencionIniciada || enDescanso}>
          ✋ Tomar Ticket
        </Btn>
        <Btn full variant="ghost" onClick={llamarTicket} disabled={!ticketActual || enDescanso}>
          📢 Llamar
        </Btn>

        <div style={{ height: 1, background: "#f1f5f9" }} />

        {/* Grupo 2: iniciar / pausar / finalizar */}
        <Btn full variant="primary" onClick={iniciarAtencion}
          disabled={!ticketActual || ticketActual?.ticketEstado !== "Tomado" || enDescanso}>
          ▶ Iniciar
        </Btn>
        <Btn full variant="pause" onClick={pausarTicket} disabled={!atencionIniciada || enDescanso}>
          <IconPause /> Pausar
        </Btn>
        <Btn full variant="success" onClick={() => setMostrarFinalizar(true)} disabled={!atencionIniciada || enDescanso}>
          ✔ Finalizar
        </Btn>

        <div style={{ height: 1, background: "#f1f5f9" }} />

        {/* Grupo 3: cancelar / descanso / crear */}
        <Btn full variant="danger" onClick={() => setMostrarCancelar(true)}
          disabled={!ticketActual || atencionIniciada || enDescanso}>
          ✕ Cancelar Ticket
        </Btn>
        <Btn full variant={enDescanso ? "danger" : "warning"} onClick={tomarDescanso}
          disabled={!estacionId || atencionIniciada || !!ticketActual}>
          <IconCoffee /> {enDescanso ? "Volver del descanso" : "Tomar Descanso"}
        </Btn>
        <Btn full variant="ghost" onClick={() => navigate(
          `/turno-manual?modo=manual&kioskoId=${kioskoId}&kioskoNumero=${kioskoNumero}&sucursalId=${sucursalId}&estacionId=${estacionId}`
        )} disabled={enDescanso}>
          + Crear Ticket
        </Btn>
      </div>
    </div>
  );

  // Lista de espera
  const CardEspera = () => (
    <div style={{ background: "#ffffff", borderRadius: 14, border: "1px solid #e2e8f0", height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ padding: "10px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#94a3b8" }}>En Espera</span>
        <span style={{ background: "#1536ea", color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>
          {ticketsSucursal.length}
        </span>
      </div>

      <div style={{ maxHeight: 500, overflowY: "auto" }}>
        {ticketsSucursal.length === 0
          ? <div style={{ padding: "30px", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>Sin tickets pendientes</div>
          : ticketsSucursal.map(t => (
            <div key={t.ticketId} onClick={() => { if (!enDescanso) setTicketActual(t); }}
              style={{ padding: "11px 14px", borderBottom: "1px solid #f8fafc", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 10, touchAction: "manipulation" }}>
              <div style={{ background: "#eef2ff", color: "#1536ea", fontFamily: "'Barlow Condensed',sans-serif",
                fontSize: 17, fontWeight: 700, borderRadius: 8, padding: "5px 9px", minWidth: 50, textAlign: "center", flexShrink: 0 }}>
                {t.ticketNumero}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.clienteNombre}</div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>{t.tiposTurnoNombre}</div>
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#ea8c15", background: "#fef3c7", padding: "2px 7px", borderRadius: 10, flexShrink: 0 }}>
                {t.tiempoEspera} m
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );

  // Lista de tickets pausados
  const CardPausados = () => {
    if (ticketsPausados.length === 0) return null;
    return (
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #d8b4fe", overflow: "hidden" }}>
        <div style={{ padding: "10px 14px", borderBottom: "1px solid #f3e8ff", background: "#faf5ff",
          display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#7c3aed" }}>
            ⏸ Tickets en Pausa
          </span>
          <span style={{ background: "#7c3aed", color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>
            {ticketsPausados.length}
          </span>
        </div>
        <div>
          {ticketsPausados.map(tp => (
            <div key={tp.ticket.ticketId} style={{
              padding: "12px 14px", borderBottom: "1px solid #f8fafc",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <div style={{ background: "#f3e8ff", color: "#7c3aed", fontFamily: "'Barlow Condensed',sans-serif",
                fontSize: 17, fontWeight: 700, borderRadius: 8, padding: "5px 9px", minWidth: 50, textAlign: "center", flexShrink: 0 }}>
                {tp.ticket.ticketNumero}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {tp.ticket.clienteNombre}
                </div>
                <div style={{ fontSize: 11, color: "#7c3aed", marginTop: 2, fontWeight: 600 }}>
                  En pausa: {formatoTiempo(tp.segundosPausa)}
                </div>
              </div>
              <button
                onClick={() => reanudarTicketPausado(tp)}
                disabled={atencionIniciada}
                style={{
                  display: "flex", alignItems: "center", gap: 5,
                  padding: "7px 12px", border: "none", borderRadius: 8,
                  background: atencionIniciada ? "#f3f4f6" : "#7c3aed",
                  color: atencionIniciada ? "#94a3b8" : "#fff",
                  fontFamily: "'Barlow',sans-serif", fontSize: 12, fontWeight: 700,
                  cursor: atencionIniciada ? "not-allowed" : "pointer",
                  flexShrink: 0, transition: "all 0.15s",
                }}
              >
                <IconPlay /> Continuar
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Estaciones
  const CardEstaciones = () => (
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden" }}>
      <div style={{ padding: "10px 14px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#94a3b8" }}>Estaciones</span>
        <span style={{ fontSize: 11, color: "#94a3b8" }}>{estaciones.length} en total</span>
      </div>
      <div style={{ padding: "10px 14px", display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none" }}>
        {estaciones.length === 0
          ? <span style={{ fontSize: 12, color: "#94a3b8" }}>Sin estaciones registradas</span>
          : estaciones.map(e => {
            const c = colorEstacion(e.estacionEstado);
            return (
              <div key={e.estacionId} style={{
                flexShrink: 0, display: "flex", alignItems: "center", gap: 6,
                padding: "7px 12px", borderRadius: 10,
                background: c.bg, color: c.text, border: `1px solid ${c.border}`,
                fontSize: 12, fontWeight: 700, whiteSpace: "nowrap",
              }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: c.text, flexShrink: 0 }} />
                {e.estacionCodigo}
                <span style={{ fontSize: 10, opacity: 0.7 }}>· {e.estacionEstado}</span>
              </div>
            );
          })
        }
      </div>
    </div>
  );

  // Vista móvil "todo"
  const VistaTodo = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Fila de espera horizontal */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <div style={{ padding: "10px 14px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#94a3b8" }}>Fila de Espera</span>
          <span style={{ background: "#1536ea", color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>{ticketsSucursal.length}</span>
        </div>
        {ticketsSucursal.length === 0
          ? <div style={{ padding: "13px 16px", fontSize: 12, color: "#94a3b8", textAlign: "center" }}>Sin tickets en espera</div>
          : <div style={{ display: "flex", gap: 8, padding: "10px 14px", overflowX: "auto", scrollbarWidth: "none" }}>
            {ticketsSucursal.map((t, i) => (
              <button key={t.ticketId} onClick={() => { if (!enDescanso) setTicketActual(t); }}
                style={{
                  flexShrink: 0, border: "none", cursor: "pointer",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                  background: i === 0 ? "#eef2ff" : "#f8fafc",
                  borderRadius: 10, padding: "8px 10px",
                  outline: ticketActual?.ticketId === t.ticketId ? "2px solid #1536ea" : `1px solid ${i === 0 ? "#c7d2fe" : "#e2e8f0"}`,
                  minWidth: 60, transition: "all 0.15s", touchAction: "manipulation",
                }}>
                <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 22, fontWeight: 800, color: i === 0 ? "#1536ea" : "#475569", lineHeight: 1 }}>{t.ticketNumero}</span>
                <span style={{ fontSize: 9, fontWeight: 700, color: "#94a3b8", maxWidth: 56, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.clienteNombre?.split(" ")[0]}</span>
                <span style={{ fontSize: 9, fontWeight: 600, color: "#ea8c15", background: "#fef3c7", padding: "1px 5px", borderRadius: 8 }}>{t.tiempoEspera}m</span>
              </button>
            ))}
          </div>
        }
      </div>
      <CardAtencion />
      <CardAcciones />
      {ticketsPausados.length > 0 && <CardPausados />}
      <CardEstaciones />
    </div>
  );

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;600;700&family=Barlow+Condensed:wght@700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        html,body{height:100%;}
        body{background:#f0f2f8;-webkit-text-size-adjust:100%;}
        .gs-page{min-height:100vh;background:#f0f2f8;font-family:'Barlow',sans-serif;padding-bottom:env(safe-area-inset-bottom,0px);}
        .gs-header{background:#1536ea;color:#fff;display:flex;align-items:center;justify-content:space-between;height:56px;box-shadow:0 2px 12px rgba(21,54,234,0.3);position:sticky;top:0;z-index:50;padding-left:max(16px,env(safe-area-inset-left));padding-right:max(16px,env(safe-area-inset-right));}
        .gs-header-brand{font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:800;letter-spacing:2px;text-transform:uppercase;white-space:nowrap;}
        .gs-header-brand span{opacity:.4;font-weight:300;margin-left:10px;font-size:13px;letter-spacing:1px;display:none;}
        @media(min-width:480px){.gs-header-brand span{display:inline;}}
        .gs-user-trigger{display:flex;align-items:center;gap:8px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);border-radius:10px;padding:6px 10px 6px 8px;cursor:pointer;color:#fff;font-family:'Barlow',sans-serif;touch-action:manipulation;-webkit-tap-highlight-color:transparent;}
        .gs-avatar{width:32px;height:32px;border-radius:8px;background:rgba(255,255,255,.25);display:flex;align-items:center;justify-content:center;font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:13px;flex-shrink:0;}
        .gs-user-name{font-size:13px;font-weight:600;max-width:100px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:none;}
        @media(min-width:480px){.gs-user-name{display:block;}}
        .gs-dropdown{position:absolute;top:calc(100% + 8px);right:0;width:min(260px,calc(100vw - 24px));background:#fff;border:1px solid #e2e8f0;border-radius:14px;box-shadow:0 16px 40px rgba(0,0,0,.14);overflow:hidden;z-index:200;}
        .gs-dd-profile{padding:18px 18px 14px;border-bottom:1px solid #f1f5f9;}
        .gs-dd-avatar{width:44px;height:44px;border-radius:12px;background:#eef2ff;display:flex;align-items:center;justify-content:center;font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:17px;color:#1536ea;margin-bottom:10px;}
        .gs-dd-name{font-size:15px;font-weight:700;color:#0f172a;}
        .gs-dd-role{font-size:12px;color:#64748b;margin-top:4px;margin-bottom:6px;}
        .gs-dd-mail{display:flex;align-items:center;gap:6px;font-size:12px;color:#94a3b8;word-break:break-all;}
        .gs-dd-sep{height:1px;background:#f1f5f9;}
        .gs-dd-item{display:flex;align-items:center;gap:10px;padding:13px 18px;font-size:13px;font-weight:600;color:#334155;cursor:pointer;border:none;background:none;width:100%;font-family:'Barlow',sans-serif;text-align:left;touch-action:manipulation;}
        .gs-dd-item:hover{background:#f8fafc;}
        .gs-dd-item.danger{color:#dc2626;}
        .gs-dd-icon{color:#94a3b8;flex-shrink:0;}
        .gs-body{padding:12px;display:flex;flex-direction:column;gap:10px;}
        @media(min-width:640px){.gs-body{padding:16px;gap:12px;}}
        @media(min-width:1024px){.gs-body{padding:20px 24px;gap:14px;}}
        .gs-tabs{display:flex;background:#fff;border-radius:12px;border:1px solid #e2e8f0;overflow:hidden;}
        .gs-tab{flex:1;padding:11px 4px;border:none;background:none;font-family:'Barlow',sans-serif;font-size:11px;font-weight:700;letter-spacing:.4px;color:#94a3b8;cursor:pointer;border-right:1px solid #f1f5f9;touch-action:manipulation;transition:all .15s;display:flex;flex-direction:column;align-items:center;gap:3px;}
        .gs-tab:last-child{border-right:none;}
        .gs-tab.active{background:#eef2ff;color:#1536ea;}
        .gs-tab-badge{background:#1536ea;color:#fff;font-size:10px;font-weight:700;padding:1px 6px;border-radius:10px;min-width:18px;text-align:center;}
        .gs-tab-badge-pause{background:#7c3aed;color:#fff;font-size:10px;font-weight:700;padding:1px 6px;border-radius:10px;}

        /* Desktop grid */
        .gs-desktop-grid-top{display:grid;grid-template-columns:2fr 200px 1.3fr;gap:14px;align-items:start;}
        .gs-desktop-grid-bottom{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:14px;}

        .gs-overlay{position:fixed;inset:0;background:rgba(15,23,42,.5);backdrop-filter:blur(3px);display:flex;align-items:flex-end;justify-content:center;z-index:100;padding:0 0 env(safe-area-inset-bottom,0px);}
        @media(min-width:480px){.gs-overlay{align-items:center;padding:16px;}}
        .gs-modal{background:#fff;border-radius:20px 20px 0 0;padding:24px 20px;width:100%;box-shadow:0 -8px 40px rgba(0,0,0,.18);}
        @media(min-width:480px){.gs-modal{border-radius:16px;padding:32px;max-width:400px;}}
        .gs-modal-title{font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:#0f172a;margin-bottom:20px;}
        .gs-select{width:100%;padding:13px 14px;border:1px solid #e2e8f0;border-radius:8px;font-family:'Barlow',sans-serif;font-size:16px;color:#0f172a;background:#f8fafc;outline:none;margin-bottom:16px;-webkit-appearance:none;}
        @media(min-width:480px){.gs-select{font-size:14px;padding:11px 14px;}}
        .gs-modal-actions{display:flex;gap:10px;}
        .gs-modal-actions>*{flex:1;}
        ::-webkit-scrollbar{width:3px;height:3px;}
        ::-webkit-scrollbar-thumb{background:#d1d5db;border-radius:4px;}
      `}</style>

      <div className="gs-page">

        {/* Header */}
        <header className="gs-header">
          <div className="gs-header-brand">
            JETSTEREO<span>· Gestor de Turnos</span>
          </div>
          <div ref={dropdownRef} style={{ position: "relative" }}>
            <button className="gs-user-trigger" onClick={() => setDropdownOpen(p => !p)}>
              <div className="gs-avatar">{iniciales}</div>
              <span className="gs-user-name">{nombreEmpleado || correoEmpleado}</span>
              <IconChevron open={dropdownOpen} />
            </button>
            {dropdownOpen && (
              <div className="gs-dropdown">
                <div className="gs-dd-profile">
                  <div className="gs-dd-avatar">{iniciales}</div>
                  <div className="gs-dd-name">{nombreEmpleado || "Gestor"}</div>
                  <div className="gs-dd-role">{rolEmpleado} · {estacionCodigo}</div>
                  <div className="gs-dd-mail"><span className="gs-dd-icon"><IconMail /></span>{correoEmpleado}</div>
                </div>
                <div className="gs-dd-sep" />
                <button className="gs-dd-item"><span className="gs-dd-icon"><IconSettings /></span>Configurar</button>
                <div className="gs-dd-sep" />
                <button className="gs-dd-item danger" onClick={cerrarSesion}><span className="gs-dd-icon"><IconLogout /></span>Cerrar sesión</button>
              </div>
            )}
          </div>
        </header>

        {/* MÓVIL / TABLET */}
        {esMovilTablet && (
          <div className="gs-body">
            <div className="gs-tabs">
              <button className={`gs-tab${tabActivo === "todo" ? " active" : ""}`} onClick={() => setTabActivo("todo")}>General</button>
              <button className={`gs-tab${tabActivo === "atencion" ? " active" : ""}`} onClick={() => setTabActivo("atencion")}>Atención</button>
              <button className={`gs-tab${tabActivo === "acciones" ? " active" : ""}`} onClick={() => setTabActivo("acciones")}>Acciones</button>
              <button className={`gs-tab${tabActivo === "espera" ? " active" : ""}`} onClick={() => setTabActivo("espera")}>
                Espera
                {ticketsSucursal.length > 0 && <span className="gs-tab-badge">{ticketsSucursal.length}</span>}
                {ticketsPausados.length > 0 && <span className="gs-tab-badge-pause">⏸{ticketsPausados.length}</span>}
              </button>
            </div>
            {tabActivo === "todo"     && <VistaTodo />}
            {tabActivo === "atencion" && <CardAtencion />}
            {tabActivo === "acciones" && <CardAcciones />}
            {tabActivo === "espera"   && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <CardEspera />
                {ticketsPausados.length > 0 && <CardPausados />}
              </div>
            )}
          </div>
        )}

        {/* DESKTOP */}
        {!esMovilTablet && (
          <div className="gs-body">
            {/* Fila superior: atención | acciones | espera */}
            <div className="gs-desktop-grid-top">
              <CardAtencion />
              <CardAcciones />
              <CardEspera />
            </div>
            {/* Fila inferior: tickets pausados | estaciones */}
            <div className="gs-desktop-grid-bottom">
              {ticketsPausados.length > 0 ? <CardPausados /> : <div />}
              <CardEstaciones />
            </div>
          </div>
        )}
      </div>

      {/* Modal Finalizar */}
      {mostrarFinalizar && (
        <div className="gs-overlay" onClick={e => { if (e.target === e.currentTarget) setMostrarFinalizar(false); }}>
          <div className="gs-modal">
            <div className="gs-modal-title">Finalizar Atención</div>
            <select className="gs-select" value={tipoAtencionId} onChange={e => setTipoAtencionId(e.target.value)}>
              <option value="">Seleccione tipo de atención</option>
              {tiposAtencion.map(ta => (
                <option key={ta.tiposAtencionId} value={ta.tiposAtencionId}>{ta.tiposAtencionNombre}</option>
              ))}
            </select>
            <div className="gs-modal-actions">
              <Btn variant="primary" full onClick={finalizarTicket}>✔ Confirmar</Btn>
              <Btn variant="ghost"   full onClick={() => setMostrarFinalizar(false)}>Cerrar</Btn>
            </div>
          </div>
        </div>
      )}

      {/* Modal Cancelar */}
      {mostrarCancelar && (
        <div className="gs-overlay" onClick={e => { if (e.target === e.currentTarget) setMostrarCancelar(false); }}>
          <div className="gs-modal">
            <div className="gs-modal-title">Cancelar Ticket</div>
            <p style={{ fontSize: 13, color: "#64748b", marginBottom: 14, lineHeight: 1.4 }}>
              ¿Cancelar el ticket <strong style={{ color: "#0f172a" }}>{ticketActual?.ticketNumero}</strong>?
            </p>
            <textarea value={motivoCancelacion} onChange={e => setMotivoCancelacion(e.target.value)}
              placeholder="Motivo (opcional)"
              style={{ width: "100%", minHeight: 80, resize: "vertical", padding: "12px 14px",
                border: "1px solid #e2e8f0", borderRadius: 10, fontFamily: "'Barlow',sans-serif",
                fontSize: 14, outline: "none", marginBottom: 16 }}
            />
            <div className="gs-modal-actions">
              <Btn variant="danger" full onClick={confirmarCancelarTicket}>Sí, cancelar</Btn>
              <Btn variant="ghost"  full onClick={() => { setMostrarCancelar(false); setMotivoCancelacion(""); }}>Cerrar</Btn>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default GestorTickets;