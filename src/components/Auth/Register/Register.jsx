// Register.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await onRegister(formData.email, formData.password);
      setShowSuccessPopup(true); // Mostrar popup de éxito
    } catch (err) {
      setError(err.message || "Ocurrió un error. Inténtalo de nuevo.");
      setShowErrorPopup(true); // Mostrar popup de error
    }
  };

  const closePopup = () => {
    setShowSuccessPopup(false);
    setShowErrorPopup(false);
  };

  return (
    <div className="auth">
      <h2 className="auth__title">Registro</h2>
      {error && <p className="auth__error">{error}</p>}
      <form className="auth__form" onSubmit={handleSubmit}>
        <input
          className="auth__input"
          type="email"
          name="email"
          autoComplete="username"
          value={formData.email}
          onChange={handleChange}
          placeholder="Correo electrónico"
          required
        />
        <input
          className="auth__input"
          type="password"
          name="password"
          autoComplete="current-password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Contraseña"
          required
        />
        <button className="auth__button" type="submit">
          Registrarse
        </button>
      </form>
      <p className="auth__link">
        ¿Ya eres miembro?
        <Link className="auth__link-text" to="/signin">
          Inicia sesión aquí
        </Link>
      </p>

      {/* Popup de éxito */}
      <div className={`popup ${showSuccessPopup ? "popup_open" : ""}`}>
        <div className="popup__content popup__content_auth">
          {/* Botón para cerrar el popup */}
          <button className="popup__close" onClick={closePopup}>
            <img
              src={closeIcon}
              alt="Cerrar popup"
              className="popup__close-icon"
            />
          </button>
          <img src={successIcon} alt="Éxito" className="popup__icon" />
          <p className="popup__message">¡Correcto! Ya estás registrado.</p>
        </div>
      </div>

      {/* Popup de error */}
      <div className={`popup ${showErrorPopup ? "popup_open" : ""}`}>
        <div className="popup__content popup__content_auth">
          <button className="popup__close" onClick={closePopup}>
            <img
              src={closeIcon}
              alt="Cerrar popup"
              className="popup__close-icon"
            />
          </button>
          <img src={errorIcon} alt="Error" className="popup__icon" />
          <p className="popup__message">
            Uy, algo salió mal. Por favor, inténtalo de nuevo.
          </p>
        </div>
      </div>
    </div>
  );
}
