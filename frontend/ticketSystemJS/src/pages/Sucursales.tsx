import { useEffect, useState } from "react";

function Sucursales() {
  const [nombre, setNombre] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [codigo, setCodigo] = useState("");
  const [estado, setEstado] = useState("");
  const [sucursales, setSucursales] = useState<any[]>([]);
  const API_URL = import.meta.env.VITE_API_URL;


  const obtenerSucursales = async () => {
    const res = await fetch(`${API_URL}/sucursales`);
    const data = await res.json();
    setSucursales(data);
  };

  const guardarSucursal = async () => {
  const res = await fetch(`${API_URL}/sucursales`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ nombre, ciudad, codigo, estado })
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Error al guardar sucursal:", data);
    alert(data.error);
    return;
  }

  obtenerSucursales();
  setNombre("");
  setCiudad("");
  setCodigo("");
  setEstado("");
};

  useEffect(() => {
    obtenerSucursales();
  }, []);

  

  return (
    <div>
      <h2>Sucursales</h2>

      <input
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />

      <input
        placeholder="Ciudad"
        value={ciudad}
        onChange={(e) => setCiudad(e.target.value)}
      />

      <input
        placeholder="Código"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
      />

      <select value={estado} onChange={(e) => setEstado(e.target.value)}>
        <option value="">Seleccione Estado</option>
        <option value="Activo">Activo</option>
        <option value="Inactivo">Inactivo</option>
      </select>

      <button onClick={guardarSucursal}>
        Guardar
      </button>

      <hr />

      <h3>Lista de Sucursales</h3>

      <ul>
        {sucursales.map((s) => (
          <li key={s.sucursalesId}>
            {s.sucursalesNombres} - {s.sucursalesCiudad} - {s.sucursalesCodigo} - {s.sucursalesEstado}
          </li>
        ))}
      </ul>
    </div>
  );
}



export default Sucursales;