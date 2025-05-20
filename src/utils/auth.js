// auth.js
const AUTH_URL = "https://se-register-api.en.tripleten-services.com/v1";
const API_URL = "https://around-api.en.tripleten-services.com/v1";

export const register = async (email, password) => {
  try {
    const response = await fetch(`${AUTH_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.message || `Error ${response.status}`;
      throw new Error(errorMsg);
    }

    return data;
  } catch (error) {
    console.error("Error en registro:", error);
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const response = await fetch(`${AUTH_URL}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.message || `Error ${response.status}`;
      throw new Error(errorMsg);
    }

    if (!data.token) {
      throw new Error("No se recibió token en la respuesta");
    }

    return data;
  } catch (error) {
    console.error("Error en login:", error);
    throw error;
  }
};

export const checkToken = async (token) => {
  try {
    const response = await fetch(`${AUTH_URL}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Token inválido (${response.status})`);
    }

    return data;
  } catch (error) {
    console.error("Error verificando token:", error);
    throw error;
  }
};

function handleResponse(res) {
  if (!res.ok) {
    return res.json().then((err) => Promise.reject(err));
  }
  return res.json();
}

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const response = await register(formData.email, formData.password);
    if (response && response.data) {
      setShowSuccessPopup(true);
      // Optionally redirect after successful registration
      setTimeout(() => navigate("/signin"), 2000);
    }
  } catch (err) {
    console.error("Registration error:", err);
    const errorMessage = err.message.includes("400")
      ? "Correo electrónico o contraseña inválidos"
      : err.message || "Ocurrió un error. Inténtalo de nuevo.";
    setError(errorMessage);
    setShowErrorPopup(true);
  }
};
