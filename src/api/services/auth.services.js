// AuthService.js
import http from '../http-common';

class AuthService {
  async login(credentials) {
    try {
      const response = await http.post('/auth/login', credentials);
      return response;
    } catch (error) {
      console.error('Service Error:', error.response ? error.response.data : error.message);
      throw error;
    }
  }

  logout() {
    return http.post('/auth/logout');
  }
}

export default new AuthService();