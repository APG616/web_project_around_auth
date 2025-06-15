// Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../../../pages/index.css";
import successIcon from "../../../../images/success-icon.png";
import errorIcon from "../../../../images/error-icon.png";
import closeIcon from "../../../../images/closeIcon.jpg";

export default function Register({ onRegister }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(() => ({ ...formData, [name]: value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    setError("Por favor ingresa un email válido");
    return;
  }
  if (!formData.password || formData.password.length < 8) {
    setError("La contraseña debe tener al menos 8 caracteres");
    return;
  }
    onRegister(formData.email, formData.password)
      .then(() => {
        setShowSuccessPopup(true);
        setTimeout(() => {
          navigate("/signin");
        }, 2000);
      })
      .catch(() => {
        setError("Error en el registro");
        setShowErrorPopup(true);
      });
  };

  const closeAllPopups = () => {
    setShowSuccessPopup(false);
    setShowErrorPopup(false);
    setError("");
  };

  return (
    <div className="auth">
      <h2 className="auth__title">Registro</h2>

      {error && <p className="auth__error">{error}</p>}

      <form className="auth__form" onSubmit={handleSubmit} noValidate>
        <input
  className="auth__input"
  type="email"
  name="email"
  value={formData.email}
  onChange={handleChange}
  placeholder="Correo electrónico"
  required
  autoComplete="username"  // Add this
/>
<input
  className="auth__input"
  type="password"
  name="password"
  value={formData.password}
  onChange={handleChange}
  placeholder="Contraseña"
  required
  minLength="4"
  autoComplete="new-password"  // Add this
/>
        <button className="auth__button" type="submit">
          Registrarse
        </button>
      </form>

      <p className="auth__link">
        ¿Ya eres miembro?{" "}
        <Link className="auth__link-text" to="/signin">
          Inicia sesión aquí
        </Link>
      </p>

      {/* Popup de éxito */}
      <div className={`popup ${showSuccessPopup ? "popup_open" : ""}`}>
        <div className="popup__content popup__content_auth">
          <button className="popup__close" onClick={closeAllPopups}>
            <img src={closeIcon} alt="Cerrar" className="popup__close-icon" />
          </button>
          <img src={successIcon} alt="Éxito" className="popup__icon" />
          <p className="popup__message">¡Registro exitoso!</p>
        </div>
      </div>

      {/* Popup de error */}
      <div className={`popup ${showErrorPopup ? "popup_open" : ""}`}>
        <div className="popup__content popup__content_auth">
          <button className="popup__close" onClick={closeAllPopups}>
            <img src={closeIcon} alt="Cerrar" className="popup__close-icon" />
          </button>
          <img src={errorIcon} alt="Error" className="popup__icon" />
          <p className="popup__message">{error || "Error en el registro"}</p>
        </div>
      </div>
    </div>
  );
}
