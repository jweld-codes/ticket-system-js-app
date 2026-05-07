// controllers/tiposAtencion.controller.js

import { getConnection, sql } from "../db/db.js";

export const obtenerTiposAtencion = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool.request().query(`
      SELECT 
        tiposAtencionId,
        tiposAtencionNombre
      FROM TiposAtencion
      ORDER BY tiposAtencionNombre ASC
    `);

    res.json(result.recordset);

  } catch (error) {
    res.status(500).json({
      message: "Error al obtener tipos de atención",
      error: error.message
    });
  }
};