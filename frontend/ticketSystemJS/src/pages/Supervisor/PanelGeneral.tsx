import { useEffect, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface EstacionInfo {
  estacionId: number;
  estacionCodigo: string;
  estacionEstado: string;
  estacionNombre: string;
}

interface TicketEspera {
  ticketId: number;
  ticketNumero: string;
  clienteNombre: string;
  tiposTurnoNombre: string;
  tiempoEspera: number;
}

interface ReceptorInfo {
  id: number;
  nombre: string;
  iniciales: string;
  estacion: string;
  estado: string;
  tickets: number;
  tiempo: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const colorEst = (e: string) => {
  if (e === "Disponible")        return { bg: "#f0fdf4", text: "#16a34a", dot: "#16a34a", border: "#bbf7d0" };
  if (e === "En Espera")         return { bg: "#fefce8", text: "#a16207", dot: "#eab308", border: "#fde68a" };
  if (e === "En Atención")       return { bg: "#eff6ff", text: "#1d4ed8", dot: "#3b82f6", border: "#bfdbfe" };
  if (e === "No Disponible")     return { bg: "#fef2f2", text: "#dc2626", dot: "#ef4444", border: "#fecaca" };
  if (e === "Fuera de Servicio") return { bg: "#f8fafc", text: "#64748b", dot: "#94a3b8", border: "#e2e8f0" };
  return { bg: "#f8fafc", text: "#64748b", dot: "#94a3b8", border: "#e2e8f0" };
};

const initials = (name: string) =>
  name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

// ─── Sub-components ──────────────────────────────────────────────────────────

const KpiCard = ({
  label, value, sub, accent, icon,
}: {
  label: string; value: string | number; sub?: string; accent: string; icon: React.ReactNode;
}) => (
  <div style={{
    background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0",
    padding: "18px 20px", position: "relative", overflow: "hidden", flex: "1 1 0",
    borderTop: `3px solid ${accent}`,
  }}>
    <div style={{
      position: "absolute", right: 16, top: 16,
      width: 36, height: 36, borderRadius: 8,
      background: accent + "22",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {icon}
    </div>
    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", color: "#64748b", marginBottom: 8 }}>{label}</div>
    <div style={{ fontSize: 32, fontWeight: 600, color: accent === "#0034f7" ? "#0f172a" : accent, fontFamily: "monospace", lineHeight: 1 }}>{value}</div>
    {sub && <div style={{ fontSize: 11.5, color: "#94a3b8", marginTop: 5 }}>{sub}</div>}
  </div>
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", color: "#94a3b8", marginBottom: 12, marginTop: 24 }}>
    {children}
  </div>
);

const Card = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
    {children}
  </div>
);

const CardHead = ({ title, right }: { title: string; right?: React.ReactNode }) => (
  <div style={{ padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9" }}>
    <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{title}</span>
    {right}
  </div>
);

const CountBadge = ({ n }: { n: number }) => (
  <span style={{ background: "#e8edff", color: "#0034f7", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20, fontFamily: "monospace" }}>{n}</span>
);

const BarRow = ({ label, value, max, color }: { label: string; value: number; max: number; color: string }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 20px", borderBottom: "1px solid #f8fafc", fontSize: 13 }}>
    <div style={{ flex: 1, fontWeight: 500, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</div>
    <div style={{ flex: 1, height: 5, background: "#f1f5f9", borderRadius: 10, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${(value / max) * 100}%`, background: color, borderRadius: 10, transition: "width 0.4s" }} />
    </div>
    <div style={{ fontFamily: "monospace", fontSize: 15, fontWeight: 600, color, minWidth: 24, textAlign: "right" }}>{value}</div>
  </div>
);

const Empty = ({ msg = "Sin datos" }: { msg?: string }) => (
  <div style={{ padding: 28, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>{msg}</div>
);

// ─── Nav icons ───────────────────────────────────────────────────────────────

const IconGrid = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);

const IconUsers = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const IconChart = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);

const IconCal = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const IconSearch = () => (
  <svg width="14" height="14" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

// ─── Main Component ──────────────────────────────────────────────────────────

type Page = "dashboard" | "receptores";

export default function PanelGeneral() {
  const API_URL = import.meta.env.VITE_API_URL;
  const usuarioSesion = JSON.parse(localStorage.getItem("usuario") || "{}");

  const sucursalId =
    usuarioSesion.sucursalesId ||
    usuarioSesion.empleadosSucursalId ||
    usuarioSesion.empleadoSucursalId ||
    usuarioSesion.sucursalId;

  const rol =
    usuarioSesion.empleadosRol ||
    usuarioSesion.empleadoRol ||
    usuarioSesion.rol ||
    "Supervisor";

  const esAdmin =
    String(rol).toLowerCase() === "administrador" ||
    String(rol).toLowerCase() === "admin" ||
    String(rol).toLowerCase() === "superadmin";

  const hoy = new Date().toISOString().split("T")[0];
  const mesInicio = hoy.slice(0, 8) + "01";

  const [page, setPage] = useState<Page>("dashboard");
  const [estaciones, setEstaciones] = useState<EstacionInfo[]>([]);
  const [espera, setEspera] = useState<TicketEspera[]>([]);
  const [ticketsHoy, setTicketsHoy] = useState<any[]>([]);
  const [ticketesMes, setTicketesMes] = useState<any[]>([]);
  const [receptores, setReceptores] = useState<ReceptorInfo[]>([]);
  const [recFilter, setRecFilter] = useState<string>("todos");

  const crearUrlReporte = (fechaInicial: string, fechaFinal: string) => {
    const params = new URLSearchParams();
    params.append("rol", rol);
    params.append("fechaInicial", fechaInicial);
    params.append("fechaFinal", fechaFinal);
    if (!esAdmin && sucursalId) params.append("sucursalId", String(sucursalId));
    return `${API_URL}/tickets/reporte?${params.toString()}`;
  };

  const fetchAll = async () => {
    try {
      const [resEst, resEsp, resHoy, resMes, resRec] = await Promise.all([
        //fetch(`${API_URL}/estaciones?sucursalId=${sucursalId}`),
        fetch(`${API_URL}/estaciones/sucursal/${sucursalId}`),
        fetch(`${API_URL}/tickets/pendientes?sucursalId=${sucursalId}`),
        fetch(crearUrlReporte(hoy, hoy)),
        fetch(crearUrlReporte(mesInicio, hoy)),
        fetch(`${API_URL}/empleados/receptores?sucursalId=${sucursalId}`),
      ]);

      setEstaciones(await resEst.json());
      setEspera(await resEsp.json());
      setTicketsHoy(await resHoy.json());
      setTicketesMes(await resMes.json());

      // Receptores: adapta según el shape real de tu API
      const recData = await resRec.json();
      setReceptores(
        recData.map((r: any) => ({
          id: r.empleadoId ?? r.id,
          nombre: r.empleadoNombre ?? r.nombre,
          iniciales: initials(r.empleadoNombre ?? r.nombre ?? ""),
          estacion: r.estacionCodigo ?? r.estacion ?? "—",
          estado: r.estacionEstado ?? r.estado ?? "Disponible",
          tickets: r.ticketsHoy ?? r.tickets ?? 0,
          tiempo: r.tiempoPromedioAtencion ?? r.tiempo ?? 0,
        }))
      );
    } catch (err) {
      console.error("Error en PanelGeneral:", err);
    }
  };

  useEffect(() => {
    fetchAll();
    const iv = setInterval(fetchAll, 10000);
    return () => clearInterval(iv);
  }, []);

  // ── Agrupaciones ──
  const porEmpleado = ticketsHoy.reduce<Record<string, number>>((acc, t) => {
  const k =
    t.Empleado?.trim?.() ||
    t.empleadoNombre?.trim?.() ||
    t.Receptor?.trim?.() ||
    t.receptorNombre?.trim?.() ||
    "Sin asignar";

  acc[k] = (acc[k] || 0) + 1;
  return acc;
}, {});

  const porTipoAtencion = ticketsHoy.reduce<Record<string, number>>((acc, t) => {
    const k = t.Tipo_Atencion || "Sin tipo";
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});

  const porTipoTurno = ticketsHoy.reduce<Record<string, number>>((acc, t) => {
    const k = t.Tipo_Numero || "Sin tipo";
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});

  const estDisp = estaciones.filter((e) => e.estacionEstado === "Disponible").length;
  const estOcup = estaciones.filter((e) => e.estacionEstado === "En Atención").length;

  const recFiltrados =
    recFilter === "todos" ? receptores : receptores.filter((r) => r.estado === recFilter);

  const today = new Date().toLocaleDateString("es-HN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  // ── Styles ──
  const S = {
    app: { display: "flex", minHeight: "100vh", fontFamily: "'DM Sans', system-ui, sans-serif", background: "#f8fafc", color: "#0f172a" } as React.CSSProperties,
    sidebar: { width: 220, flexShrink: 0, background: "#fff", borderRight: "1px solid #e2e8f0", display: "flex", flexDirection: "column" as const },
    sidebarLogo: { padding: "20px 20px 16px", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 10 },
    logoIcon: { width: 34, height: 34, borderRadius: 10, background: "#0034f7", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 600, fontSize: 15, flexShrink: 0 },
    sidebarNav: { padding: 12, flex: 1 },
    navSection: { fontSize: 10, fontWeight: 600, letterSpacing: "1.2px", textTransform: "uppercase" as const, color: "#94a3b8", padding: "0 8px", margin: "16px 0 6px" },
    sidebarFooter: { padding: "14px 20px", borderTop: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 10 },
    main: { flex: 1, overflow: "auto", display: "flex", flexDirection: "column" as const },
    topbar: { background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "14px 24px", display: "flex", alignItems: "center", gap: 12, position: "sticky" as const, top: 0, zIndex: 10 },
    content: { padding: 24 },
    kpiGrid: { display: "flex", gap: 14, marginBottom: 24 },
    grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
    recGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 },
  };

  const navItem = (active: boolean): React.CSSProperties => ({
    display: "flex", alignItems: "center", gap: 9,
    padding: "9px 10px", borderRadius: 8, cursor: "pointer",
    fontSize: 13.5, fontWeight: 500,
    color: active ? "#0034f7" : "#475569",
    background: active ? "#e8edff" : "transparent",
    border: "none", width: "100%", textAlign: "left",
    marginBottom: 2, transition: "all 0.15s",
  });

  return (
    <div style={S.app}>
      {/* ── SIDEBAR ── */}
      <div style={S.sidebar}>
        <div style={S.sidebarLogo}>
          <div style={S.logoIcon}>JS</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.3px" }}>Jetstereo</div>
            <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 400 }}>Sistema de Turnos</div>
          </div>
        </div>

        <div style={S.sidebarNav}>
          <div style={S.navSection}>Principal</div>

          <button style={navItem(page === "dashboard")} onClick={() => setPage("dashboard")}>
            <IconGrid /> Panel General
          </button>

          <button style={navItem(page === "receptores")} onClick={() => setPage("receptores")}>
            <IconUsers /> Receptores
            <span style={{ marginLeft: "auto", background: "#0034f7", color: "#fff", fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 20, fontFamily: "monospace" }}>
              {receptores.length || "—"}
            </span>
          </button>

          <div style={S.navSection}>Reportes</div>

          <button style={navItem(false)}>
            <IconChart /> Estadísticas
          </button>

          <button style={navItem(false)}>
            <IconCal /> Historial
          </button>
        </div>

        <div style={S.sidebarFooter}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#e8edff", color: "#0034f7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600 }}>
            SV
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Supervisor</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>{sucursalId ? `Sucursal #${sucursalId}` : "General"}</div>
          </div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={S.main}>
        {/* TOPBAR */}
        <div style={S.topbar}>
          <div style={{ fontSize: 16, fontWeight: 600, flex: 1 }}>
            {page === "dashboard" ? "Panel General" : "Receptores"}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f8fafc", border: "1px solid #e2e8f0", padding: "7px 12px", borderRadius: 8, maxWidth: 240, flex: 1 }}>
            <IconSearch />
            <input placeholder="Buscar..." style={{ border: "none", background: "none", outline: "none", fontSize: 13, fontFamily: "inherit", color: "#0f172a", width: "100%" }} />
          </div>
          <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 400, whiteSpace: "nowrap" }}>{today}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#f0fdf4", color: "#16a34a", padding: "5px 11px", borderRadius: 20, fontSize: 12, fontWeight: 500, border: "1px solid #bbf7d0" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#16a34a" }} />
            En línea
          </div>
        </div>

        <div style={S.content}>

          {/* ════════════════ DASHBOARD PAGE ════════════════ */}
          {page === "dashboard" && (
            <>
              {/* KPIs */}
              <div style={S.kpiGrid}>
                <KpiCard label="Tickets hoy" value={ticketsHoy.length} sub="Todos los estados" accent="#0034f7"
                  icon={<svg width="18" height="18" fill="none" stroke="#0034f7" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>}
                />
                <KpiCard label="Este mes" value={ticketesMes.length} sub="Desde el 1 del mes" accent="#8b5cf6"
                  icon={<svg width="18" height="18" fill="none" stroke="#8b5cf6" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
                />
                <KpiCard label="En espera" value={espera.length} sub="Pendientes en cola" accent="#f59e0b"
                  icon={<svg width="18" height="18" fill="none" stroke="#f59e0b" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
                />
                <KpiCard label="Estaciones disponibles" value={`${estDisp}/${estaciones.length}`} sub={`${estOcup} en atención`} accent="#10b981" icon={<svg width="18" height="18" fill="none" stroke="#10b981" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
                />
              </div>

              {/* Estaciones */}
              <SectionLabel>Estado de estaciones</SectionLabel>
              <Card>
                <CardHead title="Estaciones de la sucursal" right={<span style={{ fontSize: 12, color: "#94a3b8" }}>{estaciones.length} total</span>} />
                <div style={{ padding: "16px 20px", display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {estaciones.length === 0
                    ? <span style={{ fontSize: 13, color: "#94a3b8" }}>Sin datos</span>
                    : estaciones.map((e) => {
                        const c = colorEst(e.estacionEstado);
                        return (
                          <div key={e.estacionId} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 20, fontSize: 12, fontWeight: 500, background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: c.dot, flexShrink: 0 }} />
                            <strong>{e.estacionCodigo}</strong>&nbsp;—&nbsp;{e.estacionEstado}
                          </div>
                        );
                      })}
                </div>
              </Card>

              {/* Cola + Empleado */}
              <SectionLabel>Actividad en tiempo real</SectionLabel>
              <div style={S.grid2}>
                {/* Cola de espera */}
                <Card>
                  <CardHead title="Cola de espera" right={<CountBadge n={espera.length} />} />
                  <div style={{ maxHeight: 280, overflowY: "auto" }}>
                    {espera.length === 0
                      ? <Empty msg="Sin tickets en espera" />
                      : espera.map((t) => (
                          <div key={t.ticketId} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 20px", borderBottom: "1px solid #f8fafc", fontSize: 13 }}>
                            <div style={{ background: "#e8edff", color: "#0034f7", borderRadius: 6, padding: "3px 9px", fontFamily: "monospace", fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
                              {t.ticketNumero}
                            </div>
                            <div style={{ flex: 1, fontWeight: 500, color: "#0f172a", minWidth: 0 }}>
                              {t.clienteNombre}
                              <br />
                              <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 400 }}>{t.tiposTurnoNombre}</span>
                            </div>
                            <div style={{ background: "#fef3c7", color: "#92400e", fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 8, flexShrink: 0, fontFamily: "monospace" }}>
                              {t.tiempoEspera} min
                            </div>
                          </div>
                        ))}
                  </div>
                </Card>

                {/* Por empleado */}
                <Card>
                  <CardHead title="Por empleado (hoy)" />
                  <div style={{ maxHeight: 280, overflowY: "auto" }}>
                    {Object.keys(porEmpleado).length === 0
                      ? <Empty />
                      : (() => {
                          const max = Math.max(...Object.values(porEmpleado));
                          return Object.entries(porEmpleado).sort((a, b) => b[1] - a[1]).map(([k, v]) => (
                            <BarRow key={k} label={k} value={v} max={max} color="#0034f7" />
                          ));
                        })()}
                  </div>
                </Card>
              </div>

              {/* Tipos */}
              <SectionLabel>Distribución de tickets (hoy)</SectionLabel>
              <div style={S.grid2}>
                <Card>
                  <CardHead title="Por tipo de atención" />
                  {Object.keys(porTipoAtencion).length === 0
                    ? <Empty />
                    : (() => {
                        const max = Math.max(...Object.values(porTipoAtencion));
                        return Object.entries(porTipoAtencion).sort((a, b) => b[1] - a[1]).map(([k, v]) => (
                          <BarRow key={k} label={k} value={v} max={max} color="#8b5cf6" />
                        ));
                      })()}
                </Card>

                <Card>
                  <CardHead title="Por tipo de turno" />
                  {Object.keys(porTipoTurno).length === 0
                    ? <Empty />
                    : (() => {
                        const max = Math.max(...Object.values(porTipoTurno));
                        return Object.entries(porTipoTurno).sort((a, b) => b[1] - a[1]).map(([k, v]) => (
                          <BarRow key={k} label={k} value={v} max={max} color="#10b981" />
                        ));
                      })()}
                </Card>
              </div>
            </>
          )}

          {/* ════════════════ RECEPTORES PAGE ════════════════ */}
          {page === "receptores" && (
            <>
              {/* KPIs receptores */}
              <div style={{ display: "flex", gap: 14, marginBottom: 24 }}>
                <KpiCard label="Total receptores" value={receptores.length} sub="En esta sucursal" accent="#0034f7"
                  icon={<svg width="18" height="18" fill="none" stroke="#0034f7" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
                />
                <KpiCard label="En atención" value={receptores.filter((r) => r.estado === "En Atención").length} sub="Atendiendo ahora" accent="#10b981"
                  icon={<svg width="18" height="18" fill="none" stroke="#10b981" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
                />
                <KpiCard label="Disponibles" value={receptores.filter((r) => r.estado === "Disponible").length} sub="Libres para atender" accent="#f59e0b"
                  icon={<svg width="18" height="18" fill="none" stroke="#f59e0b" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
                />
              </div>

              {/* Filtros */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <SectionLabel>Gestores de la sucursal</SectionLabel>
                <div style={{ display: "flex", gap: 6 }}>
                  {[
                    { label: "Todos", value: "todos" },
                    { label: "En atención", value: "En Atención" },
                    { label: "Disponibles", value: "Disponible" },
                  ].map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setRecFilter(f.value)}
                      style={{
                        fontFamily: "inherit", fontSize: 12, fontWeight: 500,
                        padding: "5px 12px", borderRadius: 20, cursor: "pointer",
                        border: `1px solid ${recFilter === f.value ? "#0034f7" : "#e2e8f0"}`,
                        background: recFilter === f.value ? "#0034f7" : "#fff",
                        color: recFilter === f.value ? "#fff" : "#475569",
                        transition: "all 0.15s",
                      }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid de receptores */}
              <div style={S.recGrid}>
                {recFiltrados.length === 0 ? (
                  <Empty msg="Sin receptores para mostrar" />
                ) : (
                  recFiltrados.map((r) => {
                    const c = colorEst(r.estado);
                    return (
                      <div key={r.id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, textAlign: "center" }}>
                        {/* Avatar */}
                        <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#e8edff", color: "#0034f7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 600 }}>
                          {r.iniciales}
                        </div>

                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{r.nombre}</div>
                          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
                            {r.estacion !== "—" ? r.estacion : "Sin estación"}
                          </div>
                        </div>

                        {/* Estado */}
                        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 500, padding: "4px 10px", borderRadius: 20, background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: c.dot }} />
                          {r.estado}
                        </div>

                        {/* Stats */}
                        <div style={{ width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 4, borderTop: "1px solid #f1f5f9", paddingTop: 12 }}>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                            <div style={{ fontFamily: "monospace", fontSize: 20, fontWeight: 600, color: "#0f172a" }}>{r.tickets}</div>
                            <div style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>Tickets</div>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                            <div style={{ fontFamily: "monospace", fontSize: 20, fontWeight: 600, color: "#0f172a" }}>{r.tiempo > 0 ? `${r.tiempo}m` : "—"}</div>
                            <div style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>T. atención</div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}