import axios from 'axios';
import httpCommon from '../http-common';
import AuthService from './auth.services'; // Import AuthService here

class AdminService {
  constructor() {
    this.baseURL = `${httpCommon.defaults.baseURL}/users`;
  }

  getAuthHeader() {
    const token = localStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  async fetchAdmins(page = 1, limit = 10, searchTerm = '') {
    try {
      const response = await httpCommon.get('/users/admin', {
        headers: this.getAuthHeader(),
        params: {
          page,
          limit,
          search: searchTerm
        }
      });

      const { data } = response.data;
      return {
        admins: data.users || [],
        totalPages: data.totalPages || 1,
        totalUsers: data.totalUsers || 0,
        currentPage: data.currentPage || page,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  
  async addAdmin(AdminData) {
    try {
      
      // Make the API call to add Admin
      const response = await httpCommon.post('/users/admin', AdminData, {
        headers: {
          ...this.getAuthHeader(),
          'Content-Type': 'application/json',
        },
      })
      return response.data?.data;
    } catch (error) {
      // Throw an error with meaningful message and status
      throw {
        message: error.response?.data?.message || error.message || 'An error occurred',
        status: error.response?.status || 500,
        isAuthError: error.response?.status === 401,
      };
    }
  }

  async updateAdmin(id, AdminData) {
    if (!AdminData) {
      throw new Error("No data provided for update");
    }
  
    try {
      const payload = {
        name: AdminData.name,
        email: AdminData.email,
        phoneNumber: AdminData.phoneNumber,
        status: AdminData.status || 'active',
      };
  
      const response = await httpCommon.put(`/users/${id}`, payload, {
        headers: {
          ...this.getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.data) {
        throw new Error('No data received from server');
      }
  
      return response.data?.data;
    } catch (error) {
      console.error('Admin Update Error:', error.response?.data || error);
      throw this.handleError(error);
    }
  }

  async uploadAdminPhoto(id, photoFile) {
    try {
      const formData = new FormData();
      formData.append('photo', photoFile);

      const response = await httpCommon.post(`/users/${id}/photo`, formData, {
        headers: {
          ...this.getAuthHeader(),
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data?.photoUrl;
    } catch (error) {
      throw this.handleError(error);
    }
  }

 handleError(error) {
  console.error('API Error:', error.response?.data || error.message);
  return {
    message: error.response?.data?.message || error.message,
    status: error.response?.status,
  };
}

  async deleteAdmin(id) {
    try {
      await httpCommon.delete(`/users/${id}`, {
        headers: this.getAuthHeader(),
      });
      return id;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    return {
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
    };
  }
}

export default new AdminService();
