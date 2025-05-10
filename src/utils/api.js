// api.js
const BASE_URL = "https://se-register-api.en.tripleten-services.com/v1";

class Api {
  constructor({ baseUrl }) {
    this._baseUrl = baseUrl;
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
    if (token) this._validateToken();

    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  _handleResponse(res) {
    if (!res.ok) {
      return res.json().then((err) => {
        const statusMessages = {
          400: "Solicitud incorrecta",
          401: "No autorizado - token inválido",
          404: "Endpoint no encontrado",
          500: "Error del servidor",
        };

        throw new Error(
          err.message || statusMessages[res.status] || `Error ${res.status}`
        );
      });
    }
    return res.json();
  }

  // User methods
  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: this._getHeaders(),
    }).then(this._handleResponse);
  }

  setUserInfo(data) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._getHeaders(),
      body: JSON.stringify(data),
    }).then(this._handleResponse);
  }

  setUserAvatar(avatar) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._getHeaders(),
      body: JSON.stringify({ avatar }),
    }).then(this._handleResponse);
  }

  // Card methods - Versión simplificada sin alternativas
  getCardList() {
    return fetch(`${this._baseUrl}/cards`, {
      method: "GET",
      headers: this._getHeaders(),
    })
      .then(this._handleResponse)
      .catch((error) => {
        console.error("Error al obtener tarjetas:", error.message);
        return []; // Retorna array vacío como fallback
      });
  }

  addCard(data) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._getHeaders(),
      body: JSON.stringify(data),
    }).then(this._handleResponse);
  }

  deleteCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: this._getHeaders(),
    }).then(this._handleResponse);
  }

  changeLikeCardStatus(cardId, isLiked) {
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
