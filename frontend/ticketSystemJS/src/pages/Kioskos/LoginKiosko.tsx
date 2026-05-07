import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap');

  :root {
    --bg: #0a0f1e;
    --surface: #111827;
    --surface2: #1a2235;
    --accent: #00d4ff;
    --accent2: #0099cc;
    --text: #f0f4ff;
    --muted: #6b7a99;
    --error: #ff4d6a;
    --border: rgba(0, 212, 255, 0.15);
    --glow: 0 0 40px rgba(0, 212, 255, 0.15);
  }

  .kiosko-root {
    font-family: 'Sora', sans-serif;
    min-height: 100vh;
    background: var(--bg);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    padding: 2rem;
  }

  .kiosko-root::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 50% at 50% -10%, rgba(0, 212, 255, 0.12) 0%, transparent 60%),
      radial-gradient(ellipse 40% 40% at 90% 90%, rgba(0, 153, 204, 0.08) 0%, transparent 50%);
    pointer-events: none;
  }

  .grid-bg {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(0, 212, 255, 0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 212, 255, 0.04) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
  }

  .login-card {
    position: relative;
    width: 100%;
    max-width: 480px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 3rem 3rem 2.5rem;
    box-shadow: var(--glow), 0 40px 80px rgba(0,0,0,0.5);
    animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .card-accent-line {
    position: absolute;
    top: 0; left: 10%; right: 10%;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
    border-radius: 2px;
  }

  .kiosko-icon {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, rgba(0,212,255,0.15), rgba(0,153,204,0.08));
    border: 1px solid var(--border);
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.75rem;
    font-size: 28px;
  }

  .login-title {
    font-size: 1.9rem;
    font-weight: 800;
    color: var(--text);
    letter-spacing: -0.03em;
    margin-bottom: 0.4rem;
    line-height: 1.1;
  }

  .login-subtitle {
    font-size: 0.9rem;
    color: var(--muted);
    font-weight: 300;
    margin-bottom: 2.5rem;
    letter-spacing: 0.02em;
  }

  .field-label {
    display: block;
    font-size: 0.72rem;
    font-weight: 600;
    color: var(--accent);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 0.6rem;
  }

  .input-wrapper {
    position: relative;
    margin-bottom: 1.75rem;
  }

  .kiosko-input {
    width: 100%;
    padding: 1rem 1.25rem 1rem 3rem;
    background: var(--surface2);
    border: 1.5px solid rgba(0, 212, 255, 0.12);
    border-radius: 12px;
    color: var(--text);
    font-family: 'JetBrains Mono', monospace;
    font-size: 1.1rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
  }

  .kiosko-input::placeholder {
    color: var(--muted);
    font-weight: 400;
    letter-spacing: 0.05em;
    font-family: 'Sora', sans-serif;
    font-size: 0.95rem;
  }

  .kiosko-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
  }

  .input-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--muted);
    font-size: 1rem;
    pointer-events: none;
  }

  .btn-primary {
    width: 100%;
    padding: 1.1rem;
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%);
    color: #0a0f1e;
    border: none;
    border-radius: 12px;
    font-family: 'Sora', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.2s, opacity 0.2s;
    box-shadow: 0 8px 24px rgba(0, 212, 255, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    margin-bottom: 1.5rem;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(0, 212, 255, 0.35);
  }

  .btn-primary:active {
    transform: translateY(0);
  }

  .btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  .divider {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .divider-line {
    flex: 1;
    height: 1px;
    background: rgba(107, 122, 153, 0.25);
  }

  .divider-text {
    font-size: 0.75rem;
    color: var(--muted);
    letter-spacing: 0.08em;
  }

  .btn-secondary {
    width: 100%;
    padding: 0.9rem;
    background: transparent;
    color: var(--muted);
    border: 1.5px solid rgba(107, 122, 153, 0.25);
    border-radius: 12px;
    font-family: 'Sora', sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .btn-secondary:hover {
    border-color: var(--accent);
    color: var(--accent);
  }

  .error-box {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    background: rgba(255, 77, 106, 0.1);
    border: 1px solid rgba(255, 77, 106, 0.3);
    border-radius: 10px;
    padding: 0.85rem 1rem;
    margin-top: 1rem;
    animation: shake 0.4s ease;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-6px); }
    75% { transform: translateX(6px); }
  }

  .error-text {
    color: var(--error);
    font-size: 0.85rem;
    font-weight: 500;
  }

  .spinner {
    width: 18px; height: 18px;
    border: 2px solid rgba(10,15,30,0.3);
    border-top-color: #0a0f1e;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .status-badge {
    position: absolute;
    top: 1.5rem; right: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.7rem;
    color: var(--muted);
    font-weight: 500;
    letter-spacing: 0.08em;
  }

  .status-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #22c55e;
    animation: pulse-dot 2s infinite;
  }

  @keyframes pulse-dot {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
`;

function LoginKiosko() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const validarKiosko = async () => {
    if (!codigo.trim()) {
      setError("Ingrese el código del kiosko.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/kioskos/validar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo }),
      });

      const contentType = res.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        setError("Error de conexión con el servidor.");
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Código inválido. Intente nuevamente.");
        return;
      }

      navigate(
        `/eleccion-turno?kioskoId=${data.kioskoId}&kioskoNumero=${data.kioskoNumero}&sucursalId=${data.kioskoSucursalId}`
      );

    } catch {
      setError("No se pudo conectar al servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") validarKiosko();
  };

  return (
    <>
      <style>{styles}</style>
      <div className="kiosko-root">
        <div className="grid-bg" />

        <div className="login-card">
          <div className="card-accent-line" />

          <div className="status-badge">
            <span className="status-dot" />
            SISTEMA ACTIVO
          </div>

          
          <h1 className="login-title">Inicio de<br />Kiosko</h1>
          <p className="login-subtitle">Ingrese el código de acceso para activar este terminal</p>

          <label className="field-label" htmlFor="kiosko-code">Código de kiosko</label>
          <div className="input-wrapper">
            <span className="input-icon">🔑</span>
            <input
              id="kiosko-code"
              ref={inputRef}
              className="kiosko-input"
              type="text"
              placeholder="Ej: KSK-001"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.toUpperCase())}
              onKeyDown={handleKeyDown}
              autoComplete="off"
            />
          </div>

          <button
            className="btn-primary"
            onClick={validarKiosko}
            disabled={loading}
            
          >
            {loading ? (
              <><span className="spinner" /> Verificando...</>
            ) : (
              <>Activar Terminal →</>
            )}
          </button>

          <div className="divider">
            <div className="divider-line" />
            <div className="divider-line" />
          </div>

         

          {error && (
            <div className="error-box">
              <span>⚠️</span>
              <span className="error-text">{error}</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default LoginKiosko;