import httpCommon from '../http-common';
import { encryptData, decryptData } from '../utils/crypto';

class TenantService {
    constructor() {
        this.baseURL = `${httpCommon.defaults.baseURL}/tenants`;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
        };
    }

    getAuthHeader() {
        try {
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
        } catch (error) {
            console.error('Error getting authorization header:', error.message);
            return {};
        }
    }

  async fetchTenants(page = 1, limit = 5, searchTerm = '') {
        try {
            const response = await httpCommon.get(this.baseURL, {
                headers: this.getAuthHeader(),
                params: { page, limit, search: searchTerm },
            });
            const { data } = response.data;
               const cacheData = {
              timestamp: new Date().getTime(),
              tenants: data.tenants,
              totalPages: data.totalPages,
              totalTenants: data.totalTenants,
              currentPage: data.currentPage
            };
            // Encrypt and store the fetched tenants data in localStorage if needed
             localStorage.setItem('tenants', encryptData(cacheData));


            return {
                tenants: data.tenants,
                totalPages: data?.totalPages || 1,
                totalTenants: data?.totalTenants || 0,
                currentPage: data?.currentPage || page,
            };
        } catch (error) {
            // Try to get cached data if request fails
            const encryptedCache = localStorage.getItem('tenants');
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


    async addTenant(tenantData) {
        try {
            const formData = this.createFormData(tenantData);
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

    async updateTenant(id, tenantData) {
        try {
             const formData = this.createFormData(tenantData);
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


    async deleteTenant(id) {
        try {
            await httpCommon.delete(`${this.baseURL}/${id}`, {
                headers: this.getAuthHeader(),
            });
            return id;
        } catch (error) {
            throw this.handleError(error);
        }
    }

     async uploadPhoto(id, photo) {
        try {
             const formData = this.createFormData({ photo }, 'photo');
              const response =  await httpCommon.post(`${this.baseURL}/${id}/photo`, formData, {
                headers: {
                    ...this.getAuthHeader(),
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data?.photoUrl
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getTenantById(id) {
        try {
            const response = await httpCommon.get(`${this.baseURL}/${id}`, {
                headers: this.getAuthHeader(),
            });
            return response.data?.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    createFormData(data, mediaFieldName = 'media') {
      const formData = new FormData();

       if(data && data.photo) {
          if (data.photo instanceof File) {
             formData.append(mediaFieldName, data.photo);
           } else {
             console.warn('Skipping non-file photo:', data.photo);
           }
        }
          Object.entries(data).forEach(([key, value]) => {
             if (value != null && key !== mediaFieldName) {
               formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
              }
            });

           return formData;
   }

    handleError(error) {
         console.error('API Error:', error.response?.data || error.message);
        throw {
            message: error.response?.data?.message || error.message || 'An unexpected error occurred',
            status: error.response?.status || 500,
            errors: error.response?.data?.errors || [],
        };
    }
}

export default new TenantService();