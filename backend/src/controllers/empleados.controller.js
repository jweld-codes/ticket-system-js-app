import { getConnection, sql } from "../db/db.js";

// OBTENER EMPLEADOS
export const obtenerEmpleados = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool.request().query(`
      SELECT 
        e.empleadosId AS empleadoId,
        e.empleadosPNombre AS empleadoPNombre,
        e.empleadosPApellido AS empleadoPApellido,
        e.empleadosSNombre AS empleadoSNombre,
        e.empleadosSApellido AS empleadoSApellido,

        e.empleadosCorreo AS empleadoCorreo,
        e.empleadosRol AS empleadoRol,
        e.empleadosEstado AS empleadoEstado,
        e.empleadosSucursalId AS empleadoSucursalId,

        s.sucursalesNombres AS sucursalNombre

      FROM Empleados e

      INNER JOIN Sucursales s 
        ON e.empleadosSucursalId = s.sucursalesId

      ORDER BY e.empleadosId DESC
    `);

    res.json(result.recordset);

  } catch (error) {
    res.status(500).json({
      message: "Error al obtener empleados",
      error: error.message
    });
  }
};

// CREAR EMPLEADO
export const crearEmpleado = async (req, res) => {
  try {
    const {
      primer_nombre,
      segundo_nombre,
      primer_apellido,
      segundo_apellido,
      correo,
      sucursalId,
      rol,
      estado
    } = req.body;

    const pool = await getConnection();

    await pool.request()
      .input("primer_nombre", sql.VarChar, primer_nombre)
      .input("segundo_nombre", sql.VarChar, segundo_nombre || null)
      .input("primer_apellido", sql.VarChar, primer_apellido)
      .input("segundo_apellido", sql.VarChar, segundo_apellido || null)
      .input("correo", sql.VarChar, correo)
      .input("sucursalId", sql.Int, sucursalId)
      .input("rol", sql.VarChar, rol)
      .input("estado", sql.VarChar, estado)
      .query(`
        INSERT INTO Empleados
        (
          empleadosPNombre,
          empleadosSNombre,
          empleadosPApellido,
          empleadosSApellido,
          empleadosCorreo,
          empleadosSucursalId,
          empleadosRol,
          empleadosEstado
        )
        VALUES
        (
          @primer_nombre,
          @segundo_nombre,
          @primer_apellido,
          @segundo_apellido,
          @correo,
          @sucursalId,
          @rol,
          @estado
        )
      `);

    res.json({
      message: "Empleado creado correctamente"
    });

  } catch (error) {
    res.status(500).json({
      message: "Error al crear empleado",
      error: error.message
    });
  }
};