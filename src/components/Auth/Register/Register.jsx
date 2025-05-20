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
  const navigate = useNavigate();
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const closeAllPopups = () => {
    setShowSuccessPopup(false);
    setShowErrorPopup(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validación frontend
    if (!formData.email || !formData.password) {
      setError("Email y contraseña son obligatorios");
      setShowErrorPopup(true);
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError("Ingrese un email válido");
      setShowErrorPopup(true);
      return;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setShowErrorPopup(true);
      return;
    }

    try {
      const response = await onRegister(formData.email, formData.password);

      if (response?.data) {
        setShowSuccessPopup(true);
        setTimeout(() => navigate("/signin"), 2000);
      }
    } catch (err) {
      console.error("Error en registro:", err);
      setError(
        err.message ||
          "Error al registrarse. Por favor, intente con diferentes credenciales."
      );
      setShowErrorPopup(true);
    }
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
        />
        <input
          className="auth__input"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Contraseña"
          required
          minLength="6"
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
