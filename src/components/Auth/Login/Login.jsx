//Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../../../pages/index.css";

export default function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
      await onLogin(formData.email, formData.password);
      setFormData({ email: "", password: "" });
    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="auth">
      <h2 className="auth__title">Iniciar sesión</h2>
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
