import bcrypt from "bcrypt";
import { getConnection, sql } from "../db/db.js";

export const login = async (req, res) => {
  try {
    const { usuario, clave, estadoEstacion } = req.body;

    const pool = await getConnection();

    const result = await pool.request()
      .input("usuario", sql.VarChar, usuario)
      .query(`
        SELECT 
          u.empleadoUsuarioId,
          u.empleadoNickname,
          u.empleadoPassword,
          u.empleadoUserEstado,

          e.empleadosId,
          e.empleadosPNombre,
          e.empleadosPApellido,
          e.empleadosCorreo,
          e.empleadosEstado,
          e.empleadosRol,
          e.empleadosSucursalId,

          s.sucursalesId,
          s.sucursalesNombres,

          es.estacionId,
          es.estacionNombre,
          es.estacionCodigo,
          es.estacionEstado,

          k.kioskoId,
          k.kioskoCodigo,
          k.kioskoNumero

        FROM EmpleadosUsuarios u

        INNER JOIN Empleados e
          ON u.empleadoUserId = e.empleadosId

        INNER JOIN Sucursales s
          ON e.empleadosSucursalId = s.sucursalesId

        LEFT JOIN Estaciones es
          ON es.estacionEmpleadoId = e.empleadosId

        LEFT JOIN KioskoSucursales k
          ON k.kioskoSucursalId = s.sucursalesId
          AND k.kioskoNumero = 2

        WHERE u.empleadoNickname = @usuario
      `);

    if (result.recordset.length === 0) {
      return res.status(401).json({
        message: "Usuario o contraseña incorrectos",
      });
    }

    const usuarioBD = result.recordset[0];

    const claveValida = await bcrypt.compare(
      clave,
      usuarioBD.empleadoPassword
    );

    if (!claveValida) {
      return res.status(401).json({
        message: "Usuario o contraseña incorrectos",
      });
    }

    if (usuarioBD.empleadoUserEstado?.toUpperCase() !== "ACTIVO") {
      return res.status(403).json({
        message: "Usuario inactivo",
      });
    }

    // CAMBIAR ESTADO DE ESTACION
    if (usuarioBD.estacionId && estadoEstacion) {
      await pool.request()
        .input("estado", sql.VarChar, estadoEstacion)
        .input("estacionId", sql.Int, usuarioBD.estacionId)
        .query(`
          UPDATE Estaciones
          SET estacionEstado = @estado
          WHERE estacionId = @estacionId
        `);

      usuarioBD.estacionEstado = estadoEstacion;
    }

    // SIEMPRE DEJAR DISPONIBLE AL INICIAR
    if (usuarioBD.estacionId) {
      await pool.request()
        .input("estado", sql.VarChar, "Disponible")
        .input("estacionId", sql.Int, usuarioBD.estacionId)
        .query(`
          UPDATE Estaciones
          SET estacionEstado = @estado
          WHERE estacionId = @estacionId
        `);

      usuarioBD.estacionEstado = "Disponible";
    }

    delete usuarioBD.empleadoPassword;

    res.json(usuarioBD);

  } catch (error) {
    res.status(500).json({
      message: "Error al iniciar sesión",
      error: error.message,
    });
  }
};