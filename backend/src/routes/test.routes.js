import express from "express";
import { getConnection, sql } from "../db/db.js";

const router = express.Router();

router.get("/test-db", async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool.request().query("SELECT GETDATE() AS fecha");
    console.log("RESULT:", result);

    res.json({
      message: "Conexión exitosa",
      fecha: result.recordset[0].fecha,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error de conexión",
      error: error.message,
    });
  }
});

export default router;