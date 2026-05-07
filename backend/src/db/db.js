import sql from "mssql";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const dbSettings = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT) || 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};
let pool;
export const getConnection = async () => {
  try {
    if (pool) return pool;
    pool = await sql.connect(dbSettings);
    console.log("Conexión SQL Server establecida");
    return pool;
  } catch (error) {
    console.error("Error de conexión SQL Server:", error);
    throw error;
  }
};

export { sql };