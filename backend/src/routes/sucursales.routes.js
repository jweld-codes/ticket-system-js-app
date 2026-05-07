import express from "express";
import { obtenerSucursales, eliminarSucursal, crearSucursal} from "../controllers/sucursales.controller.js";

const router = express.Router();

router.get("/", (req, res, next) => {
  //console.log("ENTRÓ A LA TABLA SUCURSALES");
  next();
}, obtenerSucursales);
router.post("/", crearSucursal);
router.delete("/:id", eliminarSucursal);

export default router;

