import { getConnection, sql } from "../db/db.js";

// CONTROLADOR PARA VER TODOS LOS CLIENTES EXISTENTES
export const obtenerClientes = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool.request().query(`
      SELECT
        clienteId,
        clienteNombre,
        clienteDNI,
        clienteEstado
      FROM Clientes
      ORDER BY clienteId DESC
    `);

    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener clientes",
      error: error.message,
    });
  }
};

// CONTROLADOR PARA CREAR UN NUEVO CLIENTE
export const crearCliente = async (req, res) => {
  try {
    const { nombre, dni } = req.body;

    const pool = await getConnection();

    await pool.request()
      .input("nombre", sql.VarChar, nombre)
      .input("dni", sql.VarChar, dni)
      .query(`
        INSERT INTO Clientes 
        (clienteNombre, clienteDNI)
        VALUES (@nombre, @dni)
      `);

    res.json({ message: "Cliente creado correctamente" });
  } catch (error) {
    res.status(500).json({
      message: "Error al crear cliente",
      error: error.message,
    });
  }
};

// CONTROLADOR PARA ELIMINAR UN CLIENTE EXISTENTE
export const eliminarCliente = async (req, res) => {
  try {
    const { id } = req.params;

    const pool = await getConnection();

    await pool.request()
      .input("id", sql.Int, id)
      .query(`
        DELETE FROM Clientes 
        WHERE clienteId = @id
      `);

    res.json({ message: "Cliente eliminado correctamente" });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar cliente",
      error: error.message,
    });
  }
};

// CONTROLADOR PARA BUSCAR CLIENTE POR DNI
export const buscarClientePorDNI = async (req, res) => {
  try {
    const { dni } = req.params;

    const pool = await getConnection();

    const result = await pool.request()
      .input("dni", sql.VarChar, dni)
      .query(`
        SELECT 
          clienteId,
          clienteNombre,
          clienteDNI
        FROM Clientes
        WHERE clienteDNI = @dni
      `);

    if (result.recordset.length === 0) {
      return res.json({ existe: false });
    }

    res.json({
      existe: true,
      cliente: result.recordset[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al buscar cliente",
      error: error.message,
    });
  }
};