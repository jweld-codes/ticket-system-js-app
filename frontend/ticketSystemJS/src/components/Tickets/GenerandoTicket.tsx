// src/components/GenerandoTicket.tsx
import { useEffect, useState } from "react";

interface Props {
  mensaje?: string;
}

function GenerandoTicket({ mensaje = "Generando Ticket" }: Props) {
  const [puntos, setPuntos] = useState("");

  useEffect(() => {
    const iv = setInterval(() => {
      setPuntos((p) => (p.length >= 3 ? "" : p + "."));
    }, 400);
    return () => clearInterval(iv);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;600;700&family=Barlow+Condensed:wght@700;800&display=swap');
        .gt-wrap {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          min-height: 100vh; background: #f0f2f8;
          font-family: 'Barlow', sans-serif;
          gap: 28px; padding: 24px;
        }
        .gt-ring {
          width: 96px; height: 96px;
          border-radius: 50%;
          border: 5px solid #e8ecfd;
          border-top-color: #1536ea;
          animation: gt-spin 0.9s linear infinite;
          flex-shrink: 0;
        }
        @keyframes gt-spin { to { transform: rotate(360deg); } }
        .gt-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 22px; font-weight: 700;
          letter-spacing: 1px; color: #1536ea;
          text-align: center;
          min-width: 220px;
        }
        .gt-sub { font-size: 14px; color: #94a3b8; text-align: center; }
      `}</style>
      <div className="gt-wrap">
        <div className="gt-ring" />
        <div>
          <div className="gt-label">{mensaje}{puntos}</div>
          <div className="gt-sub">Espere un momento</div>
        </div>
      </div>
    </>
  );
}

export default GenerandoTicket;