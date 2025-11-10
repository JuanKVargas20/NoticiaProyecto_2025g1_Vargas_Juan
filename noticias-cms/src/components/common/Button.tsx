import React from 'react';
import './Button.css'; // ← Importa los estilos del botón

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, children, className }) => {
  return (
    <button onClick={onClick} className={`btn ${className || ''}`}>
      {children}
    </button>
  );
};

export default Button;