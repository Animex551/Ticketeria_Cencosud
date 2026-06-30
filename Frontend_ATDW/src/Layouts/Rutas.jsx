import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Contacto from "../pages/Contacto";
import DefaultPage from "../pages/DefaultPage";
import TicketPage from "../pages/TicketPage";
import AdminPage from "../pages/AdminPage"
import CrearPage from "../pages/CrearPage"
import TecnicoPage from "../pages/TecnicoPage"
import TomadosTPage from "../pages/TomadosTPage"


function Rutas() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Contacto" element={<Contacto />} />
      <Route path="/DefaultPage" element={<DefaultPage />} />
      <Route path="/TicketPage/:id" element={<TicketPage />} />
      <Route path="/AdminPage" element={<AdminPage />} />
      <Route path="/CrearPage" element={<CrearPage />} />
      <Route path="/TecnicoPage" element={<TecnicoPage />} />
      <Route path="/TomadosTPage" element={<TomadosTPage />} />
      
    </Routes>
  );
}

export default Rutas;