//auth.js
const Auth = {
  login(token) {
    localStorage.setItem('jwt', token);
  },

  logout() {
    localStorage.removeItem('jwt');
  },

  isLoggedIn() {
    return !!localStorage.getItem('jwt');
  },

  async checkAuth() {
    if (!this.isLoggedIn()) return false;
    
    try {
      const response = await fetch('http://localhost:3000/users/me', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
      });
      return response.ok;
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  }
};

export default Auth;