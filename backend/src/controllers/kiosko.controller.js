import { getConnection, sql } from "../db/db.js";

export const validarKiosko = async (req, res) => {
  try {
    const { codigo } = req.body;

    const pool = await getConnection();

    const result = await pool.request()
      .input("codigo", sql.VarChar, codigo)
      .query(`
        SELECT 
          k.kioskoId,
          k.kioskoCodigo,
          k.kioskoSucursalId,
          k.kioskoNumero,

          s.sucursalesNombres,
          s.sucursalesCiudad

        FROM KioskoSucursales k

        INNER JOIN Sucursales s
          ON k.kioskoSucursalId = s.sucursalesId

        WHERE k.kioskoCodigo = @codigo
          AND UPPER(k.kioskoEstado) = 'ACTIVO'
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        message: "Código de kiosko no válido o inactivo"
      });
    }

    res.json(result.recordset[0]);

  } catch (error) {
    res.status(500).json({
      message: "Error al validar kiosko",
      error: error.message
    });
  }
};

export const obtenerKioskos = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool.request().query(`
      SELECT 
        k.kioskoId,
        k.kioskoCodigo,
        k.kioskoSucursalId,
        k.kioskoEstado,
        k.kioskoNumero,

        s.sucursalesNombres AS sucursalNombre

      FROM KioskoSucursales k

      INNER JOIN Sucursales s
        ON k.kioskoSucursalId = s.sucursalesId

      ORDER BY k.kioskoId DESC
    `);

    res.json(result.recordset);

  } catch (error) {
    res.status(500).json({
      message: "Error al obtener kioskos",
      error: error.message
    });
  }
};

export const crearKiosko = async (req, res) => {
  try {
    const { codigo, kSucursalId, estado, kioskoNumero } = req.body;

    const pool = await getConnection();

    await pool.request()
      .input("codigo", sql.VarChar, codigo)
      .input("kSucursalId", sql.Int, Number(kSucursalId))
      .input("estado", sql.VarChar, estado)
      .input("kioskoNumero", sql.Int, Number(kioskoNumero))
      .query(`
        INSERT INTO KioskoSucursales
        (
          kioskoCodigo,
          kioskoSucursalId,
          kioskoEstado,
          kioskoNumero
        )
        VALUES
        (
          @codigo,
          @kSucursalId,
          @estado,
          @kioskoNumero
        )
      `);

    res.json({
      message: "Kiosko creado correctamente"
    });

  } catch (error) {
    res.status(500).json({
      message: "Error al crear kiosko",
      error: error.message
    });
  }
};