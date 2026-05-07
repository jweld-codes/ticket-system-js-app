import { getConnection, sql } from "../db/db.js";

const HORA_HONDURAS = "DATEADD(HOUR, -6, GETUTCDATE())";

/* =========================
   OBTENER TODOS LOS TICKETS
========================= */
export const obtenerTickets = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool.request().query(`
      SELECT 
        t.ticketId,
        t.ticketNumero,
        t.ticketEstado,
        t.ticketHoraFechaCreacion,
        t.ticketHoraInicio,
        t.ticketHoraFin,
        t.ticketSucursalId,
        t.ticketQRCodigo,

        c.clienteNombre,
        c.clienteDNI,

        tt.tiposTurnoNombre,
        tt.tiposTurnoCodigo,
        tt.tiposTurnoPrioridad,

        k.kioskoCodigo,

        s.sucursalesNombres AS sucursalNombre,

        e.estacionNombre,
        emp.empleadosPNombre AS empleadoNombre,
        emp.empleadosPApellido AS empleadoApellido

      FROM Tickets t

      INNER JOIN Clientes c 
        ON t.ticketClienteId = c.clienteId

      INNER JOIN TiposTurno tt 
        ON t.ticketTiposTurnoId = tt.tiposTurnoId

      LEFT JOIN KioskoSucursales k 
        ON t.ticketKioskoId = k.kioskoId

      INNER JOIN Sucursales s 
        ON t.ticketSucursalId = s.sucursalesId

      LEFT JOIN Estaciones e
        ON t.ticketEstacionId = e.estacionId

      LEFT JOIN Empleados emp
        ON t.ticketEmpleadoId = emp.empleadosId

      ORDER BY t.ticketId DESC
    `);

    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener tickets",
      error: error.message
    });
  }
};

/* =========================
   OBTENER TICKETS PENDIENTES
========================= */
export const obtenerTicketsPendientes = async (req, res) => {
  try {
    const { sucursalId } = req.query;

    if (!sucursalId) {
      return res.status(400).json({
        message: "Debe enviar sucursalId"
      });
    }

    const pool = await getConnection();

    const result = await pool.request()
      .input("sucursalId", sql.Int, Number(sucursalId))
      .query(`
        SELECT 
          t.ticketId,
          t.ticketNumero,
          t.ticketEstado,
          t.ticketHoraFechaCreacion,
          t.ticketSucursalId,

          DATEDIFF(MINUTE, t.ticketHoraFechaCreacion, ${HORA_HONDURAS}) AS tiempoEspera,

          c.clienteNombre,
          c.clienteDNI,

          tt.tiposTurnoNombre,
          tt.tiposTurnoCodigo,
          tt.tiposTurnoPrioridad

        FROM Tickets t

        INNER JOIN Clientes c
          ON t.ticketClienteId = c.clienteId

        INNER JOIN TiposTurno tt
          ON t.ticketTiposTurnoId = tt.tiposTurnoId

        WHERE t.ticketEstado = 'Pendiente'
          AND t.ticketSucursalId = @sucursalId

        ORDER BY 
          tt.tiposTurnoPrioridad ASC,
          t.ticketHoraFechaCreacion ASC
      `);

    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener tickets pendientes",
      error: error.message
    });
  }
};

/* =========================
   CREAR TICKET MANUAL
========================= */
export const crearTicketManual = async (req, res) => {
  try {
    const {
      nombreCompleto,
      dni,
      tipoTurno,
      kioskoId,
      sucursalId
    } = req.body;

    if (!nombreCompleto || !dni || !tipoTurno || !kioskoId || !sucursalId) {
      return res.status(400).json({
        message: "Faltan datos para crear el ticket",
        datosRecibidos: req.body
      });
    }

    const pool = await getConnection();

    let clienteId;

    const clienteExiste = await pool.request()
      .input("dni", sql.VarChar, dni)
      .query(`
        SELECT clienteId
        FROM Clientes
        WHERE clienteDNI = @dni
      `);

    if (clienteExiste.recordset.length > 0) {
      clienteId = clienteExiste.recordset[0].clienteId;
    } else {
      const nuevoCliente = await pool.request()
        .input("nombreCompleto", sql.VarChar, nombreCompleto)
        .input("dni", sql.VarChar, dni)
        .query(`
          INSERT INTO Clientes
          (
            clienteNombre,
            clienteDNI
          )
          OUTPUT INSERTED.clienteId
          VALUES
          (
            @nombreCompleto,
            @dni
          )
        `);

      clienteId = nuevoCliente.recordset[0].clienteId;
    }

    const tipo = await pool.request()
      .input("tipoTurno", sql.VarChar, tipoTurno)
      .query(`
        SELECT
          tiposTurnoId,
          tiposTurnoNombre,
          tiposTurnoCodigo,
          tiposTurnoPrioridad
        FROM TiposTurno
        WHERE tiposTurnoCodigo = @tipoTurno
      `);

    if (tipo.recordset.length === 0) {
      return res.status(404).json({
        message: "Tipo de turno no encontrado"
      });
    }

    const tipoData = tipo.recordset[0];

    const ultimoTicket = await pool.request()
      .input("tipoTurnoId", sql.Int, tipoData.tiposTurnoId)
      .input("sucursalId", sql.Int, Number(sucursalId))
      .query(`
        SELECT TOP 1 ticketNumero
        FROM Tickets
        WHERE ticketTiposTurnoId = @tipoTurnoId
          AND ticketSucursalId = @sucursalId
          AND CAST(ticketHoraFechaCreacion AS DATE) = CAST(${HORA_HONDURAS} AS DATE)
        ORDER BY ticketId DESC
      `);

    let numero = 1;

    if (ultimoTicket.recordset.length > 0) {
      const ultimoCodigo = ultimoTicket.recordset[0].ticketNumero.trim();
      const codigoTurno = tipoData.tiposTurnoCodigo.trim();
      const soloNumero = ultimoCodigo.replace(codigoTurno, "");

      numero = Number(soloNumero) + 1;
    }

    const ticketNumero =
      `${tipoData.tiposTurnoCodigo.trim()}${String(numero).padStart(4, "0")}`;

    const ticketCreado = await pool.request()
      .input("ticketNumero", sql.VarChar, ticketNumero)
      .input("kioskoId", sql.Int, Number(kioskoId))
      .input("tipoTurnoId", sql.Int, tipoData.tiposTurnoId)
      .input("clienteId", sql.Int, clienteId)
      .input("sucursalId", sql.Int, Number(sucursalId))
      .query(`
        INSERT INTO Tickets
        (
          ticketNumero,
          ticketKioskoId,
          ticketTiposTurnoId,
          ticketClienteId,
          ticketEstado,
          ticketHoraFechaCreacion,
          ticketHoraInicio,
          ticketHoraFin,
          ticketSucursalId
        )
        OUTPUT INSERTED.ticketId
        VALUES
        (
          @ticketNumero,
          @kioskoId,
          @tipoTurnoId,
          @clienteId,
          'Pendiente',
          ${HORA_HONDURAS},
          NULL,
          NULL,
          @sucursalId
        )
      `);

    const ticketId = ticketCreado.recordset[0].ticketId;

    const ticketQRCodigo =
      `https://ticket-system-js.vercel.app/turno-digital/${ticketId}`;

    await pool.request()
      .input("ticketQRCodigo", sql.VarChar, ticketQRCodigo)
      .input("ticketId", sql.Int, ticketId)
      .query(`
        UPDATE Tickets
        SET ticketQRCodigo = @ticketQRCodigo
        WHERE ticketId = @ticketId
      `);

    const detalle = await pool.request()
      .input("ticketId", sql.Int, ticketId)
      .query(`
        SELECT 
          t.ticketId,
          t.ticketNumero,
          t.ticketHoraFechaCreacion,
          t.ticketEstado,
          t.ticketSucursalId,
          t.ticketQRCodigo,

          c.clienteNombre,
          c.clienteDNI,

          tt.tiposTurnoNombre,
          tt.tiposTurnoCodigo,

          k.kioskoSucursalId,

          s.sucursalesId AS sucursalId,
          s.sucursalesNombres

        FROM Tickets t

        INNER JOIN Clientes c
          ON t.ticketClienteId = c.clienteId

        INNER JOIN TiposTurno tt
          ON t.ticketTiposTurnoId = tt.tiposTurnoId

        LEFT JOIN KioskoSucursales k
          ON t.ticketKioskoId = k.kioskoId

        INNER JOIN Sucursales s
          ON t.ticketSucursalId = s.sucursalesId

        WHERE t.ticketId = @ticketId
      `);

    res.json(detalle.recordset[0]);
  } catch (error) {
    console.error("ERROR AL CREAR TICKET MANUAL:", error);

    res.status(500).json({
      message: "Error al crear ticket manual",
      error: error.message
    });
  }
};

/* =========================
   TOMAR TICKET
========================= */
export const tomarTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { empleadoId, estacionId } = req.body;

    if (!empleadoId || !estacionId) {
      return res.status(400).json({
        message: "Debe enviar empleadoId y estacionId"
      });
    }

    const pool = await getConnection();

    const result = await pool.request()
      .input("empleadoId", sql.Int, Number(empleadoId))
      .input("estacionId", sql.Int, Number(estacionId))
      .input("ticketId", sql.Int, Number(ticketId))
      .query(`
        UPDATE Tickets
        SET 
          ticketEstado = 'Tomado',
          ticketEmpleadoId = @empleadoId,
          ticketEstacionId = @estacionId,
          ticketHoraInicio = ${HORA_HONDURAS}
        OUTPUT INSERTED.*
        WHERE ticketId = @ticketId
          AND ticketEstado = 'Pendiente'
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        message: "Ticket no encontrado o ya fue tomado"
      });
    }

    await pool.request()
      .input("estacionId", sql.Int, Number(estacionId))
      .query(`
        UPDATE Estaciones
        SET estacionEstado = 'Atendiendo'
        WHERE estacionId = @estacionId
      `);

    res.json({
      message: "Ticket tomado correctamente",
      ticket: result.recordset[0]
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al tomar ticket",
      error: error.message
    });
  }
};

/* =========================
   INICIAR ATENCIÓN
========================= */
export const iniciarAtencionTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const pool = await getConnection();

    const result = await pool.request()
      .input("ticketId", sql.Int, Number(ticketId))
      .query(`
        UPDATE Tickets
        SET 
          ticketEstado = 'En Atención',
          ticketHoraInicio = ISNULL(ticketHoraInicio, ${HORA_HONDURAS})
        OUTPUT INSERTED.*
        WHERE ticketId = @ticketId
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        message: "Ticket no encontrado"
      });
    }

    res.json({
      message: "Atención iniciada correctamente",
      ticket: result.recordset[0]
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al iniciar atención",
      error: error.message
    });
  }
};

/* =========================
   FINALIZAR TICKET
========================= */
export const finalizarTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { empleadoId, estacionId, tipoAtencionId } = req.body;

    if (!ticketId || !empleadoId || !estacionId || !tipoAtencionId) {
      return res.status(400).json({
        message: "Faltan datos para finalizar el ticket",
        datosRecibidos: {
          ticketId,
          empleadoId,
          estacionId,
          tipoAtencionId
        }
      });
    }

    const pool = await getConnection();

    const ticketResult = await pool.request()
      .input("ticketId", sql.Int, Number(ticketId))
      .query(`
        SELECT 
          ticketId,
          ticketKioskoId,
          ticketSucursalId,
          ticketHoraInicio
        FROM Tickets
        WHERE ticketId = @ticketId
      `);

    if (ticketResult.recordset.length === 0) {
      return res.status(404).json({
        message: "Ticket no encontrado"
      });
    }

    const ticket = ticketResult.recordset[0];

    const updateResult = await pool.request()
      .input("tipoAtencionId", sql.Int, Number(tipoAtencionId))
      .input("empleadoId", sql.Int, Number(empleadoId))
      .input("estacionId", sql.Int, Number(estacionId))
      .input("ticketId", sql.Int, Number(ticketId))
      .query(`
        UPDATE Tickets
        SET 
          ticketEstado = 'Finalizado',
          ticketHoraFin = ${HORA_HONDURAS},
          ticketTiposAtencionId = @tipoAtencionId,
          ticketEmpleadoId = @empleadoId,
          ticketEstacionId = @estacionId
        OUTPUT INSERTED.*
        WHERE ticketId = @ticketId
      `);

    const tiempoResult = await pool.request()
      .input("ticketId", sql.Int, Number(ticketId))
      .query(`
        SELECT 
          CASE 
            WHEN 
              DATEDIFF(MINUTE, ticketHoraInicio, ticketHoraFin) 
              - ISNULL(ticketTiempoPausaTotal, 0) < 0
            THEN 0
            ELSE 
              DATEDIFF(MINUTE, ticketHoraInicio, ticketHoraFin) 
              - ISNULL(ticketTiempoPausaTotal, 0)
          END AS tiempoAtencion
        FROM Tickets
        WHERE ticketId = @ticketId
      `);

    const tiempoAtencion = tiempoResult.recordset[0]?.tiempoAtencion || 0;

    await pool.request()
      .input("ticketId", sql.Int, Number(ticketId))
      .input("empleadoId", sql.Int, Number(empleadoId))
      .input("sucursalId", sql.Int, Number(ticket.ticketSucursalId))
      .input("tiempoAtencion", sql.Int, Number(tiempoAtencion))
      .query(`
        INSERT INTO Atenciones
        (
          atencionTicketId,
          atencionEmpleadoId,
          atencionSucursalId,
          atencionTiempoDeAtencion
        )
        VALUES
        (
          @ticketId,
          @empleadoId,
          @sucursalId,
          @tiempoAtencion
        )
      `);

    await pool.request()
      .input("estacionId", sql.Int, Number(estacionId))
      .query(`
        UPDATE Estaciones
        SET estacionEstado = 'Disponible'
        WHERE estacionId = @estacionId
      `);

    res.json({
      message: "Ticket finalizado correctamente",
      ticket: updateResult.recordset[0],
      tiempoAtencion
    });

  } catch (error) {
    console.error("ERROR AL FINALIZAR TICKET:", error);

    res.status(500).json({
      message: "Error al finalizar ticket",
      error: error.message
    });
  }
};

/* =========================
   CANCELAR TICKET
========================= */
export const cancelarTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const pool = await getConnection();

    const result = await pool.request()
      .input("ticketId", sql.Int, Number(ticketId))
      .query(`
        UPDATE Tickets
        SET 
          ticketEstado = 'Cancelado',
          ticketHoraFin = ${HORA_HONDURAS}
        OUTPUT INSERTED.*
        WHERE ticketId = @ticketId
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        message: "Ticket no encontrado"
      });
    }

    res.json({
      message: "Ticket cancelado correctamente",
      ticket: result.recordset[0]
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al cancelar ticket",
      error: error.message
    });
  }
};

/* =========================
   ESTADÍSTICAS POR ESTACIÓN
========================= */
export const obtenerEstadisticasEstacion = async (req, res) => {
  try {
    const { estacionId } = req.params;

    if (!estacionId) {
      return res.status(400).json({
        message: "Debe enviar estacionId"
      });
    }

    const pool = await getConnection();

    const totalResult = await pool.request()
      .input("estacionId", sql.Int, Number(estacionId))
      .query(`
        SELECT COUNT(*) AS totalAtendidos
        FROM Tickets
        WHERE ticketEstacionId = @estacionId
          AND ticketEstado = 'Finalizado'
          AND CAST(ticketHoraFin AS DATE) = CAST(${HORA_HONDURAS} AS DATE)
      `);

    const porTipoResult = await pool.request()
      .input("estacionId", sql.Int, Number(estacionId))
      .query(`
        SELECT
          ta.tiposAtencionNombre,
          COUNT(t.ticketId) AS cantidad
        FROM Tickets t

        LEFT JOIN TiposAtencion ta
          ON t.ticketTiposAtencionId = ta.tiposAtencionId

        WHERE t.ticketEstacionId = @estacionId
          AND t.ticketEstado = 'Finalizado'
          AND CAST(t.ticketHoraFin AS DATE) = CAST(${HORA_HONDURAS} AS DATE)

        GROUP BY ta.tiposAtencionNombre
        ORDER BY ta.tiposAtencionNombre ASC
      `);

    res.json({
      totalAtendidos: totalResult.recordset[0]?.totalAtendidos || 0,
      porTipo: porTipoResult.recordset
    });

  } catch (error) {
    console.error("ERROR ESTADÍSTICAS:", error);

    res.status(500).json({
      message: "Error estadísticas",
      error: error.message
    });
  }
};

/* =========================
   REPORTE DE TICKETS
========================= */
export const obtenerReporteTickets = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, sucursalId } = req.query;

    const pool = await getConnection();
    const request = pool.request();

    let query = `
      SELECT 
        t.ticketId,
        t.ticketNumero,
        t.ticketEstado,
        t.ticketHoraFechaCreacion,
        t.ticketHoraInicio,
        t.ticketHoraFin,
        t.ticketSucursalId,

        c.clienteNombre,
        c.clienteDNI,

        tt.tiposTurnoNombre,

        s.sucursalesNombres AS sucursalNombre,

        e.estacionNombre,

        emp.empleadosPNombre AS empleadoNombre,
        emp.empleadosPApellido AS empleadoApellido

      FROM Tickets t

      INNER JOIN Clientes c
        ON t.ticketClienteId = c.clienteId

      INNER JOIN TiposTurno tt
        ON t.ticketTiposTurnoId = tt.tiposTurnoId

      INNER JOIN Sucursales s
        ON t.ticketSucursalId = s.sucursalesId

      LEFT JOIN Estaciones e
        ON t.ticketEstacionId = e.estacionId

      LEFT JOIN Empleados emp
        ON t.ticketEmpleadoId = emp.empleadosId

      WHERE 1 = 1
    `;

    if (fechaInicio) {
      request.input("fechaInicio", sql.Date, fechaInicio);
      query += ` AND CAST(t.ticketHoraFechaCreacion AS DATE) >= @fechaInicio`;
    }

    if (fechaFin) {
      request.input("fechaFin", sql.Date, fechaFin);
      query += ` AND CAST(t.ticketHoraFechaCreacion AS DATE) <= @fechaFin`;
    }

    if (sucursalId) {
      request.input("sucursalId", sql.Int, Number(sucursalId));
      query += ` AND t.ticketSucursalId = @sucursalId`;
    }

    query += ` ORDER BY t.ticketHoraFechaCreacion DESC`;

    const result = await request.query(query);

    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener reporte de tickets",
      error: error.message
    });
  }
};

/* =========================
   OBTENER TICKET POR ID
========================= */
export const obtenerTicketPorId = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const pool = await getConnection();

    const result = await pool.request()
      .input("ticketId", sql.Int, Number(ticketId))
      .query(`
        SELECT 
          t.ticketId,
          t.ticketNumero,
          t.ticketEstado,
          t.ticketHoraFechaCreacion,
          t.ticketHoraInicio,
          t.ticketHoraFin,
          t.ticketSucursalId,
          t.ticketQRCodigo,

          c.clienteNombre,
          c.clienteDNI,

          tt.tiposTurnoNombre,
          tt.tiposTurnoCodigo,

          s.sucursalesNombres AS sucursalNombre,

          e.estacionNombre,

          emp.empleadosPNombre AS empleadoNombre,
          emp.empleadosPApellido AS empleadoApellido

        FROM Tickets t

        INNER JOIN Clientes c
          ON t.ticketClienteId = c.clienteId

        INNER JOIN TiposTurno tt
          ON t.ticketTiposTurnoId = tt.tiposTurnoId

        INNER JOIN Sucursales s
          ON t.ticketSucursalId = s.sucursalesId

        LEFT JOIN Estaciones e
          ON t.ticketEstacionId = e.estacionId

        LEFT JOIN Empleados emp
          ON t.ticketEmpleadoId = emp.empleadosId

        WHERE t.ticketId = @ticketId
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        message: "Ticket no encontrado"
      });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener ticket",
      error: error.message
    });
  }
};

/* =========================
   PAUSAR TICKET
========================= */
export const pausarTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { estacionId } = req.body;

    if (!ticketId || !estacionId) {
      return res.status(400).json({
        message: "Faltan datos para pausar el ticket"
      });
    }

    const pool = await getConnection();

    const ticketResult = await pool.request()
      .input("ticketId", sql.Int, Number(ticketId))
      .query(`
        UPDATE Tickets
        SET 
          ticketEstado = 'En Pausa',
          ticketPausaInicio = ${HORA_HONDURAS}
        OUTPUT INSERTED.*
        WHERE ticketId = @ticketId
      `);

    if (ticketResult.recordset.length === 0) {
      return res.status(404).json({
        message: "Ticket no encontrado"
      });
    }

    await pool.request()
      .input("estacionId", sql.Int, Number(estacionId))
      .query(`
        UPDATE Estaciones
        SET estacionEstado = 'Disponible'
        WHERE estacionId = @estacionId
      `);

    res.json({
      message: "Ticket pausado correctamente",
      ticket: ticketResult.recordset[0]
    });

  } catch (error) {
    res.status(500).json({
      message: "Error al pausar ticket",
      error: error.message
    });
  }
};

/* =========================
   REANUDAR TICKET
========================= */
export const reanudarTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { estacionId, empleadoId } = req.body;

    if (!ticketId || !estacionId) {
      return res.status(400).json({
        message: "Faltan datos para reanudar el ticket"
      });
    }

    const pool = await getConnection();

    const ticketResult = await pool.request()
      .input("ticketId", sql.Int, Number(ticketId))
      .input("estacionId", sql.Int, Number(estacionId))
      .input("empleadoId", sql.Int, empleadoId ? Number(empleadoId) : null)
      .query(`
        UPDATE Tickets
        SET 
          ticketEstado = 'En Atención',
          ticketPausaFin = ${HORA_HONDURAS},
          ticketTiempoPausaTotal = ISNULL(ticketTiempoPausaTotal, 0) +
            ISNULL(DATEDIFF(MINUTE, ticketPausaInicio, ${HORA_HONDURAS}), 0),
          ticketPausaInicio = NULL,
          ticketEstacionId = @estacionId,
          ticketEmpleadoId = ISNULL(@empleadoId, ticketEmpleadoId)
        OUTPUT INSERTED.*
        WHERE ticketId = @ticketId
      `);

    if (ticketResult.recordset.length === 0) {
      return res.status(404).json({
        message: "Ticket no encontrado"
      });
    }

    await pool.request()
      .input("estacionId", sql.Int, Number(estacionId))
      .query(`
        UPDATE Estaciones
        SET estacionEstado = 'Atendiendo'
        WHERE estacionId = @estacionId
      `);

    res.json({
      message: "Ticket reanudado correctamente",
      ticket: ticketResult.recordset[0]
    });

  } catch (error) {
    res.status(500).json({
      message: "Error al reanudar ticket",
      error: error.message
    });
  }
};