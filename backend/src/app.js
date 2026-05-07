import "dotenv/config";
import express from "express";
import cors from "cors";

import clientesRoutes from "./routes/clientes.routes.js";
import sucursalesRoutes from "./routes/sucursales.routes.js";
import empleadosRoutes from "./routes/empleado.routes.js";
import estacionesRoutes from "./routes/estaciones.routes.js";
import usuarioRoutes from "./routes/usuario.routes.js";
import kioskoRoutes from "./routes/kiosko.routes.js";
import ticketsRoutes from "./routes/tickets.routes.js";
import tiposAtencionRoutes from "./routes/tiposAtencion.routes.js";
import authRoutes from "./routes/auth.routes.js";
import vozRoutes from "./routes/voz.routes.js";

const app = express();

app.use(cors({
  origin: [
    "http://http://192.168.11.8:5000/api/"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
}));

app.use(express.json());

app.use("/api/clientes", clientesRoutes);
app.use("/api/sucursales", sucursalesRoutes);
app.use("/api/empleados", empleadosRoutes);
app.use("/api/estaciones", estacionesRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/kioskos", kioskoRoutes);
app.use("/api/tickets", ticketsRoutes);
app.use("/api/tipos-atencion", tiposAtencionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/voz", vozRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});