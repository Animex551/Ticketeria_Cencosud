import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function Ticket() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [ticket, setTicket] = useState(null);
  const [adjuntos, setAdjuntos] = useState([]);
  const [nombreZona, setNombreZona] = useState("Cargando...");
  const [nombreFalla, setNombreFalla] = useState("Cargando...");
  const [cargando, setCargando] = useState(true);

  const userLogueado = localStorage.getItem("usernameUsuario");
  const emailLogueado = localStorage.getItem("emailUsuario");
  const esTecnico = localStorage.getItem("esTecnico") === "true";

  const mapaPrioridades = {
    1: { texto: "Baja", clase: "verde" },
    2: { texto: "Media", clase: "amarillo" },
    3: { texto: "Alta", clase: "rojo" }
  };

  useEffect(() => {
    fetchTicketData();
  }, [id]);

const fetchTicketData = async () => {
    try {
      const resTicket = await axios.get(`http://localhost:8000/api/tickets/${id}/`);
      setTicket(resTicket.data);
      const { id_zona_problema, id_falla } = resTicket.data;

      // Pedimos las cosas necesarias. Fíjate en la URL de adjuntos:
      const [resZona, resFalla, resAdjuntos] = await Promise.all([
        axios.get(`http://localhost:8000/api/zonas/${id_zona_problema}/`).catch(() => ({ data: { sector: "General" } })),
        axios.get(`http://localhost:8000/api/tipo-falla/${id_falla}/`).catch(() => ({ data: { tipo: "Falla Común" } })),
        // Aquí pasamos el ID del ticket para filtrar desde el servidor
        axios.get(`http://localhost:8000/api/adjuntos/?ticket=${id}`).catch(() => ({ data: [] }))
      ]);

      setNombreZona(resZona.data.sector);
      setNombreFalla(resFalla.data.tipo);
      
      // Ya no hace falta filtrar aquí, el backend nos devuelve solo los correctos
      setAdjuntos(resAdjuntos.data); 
      setCargando(false);
    } catch (err) {
      console.error("Error al cargar:", err);
      setCargando(false);
    }
  };
  const handleAccion = async (nuevoEstado, esTomar = false) => {
    try {
      const payload = { estado: nuevoEstado };
      if (esTomar) payload.id_tecnico = localStorage.getItem("emailUsuario");
      await axios.patch(`http://localhost:8000/api/tickets/${id}/`, payload);
      alert("Ticket actualizado");
      fetchTicketData();
    } catch (error) {
      console.error(error.response?.data);
      alert("Error al actualizar.");
    }
  };

  if (cargando) return <p style={{ padding: "30px", textAlign: "center", color: "white" }}>Cargando ticket...</p>;
  if (!ticket) return <p>Ticket no encontrado.</p>;

  const valorPrioridad = ticket.prioridad ?? 1;
  const infoPrioridad = mapaPrioridades[valorPrioridad] || { texto: "N/A", clase: "" };

  return (
    <div className="ticket-detail-page">
      <aside className="admin-menu">
        <div className="admin-title">
          <h2>Bienvenido</h2>
          <p>{userLogueado}</p>
        </div>
        <button className="btn-regresar" onClick={() => navigate(-1)}>← Volver</button>
      </aside>

      <section className="ticket-main-content">
        <div className="ticket-header-container">
          <h2>Detalle del Ticket #{ticket.id}</h2>
          <div className="acciones-tecnico" style={{ marginBottom: "15px" }}>
            {esTecnico && !ticket.id_tecnico && (
              <button onClick={() => handleAccion("En Proceso", true)}>Tomar Ticket</button>
            )}
            {esTecnico && String(ticket.id_tecnico) === String(emailLogueado) && ticket.estado !== "Finalizado" && (
              <button onClick={() => handleAccion("Finalizado")}>Finalizar Ticket</button>
            )}
          </div>
        </div>

        <div className="ticket-info-card">
           <div className="field-group">
            <label>Asunto</label>
            <p style={{ fontSize: "20px", fontWeight: "bold" }}>{ticket.nombre}</p>
          </div>

          <div className="ticket-grid-details">
            <div className="field-group"><label>Zona</label><p>{nombreZona}</p></div>
            <div className="field-group"><label>Tipo</label><p>{nombreFalla}</p></div>
            <div className="field-group"><label>Estado</label><span className="status-badge">{ticket.estado}</span></div>
            <div className="field-group">
              <label>Prioridad</label>
              <div className="prioridad-indicator-wrapper">
                <span className={`indicador-dot ${infoPrioridad.clase}`}></span>
                <span>{infoPrioridad.texto}</span>
              </div>
            </div>
          </div>

          <div className="field-group" style={{ marginTop: "15px" }}>
            <label>Descripción</label>
            <div className="description-block">{ticket.descripcion}</div>
          </div>

          {/* Sección de adjuntos */}
          {adjuntos.length > 0 && (
            <div className="field-group" style={{ marginTop: "20px" }}>
              <label>Archivos Adjuntos</label>
              <div className="adjuntos-container" style={{ display: "flex", gap: "15px", marginTop: "10px", flexWrap: "wrap" }}>
                {adjuntos.map((item) => {
                  // Asegura que la ruta tenga el dominio del servidor
                  const imageUrl = item.path.startsWith('http') ? item.path : `http://localhost:8000${item.path}`;
                  return (
                    <a key={item.id} href={imageUrl} target="_blank" rel="noreferrer">
                      <img 
                        src={imageUrl} 
                        alt="Adjunto" 
                        style={{ width: "150px", height: "150px", objectFit: "cover", borderRadius: "8px", border: "1px solid #ddd" }} 
                        onError={(e) => { e.target.style.display = 'none'; console.log("No se pudo cargar la imagen:", imageUrl); }}
                      />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Ticket;