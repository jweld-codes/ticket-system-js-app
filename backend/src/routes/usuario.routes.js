import express from "express";
import { obtenerUsuarios, crearUsuario} from "../controllers/usuarios.controller.js";

const router = express.Router();

router.get("/", (req, res, next) => {
  //console.log("ENTRÓ A LA TABLA USUARIOS");
  next();
}, obtenerUsuarios);
router.post("/", crearUsuario);

export default router;

