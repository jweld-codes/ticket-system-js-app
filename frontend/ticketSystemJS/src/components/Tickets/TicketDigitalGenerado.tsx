import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function TicketDigitalGenerado() {
  const location = useLocation();
  const ticket = location.state?.ticket;

  const [segundos, setSegundos] = useState(0);
  const [alertaEnviada, setAlertaEnviada] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const intervalo = setInterval(() => {
      setSegundos((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(intervalo);
  }, []);

  const minutos = Math.floor(segundos / 60);
  const segundosRestantes = segundos % 60;

  const alertaHabilitada = segundos >= 600;

  const enviarAlerta = async () => {
    if (!ticket) return;

    try {
      await fetch(`${API_URL}tickets/alerta-espera`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticketId: ticket.ticketId,
          tiempoEspera: segundos,
        }),
      });

      setAlertaEnviada(true);
    } catch {
      alert("No se pudo enviar la alerta.");
    }
  };

  if (!ticket) {
    return (
      <div style={{ padding: 30 }}>
        No se encontró información del ticket digital.
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0f1e",
        color: "#fff",
        fontFamily: "Sora, sans-serif",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          background: "#111827",
          borderRadius: 24,
          padding: 30,
          textAlign: "center",
          boxShadow: "0 20px 60px rgba(0,0,0,.45)",
        }}
      >
        <h1 style={{ color: "#00d4ff" }}>Ticket Digital</h1>

        <h2 style={{ fontSize: 50, margin: "20px 0" }}>
          {ticket.ticketCodigo || ticket.codigo || ticket.numero}
        </h2>

        <div style={{ textAlign: "left", lineHeight: 1.8 }}>
          <p><b>Nombre:</b> {ticket.clienteNombre}</p>
          <p><b>Tipo de turno:</b> {ticket.tipoTurno}</p>
          <p><b>Sucursal:</b> {ticket.sucursalNombre || ticket.sucursalId}</p>
          <p><b>Kiosko:</b> {ticket.kioskoNumero || ticket.kioskoId}</p>
          <p><b>Estado:</b> En espera</p>
        </div>

        <div
          style={{
            marginTop: 30,
            padding: 20,
            background: "#1a2235",
            borderRadius: 18,
          }}
        >
          <p style={{ color: "#94a3b8", marginBottom: 8 }}>
            Tiempo en espera
          </p>

          <h2>
            {minutos.toString().padStart(2, "0")}:
            {segundosRestantes.toString().padStart(2, "0")}
          </h2>
        </div>

        <button
          onClick={enviarAlerta}
          disabled={!alertaHabilitada || alertaEnviada}
          style={{
            marginTop: 25,
            width: "100%",
            padding: "16px",
            border: "none",
            borderRadius: 14,
            fontWeight: 700,
            cursor: alertaHabilitada && !alertaEnviada ? "pointer" : "not-allowed",
            background:
              alertaHabilitada && !alertaEnviada ? "#ff4d6a" : "#334155",
            color: "#fff",
          }}
        >
          {alertaEnviada
            ? "Alerta enviada"
            : alertaHabilitada
            ? "Avisar que llevo 10 minutos esperando"
            : "La alerta se habilita a los 10 minutos"}
        </button>
      </div>
    </div>
  );
}

export default TicketDigitalGenerado;