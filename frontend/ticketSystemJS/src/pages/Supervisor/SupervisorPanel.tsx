// src/pages/SupervisorPanel.tsx
import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const IconBell = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const IconSettings = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);
const IconLogout = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const IconChevron = ({ open }: { open: boolean }) => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
    style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0)" }}>
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const NAV_ITEMS = [
  { to: "/supervisor",           label: "Panel General", icon: "▦" },
  { to: "/supervisor/tickets",   label: "Tickets",       icon: "🎟" },
  { to: "/supervisor/clientes",  label: "Clientes",      icon: "👥" },
  { to: "/supervisor/estaciones",label: "Estaciones",    icon: "🖥" },
];

export default function SupervisorPanel() {
  //const API_URL = import.meta.env.VITE_API_URL;
  const navigate  = useNavigate();
  const dropRef   = useRef<HTMLDivElement>(null);
  const u         = JSON.parse(localStorage.getItem("usuario") || "{}");
  const nombre    = `${u.empleadosPNombre ?? ""} ${u.empleadosPApellido ?? ""}`.trim();
  const rol       = u.empleadoUserEstado ?? "Supervisor";
  const iniciales = nombre.split(" ").slice(0,2).map((n: string) => n[0] ?? "").join("").toUpperCase() || "SU";

  const [dropOpen, setDropOpen]   = useState(false);
  const [notifCount]              = useState(3);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const cerrarSesion = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;600;700&family=Barlow+Condensed:wght@700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f0f2f8; font-family: 'Barlow', sans-serif; }

        .sv-shell { display: flex; flex-direction: column; min-height: 100vh; }

        /* ── Navbar ── */
        .sv-nav {
          position: sticky; top: 0; z-index: 50;
          height: 58px;
          background: #1536ea;
          display: flex; align-items: center;
          padding: 0 24px; gap: 0;
          box-shadow: 0 2px 16px rgba(21,54,234,0.25);
        }
        .sv-brand {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 21px; font-weight: 800; letter-spacing: 2px;
          text-transform: uppercase; color: #fff; white-space: nowrap;
          margin-right: 32px;
        }
        .sv-brand span { opacity: 0.45; }

        .sv-links { display: flex; align-items: center; gap: 4px; flex: 1; overflow-x: auto; }
        .sv-links::-webkit-scrollbar { display: none; }

        .sv-link {
          display: flex; align-items: center; gap: 7px;
          padding: 7px 14px; border-radius: 9px;
          font-size: 13px; font-weight: 600; white-space: nowrap;
          color: rgba(255,255,255,0.65); text-decoration: none;
          transition: background 0.15s, color 0.15s;
        }
        .sv-link:hover { color: #fff; background: rgba(255,255,255,0.1); }
        .sv-link.active { color: #fff; background: rgba(255,255,255,0.18); }

        .sv-right { display: flex; align-items: center; gap: 12px; margin-left: auto; flex-shrink: 0; }

        /* Notificaciones */
        .sv-bell {
          position: relative; cursor: pointer;
          color: rgba(255,255,255,0.7);
          background: none; border: none; padding: 6px;
          display: flex; align-items: center; border-radius: 8px;
          transition: background 0.15s, color 0.15s;
        }
        .sv-bell:hover { color: #fff; background: rgba(255,255,255,0.12); }
        .sv-bell-badge {
          position: absolute; top: 2px; right: 2px;
          width: 16px; height: 16px; border-radius: 50%;
          background: #ef4444; border: 2px solid #1536ea;
          font-size: 9px; font-weight: 800; color: #fff;
          display: flex; align-items: center; justify-content: center;
        }

        /* Dropdown usuario */
        .sv-user-btn {
          display: flex; align-items: center; gap: 9px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 10px; padding: 5px 11px 5px 7px;
          cursor: pointer; color: #fff;
          font-family: 'Barlow', sans-serif; transition: background 0.15s;
        }
        .sv-user-btn:hover { background: rgba(255,255,255,0.2); }
        .sv-avatar-sm {
          width: 30px; height: 30px; border-radius: 8px;
          background: rgba(255,255,255,0.22);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800; font-size: 12px;
        }
        .sv-user-name { font-size: 13px; font-weight: 600; max-width: 130px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

        /* Dropdown panel */
        .sv-dropdown {
          position: absolute; top: calc(100% + 8px); right: 0;
          width: 240px; background: #fff;
          border: 1px solid #e2e8f0; border-radius: 14px;
          box-shadow: 0 16px 40px rgba(0,0,0,0.14);
          overflow: hidden; z-index: 200;
          animation: dd-in 0.15s ease;
        }
        @keyframes dd-in {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sv-dd-profile { padding: 16px; border-bottom: 1px solid #f1f5f9; }
        .sv-dd-avatar {
          width: 42px; height: 42px; border-radius: 11px;
          background: #eef2ff; color: #1536ea;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-size: 16px;
          margin-bottom: 9px;
        }
        .sv-dd-name { font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 2px; }
        .sv-dd-role { font-size: 12px; color: #64748b; }
        .sv-dd-sep  { height: 1px; background: #f1f5f9; }
        .sv-dd-item {
          display: flex; align-items: center; gap: 9px;
          padding: 11px 16px; font-size: 13px; font-weight: 600; color: #334155;
          cursor: pointer; transition: background 0.12s;
          background: none; border: none; width: 100%;
          font-family: 'Barlow', sans-serif; text-align: left;
        }
        .sv-dd-item:hover { background: #f8fafc; }
        .sv-dd-item.danger { color: #dc2626; }
        .sv-dd-item.danger:hover { background: #fff5f5; }
        .sv-dd-icon { color: #94a3b8; }
        .sv-dd-item.danger .sv-dd-icon { color: #fca5a5; }

        /* Page content */
        .sv-main { flex: 1; padding: 24px; }

        @media (max-width: 640px) {
          .sv-brand { font-size: 17px; margin-right: 12px; }
          .sv-user-name { display: none; }
          .sv-link { padding: 7px 10px; font-size: 12px; }
          .sv-main { padding: 16px 12px; }
        }
      `}</style>

      <div className="sv-shell">
        <nav className="sv-nav">
          <div className="sv-brand">JETSTEREO</div>

          <div className="sv-links">
            {NAV_ITEMS.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === "/supervisor"}
                className={({ isActive }) => `sv-link${isActive ? " active" : ""}`}
              >
                <span>{n.icon}</span> {n.label}
              </NavLink>
            ))}
          </div>

          <div className="sv-right">
            {/* Campana */}
            <button className="sv-bell">
              <IconBell />
              {notifCount > 0 && <span className="sv-bell-badge">{notifCount}</span>}
            </button>

            {/* Dropdown */}
            <div ref={dropRef} style={{ position: "relative" }}>
              <button className="sv-user-btn" onClick={() => setDropOpen(p => !p)}>
                <div className="sv-avatar-sm">{iniciales}</div>
                <span className="sv-user-name">{nombre || "Supervisor"}</span>
                <IconChevron open={dropOpen} />
              </button>

              {dropOpen && (
                <div className="sv-dropdown">
                  <div className="sv-dd-profile">
                    <div className="sv-dd-avatar">{iniciales}</div>
                    <div className="sv-dd-name">{nombre || "Supervisor"}</div>
                    <div className="sv-dd-role">{rol}</div>
                  </div>
                  <div className="sv-dd-sep" />
                  <button className="sv-dd-item">
                    <span className="sv-dd-icon"><IconSettings /></span> Configurar
                  </button>
                  <div className="sv-dd-sep" />
                  <button className="sv-dd-item danger" onClick={cerrarSesion}>
                    <span className="sv-dd-icon"><IconLogout /></span> Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>

        <main className="sv-main">
          <Outlet />
        </main>
      </div>
    </>
  );
}