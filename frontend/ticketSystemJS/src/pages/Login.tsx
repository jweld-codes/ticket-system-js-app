import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EyeOpen = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOff = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

function LoginGestor() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const [verClave, setVerClave] = useState(false);
  const [cargando, setCargando] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

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



  const iniciarSesion = async () => {
    if (!usuario || !clave) {
      setError("Por favor completa todos los campos.");
      return;
    }
    setError("");
    setCargando(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, clave }),
      });
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        setError("Error de conexión con el servidor.");
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Usuario o contraseña incorrectos.");
        return;
      }

      localStorage.setItem("usuario", JSON.stringify(data));
      if (data.empleadosRol === "Administrador") {
          navigate("/admin", { replace: true });
        } else if (data.empleadosRol === "Supervisor") {
          navigate("/supervisor", { replace: true });
        } else if (data.empleadosRol === "Gestor") {
          navigate(`/gestor?kioskoId=${data.kioskoId}&kioskoNumero=${data.kioskoNumero}&sucursalId=${data.sucursalesId}&estacionID=${data.estacionId}`, { replace: true });
        } else {
          alert("Rol no autorizado");
        }
        
    } catch {
      setError("No se pudo conectar al servidor.");
    } finally {
      setCargando(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") iniciarSesion();
  };

  return (
    <>
      {/* ── Fuentes ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;600;700&family=Barlow+Condensed:wght@700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .js-login-page {
          min-height: 100vh;
          min-height: 100dvh;
          background: #0a0a0a;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Barlow', sans-serif;
          position: relative;
          overflow: hidden;
          padding: 16px;
        }

        .js-bg-grid {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(220,20,20,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(220,20,20,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        .js-bg-glow {
          position: fixed;
          top: -200px;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 400px;
          background: radial-gradient(ellipse, rgba(200,10,10,0.12) 0%, transparent 70%);
          pointer-events: none;
        }

        .js-card {
          position: relative;
          width: 100%;
          max-width: 420px;
          background: #111111;
          border: 1px solid #222;
          border-radius: 4px;
          padding: 48px 44px 40px;
          box-shadow: 0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03);
        }

        .js-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: #1536ea;
          border-radius: 4px 4px 0 0;
        }

        .js-logo-text {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800;
          font-size: 32px;
          letter-spacing: 3px;
          color: #fff;
          text-transform: uppercase;
        }

        .js-label {
          display: block;
          font-size: 10px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: #555;
          margin-bottom: 8px;
          font-weight: 600;
        }

        .js-input {
          width: 100%;
          background: #0a0a0a;
          border: 1px solid #2a2a2a;
          border-radius: 3px;
          color: #fff;
          font-family: 'Barlow', sans-serif;
          font-size: 15px;
          padding: 13px 16px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          -webkit-appearance: none;
        }

        .js-input:focus {
          border-color: #1536ea;
          box-shadow: 0 0 0 3px rgba(204,0,0,0.08);
        }

        .js-input::placeholder { color: #333; }

        .js-input-pass { padding-right: 44px; }

        .js-toggle-pass {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #444;
          padding: 4px;
          display: flex;
          align-items: center;
          transition: color 0.2s;
          -webkit-tap-highlight-color: transparent;
        }

        .js-toggle-pass:hover { color: #1536ea; }

        .js-forgot-link {
          font-size: 12px;
          color: #444;
          text-decoration: none;
          letter-spacing: 0.5px;
          transition: color 0.2s;
          -webkit-tap-highlight-color: transparent;
        }

        .js-forgot-link:hover,
        .js-forgot-link:active { color: #CC0000; }

        .js-btn {
          width: 100%;
          background: #1536ea;
          border: none;
          border-radius: 3px;
          color: #fff;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          padding: 14px;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }

        .js-btn:hover:not(:disabled) { background: #112bbe; }
        .js-btn:active:not(:disabled) { transform: scale(0.99); }
        .js-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .js-error {
          margin-top: 16px;
          padding: 11px 14px;
          background: rgba(204,0,0,0.08);
          border: 1px solid rgba(204,0,0,0.25);
          border-radius: 3px;
          color: #ff4444;
          font-size: 13px;
        }

        /* ── Tablet / iPad ── */
        @media (min-width: 481px) and (max-width: 1024px) {
          .js-card {
            max-width: 480px;
            padding: 52px 52px 44px;
          }
          .js-logo-text { font-size: 34px; }
          .js-input { font-size: 16px; padding: 14px 16px; }
          .js-btn { font-size: 16px; padding: 15px; }
        }

        /* ── Móvil ── */
        @media (max-width: 480px) {
          .js-login-page {
            align-items: flex-start;
            padding: 0;
          }
          .js-card {
            max-width: 100%;
            min-height: 100vh;
            min-height: 100dvh;
            border-radius: 0;
            border-left: none;
            border-right: none;
            padding: 56px 24px 40px;
            display: flex;
            flex-direction: column;
          }
          .js-logo-text { font-size: 28px; letter-spacing: 2px; }
          .js-input {
            font-size: 16px; /* evita zoom en iOS */
            padding: 14px 16px;
          }
          .js-input-pass { padding-right: 48px; }
          .js-btn {
            padding: 16px;
            font-size: 15px;
            margin-top: auto; /* empuja el botón hacia abajo en móvil */
          }
          .js-label { font-size: 11px; }
          .js-footer-spacer { flex: 1; }
        }

        /* ── Pantalla muy pequeña (≤360px) ── */
        @media (max-width: 360px) {
          .js-card { padding: 48px 20px 36px; }
          .js-logo-text { font-size: 24px; }
        }

        /* ── Landscape en móvil ── */
        @media (max-width: 480px) and (orientation: landscape) {
          .js-login-page { align-items: center; padding: 16px; }
          .js-card {
            min-height: unset;
            border-radius: 4px;
            border: 1px solid #222;
            padding: 32px 28px 28px;
          }
          .js-btn { margin-top: 0; }
          .js-logo-area { margin-bottom: 20px; }
          .js-field-group { margin-bottom: 14px; }
          .js-forgot-wrap { margin-bottom: 18px; }
        }
      `}</style>

      <div className="js-login-page">
        <div className="js-bg-grid" />
        <div className="js-bg-glow" />

        <div className="js-card">
          {/* Logo */}
          <div className="js-logo-area" style={{ textAlign: "center", marginBottom: "36px" }}>
            <div className="js-logo-text">
              JET<span style={{ color: "#1536ea" }}>STEREO</span>
            </div>
            <div style={{ fontSize: "11px", letterSpacing: "4px", color: "#444", textTransform: "uppercase", marginTop: "4px", fontWeight: 300 }}>
              Sistema de Turnos
            </div>
            <div style={{ width: "32px", height: "1px", background: "#1536ea", margin: "14px auto 0" }} />
          </div>

          {/* Usuario */}
          <div className="js-field-group" style={{ marginBottom: "20px" }}>
            <label className="js-label">Usuario</label>
            <input
              className="js-input"
              type="text"
              placeholder="Ingresa tu usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="username"
              autoCapitalize="none"
              autoCorrect="off"
            />
          </div>

          {/* Contraseña */}
          <div className="js-field-group" style={{ marginBottom: "20px" }}>
            <label className="js-label">Contraseña</label>
            <div style={{ position: "relative" }}>
              <input
                className={`js-input js-input-pass`}
                type={verClave ? "text" : "password"}
                placeholder="••••••••"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="js-toggle-pass"
                onClick={() => setVerClave(!verClave)}
                title={verClave ? "Ocultar contraseña" : "Ver contraseña"}
                aria-label={verClave ? "Ocultar contraseña" : "Ver contraseña"}
              >
                {verClave ? <EyeOff /> : <EyeOpen />}
              </button>
            </div>
          </div>

          {/* Olvidé contraseña */}
          <div className="js-forgot-wrap" style={{ textAlign: "right", marginTop: "-8px", marginBottom: "28px" }}>
            <a href="#" className="js-forgot-link">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {/* Espaciador móvil */}
          <div className="js-footer-spacer" />

          {/* Botón */}
          <button
            className="js-btn"
            onClick={iniciarSesion}
            disabled={cargando}
          >
            {cargando ? "Verificando..." : "Iniciar Sesión"}
          </button>

          {/* Error */}
          {error && <div className="js-error">{error}</div>}

          <div style={{ textAlign: "center", marginTop: "28px", fontSize: "11px", color: "#2a2a2a", letterSpacing: "1px" }}>
            Recepción · Jetstereo
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginGestor;