import { BrowserRouter, Routes, Route } from "react-router-dom";
import RutaProtegida from "./components/RutaProtegida";

import Inicio from "./pages/Inicio";
import Login from "./pages/Login";


import LoginKiosko from "./pages/Kioskos/LoginKiosko";
import NuevoKiosko from "./pages/Kioskos/NuevoKiosko";

import TurnoManual from "./pages/Turnos/TurnoManual";
import EleccionTurno from "./pages/Turnos/EleccionTurno";
import TurnoDigitalQR from "./pages/Turnos/TurnDigitalQR";
import TurnoDigital from "./pages/Turnos/TurnoDigital";
import TicketDigitalGenerado from "./components/Tickets/TicketDigitalGenerado";

import Usuarios from "./pages/Usuarios";
import GestorTickets from "./pages/Gestor/GestorUI";
import SupervisorPanel from "./pages/Supervisor/SupervisorPanel";
import AdminPanel from "./pages/Admin/AdminPanel";
import ListaTickets from "./pages/Tickets/Tickets";

import NoAutorizado from "./pages/NoAutorizado";

import Empleados from "./pages/Empleados";
import Sucursales from "./pages/Sucursales";
import Estaciones from "./pages/Estaciones";
import PanelGeneral from "./pages/Supervisor/PanelGeneral";
import Clientes from "./pages/Clientes";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Inicio />} />

        <Route path="/login" element={<Login />} />
        <Route path="/login-kiosko" element={<LoginKiosko />} />
        <Route path="/turno-manual" element={<TurnoManual />} />
        <Route path="/eleccion-turno" element={<EleccionTurno />} />
        <Route path="/turno-digital/:ticketId" element={<TurnoDigital />} />
        <Route path="/turno-digital-qr" element={<TurnoDigitalQR />} />
        <Route path="/turno-digital" element={<TurnoDigital />} />
        <Route path="/ticket-digital-generado" element={<TicketDigitalGenerado />} />


        <Route
          path="/gestor"
          element={
            <RutaProtegida rolesPermitidos={["Gestor", "Administrador"]}>
              <GestorTickets />
            </RutaProtegida>
          }
        />

       <Route path="/supervisor" element={<SupervisorPanel />}>
        <Route index           element={<PanelGeneral />} />
        <Route path="tickets"  element={<ListaTickets />} />
        <Route path="clientes" element={<Clientes />} />
        <Route path="estaciones" element={<Estaciones />} />
      </Route>

        

        <Route
          path="/admin"
          element={
            <RutaProtegida rolesPermitidos={["Administrador"]}>
              <AdminPanel />
            </RutaProtegida>
          }
        />

        <Route
          path="/usuarios"
          element={
            <RutaProtegida rolesPermitidos={["Administrador"]}>
              <Usuarios />
            </RutaProtegida>
          }
        />

        <Route
          path="/empleados"
          element={
            <RutaProtegida rolesPermitidos={["Administrador"]}>
              <Empleados />
            </RutaProtegida>
          }
        />

         <Route
          path="/nuevo-kiosko"
          element={
            <RutaProtegida rolesPermitidos={["Administrador"]}>
              <NuevoKiosko />
            </RutaProtegida>
          }
        />

        <Route
          path="/sucursales"
          element={
            <RutaProtegida rolesPermitidos={["Administrador"]}>
              <Sucursales />

            </RutaProtegida>
          }
        />

        <Route
          path="/estaciones"
          element={
            <RutaProtegida rolesPermitidos={["Administrador"]}>
              <Estaciones />
            </RutaProtegida>
          }
        />

        <Route
          path="/tickets"
          element={
            <RutaProtegida rolesPermitidos={["Supervisor", "Administrador"]}>
              <ListaTickets />
            </RutaProtegida>
          }
        />

        <Route path="/no-autorizado" element={<NoAutorizado />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;