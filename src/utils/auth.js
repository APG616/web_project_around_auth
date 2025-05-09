// auth.js
const BASE_URL = "https://se-register-api.en.tripleten-services.com/v1";

export const register = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then((res) => {
    if (!res.ok) {
      return res.json().then((err) => {
        throw new Error(err.message || "Registration failed");
      });
    }
    return res.json();
  });
};
export const login = (email, password) => {
  return fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then(handleResponse);
};

export const checkToken = (token) => {
  if (!token) return Promise.reject("Token no proporcionado");

  return fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => {
    if (!res.ok) {
      return res.json().then((err) => {
        throw new Error(err.message || "Token inválido");
      });
    }
    return res.json();
  });
};

function handleResponse(res) {
  if (!res.ok) {
    return res.json().then((err) => Promise.reject(err));
  }
  return res.json();
}
