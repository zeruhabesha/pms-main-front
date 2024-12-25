import axios from 'axios';
import httpCommon from '../http-common';
import AuthService from './auth.services'; // Import AuthService here

class SuperAdminService {
  constructor() {
    this.baseURL = `${httpCommon.defaults.baseURL}/users`; // Use httpCommon.defaults.baseURL
  }

  getAuthHeader() {
    const token = localStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  async fetchSuperAdmins(page = 1, limit = 10, searchTerm = '') {
    try {
      const response = await httpCommon.get(`/users/super-admin`, {
        headers: this.getAuthHeader(),
        params: { page, limit, search: searchTerm },
      });
      return {
        users: response.data?.data?.users || [],
        totalPages: response.data?.data?.totalPages || 1,
        totalUsers: response.data?.data?.totalUsers || 0,
        currentPage: response.data?.data?.currentPage || page,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  async addSuperAdmin(superAdminData) {
    try {
      
      // Make the API call to add Super Admin
      const response = await httpCommon.post('/users/superadmin', superAdminData, {
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

  async updateSuperAdmin(id, superAdminData) {
    if (!superAdminData) {
      throw new Error("No data provided for update");
    }
  
    try {
      const payload = {
        name: superAdminData.name,
        email: superAdminData.email,
        phoneNumber: superAdminData.phoneNumber,
        status: superAdminData.status || 'active',
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
      console.error('SuperAdmin Update Error:', error.response?.data || error);
      throw this.handleError(error);
    }
  }

  async uploadSuperAdminPhoto(id, photoFile) {
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
    return {
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
    };
  }

  async deleteSuperAdmin(id) {
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

export default new SuperAdminService();
