import axios from 'axios';
import httpCommon from '../http-common';
import { encryptData, decryptData } from '../utils/crypto';

class MaintenanceService {
  constructor() {
    this.baseURL = `${httpCommon.defaults.baseURL}/maintenances`;
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

  async fetchMaintenances(page = 1, limit = 10, searchTerm = '') {
    try {
      const response = await httpCommon.get('/maintenances', {
        headers: this.getAuthHeader(),
        params: { page, limit, search: searchTerm },
      });
  
      const { data } = response;
  
      // Store the fetched data in localStorage
      if (data?.data) {
        localStorage.setItem('maintenances', encryptData({
          timestamp: new Date().getTime(),
          ...data.data
        }));
      }
  
      return data.data;
    } catch (error) {
      const encryptedCache = localStorage.getItem('maintenances');
      if (encryptedCache) {
        const cachedData = decryptData(encryptedCache);
        if (cachedData && (new Date().getTime() - cachedData.timestamp < 3600000)) {
          return {
            maintenances: cachedData.maintenances,
            totalPages: cachedData.totalPages,
            totalRequests: cachedData.totalRequests,
            currentPage: cachedData.currentPage,
            fromCache: true,
          };
        }
      }
      throw this.handleError(error);
    }
  }

  async addMaintenance(maintenanceData) {
    try {
        const formData = this.createFormData(maintenanceData);

        const response = await httpCommon.post('/maintenances', formData, {
            headers: {
                ...this.getAuthHeader(),
                'Content-Type': 'multipart/form-data',
            },
        });

        if (!response.data?.data) {
            throw new Error('No data received from server');
        }

        return response.data.data;
    } catch (error) {
        console.error('Error adding maintenance:', error.response?.data || error.message);
        if (error.response?.data?.error === 'Property not found') {
            throw new Error('The selected property could not be found. Please verify your selection.');
        }
        throw this.handleError(error);
    }
}

  async updateMaintenance(id, maintenanceData) {
    if (!maintenanceData) {
      throw new Error('No data provided for update');
    }
    try {
      const formData = this.createFormData(maintenanceData);
  
      const response = await httpCommon.put(`/maintenances/${id}`, formData, {
        headers: {
          ...this.getAuthHeader(),
          'Content-Type': 'multipart/form-data',
        },
      });
  
      // Update cached maintenance data if exists
      const encryptedCache = localStorage.getItem('maintenances');
      if (encryptedCache) {
        const cachedData = decryptData(encryptedCache);
        if (cachedData) {
          // Ensure cachedData.maintenances is an array before using map
          const maintenances = Array.isArray(cachedData.maintenances) ? cachedData.maintenances : [];
          cachedData.maintenances = maintenances.map((item) =>
            item.id === id ? { ...item, ...response.data?.data } : item
          );
          cachedData.timestamp = new Date().getTime();
          localStorage.setItem('maintenances', encryptData(cachedData));
        }
      }
  
      return response.data?.data;
    } catch (error) {
      console.error('Maintenance Update Error:', error.response?.data || error);
      throw this.handleError(error);
    }
  }
  

  async deleteMaintenance(id) {
    try {
      await httpCommon.delete(`/maintenances/${id}`, {
        headers: this.getAuthHeader(),
      });

      // Update cached maintenances if exists
      const encryptedCache = localStorage.getItem('maintenances');
      if (encryptedCache) {
        const cachedData = decryptData(encryptedCache);
        if (cachedData) {
          cachedData.maintenances = cachedData.maintenances.filter((item) => item.id !== id);
          cachedData.timestamp = new Date().getTime();
          localStorage.setItem('maintenances', encryptData(cachedData));
        }
      }

      return id;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  clearCache() {
    localStorage.removeItem('maintenances');
  }

  createFormData(data) {
    const formData = new FormData();
    
    // Handle basic fields
    const basicFields = [
        'tenant', 'property', 'typeOfRequest', 'description',
        'urgencyLevel', 'preferredAccessTimes', 'status',
        'approvalStatus', 'notes', 'requestDate'
    ];

    basicFields.forEach(field => {
        if (data[field] != null) {
            formData.append(field, data[field]);
        }
    });

    // Handle files
    if (data.requestedFiles) {
        data.requestedFiles.forEach((file) => {
            formData.append('requestedFiles', file);
        });
    }

    return formData;
}

  handleError(error) {
    console.error('API Error:', error.response?.data || error.message);
    return {
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
    };
  }
}

export default new MaintenanceService();