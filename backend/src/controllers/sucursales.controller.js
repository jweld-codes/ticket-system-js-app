import { getConnection, sql } from "../db/db.js";

// OBTENER SUCURSALES
export const obtenerSucursales = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool.request().query(`
      SELECT
        sucursalesId,
        sucursalesNombres,
        sucursalesCiudad,
        sucursalesCodigo,
        sucursalesEstado
      FROM Sucursales
      ORDER BY sucursalesId DESC
    `);

    res.json(result.recordset);

  } catch (error) {
    console.error("ERROR AL OBTENER SUCURSALES:", error);

    res.status(500).json({
      message: "Error al obtener sucursales",
      error: error.message
    });
  }
};

// CREAR SUCURSAL
export const crearSucursal = async (req, res) => {
  try {
    const { nombre, ciudad, codigo, estado } = req.body;

    const pool = await getConnection();

    await pool.request()
      .input("nombre", sql.VarChar, nombre)
      .input("ciudad", sql.VarChar, ciudad)
      .input("codigo", sql.VarChar, codigo)
      .input("estado", sql.VarChar, estado)
      .query(`
        INSERT INTO Sucursales
        (
          sucursalesNombres,
          sucursalesCiudad,
          sucursalesCodigo,
          sucursalesEstado
        )
        VALUES
        (
          @nombre,
          @ciudad,
          @codigo,
          @estado
        )
      `);

    res.json({
      message: "Sucursal creada correctamente"
    });

  } catch (error) {
    res.status(500).json({
      message: "Error al crear sucursal",
      error: error.message
    });
  }
};

// ELIMINAR SUCURSAL
export const eliminarSucursal = async (req, res) => {
  try {
    const { id } = req.params;

    const pool = await getConnection();

    const result = await pool.request()
      .input("id", sql.Int, Number(id))
      .query(`
        DELETE FROM Sucursales
        WHERE sucursalesId = @id
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        message: "Sucursal no encontrada"
      });
    }

    res.json({
      message: "Sucursal eliminada correctamente"
    });

  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar sucursal",
      error: error.message
    });
  }
};