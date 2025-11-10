import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <p className="footer-text">
                    &copy; {new Date().getFullYear()} Noticias CMS. Todos los derechos reservados.
                </p>
                <p className="footer-team">
                    Equipo de desarrollo: Juan Camilo Vargas Perdomo, Andrés Felipe Manjarres Criollo
                </p>
            </div>
        </footer>
    );
};

export default Footer;
