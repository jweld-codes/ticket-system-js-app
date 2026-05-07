import { useEffect, useState } from "react";

function Empleados() {
  const [primer_nombre, setPrimerNombre] = useState("");
  const [segundo_nombre, setSegundoNombre] = useState("");
  const [primer_apellido, setPrimerApellido] = useState("");
  const [segundo_apellido, setSegundoApellido] = useState("");

  const [correo, setCorreo] = useState("");
  const [sucursalId, setSucursalId] = useState("");
  const [rol, setRol] = useState("");
  const [estado, setEstado] = useState("");
  const [empleados, setEmpleados] = useState<any[]>([]);
  const [sucursales, setSucursales] = useState<any[]>([]);

  const API_URL = import.meta.env.VITE_API_URL;


  const obtenerEmpleados = async () => {
    const res = await fetch(`${API_URL}/empleados`);
    const data = await res.json();
    setEmpleados(data);
  };

  const obtenerSucursales = async () => {
    const res = await fetch(`${API_URL}/sucursales`);
    const data = await res.json();
    setSucursales(data);
  };

  const guardarEmpleado = async () => {
    const res = await fetch(`${API_URL}/empleados`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        primer_nombre: primer_nombre,
        segundo_nombre: segundo_nombre,
        primer_apellido: primer_apellido,
        segundo_apellido: segundo_apellido,
        correo: correo,
        sucursalId: Number(sucursalId),
        rol: rol,
        estado: estado,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Error al guardar empleado:", data);
      alert(data.error);
      return;
    }

    obtenerEmpleados();
    setPrimerNombre("");
    setSegundoNombre("");
    setPrimerApellido("");
    setSegundoApellido("");
    setCorreo("");
    setSucursalId("");
    setRol("");
    setEstado("");
  };

  useEffect(() => {
    obtenerEmpleados();
    obtenerSucursales();
  }, []);

  return (
    <div>
      <h2>Empleados</h2>

      <input
        placeholder="Primer Nombre"
        value={primer_nombre}
        onChange={(e) => setPrimerNombre(e.target.value)}
      />

      <input
        placeholder="Segundo Nombre"
        value={segundo_nombre}
        onChange={(e) => setSegundoNombre(e.target.value)}
      />

      <input
        placeholder="Primer Apellido"
        value={primer_apellido}
        onChange={(e) => setPrimerApellido(e.target.value)}
      />

      <input
        placeholder="Segundo Apellido"
        value={segundo_apellido}
        onChange={(e) => setSegundoApellido(e.target.value)}
      />

      <input
        placeholder="Correo"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
      />

      <select
        value={sucursalId}
        onChange={(e) => setSucursalId(e.target.value)}
      >
        <option value="">Seleccionar Sucursal</option>
        {sucursales.map((s) => (
          <option key={s.sucursalesId} value={s.sucursalesId}>
            {s.sucursalesNombres}
          </option>
        ))}
      </select>

      <select value={rol} onChange={(e) => setRol(e.target.value)}>
        <option value="">Seleccionar Rol</option>
        <option value="Supervisor">Supervisor</option>
        <option value="Gestor">Gestor</option>
      </select>

      <select value={estado} onChange={(e) => setEstado(e.target.value)}>
        <option value="">Seleccionar Estado</option>
        <option value="Activo">Activo</option>
        <option value="Inactivo">Inactivo</option>
      </select>

      <button onClick={guardarEmpleado}>Guardar</button>

      <hr />

      <h3>Lista de Empleados</h3>

      <ul>
        {empleados.map((e) => (
          <li key={e.empleadoId}>
            {e.empleadoPNombre} {e.empleadoSNombre} {e.empleadoPApellido} {e.empleadoSApellido} - {e.empleadoCorreo} -{" "}
            {e.sucursalNombre} - {e.empleadoRol} - {e.empleadoEstado}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Empleados;