import { useEffect } from "react";
import { ReactQRCode } from "@lglab/react-qr-code";


interface TicketData {
  ticketNumero: string;
  clienteNombre: string;
  clienteDNI?: string;
  tiposTurnoNombre: string;
  sucursalesNombres: string;
  ticketEstado: string;
  ticketHoraFechaCreacion: string;
  ticketQRCodigo?: string;
}

interface Props {
  ticket: TicketData;
  onImprimir: () => void;
  onSalir: () => void;
  autoPrint?: boolean;
}

function TicketGenerado({ ticket, onImprimir, onSalir, autoPrint }: Props) {
  useEffect(() => {
    if (autoPrint) {
      const timer = setTimeout(() => {
        window.print();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [autoPrint]);

  const formatearFechaTicket = (valor: string) => {
  const fecha = new Date(valor);

  fecha.setHours(fecha.getHours() + 6);

  const horaStr = fecha.toLocaleTimeString("es-HN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const fechaStr = fecha.toLocaleDateString("es-HN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return { fechaStr, horaStr };
};
const { fechaStr, horaStr } = formatearFechaTicket(ticket.ticketHoraFechaCreacion);
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&family=Barlow:wght@400;600;700;800&family=Barlow+Condensed:wght@700;800;900&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── Página fondo ── */
        .tg-page {
          min-height: 100vh;
          background: #e8ecf5;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: 'Barlow', sans-serif;
          padding: 32px 16px;
          gap: 7px;
        }

        /* ── Ticket físico ── */
        .tg-ticket {
          width: 100%;
          max-width: 340px;
          background: #fff;
          /* Borde dentado superior e inferior via clip-path o SVG filter no funciona en print,
             usamos border-radius top recto y margen con pseudo-elementos */
          position: relative;
          font-family: 'Courier Prime', 'Courier New', monospace;
          color: #111;
          animation: tg-drop 0.45s cubic-bezier(0.34,1.56,0.64,1);
          /* Sombra de ticket físico */
          box-shadow: 0 2px 0 #ccc, 0 4px 0 #ddd, 0 8px 24px rgba(0,0,0,0.18);
        }

        @keyframes tg-drop {
          from { opacity: 0; transform: translateY(-24px) rotate(-1deg); }
          to   { opacity: 1; transform: translateY(0) rotate(0deg); }
        }

        /* Borde dentado superior */
        .tg-ticket::before {
          content: '';
          display: block;
          height: 10px;
          background: repeating-linear-gradient(
            90deg,
            #e8ecf5 0px, #e8ecf5 8px,
            #fff 8px, #fff 16px
          );
          border-bottom: 1.5px dashed #ddd;
        }

        /* Borde dentado inferior */
        .tg-ticket::after {
          content: '';
          display: block;
          height: 10px;
          background: repeating-linear-gradient(
            90deg,
            #e8ecf5 0px, #e8ecf5 8px,
            #fff 8px, #fff 16px
          );
          border-top: 1.5px dashed #ddd;
        }

        /* ── Interior del ticket ── */
        .tg-inner { padding: 18px 22px 14px; }

        /* Logo */
        .tg-logo-wrap {
          text-align: center;
          padding-bottom: 12px;
          margin-bottom: 12px;
          border-bottom: 1px dashed #ccc;
        }

        .tg-logo-img {
          height: 30px;
          width: auto;
          /* El logo Jetstereo es azul sobre negro; en papel blanco se invierte */
          filter: invert(1) hue-rotate(180deg) saturate(5) brightness(0.3);
          object-fit: contain;
        }

        .tg-sucursal {
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #555;
          text-align: center;
          margin-top: 4px;
          font-family: 'Courier Prime', monospace;
        }

        /* Fecha/hora encabezado */
        .tg-datetime {
          text-align: center;
          font-size: 9px;
          color: #666;
          letter-spacing: 0.5px;
          margin-bottom: 14px;
          font-family: 'Courier Prime', monospace;
        }

        /* Label "Número de turno" */
        .tg-queue-label {
          text-align: center;
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #888;
          margin-bottom: 0;
          font-family: 'Courier Prime', monospace;
        }

        /* ── NÚMERO GRANDE ── */
        .tg-numero {
          text-align: center;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 96px;
          font-weight: 900;
          color: #0034f7;
          line-height: 1;
          letter-spacing: -3px;
          margin: -4px 0 0;
        }

        /* Tipo turno bajo el número */
        .tg-tipo {
          text-align: center;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 16px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #222;
          margin-bottom: 14px;
        }

        /* Separador */
        .tg-sep {
          border: none;
          border-top: 1px dashed #ccc;
          margin: 12px 0;
        }

        /* Filas de datos */
        .tg-field {
          display: flex;
          align-items: flex-start;
          gap: 0;
          padding: 5px 0;
          font-size: 10px;
          font-family: 'Courier Prime', monospace;
        }

        .tg-field-label {
          width: 90px;
          flex-shrink: 0;
          color: #666;
          text-transform: uppercase;
          font-size: 9px;
          padding-top: 1px;
        }

        .tg-field-colon {
          width: 12px;
          flex-shrink: 0;
          color: #666;
        }

        .tg-field-value {
          flex: 1;
          font-weight: 700;
          color: #111;
          font-size: 10.5px;
          word-break: break-word;
        }

        /* Estado */
        .tg-estado-wrap {
          text-align: center;
          margin: 8px 0 4px;
        }

        .tg-estado-pill {
          display: inline-block;
          border: 1px solid #111;
          border-radius: 2px;
          padding: 2px 10px;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #111;
          font-family: 'Courier Prime', monospace;
        }

        /* QR */
        .tg-qr-wrap {
          text-align: center;
          margin: 14px 0 4px;
        }

        .tg-qr-img {
          width: 124px;
          height: 124px;
          margin: 0 auto;
          border: 1px solid #ddd;
          padding: 6px;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .tg-qr-label {
          font-size: 8px;
          color: #888;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-top: 5px;
          font-family: 'Courier Prime', monospace;
        }

        /* Nota final */
        .tg-note {
          font-size: 8px;
          color: #999;
          text-align: center;
          letter-spacing: 0.3px;
          margin-top: 8px;
          font-family: 'Courier Prime', monospace;
          line-height: 1.5;
        }

        /* ── Botones (fuera del ticket, no se imprimen) ── */
        .tg-actions {
          display: flex;
          gap: 10px;
          width: 100%;
          max-width: 340px;
        }

        .tg-btn {
          flex: 1;
          padding: 13px 10px;
          border: none;
          border-radius: 10px;
          font-family: 'Barlow', sans-serif;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .tg-btn-primary { background: #0034f7; color: #fff; }
        .tg-btn-primary:hover { background: #0026c4; }
        .tg-btn-ghost { background: #e2e8f0; color: #475569; }
        .tg-btn-ghost:hover { background: #cbd5e1; }

        /* ── PRINT ── */
        @page {
          margin: 0;
          size: 80mm auto;
        }

        @media print {
          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
          }

          .tg-page {
            margin: 0 !important;
            padding: 0 !important;
            background: #fff !important;
          }

          .tg-ticket {
            margin: 0 auto !important;
            box-shadow: none !important;
            max-width: 80mm !important;
          }

          .tg-actions {
            display: none !important;
          }
        }

          .tg-ticket {
            box-shadow: none;
            max-width: 80mm;   /* ancho típico papel térmico */
            animation: none;
          }

          .tg-ticket::before,
          .tg-ticket::after {
            display: none;   
          }

          .tg-actions { display: none; }

          .tg-logo-img {
            filter: none;   
            width: 35%;
             height: 10%;  
          }
        }

        /* ── Responsive móvil ── */
        @media (max-width: 400px) {
          .tg-numero { font-size: 80px; }
          .tg-ticket { max-width: 100%; }
        }
      `}</style>

      <div className="tg-page">

        {/* ── TICKET ── */}
        <div className="tg-ticket">
          <div className="tg-inner">

            {/* Logo */}
            <div className="tg-logo-wrap">
              <img
                src="/src/assets/jestereo_logo_full.png"
                alt="Jetstereo"
                className="tg-logo-img"
              />
              <div className="tg-sucursal">{ticket.sucursalesNombres}</div>
            </div>

            {/* Fecha / hora */}
            <div className="tg-datetime">
              {fechaStr} &nbsp;·&nbsp; {horaStr}
            </div>

            {/* Número de turno */}
            <div className="tg-queue-label">Ticket No.</div>
            <div className="tg-numero">{ticket.ticketNumero}</div>
            <div className="tg-tipo">{ticket.tiposTurnoNombre}</div>

            <hr className="tg-sep" />

            {/* Campos */}
            <div className="tg-field">
              <div className="tg-field-label">Cliente</div>
              <div className="tg-field-colon">:</div>
              <div className="tg-field-value">{ticket.clienteNombre}</div>
            </div>

            <div className="tg-field">
              <div className="tg-field-label">Servicio</div>
              <div className="tg-field-colon">:</div>
              <div className="tg-field-value">{ticket.tiposTurnoNombre}</div>
            </div>

            <hr className="tg-sep" />

            {/* QR */}
            {ticket.ticketQRCodigo && (
              <div className="tg-qr-wrap">
                <div className="tg-qr-img">
                  <ReactQRCode
                    value={ticket.ticketQRCodigo}
                    size={110}
                    marginSize={2}
                    imageSettings={{
                      src: "/jetstereo_favicon.png",
                      width: 28,
                      height: 28,
                      excavate: true,
                      opacity: 1,
                    }}
                  />
                </div>

                <div className="tg-qr-label">
                  Escanea para ver tu turno en línea
                </div>
              </div>
            )}

            {/* Nota */}
            <div className="tg-note">
              Los números pueden no llamarse en orden.{"\n"}
              Por favor espere hasta ser llamado.
            </div>

          </div>
        </div>

        {/* ── Botones (no se imprimen) ── */}
        <div className="tg-actions">
          <button className="tg-btn tg-btn-primary" onClick={onImprimir}>
            🖨️ Imprimir
          </button>
          <button className="tg-btn tg-btn-ghost" onClick={onSalir}>
            ✕ Salir
          </button>
        </div>

      </div>
    </>
  );
}

export default TicketGenerado;