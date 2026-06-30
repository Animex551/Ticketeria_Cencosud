import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CrearT() {
  const navigate = useNavigate();

  // Estados de usuario
  const userLogueado = localStorage.getItem("usernameUsuario");
  const esTecnico = localStorage.getItem("esTecnico") === "true";
  const emailCreador = localStorage.getItem("emailUsuario");

  // Estados del formulario
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState(""); 
  const [zona, setZona] = useState(""); 
  const [sucursal, setSucursal] = useState("");
  const [descripcion, setDescripcion] = useState("");
  
  // 💡 ESTADO PARA MÚLTIPLES ARCHIVOS
  const [archivos, setArchivos] = useState([]);
  
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setExito("");

    if (!tipo || !zona || !sucursal) {
      setError("Por favor, completa todos los campos obligatorios.");
      return;
    }

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("id_falla", parseInt(tipo));
    formData.append("id_zona_problema", parseInt(zona));
    formData.append("sucursal", sucursal);
    formData.append("descripcion", descripcion);
    formData.append("id_cliente", emailCreador); 
    formData.append("estado", "Abierto");
   

    // 🎯 ENVIAR TODOS LOS ARCHIVOS AL BACKEND
    archivos.forEach((file) => {
      formData.append("path", file); 
    });

    try {
      await axios.post("http://localhost:8000/api/tickets/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      setExito("¡Ticket creado exitosamente! Redirigiendo...");
      handleReset();

      setTimeout(() => {
        navigate(esTecnico ? "/TecnicoPage" : "/DefaultPage");
      }, 2000);

    } catch (err) {
      console.error("Error al crear el ticket:", err);
      setError("Error al registrar el ticket. Verifica los datos y los archivos.");
    }
  };

  const handleReset = () => {
    setNombre("");
    setTipo("");
    setZona("");
    setSucursal("");
    setDescripcion("");
    setArchivos([]); // Limpiar archivos
    setError("");
    const fileInput = document.getElementById("archivo");
    if (fileInput) fileInput.value = "";
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <main className="ticket-detail-page">
      {/* MENÚ LATERAL */}
      <aside className="admin-menu">
        <div className="admin-title">
          <h2>Bienvenido</h2>
          <p>{userLogueado}</p>
        </div>
        <button className="btn-regresar" onClick={() => navigate(-1)}>← Volver</button>
      </aside>

      {/* CONTENIDO DEL FORMULARIO */}
      <section className="ticket-main-content">
        <form className="formulario" onSubmit={handleSubmit}>
          <h3>Nuevo ticket</h3>
          <p>Completa el formulario para crear tu solicitud.</p>

          {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}
          {exito && <p style={{ color: "green", fontWeight: "bold" }}>{exito}</p>}

          <div className="fila">
            <div>
              <label htmlFor="nombre">Nombre</label>
              <input id="nombre" type="text" placeholder="Nombre usuario" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="tipo">Tipo de falla</label>
              <select id="tipo" value={tipo} onChange={(e) => setTipo(e.target.value)} required>
                <option value="">Selecciona el tipo de falla</option>
                <option value="1">Iluminación</option>
                <option value="2">Climatización</option>
                <option value="3">Enchufes</option>
                <option value="4">Informática</option>
              </select>
            </div>
          </div>

          <label htmlFor="zona">Zona</label>
          <select id="zona" value={zona} onChange={(e) => setZona(e.target.value)} required>
            <option value="">Selecciona la zona o área</option>
            <option value="1">Cajas</option>
            <option value="2">Pasillo</option>
            <option value="3">Bodega</option>
            <option value="4">Entrada</option>
          </select>

          <label htmlFor="Sucursal">Sucursal</label>
          <select id="Sucursal" value={sucursal} onChange={(e) => setSucursal(e.target.value)} required>
            <option value="">Seleccione su Sucursal</option>
            <option value="el infierno">El infierno</option>
            <option value="el tercer impacto">El tercer impacto</option>
            <option value="la isla de jefrey epstein">La isla de Jeffrey Epstein</option>
            <option value="magallanes">Magallanes</option>
          </select>

          <label htmlFor="descripcion">Descripción del problema</label>
          <textarea id="descripcion" rows="4" placeholder="Describe detalladamente el problema" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required></textarea>

          {/* INPUT PARA MÚLTIPLES ARCHIVOS */}
          <label htmlFor="archivo">Adjuntar archivos (Opcional - Selecciona varios)</label>
          <input 
            id="archivo" 
            type="file" 
            multiple 
            onChange={(e) => setArchivos(Array.from(e.target.files))}
          />

          <div className="acciones">
            <button type="button" onClick={handleReset}>Limpiar</button>
            <button type="submit" className="crear">Crear ticket</button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default CrearT;