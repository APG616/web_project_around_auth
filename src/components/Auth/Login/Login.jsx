//Login.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import "../../../../pages/index.css";

export default function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((_prev) => ({ ...formData, [name]: value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  
  // Basic validation
  if (!formData.email || !formData.email.includes('@')) {
    setError("Por favor ingresa un email válido");
    return;
  }
  if (!formData.password) {
    setError("Por favor ingresa tu contraseña");
    return;
  }

  try {
    await onLogin(formData.email, formData.password);
  } catch (err) {
    setError(err.message || "Error al iniciar sesión");
  }
};

  return (
    <div className="auth">
      <h2 className="auth__title">Iniciar sesión</h2>
      {/* eslint-disable-next-line no-undef */}
      {error && <p className="auth__error">{error}</p>}
      <form className="auth__form" onSubmit={handleSubmit} noValidate>
        <input
          className="auth__input"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Correo electrónico"
          autoComplete="username"
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
          minLength="4"
          autoComplete="current-password"
        />
        {/* eslint-disable-next-line no-undef*/}
        <button className="auth__button" type="submit">
          Iniciar sesión
        </button>
      </form>
      <p className="auth__link">
        ¿Aún no eres miembro?
        <Link className="auth__link-text" to="/signup">
          Regístrate aquí
        </Link>
      </p>
    </div>
  );
}
