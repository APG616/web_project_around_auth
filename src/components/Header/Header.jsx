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
      <div className="header__content">
        <img src={logo} alt="Logo" className="header__logo" />
        <div className="header__right-content">
          {isLoggedIn ? (
            <>
              <button
                className={`header__hamburger ${
                  isMenuOpen ? "header__hamburger_active" : ""
                }`}
                onClick={toggleMenu}
                aria-label="Menú"
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
              <div
                className={`header__auth-container ${
                  isMenuOpen ? "header__auth-container_active" : ""
                }`}
              >
                <span className="header__email">{userEmail}</span>
                <button className="header__logout" onClick={onLogout}>
                  Cerrar sesión
                </button>
              </div>
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
