// ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import * as auth from "../../utils/auth";

export default function ProtectedRoute({ isLoggedIn, children }) {
  const [isValidToken, setIsValidToken] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      setIsValidating(false);
      return;
    }

    auth
      .checkToken(token)
      .then(() => setIsValidating(false))
      .catch(() => {
        localStorage.removeItem("jwt");
        setIsValidating(false);
      });
  }, []);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (isValidating) {
    return <div className="auth-validating">Validando sesión...</div>;
  }

  if (!isLoggedIn || !isValidToken) {
    return <Navigate to="/signin" replace />;
  }

  return children ? children : <Outlet />;
}
