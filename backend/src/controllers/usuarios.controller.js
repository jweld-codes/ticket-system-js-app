import { getConnection, sql } from "../db/db.js";
import bcrypt from "bcrypt";

// OBTENER USUARIOS
export const obtenerUsuarios = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool.request().query(`
      SELECT
        u.empleadoUsuarioId,
        u.empleadoNickname,
        u.empleadoUserEstado,

        e.empleadosPNombre + ' ' + e.empleadosPApellido AS empleadoNombre

      FROM EmpleadosUsuarios u

      INNER JOIN Empleados e
        ON u.empleadoUserId = e.empleadosId

      ORDER BY u.empleadoUsuarioId DESC
    `);

    res.json(result.recordset);

  } catch (error) {
    console.error("ERROR SQL:", error);

    res.status(500).json({
      message: "Error al obtener usuarios",
      error: error.message
    });
  }
};

// CREAR USUARIO
export const crearUsuario = async (req, res) => {
  try {
    const {
      nickname,
      clave,
      estado,
      empleadoId
    } = req.body;

    if (!nickname || !clave || !estado || !empleadoId) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios"
      });
    }

    const saltRounds = 10;
    const claveHash = await bcrypt.hash(clave, saltRounds);

    const pool = await getConnection();

    await pool.request()
      .input("nickname", sql.VarChar, nickname)
      .input("claveHash", sql.VarChar, claveHash)
      .input("empleadoId", sql.Int, Number(empleadoId))
      .input("estado", sql.VarChar, estado)
      .query(`
        INSERT INTO EmpleadosUsuarios
        (
          empleadoNickname,
          empleadoPassword,
          empleadoUserId,
          empleadoUserEstado
        )
        VALUES
        (
          @nickname,
          @claveHash,
          @empleadoId,
          @estado
        )
      `);

    res.json({
      message: "Usuario creado correctamente"
    });

  } catch (error) {
    console.error("ERROR AL CREAR USUARIO:", error);

    res.status(500).json({
      message: "Error al crear usuario",
      error: error.message
    });
  }
};