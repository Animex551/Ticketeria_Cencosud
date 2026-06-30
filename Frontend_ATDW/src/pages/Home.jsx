import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const tickets = [
    ["#TK-2024-0029", "Falla en iluminación - Pasillo 3", "Abierto", "Media", "24/06/2026"],
    ["#TK-2024-0028", "Error en sistema de aire - Sala 2", "En progreso", "Alta", "24/06/2026"],
    ["#TK-2024-0027", "Puerta de emergencia dañada", "Resuelto", "Media", "23/06/2026"],
  ];

  return (
    <main className="home-page">
      <section className="home-hero">
        <div>
          <h1>Bienvenido</h1>
          <p>Sistema de gestión de tickets de mantenimiento.</p>
          <p>Crea, revisa y da seguimiento a tus solicitudes de forma rápida.</p>

          <div className="home-actions">
            
            <button onClick={() => navigate("/AdminPage")}>Ingresar como Admin</button>
          </div>
        </div>
      </section>

      <section className="home-resumen">
        <h2>Resumen general</h2>

        <div className="home-cards">
          <article><strong>12</strong><p>Tickets abiertos</p></article>
          <article><strong>4</strong><p>En progreso</p></article>
          <article><strong>28</strong><p>Resueltos</p></article>
          <article><strong>2</strong><p>Críticos</p></article>
        </div>
      </section>

      <section className="home-tabla">
        <h2>Últimos tickets</h2>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Estado</th>
              <th>Prioridad</th>
              <th>Fecha</th>
            </tr>
          </thead>

          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket[0]}>
                <td>{ticket[0]}</td>
                <td>{ticket[1]}</td>
                <td>{ticket[2]}</td>
                <td>{ticket[3]}</td>
                <td>{ticket[4]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}

export default Home;