import express from "express";
import { obtenerKioskos, crearKiosko, validarKiosko } from "../controllers/kiosko.controller.js";

const router = express.Router();

router.get("/", (req, res, next) => {
  //console.log("ENTRÓ A LA TABLA EMPLEADOS");
  next();
}, obtenerKioskos);
router.post("/", crearKiosko);
router.post("/validar", validarKiosko);

export default router;