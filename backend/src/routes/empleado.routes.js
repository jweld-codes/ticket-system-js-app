import express from "express";
import { obtenerEmpleados, crearEmpleado} from "../controllers/empleados.controller.js";

const router = express.Router();

router.get("/", (req, res, next) => {
  //console.log("ENTRÓ A LA TABLA EMPLEADOS");
  next();
}, obtenerEmpleados);
router.post("/", crearEmpleado);
//router.delete("/:id", eliminarEmpleado);

export default router;

