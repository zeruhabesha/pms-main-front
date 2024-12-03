import httpCommon from '../http-common';
import { encryptData, decryptData } from '../utils/crypto';

class TenantService {
  constructor() {
    this.baseURL = `${httpCommon.defaults.baseURL}/tenants`;
    this.CACHE_KEY = 'tenant_cache';
    this.CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  }

  // Cache utilities
  setCacheData(key, data) {
    const cacheItem = { data, timestamp: Date.now() };
    localStorage.setItem(key, encryptData(cacheItem));
  }

  getCacheData(key) {
    try {
      const encryptedCache = localStorage.getItem(key);
      if (!encryptedCache) return null;

      const cache = decryptData(encryptedCache);
      if (Date.now() - cache.timestamp > this.CACHE_DURATION) {
        localStorage.removeItem(key);
        return null;
      }

      return cache.data;
    } catch {
      return null;
    }
  }

  clearCache() {
    localStorage.removeItem(this.CACHE_KEY);
  }

  handleError(error) {
    const errorMessage =
      error.response?.data?.message || error.message || 'An unknown error occurred';
    console.error('API Error:', errorMessage);
    return Promise.reject(new Error(errorMessage));
  }

  // CRUD operations
  async fetchTenants(page = 1, limit = 10, search = '') {
    const cacheKey = `${this.CACHE_KEY}_${page}_${limit}_${search}`;
    const cachedData = this.getCacheData(cacheKey);

    if (cachedData && !search) {
      return cachedData;
    }

    try {
      const response = await httpCommon.get(this.baseURL, {
        params: { page, limit, search },
      });

      const result = {
        tenants: response.data?.data?.tenants || [],
        totalPages: response.data?.data?.totalPages || 1,
        currentPage: response.data?.data?.currentPage || page,
        totalTenants: response.data?.data?.totalTenants || 0,
      };

      if (!search) this.setCacheData(cacheKey, result);
      return result;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async addTenant(tenantData) {
    try {
      const response = await httpCommon.post(this.baseURL, tenantData);
      this.clearCache(); // Clear cache for updated tenant list
      return response.data; // Ensure data consistency
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  async updateTenant(id, tenantData) {
    try {
      const response = await httpCommon.put(`${this.baseURL}/${id}`, tenantData);
      this.clearCache(); // Clear cache for updated tenant data
      return response.data; // Ensure data consistency
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteTenant(id) {
    try {
      await httpCommon.delete(`${this.baseURL}/${id}`);
      this.clearCache();
      return { success: true, id };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async uploadPhoto(id, photo) {
    if (!id || !photo) {
      throw new Error('Both tenant ID and photo are required');
    }
  
    const formData = new FormData();
    formData.append('photo', photo);
  
    const response = await httpCommon.post(`${this.baseURL}/${id}/photo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  
    return response;
  }
  

  async getTenantById(id) {
    const cacheKey = `${this.CACHE_KEY}_detail_${id}`;
    const cachedData = this.getCacheData(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await httpCommon.get(`${this.baseURL}/${id}`);
      const data = response.data;
      this.setCacheData(cacheKey, data);
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export default new TenantService();
