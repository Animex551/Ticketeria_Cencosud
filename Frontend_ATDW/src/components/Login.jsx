import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  
  // Estados para capturar las credenciales
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página se recargue
    setError("");

    console.log("Intentando iniciar sesión con:", { email, password });

    try {
      // 1. Enviamos las credenciales a Django
      const response = await axios.post("http://localhost:8000/api/login/", {
        email: email,
        password: password
      });

      console.log("Respuesta de Django recibida:", response.data);

      if (response.data) {
        const usuario = response.data; // { email, is_admin, is_IT }

        // 2. GUARDAR EN LOCALSTORAGE (Crucial para que las páginas no te expulsen)
        localStorage.setItem("emailUsuario", usuario.email);
        localStorage.setItem("usernameUsuario", usuario.username);
        localStorage.setItem("esTecnico", usuario.is_IT ? "true" : "false");
        localStorage.setItem("esAdmin", usuario.is_admin ? "true" : "false");

        // 3. Evaluar roles y redirigir
        if (usuario.is_admin === true) {
          navigate("/AdminPage");
        } else if (usuario.is_IT === true) {
          navigate("/TecnicoPage"); 
        } else {
          navigate("/DefaultPage");  
        }
      }

    } catch (err) {
      console.error("Error en la petición de Login:", err);
      if (err.response) {
        setError(err.response.data.error || "Credenciales incorrectas. Inténtalo de nuevo.");
      } else {
        setError("No se pudo conectar con el servidor de Django. ¿Está encendido?");
      }
    }
  };

  return (
    <main className="login-container">
      <div className="login-box">
        <h2>Inicio de sesión</h2>

        {error && <p style={{ color: "red", marginBottom: "15px" }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Correo</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="btn-primario">
            Iniciar sesión
          </button>
        </form>
      </div>
    </main>
  );
}

export default Login;