// Header.jsx
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../../../blocks/header.css";
import logo from "../../../images/logo.png";

export default function Header({ isLoggedIn, userEmail, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="header">
      {/* Menú hamburguesa abierto */}
      {isLoggedIn && isMenuOpen && (
        <div className="header__info-container header__info-container_active">
          {/* Email y Cerrar sesión en la parte superior */}
          <div className="header__mobile-menu-content">
      <span className="header__email">{userEmail}</span>
      <button className="header__logout" onClick={onLogout}>
        Cerrar sesión
      </button>
    </div>

          {/* Botón cerrar y logo en la parte inferior del menú */}
          <button 
      className="header__close" 
      onClick={toggleMenu} 
      aria-label="Cerrar"
    >
      ✕
    </button>
        </div>
      )}
      {/* Contenedor de barra principal*/}
      <div className={`header__content ${isMenuOpen ? "header__content_hidden" : ""}`}>
        <img src={logo} alt="Logo" className="header__logo" />
        <div className="header__right-content">
          {isLoggedIn ? (
            <>
              <button
                className="header__hamburger"
                onClick={toggleMenu}
                aria-label="Menú"
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
            </>
          ) : (
            <nav className="header__nav">
              {location.pathname === "/signin" && (
                <Link
                  to="/signup"
                  className="header__link"
                  state={{ from: location }}
                >
                  Regístrate
                </Link>
              )}
              {location.pathname === "/signup" && (
                <Link to="/signin" className="header__link">
                  Iniciar sesión
                </Link>
              )}
            </nav>
          )}
        </div>
      </div>

      
    </header>
  );
}
           