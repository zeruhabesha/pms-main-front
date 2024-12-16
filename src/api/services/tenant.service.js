import httpCommon from '../http-common';
import { encryptData, decryptData } from '../utils/crypto';

class TenantService {
  constructor() {
    this.baseURL = `${httpCommon.defaults.baseURL}/tenants`;
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
  async fetchTenants(page = 1, limit = 5, searchTerm = '') {
    try {
      const response = await httpCommon.get('/tenants', {
        headers: this.getAuthHeader(),
        params: { page, limit, search: searchTerm },
      });
      const { data } = response.data;
      
      // Encrypt and store the fetched users data in localStorage if needed
      if (data?.tenants) {
        localStorage.setItem('user', encryptData({
          timestamp: new Date().getTime(),
          tenants: data.tenants,
          totalPages: data.totalPages,
          totalTenants: data.totalTenants,
          currentPage: data.currentPage
        }));
      }

      return {
        tenants: data.tenants,
        totalPages: data?.totalPages || 1,
        totalTenants: data?.totalTenants || 0,
        currentPage: data?.currentPage || page,
      };
    } catch (error) {
      // Try to get cached data if request fails
      const encryptedCache = localStorage.getItem('user');
      if (encryptedCache) {
        const cachedData = decryptData(encryptedCache);
        if (cachedData && (new Date().getTime() - cachedData.timestamp < 3600000)) { // 1 hour cache
          return {
            tenants: cachedData.tenants,
            totalPages: cachedData.totalPages,
            totalTenants: cachedData.totalTenants,
            currentPage: cachedData.currentPage,
            fromCache: true
          };
        }
      }
      throw this.handleError(error);
    }
  }
  // async fetchTenants(page = 1, limit = 5, search = '') {
  //   try {
  //     const response = await httpCommon.get(this.baseURL, {
  //       headers: this.getAuthHeader(),
  //       params: { page, limit, search },
  //     });

  //     const { data } = response.data;

  //     return {
  //       tenants: data?.tenants || [],
  //       totalPages: data?.totalPages || 1,
  //       totalTenants: data?.totalTenants || 0,
  //       currentPage: data?.currentPage || page,
  //     };
  //   } catch (error) {
  //     throw this.handleError(error);
  //   }
  // }

  // async addTenant(tenantData) {
  //   if (!tenantData) {
  //     throw new Error('Tenant data is required to create a tenant.');
  //   }
  
  //   try {
  //     const headers = tenantData instanceof FormData
  //       ? { ...this.getAuthHeader(), 'Content-Type': 'multipart/form-data' }
  //       : { ...this.getAuthHeader(), 'Content-Type': 'application/json' };
  
  //     console.log('Sending Data:', tenantData);
  //     console.log('Headers:', headers);
  
  //     const response = await httpCommon.post(this.baseURL, tenantData, { headers });
  //     return response.data?.data;
  //   } catch (error) {
  //     console.error('API Error:', error.response?.data || error.message);
  //     throw this.handleError(error);
  //   }
  // }
  
  async addTenant(tenantData) {
    try {
      console.log('Adding user:', tenantData);
      console.log('Request URL:', `${this.baseURL}/tenants`);
      
      // const response = await httpCommon.post('/users/user', userData, {
      //   headers: {
      //     ...this.getAuthHeader(),
      //     'Content-Type': 'application/json',
      //   },
      // });
      const response = await httpCommon.post('/tenants', tenantData, {
        headers: { ...this.getAuthHeader(), 'Content-Type': 'application/json' },
      });
      
      console.log('Response:', response.data);
  
      return response.data?.data;
    } catch (error) {
      console.error('Error adding user:', error.response?.data || error.message);
      throw this.handleError(error);
    }
  }

  async updateTenant(id, tenantData) {
    if (!id || !tenantData) {
      throw new Error('Tenant ID and update data are required.');
    }

    try {
      const headers = tenantData instanceof FormData 
        ? { 
            ...this.getAuthHeader(), 
            'Content-Type': 'multipart/form-data' 
          }
        : { 
            ...this.getAuthHeader(), 
            'Content-Type': 'application/json' 
          };

      const response = await httpCommon.put(`${this.baseURL}/${id}`, tenantData, {
        headers,
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

    return { message: errorMessage, status: errorStatus };
  }
}

export default new TenantService();
