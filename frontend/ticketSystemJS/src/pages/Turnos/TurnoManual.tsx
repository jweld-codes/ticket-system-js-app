// src/pages/TurnoManual.tsx
import { useState, useEffect} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import GenerandoTicket from "../../components/Tickets/GenerandoTicket";
import TicketGenerado from "../../components/Tickets/TicketGenerado";

const TIPOS_TURNO = [
  {
    codigo: "C",
    nombre: "Consulta",
    icono: "💬",
    descripcion: "Preguntas rápidas u orientación sin necesidad de caja.",
    accent: "#00e5a0",
    accentAlpha: "rgba(0,229,160,0.1)",
    accentBorder: "rgba(0,229,160,0.3)",
    tag: "Consulta",
  },
  {
    codigo: "A",
    nombre: "Atención General",
    icono: "🏦",
    descripcion: "Ingresos, Retiros, Cambios de Productos y Pagos.",
    accent: "#00d4ff",
    accentAlpha: "rgba(0,212,255,0.1)",
    accentBorder: "rgba(0,212,255,0.3)",
    tag: "General",
  },
  {
    codigo: "P",
    nombre: "Atención Prioritaria",
    icono: "🧓",
    descripcion: "Adultos mayores, mujeres embarazadas o personas con discapacidad.",
    accent: "#f59e0b",
    accentAlpha: "rgba(245,158,11,0.1)",
    accentBorder: "rgba(245,158,11,0.3)",
    tag: "Prioritario",
  }
];

type Paso = "tipo" | "datos" | "generando" | "ticket";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:       #080d1a;
    --surface:  #0e1525;
    --surface2: #141e30;
    --accent:   #00d4ff;
    --accent2:  #0099cc;
    --green:    #00e5a0;
    --text:     #eef2ff;
    --muted:    #5a6a8a;
    --border:   rgba(0,212,255,0.12);
    --glow:     0 0 40px rgba(0,212,255,0.1);
  }

  /* ── LAYOUT ── */
  .tm-root {
    font-family: 'Sora', sans-serif;
    min-height: 100vh; min-height: 100dvh;
    background: var(--bg);
    display: flex; flex-direction: column;
    align-items: center;
    position: relative; overflow-x: hidden;
  }

  /* Grid de fondo — sin bordes blancos, ocupa todo */
  .tm-grid {
    position: fixed; inset: 0;
    background-image:
      linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px);
    background-size: 56px 56px;
    pointer-events: none; z-index: 0;
  }

  /* Gradientes atmosféricos */
  .tm-atmo {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background:
      radial-gradient(ellipse 70% 45% at 50% -2%, rgba(0,212,255,0.12) 0%, transparent 60%),
      radial-gradient(ellipse 45% 40% at 2%  98%, rgba(0,229,160,0.08) 0%, transparent 55%),
      radial-gradient(ellipse 40% 40% at 98% 60%, rgba(0,52,247,0.08) 0%, transparent 55%);
  }

  /* ── NAV ── */
  .tm-nav {
    position: relative; z-index: 10;
    width: 100%; height: 58px; flex-shrink: 0;
    padding: 0 24px;
    display: flex; align-items: center; justify-content: space-between;
    border-bottom: 1px solid rgba(0,212,255,0.07);
    background: rgba(8,13,26,0.8);
    backdrop-filter: blur(16px);
  }

  .tm-nav-logo {
    height: 26px; width: auto;
    filter: brightness(0) invert(1) saturate(0) brightness(1.5);
    opacity: 0.9;
  }

  .tm-nav-pill {
    display: flex; align-items: center; gap: 6px;
    background: rgba(0,212,255,0.06);
    border: 1px solid var(--border);
    border-radius: 100px;
    padding: 5px 12px;
    font-size: 0.65rem; font-weight: 600;
    color: var(--accent); letter-spacing: 0.1em; text-transform: uppercase;
  }
  .tm-nav-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #4ade80; animation: blink 1.8s infinite;
  }
  @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0.35;} }

  /* ── BODY ── */
  .tm-body {
    position: relative; z-index: 2;
    width: 100%; max-width: 560px;
    padding: 32px 16px 64px;
    display: flex; flex-direction: column;
    align-items: center; gap: 22px;
  }

  /* ── HERO ── */
  .tm-hero {
    text-align: center;
    animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both;
  }
  .tm-hero-eyebrow {
    font-size: 0.65rem; font-weight: 700; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--accent);
    margin-bottom: 8px;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .tm-hero-eyebrow::before,
  .tm-hero-eyebrow::after {
    content: ''; width: 32px; height: 1px; background: var(--accent); opacity: 0.35;
  }
  .tm-hero h1 {
    font-size: clamp(1.75rem, 5vw, 2.4rem);
    font-weight: 800; color: var(--text);
    letter-spacing: -0.04em; line-height: 1.1;
    margin-bottom: 8px;
  }
  .tm-hero h1 em {
    font-style: normal;
    background: linear-gradient(120deg, #00d4ff, #00e5a0);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .tm-hero p { font-size: 0.82rem; color: var(--muted); font-weight: 300; }

  @keyframes fadeUp {
    from { opacity:0; transform:translateY(20px); }
    to   { opacity:1; transform:translateY(0); }
  }

  /* ── STEPPER ── */
  .tm-stepper {
    display: flex; align-items: center;
    width: 100%; max-width: 260px;
    animation: fadeUp 0.5s 0.08s cubic-bezier(0.16,1,0.3,1) both;
  }
  .tm-st { display: flex; flex-direction: column; align-items: center; gap: 5px; flex: 1; }
  .tm-st-circle {
    width: 32px; height: 32px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.75rem; font-weight: 800;
    border: 1.5px solid transparent; transition: all 0.25s;
  }
  .st-active  { background: var(--accent); color: var(--bg); box-shadow: 0 0 18px rgba(0,212,255,0.5); }
  .st-done    { background: rgba(0,229,160,0.1); color: var(--green); border-color: rgba(0,229,160,0.3); }
  .st-pending { background: var(--surface2); color: var(--muted); border-color: rgba(90,106,138,0.2); }
  .tm-st-label { font-size: 0.62rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); }
  .tm-st.is-active .tm-st-label { color: var(--accent); }
  .tm-st-line {
    flex: 1; height: 1px; margin-bottom: 22px;
    background: rgba(90,106,138,0.18); border-radius: 2px; transition: background 0.3s;
  }
  .tm-st-line.lit { background: linear-gradient(90deg, var(--accent), var(--accent2)); }

  /* ── CARD ── */
  .tm-card {
    width: 100%;
    background: linear-gradient(160deg, rgba(20,30,48,0.95) 0%, rgba(14,21,37,0.98) 100%);
    border: 1px solid rgba(0,212,255,0.1);
    border-radius: 20px;
    box-shadow: var(--glow), 0 32px 72px rgba(0,0,0,0.5);
    overflow: hidden; position: relative;
    animation: fadeUp 0.5s 0.12s cubic-bezier(0.16,1,0.3,1) both;
  }
  .tm-card::before {
    content: '';
    position: absolute; top: 0; left: 10%; right: 10%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0,212,255,0.5), transparent);
  }

  .tm-card-head {
    padding: 20px 24px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    display: flex; align-items: center; gap: 12px;
  }
  .tm-head-icon {
    width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0;
    background: rgba(0,212,255,0.07);
    border: 1px solid rgba(0,212,255,0.12);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem;
  }
  .tm-card-title { font-size: 1rem; font-weight: 700; color: var(--text); margin-bottom: 2px; letter-spacing: -0.02em; }
  .tm-card-sub   { font-size: 0.75rem; color: var(--muted); font-weight: 300; }

  .tm-card-body { padding: 20px 22px 4px; }
  .tm-card-foot { padding: 16px 22px 24px; display: flex; flex-direction: column; gap: 10px; }

  /* ── TIPOS ───────────────────────────── */
  .tm-tipos { display: flex; flex-direction: column; gap: 10px; }

  .tm-tipo {
    display: flex; align-items: center; gap: 14px;
    padding: 15px 18px;
    border-radius: 14px;
    border: 1.5px solid rgba(255,255,255,0.06);
    background: var(--surface2);
    cursor: pointer; width: 100%; text-align: left;
    font-family: 'Sora', sans-serif;
    transition: all 0.18s;
    -webkit-tap-highlight-color: transparent;
  }
  .tm-tipo:hover { border-color: rgba(0,212,255,0.22); background: rgba(0,212,255,0.04); }
  .tm-tipo:active { transform: scale(0.99); }

  .tm-tipo-emoji {
    width: 50px; height: 50px; border-radius: 13px; flex-shrink: 0;
    background: rgba(255,255,255,0.04);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.5rem; transition: background 0.18s;
  }
  .tm-tipo-info { flex: 1; min-width: 0; }
  .tm-tipo-nombre {
    font-size: 0.92rem; font-weight: 700; color: var(--text); margin-bottom: 3px;
  }
  .tm-tipo-desc { font-size: 0.73rem; color: var(--muted); font-weight: 300; line-height: 1.5; }
  .tm-tipo-tag {
    font-size: 0.6rem; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase;
    padding: 0.22rem 0.65rem; border-radius: 100px;
    white-space: nowrap; flex-shrink: 0;
    border: 1px solid; opacity: 0; transition: opacity 0.18s;
  }
  .tm-tipo.sel .tm-tipo-tag { opacity: 1; }

  /* ── RESUMEN ─────────────────────────── */
  .tm-resumen {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 14px; border-radius: 12px;
    border: 1px solid; background: rgba(255,255,255,0.025);
    margin-bottom: 18px;
  }
  .tm-resumen-ico { font-size: 1.2rem; }
  .tm-resumen-name { font-size: 0.85rem; font-weight: 600; flex: 1; }
  .tm-resumen-btn {
    font-size: 0.72rem; font-weight: 600; background: none; border: none;
    cursor: pointer; font-family: 'Sora', sans-serif;
    text-decoration: underline; color: var(--muted); opacity: 0.6; padding: 0;
    transition: opacity 0.15s;
  }
  .tm-resumen-btn:hover { opacity: 1; }

  /* ── FIELDS ── */
  .tm-field { margin-bottom: 22px; }
  .tm-field:last-child { margin-bottom: 0; }
  .tm-label {
    display: block; font-size: 0.63rem; font-weight: 700;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--accent); margin-bottom: 7px;
  }
  .tm-input-wrap { position: relative; }
  .tm-input-ico {
    position: absolute; left: 13px; top: 50%;
    transform: translateY(-50%); font-size: 0.9rem; pointer-events: none;
  }
  .tm-input {
    width: 100%; padding: 12px 14px 12px 40px;
    background: var(--surface2);
    border: 1.5px solid rgba(255,255,255,0.07);
    border-radius: 11px;
    font-family: 'Sora', sans-serif; font-size: 0.9rem; font-weight: 500;
    color: var(--text); outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    -webkit-appearance: none;
  }
  .tm-input::placeholder { color: var(--muted); font-weight: 300; }
  .tm-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(0,212,255,0.08);
  }

  /* ── ERROR ── */
  .tm-err {
    display: flex; align-items: center; gap: 8px;
    background: rgba(255,77,106,0.07);
    border: 1px solid rgba(255,77,106,0.22);
    border-radius: 10px; padding: 10px 14px; margin-bottom: 14px;
    font-size: 0.78rem; font-weight: 500; color: #ff4d6a;
    animation: shake 0.35s ease;
  }
  @keyframes shake { 0%,100%{transform:translateX(0);} 25%{transform:translateX(-5px);} 75%{transform:translateX(5px);} }

  /* ── HELPER ── */
  .tm-helper {
    font-size: 0.72rem; color: var(--accent);
    margin-top: 8px; font-weight: 400;
  }

  /* ── BUTTONS ── */
  .tm-btn {
    width: 100%; padding: 13px; border: none; border-radius: 11px;
    font-family: 'Sora', sans-serif; font-size: 0.9rem; font-weight: 700;
    cursor: pointer; transition: all 0.18s;
    display: flex; align-items: center; justify-content: center; gap: 6px;
    -webkit-tap-highlight-color: transparent; letter-spacing: -0.01em;
  }
  .tm-btn-primary {
    background: linear-gradient(135deg, #00d4ff, #0099cc);
    color: #080d1a;
    box-shadow: 0 6px 24px rgba(0,212,255,0.25);
  }
  .tm-btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(0,212,255,0.38); }
  .tm-btn-primary:active:not(:disabled) { transform: translateY(0); }
  .tm-btn-primary:disabled { opacity: 0.3; cursor: not-allowed; box-shadow: none; }
  .tm-btn-ghost {
    background: rgba(255,255,255,0.04); color: var(--muted);
    border: 1px solid rgba(255,255,255,0.07);
    margin-top: 2px;
  }
  .tm-btn-ghost:hover { background: rgba(255,255,255,0.07); color: var(--text); }

  /* ── MODAL ── */
  .tm-modal-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(8px);
    z-index: 50;
    display: flex; align-items: center; justify-content: center; padding: 24px;
    animation: fadeUp 0.2s ease;
  }
  .tm-modal {
    width: 100%; max-width: 360px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px; padding: 22px;
    box-shadow: var(--glow), 0 24px 60px rgba(0,0,0,.5);
    color: var(--text); display: flex; flex-direction: column; gap: 12px;
  }
  .tm-modal h3 { font-size: 1.1rem; font-weight: 700; }
  .tm-modal p  { color: var(--muted); font-size: .82rem; line-height: 1.5; }
  .tm-modal-name {
    background: var(--surface2); border: 1px solid rgba(255,255,255,.07);
    border-radius: 11px; padding: 13px;
    font-weight: 700; font-size: 0.97rem; color: var(--text);
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 420px) {
    .tm-body { padding: 20px 10px 48px; gap: 18px; }
    .tm-card-head { padding: 16px 16px 13px; }
    .tm-card-body { padding: 16px 14px 2px; }
    .tm-card-foot { padding: 12px 14px 20px; }
    .tm-tipo-top { padding: 12px 14px; }
    .tm-tipo-resumen { grid-template-columns: repeat(3, 1fr); }
    .tm-resumen-item { padding: 10px 4px; }
    .tm-resumen-item-text { font-size: 0.6rem; }
`;

function TurnoManual() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;


  const kioskoId     = searchParams.get("kioskoId");
  const kioskoNumero = searchParams.get("kioskoNumero");
  const kioskoSucursalId = searchParams.get("sucursalId");

  const [paso, setPaso]                         = useState<Paso>("tipo");
  const [tipoSeleccionado, setTipoSeleccionado] = useState<string>("");
  const [nombreCompleto, setNombreCompleto]     = useState("");
  const [dni, setDni]                           = useState("");
  const [ticket, setTicket]                     = useState<any>(null);
  const [error, setError]                       = useState("");
  const [clienteEncontrado, setClienteEncontrado] = useState<any>(null);
  const [mostrarConfirmarCliente, setMostrarConfirmarCliente] = useState(false);
  const [buscandoCliente, setBuscandoCliente] = useState(false);
  const [contadorSalida, setContadorSalida] = useState(3);

  const [primerNombre, setPrimerNombre] = useState("");
  const [segundoNombre, setSegundoNombre] = useState("");
  const [primerApellido, setPrimerApellido] = useState("");
  const [segundoApellido, setSegundoApellido] = useState("");

  const [mostrarInputsNombre, setMostrarInputsNombre] = useState(false);

  const tipoActual = TIPOS_TURNO.find((t) => t.codigo === tipoSeleccionado);

  const limpiarFormulario = () => {
  setTicket(null);
  setTipoSeleccionado("");
  setNombreCompleto("");
  setDni("");
  setError("");

  setPrimerNombre("");
  setSegundoNombre("");
  setPrimerApellido("");
  setSegundoApellido("");

  setClienteEncontrado(null);
  setMostrarConfirmarCliente(false);
  setMostrarInputsNombre(false);

  setPaso("tipo");
};

  const handleContinuar = () => { if (!tipoSeleccionado) return; setPaso("datos"); setError(""); };
  const handleVolver    = () => { setPaso("tipo"); setError(""); };

  const handleGenerar = async (nombreConfirmado?: string) => {
  setError("");

  if (dni.length !== 15) {
    setError("Debe ingresar un DNI válido con formato 0000-0000-00000.");
    return;
  }

  let nombreFinal = nombreConfirmado || nombreCompleto;

  if (!clienteEncontrado) {
    if (!primerNombre.trim() || !primerApellido.trim() || !segundoApellido.trim()) {
      setError("Debe ingresar primer nombre, primer apellido y segundo apellido.");
      return;
    }

    nombreFinal = construirNombreCompleto();
  }

  if (!nombreFinal.trim()) {
    setError("Debe ingresar nombre completo.");
    return;
  }

  setPaso("generando");

  try {
    const res = await fetch(`${API_URL}/tickets/manual`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombreCompleto: nombreFinal,
        dni: dni,
        tipoTurno: tipoSeleccionado,
        kioskoId: Number(kioskoId),
        sucursalId: Number(kioskoSucursalId),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Error al crear el ticket.");
      setPaso("datos");
      return;
    }

    await new Promise((r) => setTimeout(r, 1200));
    setTicket(data);
    setPaso("ticket");

  } catch {
    setError("No se pudo conectar al servidor.");
    setPaso("datos");
  }
};

  const handleSalir = () => {
  limpiarFormulario();

  const usuarioGuardado = localStorage.getItem("usuario");
  const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;

  if (Number(kioskoNumero) === 2 && usuario) {
    navigate(
      `/gestor?kioskoId=${usuario.kioskoId}&kioskoNumero=${usuario.kioskoNumero}&sucursalId=${usuario.sucursalesId}&estacionID=${usuario.estacionId}`,
      { replace: true }
    );
    return;
  }

  navigate(
    `/eleccion-turno?kioskoId=${kioskoId}&kioskoNumero=${kioskoNumero}&sucursalId=${kioskoSucursalId}`,
    { replace: true }
  );
};
  useEffect(() => {
  if (paso !== "ticket" || !ticket) return;

  setContadorSalida(3);

  const imprimirTimer = setTimeout(() => {
    window.print();
  }, 500);

  const intervalo = setInterval(() => {
    setContadorSalida((prev) => {
      if (prev <= 1) {
        clearInterval(intervalo);
        handleSalir();
        return 0;
      }

      return prev - 1;
    });
  }, 1000);

  return () => {
    clearTimeout(imprimirTimer);
    clearInterval(intervalo);
  };
}, [paso, ticket]);

  if (paso === "generando") return <GenerandoTicket />;
  if (paso === "ticket" && ticket) {
  return (
    <>
      <TicketGenerado
          ticket={ticket}
          onImprimir={() => window.print()}
          onSalir={handleSalir}
        />
    </>
  );
}

  const circleClass = (n: number) => {
    if (paso === "tipo"  && n === 1) return "st-active";
    if (paso === "datos" && n === 1) return "st-done";
    if (paso === "datos" && n === 2) return "st-active";
    return "st-pending";
  };

  const formatearDNI = (valor: string) => {
  const soloNumeros = valor.replace(/\D/g, "").slice(0, 13);

  if (soloNumeros.length <= 4) return soloNumeros;
  if (soloNumeros.length <= 8) {
    return `${soloNumeros.slice(0, 4)}-${soloNumeros.slice(4)}`;
  }

  return `${soloNumeros.slice(0, 4)}-${soloNumeros.slice(4, 8)}-${soloNumeros.slice(8)}`;
};

const capitalizar = (texto: string) => {
  return texto
    .trim()
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
};

const construirNombreCompleto = () => {
  return [
    primerNombre,
    segundoNombre,
    primerApellido,
    segundoApellido
  ]
    .map(capitalizar)
    .filter(Boolean)
    .join(" ");
};

const buscarClientePorDNI = async (dniFormateado: string) => {
  if (dniFormateado.length !== 15) return;

  try {
    setBuscandoCliente(true);
    setError("");

    const res = await fetch(`${API_URL}/clientes/dni/${dniFormateado}`);

    if (!res.ok) {
      setClienteEncontrado(null);
      setMostrarConfirmarCliente(false);
      setMostrarInputsNombre(true);
      setNombreCompleto("");
      setError("");
      return;
    }

    const data = await res.json();

    if (data.existe) {
      setClienteEncontrado(data.cliente);
      setMostrarConfirmarCliente(true);
      setMostrarInputsNombre(false);
      setNombreCompleto(data.cliente.clienteNombre);
    } else {
      setClienteEncontrado(null);
      setMostrarConfirmarCliente(false);
      setMostrarInputsNombre(true);
      setNombreCompleto("");
      setError("");
    }

  } catch {
    setClienteEncontrado(null);
    setMostrarConfirmarCliente(false);
    setMostrarInputsNombre(true);
    setNombreCompleto("");
    setError("");
  } finally {
    setBuscandoCliente(false);
  }
};

const handleDniChange = (valor: string) => {
  const dniFormateado = formatearDNI(valor);
  setDni(dniFormateado);

  if (dniFormateado.length === 15) {
    buscarClientePorDNI(dniFormateado);
  } else {
    setClienteEncontrado(null);
    setMostrarInputsNombre(false);
    setNombreCompleto("");
  }
};

  return (
    <>
      <style>{CSS}</style>
      <div className="tm-root">
        <div className="tm-grid" />

        {/* NAV */}
        <nav className="tm-nav">
          <div className="tm-nav-brand">JETSTEREO</div>
          <div className="tm-nav-pill">
            <span className="tm-nav-dot" />
            Kiosko #{kioskoNumero}
          </div>
        </nav>

        <div className="tm-body">

          {/* HERO */}
          <div className="tm-hero">
            <h1>CENTRO DE SERVICIO TÉCNICO <span>JETSTEREO</span></h1>
            <p>Complete los pasos para generar su ticket</p>
          </div>

          {/* STEPPER */}
          <div className="tm-stepper">
            <div className={`tm-st ${paso === "tipo" ? "is-active" : ""}`}>
              <div className={`tm-st-circle ${circleClass(1)}`}>
                {paso === "datos" ? "✓" : "1"}
              </div>
              <span className="tm-st-label">Tipo</span>
            </div>
            <div className={`tm-st-line ${paso === "datos" ? "lit" : ""}`} />
            <div className={`tm-st ${paso === "datos" ? "is-active" : ""}`}>
              <div className={`tm-st-circle ${circleClass(2)}`}>2</div>
              <span className="tm-st-label">Datos</span>
            </div>
          </div>

          {/* ── PASO 1 ── */}
          {paso === "tipo" && (
            <div className="tm-card">
              <div className="tm-card-head">
                  <div className="tm-head-icon">🎫</div>
                  <div>
                    <div className="tm-card-title">¿Qué atención necesitas?</div>
                    <div className="tm-card-sub">Selecciona una opción para continuar</div>
                  </div>
              </div>

              <div className="tm-card-body">
                <div className="tm-tipos">
                  {TIPOS_TURNO.map((t) => {
                    const sel = tipoSeleccionado === t.codigo;
                    return (
                      <button
                        key={t.codigo}
                        className={`tm-tipo${sel ? " sel" : ""}`}
                        style={sel ? {
                          borderColor: t.accent,
                          background: t.accentAlpha,
                          boxShadow: `0 0 0 3px ${t.accentAlpha}`,
                        } : {}}
                        onClick={() => setTipoSeleccionado(t.codigo)}
                      >
                        <div className="tm-tipo-emoji" style={sel ? { background: t.accentAlpha } : {}}>
                          {t.icono}
                        </div>
                        <div className="tm-tipo-info">
                          <div className="tm-tipo-nombre" style={sel ? { color: t.accent } : {}}>{t.nombre}</div>
                          <div className="tm-tipo-desc">{t.descripcion}</div>
                        </div>
                        <span
                          className="tm-tipo-tag"
                          style={{ color: t.accent, borderColor: t.accentBorder, background: t.accentAlpha }}
                        >
                          {t.tag}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="tm-card-foot">
                <button className="tm-btn tm-btn-primary" disabled={!tipoSeleccionado} onClick={handleContinuar}>
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {/* ── PASO 2 ── */}
          {paso === "datos" && (
            <div className="tm-card">
              <div className="tm-card-head">
                <div className="tm-head-icon">👤</div>
                <div>
                  <div className="tm-card-title">Tus datos</div>
                  <div className="tm-card-sub">Ingresa tu DNI para continuar</div>
                </div>
              </div>

              <div className="tm-card-body">
                {/* Resumen tipo seleccionado */}
                {tipoActual && (
                  <div className="tm-resumen" style={{ borderColor: tipoActual.accentBorder }}>
                    <span className="tm-resumen-ico">{tipoActual.icono}</span>
                    <span className="tm-resumen-name" style={{ color: tipoActual.accent }}>{tipoActual.nombre}</span>
                    <button className="tm-resumen-btn" onClick={handleVolver}>Cambiar</button>
                  </div>
                )}

                {error && <div className="tm-err">⚠ {error}</div>}

                <div className="tm-field">
                  <label className="tm-label">Número de DNI</label>
                  <div className="tm-input-wrap">
                    <span className="tm-input-ico">🪪</span>
                    <input
                      className="tm-input"
                      type="text"
                      placeholder="0000-0000-00000"
                      value={dni}
                      onChange={(e) => handleDniChange(e.target.value)}
                      autoComplete="off"
                      inputMode="numeric"
                      maxLength={15}
                    />
                  </div>
                  {buscandoCliente && (
                    <div className="tm-helper">Buscando cliente...</div>
                  )}
                </div>

                {mostrarInputsNombre && (
                  <>
                    {[
                      { label: "Primer nombre *", val: primerNombre, set: setPrimerNombre },
                      { label: "Segundo nombre",  val: segundoNombre, set: setSegundoNombre },
                      { label: "Primer apellido *", val: primerApellido, set: setPrimerApellido },
                      { label: "Segundo apellido *", val: segundoApellido, set: setSegundoApellido },
                    ].map(({ label, val, set }) => (
                      <div className="tm-field" key={label}>
                        <label className="tm-label">{label}</label>
                        <div className="tm-input-wrap">
                          <span className="tm-input-ico">👤</span>
                          <input
                            className="tm-input"
                            type="text"
                            value={val}
                            onChange={(e) => set(e.target.value)}
                            autoCapitalize="words"
                          />
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>

              {/* Modal confirmar cliente */}
              {mostrarConfirmarCliente && clienteEncontrado && (
                <div className="tm-modal-overlay">
                  <div className="tm-modal">
                    <h3>Confirmar cliente</h3>
                    <p>Encontramos este cliente registrado con ese DNI:</p>
                    <div className="tm-modal-name">{clienteEncontrado.clienteNombre}</div>
                    <p style={{ fontSize: "0.78rem" }}>DNI: {clienteEncontrado.clienteDNI}</p>
                    <button
                      className="tm-btn tm-btn-primary"
                      onClick={() => { setMostrarConfirmarCliente(false); handleGenerar(clienteEncontrado.clienteNombre); }}
                    >
                      Sí, generar mi ticket
                    </button>
                    <button
                      className="tm-btn tm-btn-ghost"
                      onClick={() => { setMostrarConfirmarCliente(false); setClienteEncontrado(null); setMostrarInputsNombre(true); setNombreCompleto(""); }}
                    >
                      No, ingresar otro nombre
                    </button>
                  </div>
                </div>
              )}

              <div className="tm-card-foot">
                <button
                  className="tm-btn tm-btn-primary"
                  onClick={() => handleGenerar()}
                  disabled={dni.length !== 15 || buscandoCliente}
                >
                   Generar Ticket
                </button>
                <button className="tm-btn tm-btn-ghost" onClick={handleVolver}>
                  ← Volver
                </button>
              </div>
            </div>
          )}

        </div>
      </div>


    </>
  );
}

export default TurnoManual;