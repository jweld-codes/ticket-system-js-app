// src/pages/supervisor/Clientes.tsx
import { useEffect, useState } from "react";

interface Cliente {
  clienteId: number;
  clienteNombre: string;
  clienteDNI: string;
}

const IconUser = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconId = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="2" y="5" width="20" height="14" rx="2"/>
    <path d="M16 10h2M16 14h2M6 10h6M6 14h4"/>
  </svg>
);
const IconEdit = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const IconSave = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
  </svg>
);
const IconX = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IconSearch = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IconPlus = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

export default function Clientes() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [nombre,        setNombre]        = useState("");
  const [dni,           setDni]           = useState("");
  const [clientes,      setClientes]      = useState<Cliente[]>([]);
  const [busqueda,      setBusqueda]      = useState("");
  const [editandoId,    setEditandoId]    = useState<number | null>(null);
  const [editNombre,    setEditNombre]    = useState("");
  const [editDni,       setEditDni]       = useState("");
  const [cargando,      setCargando]      = useState(false);
  const [guardando,     setGuardando]     = useState(false);
  const [error,         setError]         = useState("");
  const [exito,         setExito]         = useState("");
  const [mostrarForm,   setMostrarForm]   = useState(false);

  const obtenerClientes = async () => {
    setCargando(true);
    try {
      const res  = await fetch(`${API_URL}/clientes`);
      const data = await res.json();
      setClientes(Array.isArray(data) ? data : []);
    } catch { setClientes([]); }
    finally  { setCargando(false); }
  };

  useEffect(() => { obtenerClientes(); }, []);

  const mostrarExito = (msg: string) => {
    setExito(msg);
    setTimeout(() => setExito(""), 3000);
  };

  const guardarCliente = async () => {
    if (!nombre.trim() || !dni.trim()) { setError("Nombre y DNI son requeridos."); return; }
    setError(""); setGuardando(true);
    try {
      const res = await fetch(`${API_URL}/clientes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nombre.trim(), dni: dni.trim() }),
      });
      if (!res.ok) { setError("Error al guardar el cliente."); return; }
      setNombre(""); setDni(""); setMostrarForm(false);
      await obtenerClientes();
      mostrarExito("Cliente guardado correctamente.");
    } catch { setError("Error de conexión."); }
    finally { setGuardando(false); }
  };

  const iniciarEdicion = (c: Cliente) => {
    setEditandoId(c.clienteId);
    setEditNombre(c.clienteNombre);
    setEditDni(c.clienteDNI);
    setError("");
  };

  const guardarEdicion = async (id: number) => {
    if (!editNombre.trim() || !editDni.trim()) { setError("Nombre y DNI son requeridos."); return; }
    setError(""); setGuardando(true);
    try {
      const res = await fetch(`${API_URL}/clientes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: editNombre.trim(), dni: editDni.trim() }),
      });
      if (!res.ok) { setError("Error al actualizar el cliente."); return; }
      setEditandoId(null);
      await obtenerClientes();
      mostrarExito("Cliente actualizado correctamente.");
    } catch { setError("Error de conexión."); }
    finally { setGuardando(false); }
  };

  const cancelarEdicion = () => { setEditandoId(null); setError(""); };

  const filtrados = clientes.filter(c =>
    c.clienteNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.clienteDNI.includes(busqueda)
  );

  const iniciales = (nombre: string) =>
    nombre.split(" ").slice(0, 2).map(n => n[0] ?? "").join("").toUpperCase() || "?";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;600;700&family=Barlow+Condensed:wght@700;800&display=swap');

        .cl-title { font-family:'Barlow Condensed',sans-serif; font-size:26px; font-weight:800; color:#0f172a; margin-bottom:4px; }
        .cl-sub   { font-size:13px; color:#94a3b8; margin-bottom:20px; }

        /* Toast */
        .cl-toast {
          display:flex; align-items:center; gap:10px;
          padding:11px 16px; border-radius:10px; font-size:13px; font-weight:600;
          margin-bottom:16px; animation:cl-fadein .2s ease;
        }
        .cl-toast-ok  { background:#dcfce7; color:#16a34a; border:1px solid #86efac; }
        .cl-toast-err { background:#fee2e2; color:#dc2626; border:1px solid #fca5a5; }
        @keyframes cl-fadein { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }

        /* Toolbar */
        .cl-toolbar {
          display:flex; flex-wrap:wrap; gap:10px; align-items:center;
          margin-bottom:16px;
        }
        .cl-search-wrap {
          display:flex; align-items:center; gap:8px;
          flex:1; min-width:200px;
          background:#fff; border:1px solid #e2e8f0; border-radius:10px;
          padding:9px 14px; transition:border-color .2s;
        }
        .cl-search-wrap:focus-within { border-color:#1536ea; box-shadow:0 0 0 3px rgba(21,54,234,.1); }
        .cl-search-icon { color:#94a3b8; flex-shrink:0; }
        .cl-search-input {
          border:none; outline:none; background:transparent;
          font-family:'Barlow',sans-serif; font-size:13px; color:#0f172a; width:100%;
        }
        .cl-search-input::placeholder { color:#c1c9d4; }

        /* Botones acción */
        .cl-btn {
          display:inline-flex; align-items:center; gap:7px;
          padding:9px 18px; border:none; border-radius:10px;
          font-family:'Barlow',sans-serif; font-size:13px; font-weight:700;
          cursor:pointer; transition:all .15s; letter-spacing:.2px;
          white-space:nowrap;
        }
        .cl-btn-primary { background:#1536ea; color:#fff; }
        .cl-btn-primary:hover:not(:disabled) { background:#1229c7; }
        .cl-btn-primary:disabled { opacity:.5; cursor:not-allowed; }
        .cl-btn-ghost   { background:#f1f5f9; color:#475569; }
        .cl-btn-ghost:hover   { background:#e2e8f0; }
        .cl-btn-danger  { background:#fee2e2; color:#dc2626; }
        .cl-btn-danger:hover  { background:#fecaca; }
        .cl-btn-save    { background:#dcfce7; color:#16a34a; }
        .cl-btn-save:hover:not(:disabled) { background:#bbf7d0; }
        .cl-btn-save:disabled { opacity:.5; cursor:not-allowed; }
        .cl-btn-sm { padding:6px 12px; font-size:12px; border-radius:8px; }

        /* Formulario nuevo cliente */
        .cl-form {
          background:#fff; border:1px solid #e2e8f0; border-radius:16px;
          padding:22px 24px 20px; margin-bottom:16px;
          animation:cl-fadein .2s ease;
          border-top:3px solid #1536ea;
        }
        .cl-form-title { font-family:'Barlow Condensed',sans-serif; font-size:17px; font-weight:800; color:#0f172a; margin-bottom:16px; }
        .cl-form-grid  { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:16px; }
        .cl-form-field { display:flex; flex-direction:column; gap:6px; }
        .cl-form-label { font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#64748b; }
        .cl-form-input-wrap {
          display:flex; align-items:center; gap:8px;
          background:#f8fafc; border:1px solid #e2e8f0; border-radius:9px;
          padding:10px 13px; transition:border-color .2s;
        }
        .cl-form-input-wrap:focus-within { border-color:#1536ea; box-shadow:0 0 0 3px rgba(21,54,234,.1); background:#fff; }
        .cl-form-input-icon { color:#94a3b8; flex-shrink:0; }
        .cl-form-input {
          border:none; outline:none; background:transparent;
          font-family:'Barlow',sans-serif; font-size:14px; color:#0f172a; width:100%;
        }
        .cl-form-input::placeholder { color:#c1c9d4; }
        .cl-form-actions { display:flex; gap:10px; }

        /* Card tabla */
        .cl-card { background:#fff; border:1px solid #e2e8f0; border-radius:16px; overflow:hidden; }
        .cl-card-head {
          display:flex; align-items:center; justify-content:space-between;
          padding:14px 20px; border-bottom:1px solid #f1f5f9;
        }
        .cl-card-title { font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#94a3b8; }
        .cl-counter { background:#1536ea; color:#fff; font-size:11px; font-weight:700; padding:2px 9px; border-radius:20px; }

        /* Tabla */
        .cl-table { width:100%; border-collapse:collapse; font-size:13px; }
        .cl-table th {
          padding:10px 16px; background:#f8fafc;
          border-bottom:2px solid #e2e8f0;
          font-size:10px; font-weight:700; letter-spacing:1.5px;
          text-transform:uppercase; color:#64748b; text-align:left; white-space:nowrap;
        }
        .cl-table td { padding:0; border-bottom:1px solid #f8fafc; }
        .cl-table tr:last-child td { border-bottom:none; }
        .cl-table tr:hover .cl-td-inner { background:#fafbff; }

        .cl-td-inner { padding:12px 16px; display:flex; align-items:center; }

        /* Avatar */
        .cl-avatar {
          width:34px; height:34px; border-radius:9px; flex-shrink:0;
          background:#eef2ff; color:#1536ea;
          display:flex; align-items:center; justify-content:center;
          font-family:'Barlow Condensed',sans-serif; font-weight:800; font-size:13px;
          margin-right:11px;
        }
        .cl-nombre { font-weight:600; color:#0f172a; }

        /* Fila en edición */
        .cl-edit-row td { background:#fafbff; }
        .cl-edit-input {
          width:100%; padding:7px 11px;
          border:1px solid #c7d2fe; border-radius:8px;
          font-family:'Barlow',sans-serif; font-size:13px; color:#0f172a;
          background:#fff; outline:none;
          transition:border-color .2s, box-shadow .2s;
        }
        .cl-edit-input:focus { border-color:#1536ea; box-shadow:0 0 0 3px rgba(21,54,234,.1); }

        .cl-empty { padding:48px 20px; text-align:center; color:#94a3b8; font-size:14px; }
        .cl-spinner {
          width:22px; height:22px; border-radius:50%;
          border:3px solid #e8ecfd; border-top-color:#1536ea;
          animation:cl-spin .8s linear infinite; margin:0 auto;
        }
        @keyframes cl-spin { to{transform:rotate(360deg)} }

        @media (max-width:600px) {
          .cl-form-grid { grid-template-columns:1fr; }
          .cl-toolbar { flex-direction:column; align-items:stretch; }
          .cl-form-actions { flex-direction:column; }
        }
      `}</style>

      <div className="cl-title">Clientes</div>
      <div className="cl-sub">Gestión del directorio de clientes</div>

      {/* Toasts */}
      {exito && <div className="cl-toast cl-toast-ok">✓ {exito}</div>}
      {error && <div className="cl-toast cl-toast-err">⚠ {error}</div>}

      {/* Toolbar */}
      <div className="cl-toolbar">
        <div className="cl-search-wrap">
          <span className="cl-search-icon"><IconSearch /></span>
          <input
            className="cl-search-input"
            placeholder="Buscar por nombre o DNI..."
            value={busqueda}
            onChange={e => { setBusqueda(e.target.value); }}
          />
          {busqueda && (
            <button onClick={() => setBusqueda("")}
              style={{ background:"none", border:"none", cursor:"pointer", color:"#94a3b8", display:"flex", padding:2 }}>
              <IconX />
            </button>
          )}
        </div>
        <button className="cl-btn cl-btn-primary" onClick={() => { setMostrarForm(p => !p); setError(""); }}>
          <IconPlus /> Nuevo cliente
        </button>
      </div>

      {/* Formulario nuevo cliente */}
      {mostrarForm && (
        <div className="cl-form">
          <div className="cl-form-title">Nuevo cliente</div>
          <div className="cl-form-grid">
            <div className="cl-form-field">
              <label className="cl-form-label">Nombre completo</label>
              <div className="cl-form-input-wrap">
                <span className="cl-form-input-icon"><IconUser /></span>
                <input
                  className="cl-form-input"
                  placeholder="Ej. María López"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  autoCapitalize="words"
                  onKeyDown={e => e.key === "Enter" && guardarCliente()}
                />
              </div>
            </div>
            <div className="cl-form-field">
              <label className="cl-form-label">Número de documento</label>
              <div className="cl-form-input-wrap">
                <span className="cl-form-input-icon"><IconId /></span>
                <input
                  className="cl-form-input"
                  placeholder="Ej. 0801-1990-12345"
                  value={dni}
                  onChange={e => setDni(e.target.value)}
                  inputMode="numeric"
                  onKeyDown={e => e.key === "Enter" && guardarCliente()}
                />
              </div>
            </div>
          </div>
          <div className="cl-form-actions">
            <button className="cl-btn cl-btn-primary" onClick={guardarCliente} disabled={guardando}>
              <IconSave /> {guardando ? "Guardando..." : "Guardar cliente"}
            </button>
            <button className="cl-btn cl-btn-ghost" onClick={() => { setMostrarForm(false); setNombre(""); setDni(""); setError(""); }}>
              <IconX /> Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="cl-card">
        <div className="cl-card-head">
          <span className="cl-card-title">Directorio</span>
          <span className="cl-counter">{filtrados.length} clientes</span>
        </div>

        {cargando ? (
          <div style={{ padding: 48 }}><div className="cl-spinner" /></div>
        ) : filtrados.length === 0 ? (
          <div className="cl-empty">
            {busqueda ? `Sin resultados para "${busqueda}"` : "No hay clientes registrados"}
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="cl-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Número de DNI</th>
                  <th style={{ width: 160 }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map(c => {
                  const editando = editandoId === c.clienteId;
                  return (
                    <tr key={c.clienteId} className={editando ? "cl-edit-row" : ""}>
                      {/* Columna nombre */}
                      <td>
                        <div className="cl-td-inner">
                          {!editando ? (
                            <>
                              <div className="cl-avatar">{iniciales(c.clienteNombre)}</div>
                              <span className="cl-nombre">{c.clienteNombre}</span>
                            </>
                          ) : (
                            <input
                              className="cl-edit-input"
                              value={editNombre}
                              onChange={e => setEditNombre(e.target.value)}
                              autoFocus
                              onKeyDown={e => e.key === "Enter" && guardarEdicion(c.clienteId)}
                            />
                          )}
                        </div>
                      </td>

                      {/* Columna DNI */}
                      <td>
                        <div className="cl-td-inner">
                          {!editando ? (
                            <span style={{ color: "#475569", fontFamily: "monospace", fontSize: 13 }}>
                              {c.clienteDNI}
                            </span>
                          ) : (
                            <input
                              className="cl-edit-input"
                              value={editDni}
                              onChange={e => setEditDni(e.target.value)}
                              inputMode="numeric"
                              onKeyDown={e => e.key === "Enter" && guardarEdicion(c.clienteId)}
                            />
                          )}
                        </div>
                      </td>

                      {/* Acciones */}
                      <td>
                        <div className="cl-td-inner" style={{ gap: 8 }}>
                          {!editando ? (
                            <button
                              className="cl-btn cl-btn-ghost cl-btn-sm"
                              onClick={() => iniciarEdicion(c)}
                              title="Editar"
                            >
                              <IconEdit /> Editar
                            </button>
                          ) : (
                            <>
                              <button
                                className="cl-btn cl-btn-save cl-btn-sm"
                                onClick={() => guardarEdicion(c.clienteId)}
                                disabled={guardando}
                                title="Guardar cambios"
                              >
                                <IconSave /> {guardando ? "..." : "Guardar"}
                              </button>
                              <button
                                className="cl-btn cl-btn-danger cl-btn-sm"
                                onClick={cancelarEdicion}
                                title="Cancelar"
                              >
                                <IconX />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}