import bcrypt from "bcrypt";
import { getConnection, sql } from "./src/db/db.js";

const crearAdmin = async () => {
  try {
    const pool = await getConnection();

    const claveHash = await bcrypt.hash("Admin1029", 10);

    await pool.request()
      .input("nickname", sql.VarChar, "admin")
      .input("password", sql.VarChar, claveHash)
      .input("empleadoId", sql.Int, 1)
      .input("estado", sql.VarChar, "Activo")
      .query(`
        INSERT INTO EmpleadosUsuarios
        (empleadoNickname, empleadoPassword, empleadoUserId, empleadoUserEstado)
        VALUES
        (@nickname, @password, @empleadoId, @estado)
      `);

    console.log("ADMIN CREADO CORRECTAMENTE");
    process.exit();

  } catch (error) {
    console.error("ERROR AL CREAR ADMIN:", error);
    process.exit(1);
  }
};

crearAdmin();