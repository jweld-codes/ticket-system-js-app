import express from "express";
import { obtenerTiposAtencion } from "../controllers/tiposAtencion.controller.js";

const router = express.Router();

router.get("/", obtenerTiposAtencion);

export default router;