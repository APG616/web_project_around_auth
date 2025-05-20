// api.js
const API_URL = "https://around-api.en.tripleten-services.com/v1";
const AUTH_URL = "https://se-register-api.en.tripleten-services.com/v1";

class Api {
  constructor({ apiUrl, authUrl }) {
    this._apiUrl = apiUrl;
    this._authUrl = authUrl;
  }

  _getHeaders() {
    const token = localStorage.getItem("jwt");
    if (!token) {
      throw new Error("No se encontró token de autenticación");
    }
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  async _handleResponse(res) {
    if (!res.ok) {
      if (res.status === 403) {
        localStorage.removeItem("jwt"); // ✔️ Limpiar token inválido
        throw new Error("Token inválido o expirado");
      }
    }
  }

  async getUserInfo() {
    const response = await fetch(`${this._apiUrl}/users/me`, {
      // Cambiado de _authUrl a _apiUrl
      headers: this._getHeaders(),
    });
    return this._handleResponse(response);
  }

  async setUserInfo(data) {
    const response = await fetch(`${this._apiUrl}/users/me`, {
      method: "PATCH",
      headers: this._getHeaders(),
      body: JSON.stringify(data),
    });
    return this._handleResponse(response);
  }

  async setUserAvatar(avatar) {
    const response = await fetch(`${this._apiUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._getHeaders(),
      body: JSON.stringify({ avatar }),
    });
    return this._handleResponse(response);
  }

  async getCardList() {
    const response = await fetch(`${this._apiUrl}/cards`, {
      headers: this._getHeaders(),
    });
    return this._handleResponse(response);
  }

  async addCard(data) {
    const response = await fetch(`${this._apiUrl}/cards`, {
      method: "POST",
      headers: this._getHeaders(),
      body: JSON.stringify(data),
    });
    return this._handleResponse(response);
  }

  async deleteCard(cardId) {
    const response = await fetch(`${this._apiUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: this._getHeaders(),
    });
    return this._handleResponse(response);
  }

  async changeLikeCardStatus(cardId, isLiked) {
    const response = await fetch(`${this._apiUrl}/cards/${cardId}/likes`, {
      method: isLiked ? "PUT" : "DELETE",
      headers: this._getHeaders(),
    });
    return this._handleResponse(response);
  }
}

const api = new Api({
  apiUrl: API_URL,
  authUrl: AUTH_URL,
});

export default api;
