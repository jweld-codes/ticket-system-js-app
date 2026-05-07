import { useEffect, useState } from "react";

function Usuarios() {
  const [nickname, setNickname] = useState("");
  const [clave, setClave] = useState("");
  const [empleadoId, setEmpleadoId] = useState("");
  const [empleados, setEmpleados] = useState<any[]>([]);
  const [estado, setEstado] = useState("");
  const [listaUsuarios, setListaUsuarios] = useState<any[]>([]);
  const API_URL = import.meta.env.VITE_API_URL;


  const obtenerUsuarios = async () => {
    const res = await fetch(`${API_URL}/usuarios`);
    const data = await res.json();
    setListaUsuarios(data);
  };

  const obtenerEmpleados = async () => {
    const res = await fetch(`${API_URL}/empleados`);
    const data = await res.json();
    setEmpleados(data);
  };

  const guardarUsuario = async () => {
    await fetch(`${API_URL}/usuarios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nickname,
        estado,
        clave,
        empleadoId: Number(empleadoId),
      }),
    });

    await obtenerUsuarios();

    setNickname("");
    setClave("");
    setEmpleadoId("");
    setEstado("");
  };

  useEffect(() => {
    obtenerUsuarios();
    obtenerEmpleados();
  }, []);

  return (
    <div>
      <h2>Usuarios</h2>

      <input
        type="text"
        placeholder="Usuario"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />

      <input
        type="password"
        placeholder="Clave"
        value={clave}
        onChange={(e) => setClave(e.target.value)}
      />

      <select value={empleadoId} onChange={(e) => setEmpleadoId(e.target.value)}>
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

      <button onClick={guardarUsuario}>Guardar</button>

      <hr />

      <h3>Lista de Usuarios</h3>

      <ul>
        {listaUsuarios.map((u) => (
          <li key={u.empleadoUsuarioId}>
            {u.empleadoNickname} - {u.empleadoPassword} - {u.empleadosPNombre} {u.empleadosPApellido} - {u.empleadoUserEstado}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Usuarios;