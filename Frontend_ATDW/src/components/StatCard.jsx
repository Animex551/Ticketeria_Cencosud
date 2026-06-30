function StatCard({ titulo, valor, texto }) {
  return (
    <article className="stat-card">
      <h3>{titulo}</h3>
      <strong>{valor}</strong>
      <p>{texto}</p>
    </article>
  );
}

export default StatCard;