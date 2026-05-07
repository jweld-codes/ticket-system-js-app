import { useNavigate, useSearchParams } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&display=swap');

  :root {
    --bg: #0a0f1e;
    --surface: #111827;
    --surface2: #1a2235;
    --accent: #00d4ff;
    --accent2: #0099cc;
    --green: #00e5a0;
    --green2: #00b380;
    --text: #f0f4ff;
    --muted: #6b7a99;
    --border: rgba(0, 212, 255, 0.15);
  }

  .turno-root {
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

  .turno-root::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 50% at 50% -5%, rgba(0, 212, 255, 0.1) 0%, transparent 55%),
      radial-gradient(ellipse 50% 50% at 5% 95%, rgba(0, 229, 160, 0.07) 0%, transparent 50%);
    pointer-events: none;
  }

  .grid-bg {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
  }

  .turno-container {
    position: relative;
    width: 100%;
    max-width: 680px;
    animation: fadeIn 0.5s ease both;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .turno-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .logo-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(0, 212, 255, 0.08);
    border: 1px solid var(--border);
    border-radius: 100px;
    padding: 0.4rem 1rem;
    margin-bottom: 1.5rem;
    font-size: 0.75rem;
    color: var(--accent);
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .pulse-ring {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--accent);
    animation: pulse-ring 1.5s infinite;
  }

  @keyframes pulse-ring {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.3); }
  }

  .turno-title {
    font-size: 2.8rem;
    font-weight: 800;
    color: var(--text);
    letter-spacing: -0.04em;
    line-height: 1.05;
    margin-bottom: 0.75rem;
  }

  .turno-title span {
    color: var(--accent);
  }

  .turno-subtitle {
    font-size: 1rem;
    color: var(--muted);
    font-weight: 300;
    letter-spacing: 0.02em;
  }

  .cards-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
    margin-bottom: 2rem;
  }

  @media (max-width: 540px) {
    .cards-grid { grid-template-columns: 1fr; }
    .turno-title { font-size: 2rem; }
  }

  .option-card {
    position: relative;
    background: var(--surface);
    border-radius: 20px;
    padding: 2rem 1.75rem;
    border: 1.5px solid transparent;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
    overflow: hidden;
    text-align: left;
    display: flex;
    flex-direction: column;
    min-height: 220px;
  }

  .option-card::before {
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .option-card:hover {
    transform: translateY(-4px);
  }

  .option-card:active {
    transform: translateY(-1px);
  }

  /* Digital card */
  .card-digital {
    border-color: rgba(0, 212, 255, 0.2);
    box-shadow: 0 8px 32px rgba(0, 212, 255, 0.07);
  }

  .card-digital::before {
    background: radial-gradient(ellipse at 0% 0%, rgba(0, 212, 255, 0.1), transparent 60%);
  }

  .card-digital:hover {
    border-color: var(--accent);
    box-shadow: 0 16px 48px rgba(0, 212, 255, 0.18);
  }

  .card-digital:hover::before { opacity: 1; }

  /* Manual card */
  .card-manual {
    border-color: rgba(0, 229, 160, 0.2);
    box-shadow: 0 8px 32px rgba(0, 229, 160, 0.07);
  }

  .card-manual::before {
    background: radial-gradient(ellipse at 0% 0%, rgba(0, 229, 160, 0.1), transparent 60%);
  }

  .card-manual:hover {
    border-color: var(--green);
    box-shadow: 0 16px 48px rgba(0, 229, 160, 0.18);
  }

  .card-manual:hover::before { opacity: 1; }

  .card-emoji {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    display: block;
    filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
  }

  .card-tag {
    display: inline-block;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 0.25rem 0.6rem;
    border-radius: 100px;
    margin-bottom: 0.75rem;
  }

  .tag-digital {
    background: rgba(0, 212, 255, 0.12);
    color: var(--accent);
    border: 1px solid rgba(0, 212, 255, 0.2);
  }

  .tag-manual {
    background: rgba(0, 229, 160, 0.12);
    color: var(--green);
    border: 1px solid rgba(0, 229, 160, 0.2);
  }

  .card-heading {
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--text);
    letter-spacing: -0.02em;
    margin-bottom: 0.5rem;
    line-height: 1.2;
  }

  .card-desc {
    font-size: 0.82rem;
    color: var(--muted);
    font-weight: 300;
    line-height: 1.6;
    flex: 1;
  }

  .card-arrow {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1.5rem;
  }

  .card-arrow-btn {
    width: 38px; height: 38px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    transition: transform 0.2s;
  }

  .arrow-digital {
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    color: #0a0f1e;
  }

  .arrow-manual {
    background: linear-gradient(135deg, var(--green), var(--green2));
    color: #0a0f1e;
  }

  .option-card:hover .card-arrow-btn {
    transform: translateX(4px);
  }

  .footer-info {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
  }

  .footer-chip {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.75rem;
    color: var(--muted);
    font-weight: 500;
  }

  .footer-chip span {
    font-size: 0.9rem;
  }

  .separator {
    width: 1px;
    height: 16px;
    background: rgba(107, 122, 153, 0.2);
  }
`;

function EleccionTurno() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();


  const kioskoId = searchParams.get("kioskoId") || "1";
  const kioskoNumero = searchParams.get("kioskoNumero") || "1";
  const sucursalId = searchParams.get("sucursalId") || "1";


  const irDigital = () => {
  navigate(
    `/turno-digital-qr?kioskoId=${kioskoId}&kioskoNumero=${kioskoNumero}&sucursalId=${sucursalId}`
    );
  };

  const irManual = () => {
    navigate(`/turno-manual?modo=manual&kioskoId=${kioskoId}&kioskoNumero=${kioskoNumero}&sucursalId=${sucursalId}`);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="turno-root">
        <div className="grid-bg" />

        <div className="turno-container">
          <div className="turno-header">
            <div className="logo-badge">
              <span className="pulse-ring" />
              JETSTEREO
            </div>
            <h1 className="turno-title">
              ¿Cómo desea<br />tomar su <span>turno</span>?
            </h1>
            <p className="turno-subtitle">Seleccione una opción para continuar</p>
          </div>

          <div className="cards-grid">
            {/* Opción Digital */}
            <div className="option-card card-digital" onClick={irDigital}>
              <span className="card-emoji">📱</span>
              <span className="card-tag tag-digital">Recomendado</span>
              <h2 className="card-heading">Turno Digital<br />con QR</h2>
              <p className="card-desc">
                Escanee el código QR con su teléfono y reciba su turno directamente en su dispositivo.
              </p>
              <div className="card-arrow">
                <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>Sin papel</div>
                <div className="card-arrow-btn arrow-digital">→</div>
              </div>
            </div>

            {/* Opción Manual */}
            <div className="option-card card-manual" onClick={irManual}>
              <span className="card-emoji">🎫</span>
              <span className="card-tag tag-manual">Presencial</span>
              <h2 className="card-heading">Turno Manual<br />en Kiosko</h2>
              <p className="card-desc">
                Imprima su ticket físico desde este terminal y espere a ser llamado en sala.
              </p>
              <div className="card-arrow">
                <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>Ticket impreso</div>
                <div className="card-arrow-btn arrow-manual">→</div>
              </div>
            </div>
          </div>

          <div className="footer-info">
            <div className="footer-chip">
              <span>🖥️</span>
              Terminal #{kioskoNumero}
            </div>
            <div className="separator" />
            <div className="footer-chip">
              <span>🟢</span>
              En servicio
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EleccionTurno;