// auth.js
const AUTH_URL = "https://se-register-api.en.tripleten-services.com/v1";

class Auth {
  static async signup(email, password) {
    const response = await fetch(`${AUTH_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Error en el registro");
    }

    return this._handleResponse(response);
  }

  static async signin(email, password) {
    const response = await fetch(`${AUTH_URL}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Error en el inicio de sesión");
    }

    return response.json();
  }

  static async checkToken() {
    const response = await fetch(`${AUTH_URL}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Token inválido");
    }
    return this._handleResponse(response);
  }

  static logout() {
    localStorage.removeItem("jwt");
    // Aquí puedes agregar cualquier otra lógica de cierre de sesión, como redirigir al usuario
  }

  static _handleResponse(response) {
    return response.ok ? response.json() : Promise.reject(response.status);
  }
}

export default Auth;
