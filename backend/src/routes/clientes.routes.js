import express from "express";
import { crearCliente } from "../controllers/clientes.controller.js";
import { obtenerClientes, eliminarCliente, buscarClientePorDNI} from "../controllers/clientes.controller.js";

const router = express.Router();

router.get("/", (req, res, next) => {
  //console.log("ENTRÓ A LA TABLA CLIENTES");
  next();
}, obtenerClientes);
router.post("/", crearCliente);
router.delete("/:id", eliminarCliente);
router.get("/dni/:dni", buscarClientePorDNI);

export default router;

