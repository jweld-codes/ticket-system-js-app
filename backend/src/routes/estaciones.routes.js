import express from "express";
import {
  obtenerEstaciones,
  crearEstaciones,
  obtenerEstacionesPorSucursal,
  actualizarEstadoEstacionDescanso
} from "../controllers/estaciones.controllers.js";

const router = express.Router();

router.get("/", obtenerEstaciones);

router.get("/sucursal/:sucursalId", obtenerEstacionesPorSucursal);

router.post("/", crearEstaciones);

router.put("/:estacionId/estado", actualizarEstadoEstacionDescanso);

export default router;