import axios from 'axios';
import httpCommon from '../http-common';
import AuthService from './auth.services';
import { encryptData, decryptData } from '../utils/crypto';

class UserService {
  constructor() {
    this.baseURL = `${httpCommon.defaults.baseURL}/users`;
  }

  getAuthHeader() {
    const encryptedToken = localStorage.getItem('token');
    if (!encryptedToken) {
      console.warn('No token found in local storage');
      return {};
    }
    
    const token = decryptData(encryptedToken);
    if (!token) {
      console.warn('Failed to decrypt token');
      return {};
    }
    
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  async fetchUsers(page = 1, limit = 10, searchTerm = '') {
    try {
      const response = await httpCommon.get('/users/user', {
        headers: this.getAuthHeader(),
        params: { page, limit, search: searchTerm },
      });
      const { data } = response.data;
      
      // Encrypt and store the fetched users data in localStorage if needed
      if (data?.users) {
        localStorage.setItem('user', encryptData({
          timestamp: new Date().getTime(),
          users: data.users,
          totalPages: data.totalPages,
          totalUsers: data.totalUsers,
          currentPage: data.currentPage
        }));
      }

      return {
        users: data?.users || [],
        totalPages: data?.totalPages || 1,
        totalUsers: data?.totalUsers || 0,
        currentPage: data?.currentPage || page,
      };
    } catch (error) {
      // Try to get cached data if request fails
      const encryptedCache = localStorage.getItem('user');
      if (encryptedCache) {
        const cachedData = decryptData(encryptedCache);
        if (cachedData && (new Date().getTime() - cachedData.timestamp < 3600000)) { // 1 hour cache
          return {
            users: cachedData.users,
            totalPages: cachedData.totalPages,
            totalUsers: cachedData.totalUsers,
            currentPage: cachedData.currentPage,
            fromCache: true
          };
        }
      }
      throw this.handleError(error);
    }
  }

  async fetchUsers(page = 1, limit = 10, searchTerm = '') {
    try {
      const response = await httpCommon.get('/users/user', {
        headers: this.getAuthHeader(),
        params: { page, limit, search: searchTerm },
      });
      const { data } = response.data;
      
      // Encrypt and store the fetched users data in localStorage if needed
      if (data?.users) {
        localStorage.setItem('user', encryptData({
          timestamp: new Date().getTime(),
          users: data.users,
          totalPages: data.totalPages,
          totalUsers: data.totalUsers,
          currentPage: data.currentPage
        }));
      }

      return {
        users: data?.users || [],
        totalPages: data?.totalPages || 1,
        totalUsers: data?.totalUsers || 0,
        currentPage: data?.currentPage || page,
      };
    } catch (error) {
      // Try to get cached data if request fails
      const encryptedCache = localStorage.getItem('user');
      if (encryptedCache) {
        const cachedData = decryptData(encryptedCache);
        if (cachedData && (new Date().getTime() - cachedData.timestamp < 3600000)) { // 1 hour cache
          return {
            users: cachedData.users,
            totalPages: cachedData.totalPages,
            totalUsers: cachedData.totalUsers,
            currentPage: cachedData.currentPage,
            fromCache: true
          };
        }
      }
      throw this.handleError(error);
    }
  }

async fetchUsers(page = 1, limit = 10, searchTerm = '') {
    try {
      const response = await httpCommon.get('/users/user', {
        headers: this.getAuthHeader(),
        params: { page, limit, search: searchTerm },
      });
      const { data } = response.data;
      
      // Encrypt and store the fetched users data in localStorage if needed
      if (data?.users) {
        localStorage.setItem('user', encryptData({
          timestamp: new Date().getTime(),
          users: data.users,
          totalPages: data.totalPages,
          totalUsers: data.totalUsers,
          currentPage: data.currentPage
        }));
      }

      return {
        users: data?.users || [],
        totalPages: data?.totalPages || 1,
        totalUsers: data?.totalUsers || 0,
        currentPage: data?.currentPage || page,
      };
    } catch (error) {
      // Try to get cached data if request fails
      const encryptedCache = localStorage.getItem('user');
      if (encryptedCache) {
        const cachedData = decryptData(encryptedCache);
        if (cachedData && (new Date().getTime() - cachedData.timestamp < 3600000)) { // 1 hour cache
          return {
            users: cachedData.users,
            totalPages: cachedData.totalPages,
            totalUsers: cachedData.totalUsers,
            currentPage: cachedData.currentPage,
            fromCache: true
          };
        }
      }
      throw this.handleError(error);
    }
  }
  async fetchMaintenance(page = 1, limit = 10, searchTerm = '') {
    try {
      const response = await httpCommon.get('/users/maintainer', {
        headers: this.getAuthHeader(),
        params: { page, limit, search: searchTerm },
      });
      const { data } = response.data;
       // Encrypt and store the fetched maintenance data in localStorage if needed
      if (data?.users) {
          localStorage.setItem('maintenance', encryptData({
              timestamp: new Date().getTime(),
              users: data.users,
              totalPages: data.totalPages,
              totalUsers: data.totalUsers,
              currentPage: data.currentPage
          }));
      }
      return {
           maintainers: data?.users || [],
        totalPages: data?.totalPages || 1,
        totalMaintainers: data?.totalUsers || 0,
        currentPage: data?.currentPage || page,
      };
    } catch (error) {
      // Try to get cached data if request fails
        const encryptedCache = localStorage.getItem('maintenance');
      if (encryptedCache) {
          const cachedData = decryptData(encryptedCache);
          if (cachedData && (new Date().getTime() - cachedData.timestamp < 3600000)) { // 1 hour cache
            return {
                 maintainers: cachedData.users,
                totalPages: cachedData.totalPages,
                totalMaintainers: cachedData.totalUsers,
                currentPage: cachedData.currentPage,
                fromCache: true
            };
          }
      }
      throw this.handleError(error);
    }
  }
  

  async fetchInspector(page = 1, limit = 10, searchTerm = '') {
     try {
      const response = await httpCommon.get('/users/inspector', {
        headers: this.getAuthHeader(),
        params: { page, limit, search: searchTerm },
      });
      const { data } = response.data;
       // Encrypt and store the fetched inspector data in localStorage if needed
      if (data?.users) {
        localStorage.setItem('inspector', encryptData({
          timestamp: new Date().getTime(),
          users: data.users,
            totalPages: data.totalPages,
            totalUsers: data.totalUsers,
          currentPage: data.currentPage
        }));
      }
      return {
        inspectors: data?.users || [],
        totalPages: data?.totalPages || 1,
        totalInspectors: data?.totalUsers || 0,
        currentPage: data?.currentPage || page,
      };
    } catch (error) {
      // Try to get cached data if request fails
        const encryptedCache = localStorage.getItem('inspector');
      if (encryptedCache) {
          const cachedData = decryptData(encryptedCache);
          if (cachedData && (new Date().getTime() - cachedData.timestamp < 3600000)) { // 1 hour cache
            return {
                inspectors: cachedData.users,
                totalPages: cachedData.totalPages,
                totalInspectors: cachedData.totalUsers,
                currentPage: cachedData.currentPage,
                fromCache: true
            };
        }
      }
      throw this.handleError(error);
    }
  }

  
  async addUser(userData) {
    try {
      console.log('Adding user:', userData);
      console.log('Request URL:', `${this.baseURL}/user`);
      
      // const response = await httpCommon.post('/users/user', userData, {
      //   headers: {
      //     ...this.getAuthHeader(),
      //     'Content-Type': 'application/json',
      //   },
      // });
      const response = await httpCommon.post('/users', userData, {
        headers: { ...this.getAuthHeader(), 'Content-Type': 'application/json' },
      });
      
      console.log('Response:', response.data);
  
      return response.data?.data;
    } catch (error) {
      console.error('Error adding user:', error.response?.data || error.message);
      throw this.handleError(error);
    }
  }
  

  async updateUser(id, userData) {
    if (!userData) {
      throw new Error("No data provided for update");
    }
    try {
      const payload = {
        name: userData.name,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        status: userData.status || 'active',
      };
      
      const response = await httpCommon.put(`/users/${id}`, payload, {
        headers: {
          ...this.getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      // Update cached user data if exists
      const encryptedCache = localStorage.getItem('user');
      if (encryptedCache) {
        const cachedData = decryptData(encryptedCache);
        if (cachedData) {
          cachedData.users = cachedData.users.map(user => 
            user.id === id ? { ...user, ...response.data?.data } : user
          );
          cachedData.timestamp = new Date().getTime();
          localStorage.setItem('user', encryptData(cachedData));
        }
      }

      if (!response.data) {
        throw new Error('No data received from server');
      }
      return response.data?.data;
    } catch (error) {
      console.error('User Update Error:', error.response?.data || error);
      throw this.handleError(error);
    }
  }

  async uploadUserPhoto(id, photoFile) {
    try {
      const formData = new FormData();
      formData.append('photo', photoFile);

      const response = await httpCommon.post(`/users/${id}/photo`, formData, {
        headers: {
          ...this.getAuthHeader(),
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update cached user photo if exists
      const encryptedCache = localStorage.getItem('user');
      if (encryptedCache) {
        const cachedData = decryptData(encryptedCache);
        if (cachedData) {
          cachedData.users = cachedData.users.map(user => 
            user.id === id ? { ...user, photoUrl: response.data?.photoUrl } : user
          );
          cachedData.timestamp = new Date().getTime();
          localStorage.setItem('user', encryptData(cachedData));
        }
      }

      return response.data?.photoUrl;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updatePermissions(userId, permissions) {
    try {
      const response = await httpCommon.put(`/users/${userId}/permissions`, { permissions }, {
        headers: {
          ...this.getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      return response.data?.data; // Return the updated user or relevant response
    } catch (error) {
      console.error('Error updating permissions:', error.response?.data || error.message);
      throw this.handleError(error);
    }
  }
  

  async deleteUser(id) {
    try {
      await httpCommon.delete(`/users/${id}`, {
        headers: this.getAuthHeader(),
      });

      // Update cached users if exists
      const encryptedCache = localStorage.getItem('user');
      if (encryptedCache) {
        const cachedData = decryptData(encryptedCache);
        if (cachedData) {
          cachedData.users = cachedData.users.filter(user => user.id !== id);
          cachedData.timestamp = new Date().getTime();
          localStorage.setItem('user', encryptData(cachedData));
        }
      }

      return id;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  

  clearCache() {
    localStorage.removeItem('user');
  }

  handleError(error) {
    console.error('API Error:', error.response?.data || error.message);
    return {
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
    };
  }
}

export default new UserService();