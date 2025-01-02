// tenant.service.js
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

    async fetchTenants(page = 1, limit = 10, searchTerm = '') {
        try {
            const response = await httpCommon.get(this.baseURL, {
                headers: {
                    ...this.getAuthHeader(),
                    'Content-Type': 'multipart/form-data',
                },
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
            console.log("Sending POST request with data:", tenantData);
            const response = await httpCommon.post(this.baseURL, tenantData, {
                headers: {
                    ...this.getAuthHeader(),
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data?.data;
        } catch (error) {
            console.error("API call failed:", error);
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
            const formData = new FormData();
            formData.append('idProof', photo); // Use 'idProof' to match backend
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
    async generateReport(startDate, endDate) {
      try {
          const response = await httpCommon.get(`${this.baseURL}/report`, {
              headers: this.getAuthHeader(),
               params: { startDate, endDate },
          });
          return response.data?.data;
      } catch (error) {
          throw this.handleError(error);
      }
  }

  createFormData(data) {
    const formData = new FormData();
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const value = data[key];
            if (Array.isArray(value)) {
              value.forEach((file, index) => {
                   if (file instanceof File) {
                          formData.append(`${key}[${index}]`, file);
                        } else {
                          formData.append(`${key}`, file);
                     }
                });
            } else if (value instanceof File) {
                formData.append(key, value);
            } else if (typeof value === 'object' && value !== null) {
               for (const innerKey in value) {
                   if(value.hasOwnProperty(innerKey)){
                    formData.append(`${key}[${innerKey}]`, value[innerKey]);
                   }
                }
            }else if (value !== null) {
              formData.append(key, value);
            }

        }
    }
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