import httpCommon from '../http-common';
import { decryptData } from '../utils/crypto';

class TenantService {
  constructor() {
    this.baseURL = `${httpCommon.defaults.baseURL}/tenants`;
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

  async fetchTenants(page = 1, limit = 5, search = '') {
    try {
      const response = await httpCommon.get(this.baseURL, {
        headers: this.getAuthHeader(),
        params: { page, limit, search },
      });

      const { data } = response.data;

      return {
        tenants: data?.tenants || [],
        totalPages: data?.totalPages || 1,
        totalTenants: data?.totalTenants || 0,
        currentPage: data?.currentPage || page,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async addTenant(tenantData) {
    if (!tenantData) {
      throw new Error('Tenant data is required to create a tenant.');
    }

    try {
      const response = await httpCommon.post(this.baseURL, tenantData, {
        headers: {
          ...this.getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      return response.data?.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateTenant(id, tenantData) {
    if (!id || !tenantData) {
      throw new Error('Tenant ID and update data are required.');
    }

    try {
      const response = await httpCommon.put(`${this.baseURL}/${id}`, tenantData, {
        headers: {
          ...this.getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      return response.data?.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteTenant(id) {
    if (!id) {
      throw new Error('Tenant ID is required for deletion.');
    }
  
    try {
      await httpCommon.delete(`${this.baseURL}/${id}`, {
        headers: this.getAuthHeader(),
      });
      return id;
    } catch (error) {
      console.error('API Error during tenant deletion:', {
        tenantId: id,
        error: error.response?.data || error.message,
      });
      throw this.handleError(error);
    }
  }
  

  async uploadPhoto(id, photo) {
    if (!id || !photo) {
      throw new Error('Tenant ID and photo are required.');
    }

    try {
      const formData = new FormData();
      formData.append('photo', photo);

      const response = await httpCommon.post(`${this.baseURL}/${id}/photo`, formData, {
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

  async getTenantById(id) {
    if (!id) {
      throw new Error('Tenant ID is required to fetch details.');
    }

    try {
      const response = await httpCommon.get(`${this.baseURL}/${id}`, {
        headers: this.getAuthHeader(),
      });

      return response.data?.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred.';
    const errorStatus = error.response?.status || 500;

    console.error('API Error:', errorMessage);

    throw { message: errorMessage, status: errorStatus };
  }
}

export default new TenantService();
