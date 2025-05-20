//Login.jsx
import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "../../../../pages/index.css";

export default function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

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

    // Validación básica
    if (!formData.email || !formData.password) {
      setError("Email y contraseña son requeridos");
      return;
    }

    try {
      await onLogin(formData.email, formData.password);
      navigate(location.state?.from || "/", { replace: true });
    } catch (err) {
      console.error("Error en login:", err);

      let errorMessage = "Error al iniciar sesión";
      if (err.message.includes("401")) {
        errorMessage = "Credenciales inválidas";
      } else if (err.message.includes("403")) {
        errorMessage = "Problema de autenticación. Intente nuevamente.";
      } else if (err.message.includes("Failed to fetch")) {
        errorMessage = "Error de conexión con el servidor";
      }

      setError(errorMessage);
    }
  };

  return (
    <div className="auth">
      <h2 className="auth__title">Iniciar sesión</h2>
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
        />
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
