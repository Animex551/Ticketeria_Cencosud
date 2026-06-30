import { useState, useEffect } from 'react';
import { ticketsData, estadisticasData } from '../data/tickets';
import { TicketCard } from './TicketCard';

function Home(){
     
        const [tickets, setTickets] = useState([]);
        const [filteredTickets, setFilteredTickets] = useState([]);
        const [stats, setStats] = useState(estadisticasData);

        useEffect(() => {
            // Simulando carga de datos y cambio de título
            document.title = 'Inicio - Sistema de Tickets';
            
            // Cargar tickets
            setTickets(ticketsData);
            setFilteredTickets(ticketsData.slice(0, 9)); // Mostrar primeros 9 tickets

            return () => {
            document.title = 'React App';
            };
        }, []);

        const ticketAbiertos = filteredTickets.filter(t => t.estado === 'Abierto');
        const ticketsCriticos = filteredTickets.filter(t => t.estado === 'Crítico');

        return (
            <div className="home">
            <main className="home__main" role="main">
                <div className="container">
                {/* Resumen Estadístico */}
                <section className="home__estadisticas" aria-label="Resumen estadístico de tickets">
                    <h2 className="home__section-title">Resumen de Estadísticas</h2>
                    
                    <div className="estadisticas-grid">
                    <div className="estadistica-card">
                        <div className="estadistica-card__numero">
                        {stats.abiertos.toLocaleString()}
                        </div>
                        <div className="estadistica-card__label">Tickets Abiertos</div>
                        <div className="estadistica-card__porcentaje">{stats.porcentajeAbiertos}%</div>
                    </div>

                    <div className="estadistica-card estadistica-card--critico">
                        <div className="estadistica-card__numero">
                        {stats.criticos.toLocaleString()}
                        </div>
                        <div className="estadistica-card__label">Críticos</div>
                        <div className="estadistica-card__porcentaje">{stats.porcentajeCriticos}%</div>
                    </div>

                    <div className="estadistica-card estadistica-card--resuelto">
                        <div className="estadistica-card__numero">
                        {stats.resueltos.toLocaleString()}
                        </div>
                        <div className="estadistica-card__label">Resueltos</div>
                        <div className="estadistica-card__porcentaje">{stats.porcentajeResueltos}%</div>
                    </div>
                    </div>

                    {/* Gráfico de pastel simple */}
                    <div className="estadisticas-chart">
                    <h3 className="estadisticas-chart__title">Distribución de Estado</h3>
                    <div className="chart-container">
                        <svg viewBox="0 0 200 200" className="pie-chart">
                        {/* Implementación simplificada de gráfico de pastel */}
                        <circle cx="100" cy="100" r="90" fill="none" stroke="#e0e0e0" strokeWidth="2" />
                        <text x="100" y="105" textAnchor="middle" fontSize="24" fill="#0066cc" fontWeight="bold">
                            TICKETS
                        </text>
                        </svg>
                        <div className="chart-legend">
                        <div className="legend-item">
                            <span className="legend-color" style={{ backgroundColor: '#28a745' }}></span>
                            <span>Resueltos: {stats.porcentajeResueltos}%</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-color" style={{ backgroundColor: '#0066cc' }}></span>
                            <span>Abiertos: {stats.porcentajeAbiertos}%</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-color" style={{ backgroundColor: '#ffc107' }}></span>
                            <span>Críticos: {stats.porcentajeCriticos}%</span>
                        </div>
                        </div>
                    </div>
                    </div>
                </section>

                {/* Sección de Tickets */}
                <section className="home__tickets" aria-label="Sección de tickets abiertos y críticos">
                    <div className="tickets-container">
                    {/* Tickets Abiertos */}
                    <div className="tickets-section">
                        <h2 className="tickets-section__title">
                        TICKETS ABIERTOS
                        <span className="tickets-section__count">{ticketAbiertos.length}</span>
                        </h2>
                        <div className="tickets-grid">
                        {ticketAbiertos.map(ticket => (
                            <TicketCard
                            key={ticket.id}
                            nombre={ticket.nombre}
                            codigo={ticket.codigo}
                            estado={ticket.estado}
                            cantidad={ticket.cantidad}
                            imagen={ticket.imagen}
                            />
                        ))}
                        </div>
                    </div>

                    {/* Tickets Críticos */}
                    <div className="tickets-section">
                        <h2 className="tickets-section__title">
                        TICKETS ESTADO CRÍTICO
                        <span className="tickets-section__count">{ticketsCriticos.length}</span>
                        </h2>
                        <div className="tickets-grid">
                        {ticketsCriticos.map(ticket => (
                            <TicketCard
                            key={ticket.id}
                            nombre={ticket.nombre}
                            codigo={ticket.codigo}
                            estado={ticket.estado}
                            cantidad={ticket.cantidad}
                            imagen={ticket.imagen}
                            />
                        ))}
                        </div>
                    </div>
                    </div>
                </section>
                </div>
            </main>
            </div>
        );
        };
        

        export default Home;
