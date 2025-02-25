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

    getRegisteredBy() {
        try {
            const encryptedUser = localStorage.getItem('user');
            if (!encryptedUser) {
                console.warn("No user found in local storage");
                return null;
            }

            const decryptedUser = decryptData(encryptedUser);

            // Check if decryptedUser is already an object
            const user = typeof decryptedUser === 'string' ? JSON.parse(decryptedUser) : decryptedUser;


            if (!user || !user._id) {
                console.warn("No registeredBy found in user data");
                return null;
            }

            return user;

        } catch (error) {
            console.error("Error fetching registeredBy:", error);
            return null;
        }
    }

    async fetchTenants(page = 1, limit = 10, searchTerm = '') {
        try {
            const user = this.getRegisteredBy();

            if (!user) {
                console.warn("User data not available, cannot fetch tenants.");
                return {
                    tenants: [],
                    totalPages: 0,
                    totalTenants: 0,
                    currentPage: page,
                };
            }

            let registeredById;
            if (user.role === 'Admin') {
                registeredById = user._id;
            } else {
                registeredById = user.registeredBy._id;
            }

            const response = await httpCommon.get(`tenants/registeredBy/${registeredById}`, { // Modified URL to filter by registeredBy
                headers: {
                    ...this.getAuthHeader(),
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
            localStorage.setItem('tenants', encryptData(cacheData));

            return {
                tenants: data.tenants,
                totalPages: data.totalPages,
                totalTenants: data.totalTenants,
                currentPage: data.currentPage,
            };
        } catch (error) {
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

    async getTenantStatusCounts() {
        try {
            const user = this.getRegisteredBy();
    
            if (!user) {
                console.warn("User data not available, cannot fetch tenant status counts.");
                return { active: 0, inactive: 0, pending: 0 }; // ✅ Default empty object
            }
    
            let registeredById = user.role === "Admin" ? user._id : user.registeredBy._id;
    
            if (!registeredById || typeof registeredById !== "string" || registeredById.length !== 24) {
                console.error("Invalid registeredById:", registeredById);
                throw new Error("Invalid registeredById format or missing information");
            }
    
            console.log("Fetching tenant status counts for registeredById:", registeredById);
    
            const response = await httpCommon.get(`/tenants/statusCounts/${registeredById}`, {
                headers: { ...this.defaultHeaders, ...this.getAuthHeader() },
            });
    
            console.log("API Response for Tenant Status Counts:", response.data);
    
            return response.data.data || { active: 0, inactive: 0, pending: 0 }; // ✅ Ensure default values
        } catch (error) {
            console.error("Failed to fetch tenant status counts:", error);
            return { active: 0, inactive: 0, pending: 0 }; // ✅ Prevent errors
        }
    }
    
    

   // tenant.service.js

   async addTenant(tenantData) {
    try {
        console.log("Sending POST request with data:", tenantData);

        if (tenantData.registeredByAdmin && typeof tenantData.registeredByAdmin === 'object' && tenantData.registeredByAdmin._id) {
           tenantData = { ...tenantData, registeredByAdmin: tenantData.registeredByAdmin._id };
        }

        const formData = this.createFormData(tenantData);
        const response = await httpCommon.post(this.baseURL, formData, {
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
            // Convert registeredByAdmin to its _id
            if (tenantData.registeredByAdmin && typeof tenantData.registeredByAdmin === 'object' && tenantData.registeredByAdmin._id) {
                tenantData = { ...tenantData, registeredByAdmin: tenantData.registeredByAdmin._id };
            }
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
             return response.data.data;
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

        if (value === null || value === undefined) {
          continue; // Skip null or undefined values
        }

        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            formData.append(`${key}[${index}]`, item); // Appending array elements correctly
          });
        } else if (typeof value === 'object' && !(value instanceof File)) {
          // Handle nested objects by iterating through their properties
          for (const nestedKey in value) {
            if (value.hasOwnProperty(nestedKey)) {
              formData.append(`${key}[${nestedKey}]`, value[nestedKey]);
            }
          }
        } else {
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