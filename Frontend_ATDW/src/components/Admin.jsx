import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

function Admin() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [zonas, setZonas] = useState({});
  const [fallas, setFallas] = useState({});
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState("mensual");

  const COLORS = ['#2ecc71', '#f1c40f', '#e74c3c', '#3498db', '#9b59b6'];

  const userLogueado = localStorage.getItem("usernameUsuario");
  const esTecnico = localStorage.getItem("esTecnico") === "true";
  const esAdmin = localStorage.getItem("esAdmin") === "true";

  const mapaPrioridades = {
    1: { texto: "Baja", color: "#2ecc71" },
    2: { texto: "Media", color: "#f1c40f" },
    3: { texto: "Alta", color: "#e74c3c" }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resTickets, resZonas, resFallas] = await Promise.allSettled([
          axios.get("http://localhost:8000/api/tickets/?all=true"),
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
          resFallas.value.data.forEach(f => mapaF[f.id] = { nombre: f.tipo, prioridad: f.prioridad });
          setFallas(mapaF);
        }
      } catch (error) { console.error("Error al cargar:", error); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const filteredTickets = useMemo(() => {
    const ahora = new Date();
    return tickets.filter((t) => {
      const fechaTicket = new Date(t.fecha_creacion);
      if (periodo === "semanal") {
        const haceUnaSemana = new Date();
        haceUnaSemana.setDate(ahora.getDate() - 7);
        return fechaTicket >= haceUnaSemana;
      }
      if (periodo === "mensual") return fechaTicket.getMonth() === ahora.getMonth() && fechaTicket.getFullYear() === ahora.getFullYear();
      if (periodo === "anual") return fechaTicket.getFullYear() === ahora.getFullYear();
      return true;
    });
  }, [tickets, periodo]);

  // --- CÁLCULOS PARA LOS GRÁFICOS ---
  const chartDataEstado = useMemo(() => {
    const counts = { "Abierto": 0, "En Proceso": 0 };
    filteredTickets.forEach(t => counts[t.estado] = (counts[t.estado] || 0) + 1);
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
  }, [filteredTickets]);

  const chartDataPrioridad = useMemo(() => {
    const counts = { "Baja": 0, "Media": 0, "Alta": 0 };
    filteredTickets.forEach(t => {
      const p = fallas[t.id_falla]?.prioridad || 1;
      const label = p === 1 ? "Baja" : p === 2 ? "Media" : "Alta";
      counts[label]++;
    });
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
  }, [filteredTickets, fallas]);

  const chartDataZonas = useMemo(() => {
    const counts = {};
    filteredTickets.forEach(t => {
      const zona = zonas[t.id_zona_problema] || "Desconocida";
      counts[zona] = (counts[zona] || 0) + 1;
    });
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
  }, [filteredTickets, zonas]);

  if (loading) return <div className="admin-page"><p>Cargando...</p></div>;

  return (
    <main className="admin-page">
      <aside className="admin-menu">
        <div className="admin-title"><h2>Bienvenido</h2><p>{userLogueado}</p></div>
        <button onClick={() => navigate("/DefaultPage")}>Mis Tickets</button>
        {esTecnico && <button onClick={() => navigate("/TecnicoPage")}>Tickets por revisar</button>}
        {esTecnico && <button onClick={() => navigate("/TomadosTPage")}>Tickets Tomados</button>}
        {esAdmin && <button onClick={() => navigate("/AdminPage")}>Dashboard</button>}
        <button onClick={handleLogout}>Finalizar sesión</button>
      </aside>

      <section className="admin-main">
        <header>
          <h1>Dashboard</h1>
          <div className="period-filters">
            <button onClick={() => setPeriodo("semanal")} className={periodo === "semanal" ? "active" : ""}>Semanal</button>
            <button onClick={() => setPeriodo("mensual")} className={periodo === "mensual" ? "active" : ""}>Mensual</button>
            <button onClick={() => setPeriodo("anual")} className={periodo === "anual" ? "active" : ""}>Anual</button>
          </div>
        </header>

        {/* Sección de 3 Gráficos */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '40px' }}>
          <div style={{ background: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', height: '250px' }}>
            <h4>Estado</h4>
            <ResponsiveContainer width="100%" height="80%"><BarChart data={chartDataEstado}><XAxis dataKey="name"/><Tooltip/><Bar dataKey="value" fill="#3498db"/></BarChart></ResponsiveContainer>
          </div>
          <div style={{ background: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', height: '250px' }}>
            <h4>Prioridad</h4>
            <ResponsiveContainer width="100%" height="80%"><PieChart><Pie data={chartDataPrioridad} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>{chartDataPrioridad.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip/><Legend/></PieChart></ResponsiveContainer>
          </div>
          <div style={{ background: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', height: '250px' }}>
            <h4>Tickets por Zona</h4>
            <ResponsiveContainer width="100%" height="80%"><BarChart data={chartDataZonas}><XAxis dataKey="name"/><Tooltip/><Bar dataKey="value" fill="#9b59b6"/></BarChart></ResponsiveContainer>
          </div>
        </section>

        {/* Tabla recuperada */}
        <section className="admin-tabla">
          <h3>Tickets {periodo}</h3>
          <table>
            <thead>
              <tr><th>ID</th><th>Nombre</th><th>Zona</th><th>Falla</th><th>Prioridad</th><th>Estado</th></tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => {
                const infoFalla = fallas[ticket.id_falla] || { nombre: "Desconocido", prioridad: 1 };
                const infoPrioridad = mapaPrioridades[infoFalla.prioridad] || mapaPrioridades[1];
                return (
                  <tr key={ticket.id}>
                    <td><Link to={`/TicketPage/${ticket.id}`}>{ticket.id}</Link></td>
                    <td>{ticket.nombre}</td>
                    <td>{zonas[ticket.id_zona_problema] || ticket.id_zona_problema}</td>
                    <td>{infoFalla.nombre}</td>
                    <td><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: infoPrioridad.color }} />{infoPrioridad.texto}</div></td>
                    <td>{ticket.estado}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      </section>
    </main>
  );
}

export default Admin;