import { useSearchParams } from "react-router-dom";
import { ReactQRCode } from "@lglab/react-qr-code";

function TurnoDigitalQR() {
  const [searchParams] = useSearchParams();
  const API_URL = import.meta.env.VITE_API_URL;


  const kioskoId = searchParams.get("kioskoId") || "";
  const kioskoNumero = searchParams.get("kioskoNumero") || "";
  const sucursalId = searchParams.get("sucursalId") || "";

  const urlDigital = `${API_URL}/turno-digital?kioskoId=${kioskoId}&kioskoNumero=${kioskoNumero}&sucursalId=${sucursalId}`;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0f1e",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Sora, sans-serif",
        padding: 30,
      }}
    >
      <div
        style={{
          background: "#111827",
          padding: 40,
          borderRadius: 24,
          textAlign: "center",
          maxWidth: 460,
          width: "100%",
        }}
      >
        <h1>Turno Digital</h1>
        <p style={{ color: "#94a3b8" }}>
          Escanee este código QR con su celular para tomar su turno.
        </p>

        <div
          style={{
            background: "#fff",
            padding: 20,
            borderRadius: 18,
            margin: "30px auto",
            width: "fit-content",
          }}
        >
          <ReactQRCode value={urlDigital} size={240} />
        </div>

        <p style={{ color: "#00d4ff", fontSize: 14 }}>
          Terminal #{kioskoNumero}
        </p>
      </div>
    </div>
  );
}

export default TurnoDigitalQR;