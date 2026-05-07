import { useEffect, useState } from "react";

function Estaciones() {
  const [nombre, setNombre] = useState("");
  const [estado, setEstado] = useState("");
  const [codigo, setCodigo] = useState("");
  const [empleadoId, setEmpleadoId] = useState("");
  const [empleados, setEmpleados] = useState<any[]>([]);
  const [estaciones, setEstaciones] = useState<any[]>([]);
  const API_URL = import.meta.env.VITE_API_URL;


  const obtenerEstaciones = async () => {
    const res = await fetch(`${API_URL}/estaciones`);
    const data = await res.json();
    setEstaciones(data);
  };

  const obtenerEmpleados = async () => {
    const res = await fetch(`${API_URL}/empleados`);
    const data = await res.json();
    setEmpleados(data);
  };

  const guardarEstacion = async () => {
    const res =await fetch(`${API_URL}/estaciones`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre,
        estado,
        codigo,
        empleadoId: Number(empleadoId),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Error al guardar estación:", data);
      alert(data.error);
      return;
    }

    await obtenerEstaciones();

    setNombre("");
    setEstado("");
    setCodigo("");
    setEmpleadoId("");
  };

  useEffect(() => {
    obtenerEstaciones();
    obtenerEmpleados();
  }, []);

  return (
    <div>
      <h2>Estaciones</h2>

      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />

     

      <input
        type="text"
        placeholder="Código"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
      />

      <select
        value={empleadoId}
        onChange={(e) => setEmpleadoId(e.target.value)}
      >
        <option value="">Seleccionar Empleado</option>
        {empleados.map((e) => (
          <option key={e.empleadoId} value={e.empleadoId}>
            {e.empleadoPNombre} {e.empleadoPApellido}
          </option>
        ))}
      </select>

       <select value={estado} onChange={(e) => setEstado(e.target.value)}>
        <option value="">Seleccionar Estado</option>
        <option value="Activo">Activo</option>
        <option value="Inactivo">Inactivo</option>
      </select>

      <button onClick={guardarEstacion}>Guardar</button>

      <hr />

      <h3>Lista de Estaciones</h3>

      <ul>
        {estaciones.map((es) => (
          <li key={es.estacionId}>
            {es.estacionNombre} - {es.estacionEstado} - {es.estacionCodigo} -{" "}
            {es.empleadoNombre}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Estaciones;