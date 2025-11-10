import React from "react";
import "./Home.css";

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <div className="overlay"></div> {/* capa oscura */}
      <div className="home-card">
        <h1>Bienvenido al CMS de Noticias Corporativas</h1>
        <p>Aquí podrás gestionar todas las noticias de tu empresa.</p>
      </div>
    </div>
  );
};

export default Home;
