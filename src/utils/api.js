// api.js
const BASE_URL = "https://around-api.es.tripleten-services.com/v1";
const HARDCODED_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODM2NjMyMzdhYmU0NjBiODlkMDQ1ZjMiLCJpYXQiOjE3NDgzOTQ4MDYsImV4cCI6MTc0ODk5OTYwNn0.pr-YWiG4JqL3MdCQAph_mj2c2mztmAnEZx4kziG3p6I"

class Api {
  constructor() {
    // Eliminado todo el código relacionado con mock data
  }

  _getHeaders() {
    const token = localStorage.getItem("jwt");
    if (!token) {
      console.warn("No JWT token found, using hardcoded token");
      return this._getHardcodedHeaders();
    }

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    };
  }

  _getHardcodedHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${HARDCODED_TOKEN}`
    };
  }

  async _handleResponse(res) {
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      if (res.status === 403 || res.status === 401) {
        localStorage.removeItem("jwt");
        throw new Error(errorData.message || `Token inválido o expirado (${res.status})`);
      }
      throw new Error(errorData.message || `Error: ${res.status}`);
    }
    return res.json();
  }

  async signin(email, password) {
    const response = await fetch('https://se-register-api.en.tripleten-services.com/v1/signin', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });
    return this._handleResponse(response);
  }

  async signup(email, password) {
    const response = await fetch('https://se-register-api.en.tripleten-services.com/v1/signup', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",

      },
      body: JSON.stringify({ email, password })
    });
    return this._handleResponse(response);
  }

  async getUserInfo() {
    const response = await fetch(`${BASE_URL}/users/me`, {
      headers: this._getHeaders()
    });
    return this._handleResponse(response);
  }

  async setUserInfo(data) {
    const response = await fetch(`${BASE_URL}/users/me`, {
      method: "PATCH",
      headers: this._getHeaders(),
      body: JSON.stringify(data)
    });
    return this._handleResponse(response);
  }

  async setUserAvatar(avatar) {
    const response = await fetch(`${BASE_URL}/users/me/avatar`, {
      method: "PATCH",
      headers: this._getHeaders(),
      body: JSON.stringify({ avatar })
    });
    return this._handleResponse(response);
  }

  async getCardList() {
    const response = await fetch(`${BASE_URL}/cards`, {
      headers: this._getHeaders()
    });
    return this._handleResponse(response);
  }

  async addCard(data) {
    const response = await fetch(`${BASE_URL}/cards`, {
      method: "POST",
      headers: this._getHeaders(),
      body: JSON.stringify(data)
    });
    return this._handleResponse(response);
  }

  async deleteCard(cardId) {
    const response = await fetch(`${BASE_URL}/cards/${cardId}`, {
      method: "DELETE",
      headers: this._getHeaders()
    });
    return this._handleResponse(response);
  }

  async changeLikeCardStatus(cardId, isLiked) {
    const response = await fetch(`${BASE_URL}/cards/${cardId}/likes`, {
      method: isLiked ? "PUT" : "DELETE",
      headers: this._getHeaders()
    });
    return this._handleResponse(response);
  }
}

const api = new Api();
export default api;