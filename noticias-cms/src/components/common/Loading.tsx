import React from 'react';
import './Loading.css'; // Importa el nuevo estilo

const Loading: React.FC = () => {
  return (
    <div className="loading">
      <div className="spinner"></div>
      <p>Cargando...</p>
    </div>
  );
};

export default Loading;
