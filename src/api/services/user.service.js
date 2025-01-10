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

  getRegisteredBy() {
     const encryptedUser = localStorage.getItem('user');
     if(!encryptedUser){
        console.warn("No user found in local storage")
        return null;
     }

     const user = decryptData(encryptedUser)

      if(!user || !user.registeredBy) {
          console.warn("No registeredBy found in user data")
          return null;
      }
      return user.registeredBy;

  }

  async fetchUsers(page = 1, limit = 10, searchTerm = '') {
    const encryptedUser = localStorage.getItem('user');
    if (!encryptedUser) {
        console.warn("No user found in local storage");
        return {
            users: [],
            totalPages: 0,
            totalUsers: 0,
            currentPage: page
        };
    }

    const user = decryptData(encryptedUser);
    if (!user || !user.registeredBy) {
        console.warn("No valid registeredBy found in local storage");
        return {
            users: [],
            totalPages: 0,
            totalUsers: 0,
            currentPage: page
        };
    }

    const registeredBy = user.registeredBy;

    try {
        // const response = await httpCommon.get(`/users/registeredBy/${registeredBy}`, {
          const response = await httpCommon.get(`/users/user`, {

            headers: this.getAuthHeader(),
            params: { page, limit, search: searchTerm },
        });
        const { data } = response.data;

        return {
            users: data?.users || [],
            totalPages: data?.totalPages || 1,
            totalUsers: data?.totalUsers || 0,
            currentPage: data?.currentPage || page,
        };
    } catch (error) {
        throw this.handleError(error);
    }
}

async fetchMaintenance(page = 1, limit = 10, searchTerm = '') {
    const encryptedUser = localStorage.getItem('user');
    if (!encryptedUser) {
        console.warn("No user found in local storage");
        return {
          maintainers: [],
            totalPages: 0,
            totalMaintainers: 0,
            currentPage: page
        };
    }

    const user = decryptData(encryptedUser);
      if (!user || !user.registeredBy) {
          console.warn("No valid registeredBy found in local storage");
          return {
              maintainers: [],
                totalPages: 0,
                totalMaintainers: 0,
                currentPage: page
          }
      }
    const registeredBy = user.registeredBy;


    try {
        const response = await httpCommon.get(`/users/registeredBy/${registeredBy}/maintainers`, {
            headers: this.getAuthHeader(),
            params: { page, limit, search: searchTerm },
        });
        const { data } = response.data;
        return {
            maintainers: data?.users || [],
            totalPages: data?.totalPages || 1,
            totalMaintainers: data?.totalUsers || 0,
            currentPage: data?.currentPage || page,
        };
    } catch (error) {
        throw this.handleError(error);
    }
}


async fetchInspector(page = 1, limit = 10, searchTerm = '') {
    const encryptedUser = localStorage.getItem('user');
    if (!encryptedUser) {
        console.warn("No user found in local storage");
        return {
            inspectors: [],
            totalPages: 0,
            totalInspectors: 0,
            currentPage: page
        };
    }

     const user = decryptData(encryptedUser);
      if(!user || !user.registeredBy){
          console.warn("No valid registeredBy found in local storage");
          return {
              inspectors: [],
            totalPages: 0,
            totalInspectors: 0,
            currentPage: page
          }
      }
    const registeredBy = user.registeredBy;

    try {
        const response = await httpCommon.get(`/users/registeredBy/${registeredBy}/inspectors`, {
            headers: this.getAuthHeader(),
            params: { page, limit, search: searchTerm },
        });
        const { data } = response.data;
        return {
            inspectors: data?.users || [],
            totalPages: data?.totalPages || 1,
            totalInspectors: data?.totalUsers || 0,
            currentPage: data?.currentPage || page,
        };
    } catch (error) {
        throw this.handleError(error);
    }
}

  
  async addUser(userData) {
    try {
      console.log('Adding user:', userData);
      console.log('Request URL:', `${this.baseURL}/user`);

      // Make sure that your front end sets the `role` property to a valid value.
      
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
      return id;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  

  clearCache() {
    //No cache to clear
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