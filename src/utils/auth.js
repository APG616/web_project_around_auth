// auth.js
const BASE_URL = "https://se-register-api.en.tripleten-services.com/v1";

const validateToken = (token) => {
  if (!token || typeof token !== "string" || !token.startsWith("eyJ")) {
    throw new Error("Token inválido o mal formado");
  }
};

export const register = (email, password) => {
  if (!email || !password) {
    return Promise.reject(new Error("Email y password son requeridos"));
  }

  return fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email, password }),
  }).then(handleAuthResponse);
};

export const login = (email, password) => {
  if (!email || !password) {
    return Promise.reject(new Error("Email y password son requeridos"));
  }

  return fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email, password }),
  }).then(handleAuthResponse);
};

export const checkToken = (token) => {
  try {
    validateToken(token);

    return fetch(`${BASE_URL}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then(handleAuthResponse);
  } catch (err) {
    return Promise.reject(err);
  }
};

const handleAuthResponse = (res) => {
  if (!res.ok) {
    return res.json().then((err) => {
      let errorMessage = "Error en la solicitud";

      if (res.status === 400) errorMessage = "Datos incorrectos o faltantes";
      if (res.status === 401) errorMessage = "No autorizado";
      if (res.status === 404) errorMessage = "Recurso no encontrado";

      throw new Error(err.message || errorMessage);
    });
  }
  return res.json();
};
