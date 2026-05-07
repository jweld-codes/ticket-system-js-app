import { useEffect, useState } from "react";

function Kioskos() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [estado, setEstado] = useState("");
  const [kSucursalId, setKSucursalId] = useState("");
  const [codigo, setCodigo] = useState("");
  const [kioskos, setKioskos] = useState<any[]>([]);
  const [sucursales, setSucursales] = useState<any[]>([]);

  const obtenerKioskos = async () => {
    const res = await fetch(`${API_URL}/kioskos`);
    const data = await res.json();
    setKioskos(data);
  };

  const obtenerSucursales = async () => {
    const res = await fetch(`${API_URL}/sucursales`);
    const data = await res.json();
    setSucursales(data);
  };

  const guardarKiosko = async () => {
    await fetch(`${API_URL}/kioskos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        codigo,
        kSucursalId: Number(kSucursalId),
        estado
      })
    });

    obtenerKioskos();
    setEstado("");
    setKSucursalId("");
    setCodigo("");
  };

  useEffect(() => {
    obtenerKioskos();
    obtenerSucursales();
  }, []);

  return (
    <div>
      <h2>Kioskos</h2>

      <input
        placeholder="Código de Kiosko"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
      />

      <select
        value={kSucursalId}
        onChange={(e) => setKSucursalId(e.target.value)}
      >
        <option value="">Seleccionar Sucursal</option>
        {sucursales.map((s) => (
          <option key={s.sucursalesId} value={s.sucursalesId}>
            {s.sucursalesNombres}
          </option>
        ))}
      </select>

      <select value={estado} onChange={(e) => setEstado(e.target.value)}>
        <option value="">Seleccionar Estado</option>
        <option value="ACTIVO">ACTIVO</option>
        <option value="INACTIVO">INACTIVO</option>
      </select>

      <button onClick={guardarKiosko}>Guardar</button>

      <hr />

      <h3>Lista de Kioskos</h3>

      <ul>
        {kioskos.map((k) => (
          <li key={k.kioskoId}>
            {k.kioskoCodigo} - {k.sucursalNombre} - {k.kioskoEstado}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Kioskos;