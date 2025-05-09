const BASE_URL = "https://se-register-api.en.tripleten-services.com/v1";

class Api {
  constructor({ baseUrl }) {
    this._baseUrl = baseUrl;
  }

  _getHeaders() {
    const token = localStorage.getItem("jwt");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  _handleResponse(res) {
    if (!res.ok) {
      return Promise.reject(res.status);
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

  // Card methods
  getCardList() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._getHeaders(),
    }).then((res) => {
      if (!res.ok) {
        return res.json().then((err) => {
          throw new Error(err.message || "Error al obtener tarjetas");
        });
      }
      return res.json();
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
