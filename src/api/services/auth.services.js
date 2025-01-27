import http from '../http-common';

class AuthService {
  async login(credentials) {
    try {
        const response = await http.post('/auth/login', credentials);
        
        if (response.data?.status === 'success') {
            // Set Authorization header for subsequent requests
            http.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.token}`;
        }
        
        return response;
    } catch (error) {
        console.error('Service Error:', error.response?.data || error.message);
        throw error;
    }
}

  async checkStatus(email) {
    console.log('Email:', email);
    try {
      // Use POST and send email in the request body
      const response = await http.post('/users/status/email', { email });
      console.log('Response:', response.data);
      return response.data;
    } catch (error) {
      console.error(
        'Service Error:',
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  }
  
   async resetPassword(resetData) {
        try {
            const response = await http.put(`/users/${resetData.userId}/reset-password`, { newPassword: resetData.newPassword, resetCode: resetData.resetCode });
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