import express from "express";
import {
  crearTicketManual,
  obtenerTickets,
  obtenerTicketsPendientes,
  iniciarAtencionTicket,
  finalizarTicket,
  cancelarTicket,
  tomarTicket,
  obtenerEstadisticasEstacion,
  obtenerReporteTickets,
  obtenerTicketPorId,
  pausarTicket,
  reanudarTicket
} from "../controllers/tickets.controller.js";

const router = express.Router();

router.get("/", obtenerTickets);
router.get("/pendientes", obtenerTicketsPendientes);
router.get("/reporte", obtenerReporteTickets);
router.get("/estadisticas/:estacionId", obtenerEstadisticasEstacion);
router.get("/:ticketId", obtenerTicketPorId);

router.post("/manual", crearTicketManual);

router.put("/:ticketId/tomar", tomarTicket);
router.put("/:ticketId/pausar", pausarTicket);
router.put("/:ticketId/reanudar", reanudarTicket);
router.put("/:ticketId/iniciar", iniciarAtencionTicket);
router.put("/:ticketId/finalizar", finalizarTicket);
router.put("/:ticketId/cancelar", cancelarTicket);

export default router;