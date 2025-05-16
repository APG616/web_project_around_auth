const BASE_URL = "https://se-register-api.en.tripleten-services.com/v1";

const handleAuthResponse = (res) => {
  if (!res.ok) {
    return res
      .json()
      .then((err) => {
        let errorMessage = "Error en la solicitud";

        if (res.status === 400) errorMessage = "Datos incorrectos o faltantes";
        if (res.status === 401) errorMessage = "No autorizado";
        if (res.status === 404) errorMessage = "Recurso no encontrado";
        if (res.status === 500) errorMessage = "Error del servidor";

        const error = new Error(err.message || `Error ${res.status}`, {
          url: res.url,
          status: res.status,
          error: err,
        });
        throw error;
      })
      .catch(() => {
        const error = new Error(
          `Error ${res.status}: No se pudo procesar la respuesta`
        );
        error.status = res.status;
        throw error;
      });
  }
  return res.json();
};

const validateToken = (token) => {
  if (!token) throw new Error("Token NO PROPORCIONADO");
  if (typeof token !== "string") throw new Error("Token NO ES UN STRING");
  if (!token.startsWith("eyJ")) throw new Error("Token NO ES UN JWT");

  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Estructura de token inválida");
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
  })
    .then(handleAuthResponse)
    .catch((error) => {
      if (error.message.includes("Failed to fetch")) {
        throw new Error("Error de conexión con el servidor");
      }
      throw error;
    });
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
