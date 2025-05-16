//Login.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import "../../../../pages/index.css";

export default function Login({ onLogin, apiError }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [localError, setLocalError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError("");
    onLogin(formData.email, formData.password);
  };

  return (
    <div className="auth">
      <h2 className="auth__title">Iniciar sesión</h2>
      {(apiError || localError) && (
        <p className="auth__error">{apiError || localError}</p>
      )}
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
          Iniciar sesión
        </button>
      </form>
      <p className="auth__link">
        ¿Aún no eres miembro?{" "}
        <Link to="/signup" className="auth__link-text">
          Regístrate aquí
        </Link>
      </p>
    </div>
  );
}
