import httpCommon from '../http-common';
import { decryptData } from '../utils/crypto';

class MaintenanceService {
  constructor() {
    this.baseURL = `${httpCommon.defaults.baseURL}/maintenances`;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
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

  async fetchMaintenance(page = 1, limit = 5, searchTerm = '') {
    try {
      const response = await httpCommon.get(this.baseURL, {
        headers: this.getAuthHeader(),
        params: {
          page,
          limit,
          search: searchTerm.trim(),
        },
      });

      const { data } = response.data;

      return {
        maintenanceRequests: data?.maintenances || [],
        totalPages: data?.totalPages || 1,
        totalRequests: data?.totalRequests || 0,
        currentPage: data?.currentPage || page,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async addMaintenance(maintenanceData) {
    try {
      this.validateMaintenanceData(maintenanceData);

      const formData = this.createFormData(maintenanceData);

      const response = await httpCommon.post(this.baseURL, formData, {
        headers: {
          ...this.getAuthHeader(),
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data?.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateMaintenance(id, maintenanceData) {
    if (!maintenanceData) {
      throw new Error('No data provided for update');
    }

    try {
      const formData = this.createFormData(maintenanceData);

      const response = await httpCommon.put(`${this.baseURL}/${id}`, formData, {
        headers: {
          ...this.getAuthHeader(),
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data?.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteMaintenance(id) {
    try {
      await httpCommon.delete(`${this.baseURL}/${id}`, {
        headers: this.getAuthHeader(),
      });

      return { id, message: 'Maintenance deleted successfully' };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  validateMaintenanceData(maintenanceData) {
    if (!maintenanceData.title?.trim()) {
      throw new Error('Title is required');
    }
    if (!maintenanceData.maintenanceType?.trim()) {
      throw new Error('Maintenance Type is required');
    }
    if (!maintenanceData.description?.trim()) {
      throw new Error('Description is required');
    }
  }

  createFormData(data) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value != null) {
        if (Array.isArray(value)) {
          value.forEach((item) => formData.append(`${key}[]`, item));
        } else {
          formData.append(key, value);
        }
      }
    });
    return formData;
  }

  handleError(error) {
    const errorMessage = error.response?.data?.message || error.message;
    const errorStatus = error.response?.status || 500;
    console.error('API Error:', errorMessage, `(Status: ${errorStatus})`);
    return { message: errorMessage, status: errorStatus };
  }
}

export default new MaintenanceService();
