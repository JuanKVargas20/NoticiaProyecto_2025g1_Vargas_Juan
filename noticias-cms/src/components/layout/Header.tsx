import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

import "./Header.css";

const Header: React.FC = () => {
  const { user, logout } = useAuth(); 
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/"); // Redirige al inicio después de cerrar sesión
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  return (
    <header className="app-header">
      <h1 className="header-title">Noticias Corporativas</h1>

      <nav className="header-nav">
        <ul>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li> {/* Siempre visible */}
          {!user && <li><Link to="/login">Iniciar Sesión</Link></li>}
        </ul>
      </nav>

      {/* Botón de cerrar sesión visible solo cuando hay usuario */}
      {user && (
        <button className="btn-logout" onClick={handleLogout}>
          Cerrar sesión
        </button>
      )}
    </header>
  );
};

export default Header;
