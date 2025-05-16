// api.js
const BASE_URL = "https://around-api.en.tripleten-services.com/v1";

class Api {
  constructor({ baseUrl }) {
    this._baseUrl = baseUrl;
    console.log("API Base URL:", this._baseUrl); // Verifica la URL
    this._validateToken();
  }

  _validateToken() {
    const token = localStorage.getItem("jwt");
    if (token && (!token.startsWith("eyJ") || token.length < 100)) {
      console.error("Token inválido detectado, limpiando...");
      localStorage.removeItem("jwt");
    }
  }

  _getHeaders() {
    const token = localStorage.getItem("jwt");
    console.log("Using token:", token);
    if (token) this._validateToken();

    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      Origin: window.location.origin, // Añade el origen
      "Access-Control-Allow-Origin": "GET, POST, PUT, PATCH, DELETE",
    };
  }

  _handleResponse(res) {
    if (!res.ok) {
      return res
        .json()
        .then((err) => {
          const statusMessages = {
            400: "Solicitud incorrecta",
            401: "No autorizado - token inválido",
            404: "Endpoint no encontrado",
            500: "Error del servidor",
          };

          const error = new Error(
            err.message || statusMessages[res.status] || `Error ${res.status}`
          );
          error.status = res.status;
          throw error;
        })
        .catch(() => {
          throw new Error(
            `Error ${res.status}: No se pudo parsear la respuesta`
          );
        });
    }
    return res.json();
  }

  // User methods
  async getUserInfo() {
    try {
      const response = await fetch(`${this._baseUrl}/users/me`, {
        method: "GET",
        headers: this._getHeaders(),
        credentials: "include", // Añade esto para manejar cookies
      });

      console.log("OPTIONS response headers:", [...response.headers.entries()]);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching user info:", error);
      throw error;
    }
  }

  async setUserInfo(data) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._getHeaders(),
      body: JSON.stringify(data),
    }).then(this._handleResponse);
  }

  async setUserAvatar(avatar) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._getHeaders(),
      body: JSON.stringify({ avatar }),
    }).then(this._handleResponse);
  }

  // Card methods - Versión simplificada sin alternativas
  async getCardList() {
    try {
      const response = await fetch(`${this._baseUrl}/cards`, {
        method: "GET",
        headers: this._getHeaders(),
      });
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error al obtener la lista de tarjetas:", error.message);
      return [];
    }
  }

  async addCard(data) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._getHeaders(),
      body: JSON.stringify(data),
    }).then(this._handleResponse);
  }

  async deleteCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: this._getHeaders(),
    }).then(this._handleResponse);
  }

  async changeLikeCardStatus(cardId, isLiked) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: isLiked ? "PUT" : "DELETE",
      headers: this._getHeaders(),
    }).then(this._handleResponse);
  }
}

const api = new Api({
  baseUrl: BASE_URL,
});

export default api;
