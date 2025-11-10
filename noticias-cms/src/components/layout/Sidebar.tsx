import React from 'react';

const Sidebar: React.FC = () => {
    return (
        <div className="sidebar">
            <h2>Menú de Navegación</h2>
            <ul>
                <li><a href="/">Inicio</a></li>
                <li><a href="/news">Noticias</a></li>
                <li><a href="/dashboard">Dashboard</a></li>
                <li><a href="/login">Iniciar Sesión</a></li>
            </ul>
        </div>
    );
};

export default Sidebar;