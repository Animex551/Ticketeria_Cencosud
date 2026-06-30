import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Ticketeria() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [zonas, setZonas] = useState({});
  const [fallas, setFallas] = useState({}); // Ahora guardará { nombre, prioridad }
  const [cargando, setCargando] = useState(true);

  const emailLogueado = localStorage.getItem("emailUsuario");
  const userLogueado = localStorage.getItem("usernameUsuario");
  const esTecnico = localStorage.getItem("esTecnico") === "true";
  const esAdmin = localStorage.getItem("esAdmin") === "true";


  const mapaPrioridades = {
    1: { texto: "Baja ", clase: "verde", color: "#2ecc71" },
    2: { texto: "Media ", clase: "amarillo", color: "#f1c40f" },
    3: { texto: "Alta ", clase: "rojo", color: "#e74c3c" }
  };

  useEffect(() => {
    if (!emailLogueado) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        const url = `http://localhost:8000/api/tickets/?cliente=${emailLogueado}`;

        const [resTickets, resZonas, resFallas] = await Promise.allSettled([
          axios.get(url),
          axios.get("http://localhost:8000/api/zonas/"),
          axios.get("http://localhost:8000/api/tipo-falla/")
        ]);

        if (resTickets.status === "fulfilled") setTickets(resTickets.value.data);
        
        if (resZonas.status === "fulfilled") {
          const mapaZ = {};
          resZonas.value.data.forEach(z => mapaZ[z.id] = z.sector);
          setZonas(mapaZ);
        }
        
        if (resFallas.status === "fulfilled") {
          const mapaF = {};
          // Guardamos tanto el nombre (tipo) como la prioridad
          resFallas.value.data.forEach(f => mapaF[f.id] = { nombre: f.tipo, prioridad: f.prioridad });
          setFallas(mapaF);
        }

      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setCargando(false);
      }
    };

    fetchData();
  }, [emailLogueado, navigate]);

  if (cargando) return <p style={{ padding: "20px", color: "white" }}>Cargando...</p>;

  return (
    <main className="admin-page">
      <aside className="admin-menu">
        <div className="admin-title">
          <h2>Bienvenido</h2>
          <p>{userLogueado}</p>
        </div>
        <button onClick={() => navigate("/DefaultPage")}>Mis Tickets</button>
        {esTecnico && <button onClick={() => navigate("/TecnicoPage")}>Tickets por revisar</button>}
         {esTecnico && <button onClick={() => navigate("/TomadosTPage")}>Tickets Tomados</button>}
         {esAdmin && <button onClick={() => navigate("/AdminPage")}>Dashboard</button>}
        <button onClick={() => { localStorage.clear(); navigate("/"); }}>Finalizar sesión</button>
        <button onClick={() => navigate("/CrearPage")}>Crear ticket</button>
      </aside>

      <section className="admin-main">
        <h2>Listado de Tickets Propios</h2>
        <section className="admin-tabla">
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Nombre</th><th>Zona</th><th>Tipo Falla</th><th>Prioridad</th><th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {tickets.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: "center" }}>No tienes tickets registrados.</td></tr>
              ) : (
                tickets.map((ticket) => {
                  // Obtenemos la info desde nuestro objeto fallas
                  const infoFalla = fallas[ticket.id_falla] || { nombre: "Desconocido", prioridad: 1 };
                  const infoPrioridad = mapaPrioridades[infoFalla.prioridad] || mapaPrioridades[1];
                  
                  return (
                    <tr key={ticket.id}>
                      <td><Link to={`/TicketPage/${ticket.id}`}>{ticket.id}</Link></td>
                      <td>{ticket.nombre}</td>
                      <td>{zonas[ticket.id_zona_problema] || ticket.id_zona_problema}</td>
                      <td>{infoFalla.nombre}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{
                            width: '12px', height: '12px', borderRadius: '2px',
                            backgroundColor: infoPrioridad.color
                          }} />
                          {infoPrioridad.texto}
                        </div>
                      </td>
                      <td>{ticket.estado}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </section>
      </section>
    </main>
  );
}

export default Ticketeria;