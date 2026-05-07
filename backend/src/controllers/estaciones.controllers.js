import { getConnection, sql } from "../db/db.js";

// OBTENER ESTACIONES
export const obtenerEstaciones = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool.request().query(`
      SELECT 
        es.estacionId,
        es.estacionNombre,
        es.estacionEstado,
        es.estacionCodigo,
        es.estacionEmpleadoId,

        e.empleadosPNombre + ' ' + e.empleadosPApellido AS empleadoNombre

      FROM Estaciones es

      INNER JOIN Empleados e 
        ON es.estacionEmpleadoId = e.empleadosId

      ORDER BY es.estacionId DESC
    `);

    res.json(result.recordset);

  } catch (error) {
    res.status(500).json({
      message: "Error al obtener estaciones",
      error: error.message
    });
  }
};

// OBTENER ESTACIONES POR SUCURSAL
export const obtenerEstacionesPorSucursal = async (req, res) => {
  try {
    const { sucursalId } = req.params;

    const pool = await getConnection();

    const result = await pool.request()
      .input("sucursalId", sql.Int, Number(sucursalId))
      .query(`
        SELECT 
          es.estacionId,
          es.estacionNombre,
          es.estacionEstado,
          es.estacionCodigo,
          es.estacionEmpleadoId,

          e.empleadosId,
          e.empleadosPNombre,
          e.empleadosPApellido,
          e.empleadosSucursalId,

          e.empleadosPNombre + ' ' + e.empleadosPApellido AS empleadoNombre

        FROM Estaciones es

        INNER JOIN Empleados e 
          ON es.estacionEmpleadoId = e.empleadosId

        WHERE e.empleadosSucursalId = @sucursalId

        ORDER BY es.estacionId ASC
      `);

    res.json(result.recordset);

  } catch (error) {
    res.status(500).json({
      message: "Error al obtener estaciones por sucursal",
      error: error.message
    });
  }
};

// CREAR ESTACION
export const crearEstaciones = async (req, res) => {
  try {
    const {
      nombre,
      estado,
      codigo,
      empleadoId
    } = req.body;

    const pool = await getConnection();

    await pool.request()
      .input("nombre", sql.VarChar, nombre)
      .input("estado", sql.VarChar, estado)
      .input("codigo", sql.VarChar, codigo)
      .input("empleadoId", sql.Int, empleadoId)
      .query(`
        INSERT INTO Estaciones
        (
          estacionNombre,
          estacionEstado,
          estacionCodigo,
          estacionEmpleadoId
        )
        VALUES
        (
          @nombre,
          @estado,
          @codigo,
          @empleadoId
        )
      `);

    res.json({
      message: "Estación creada correctamente"
    });

  } catch (error) {
    res.status(500).json({
      message: "Error al crear estación",
      error: error.message
    });
  }
};

// ACTUALIZAR ESTADO ESTACION
export const actualizarEstadoEstacionDescanso = async (req, res) => {
  try {
    const { estacionId } = req.params;
    const { estado } = req.body;

    const pool = await getConnection();

    await pool.request()
      .input("estado", sql.VarChar, estado)
      .input("estacionId", sql.Int, Number(estacionId))
      .query(`
        UPDATE Estaciones
        SET estacionEstado = @estado
        WHERE estacionId = @estacionId
      `);

    res.json({
      message: "Estado actualizado correctamente",
      estacionId,
      estado
    });

  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar estado",
      error: error.message
    });
  }
};