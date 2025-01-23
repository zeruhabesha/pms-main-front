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
            console.log('Fetched maintenances:', data?.data);

            if (data?.data) {
                localStorage.setItem(
                    'maintenances_data',
                    encryptData({
                        timestamp: new Date().getTime(),
                        ...data.data,
                    })
                );
            }

            return data.data;
        } catch (error) {
            return this.handleCachedData(error, 'maintenances_data', 'Fetching maintenances failed.');
        }
    }

    async addMaintenance(maintenanceData) {
        try {
            console.log('Submitting maintenance data:');
            if (maintenanceData instanceof FormData) {
                for (let [key, value] of maintenanceData.entries()) {
                    console.log(key, value);
                }
            }

            const response = await httpCommon.post('/maintenances', maintenanceData, {
                headers: {
                    ...this.getAuthHeader(),
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async updateMaintenance(id, maintenanceData) {
        try {
            const formData = this.createFormData(maintenanceData);

            const response = await httpCommon.put(`/maintenances/${id}`, formData, {
                headers: {
                    ...this.getAuthHeader(),
                    'Content-Type': 'multipart/form-data',
                },
            });

            this.updateCachedMaintenance(id, response.data?.data);
            return response.data?.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async deleteMaintenance(id) {
        try {
            await httpCommon.delete(`/maintenances/${id}`, {
                headers: this.getAuthHeader(),
            });

            this.removeCachedMaintenance(id);
            return id;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    clearCache() {
        localStorage.removeItem('maintenances_data');
        console.log('Maintenance cache cleared');
    }

    createFormData(data) {
        const formData = new FormData();
        for (const key in data) {
            if (data[key] !== null && data[key] !== undefined) {
                if (key === 'requestedFiles' && Array.isArray(data[key])) {
                    data[key].forEach((file) => formData.append(key, file));
                } else {
                    formData.append(key, data[key]);
                }
            }
        }
        return formData;
    }

    async fetchMaintenanceById(id) {
        if (!id) {
            throw new Error('Maintenance ID is required');
        }
    
        try {
            const response = await httpCommon.get(`/maintenances/${id}`, {
                headers: this.getAuthHeader(),
            });
    
            console.log('Fetched maintenance details:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching maintenance by ID:', error.response || error.message);
            throw this.handleError(error);
        }
    }
    

    updateCachedMaintenance(id, updatedData) {
        const encryptedCache = localStorage.getItem('maintenances_data');
        if (encryptedCache) {
            const cachedData = decryptData(encryptedCache);
            if (cachedData) {
                const updatedMaintenances = cachedData.maintenances.map((item) =>
                    item._id === id ? { ...item, ...updatedData } : item
                );
                localStorage.setItem(
                    'maintenances_data',
                    encryptData({ ...cachedData, maintenances: updatedMaintenances, timestamp: new Date().getTime() })
                );
            }
        }
    }

    removeCachedMaintenance(id) {
        const encryptedCache = localStorage.getItem('maintenances_data');
        if (encryptedCache) {
            const cachedData = decryptData(encryptedCache);
            if (cachedData) {
                const updatedMaintenances = cachedData.maintenances.filter((item) => item._id !== id);
                localStorage.setItem(
                    'maintenances_data',
                    encryptData({ ...cachedData, maintenances: updatedMaintenances, timestamp: new Date().getTime() })
                );
            }
        }
    }

    handleCachedData(error, cacheKey, logMessage) {
        console.error(logMessage, error);
        const encryptedCache = localStorage.getItem(cacheKey);
        if (encryptedCache) {
            const cachedData = decryptData(encryptedCache);
            if (cachedData && new Date().getTime() - cachedData.timestamp < 3600000) {
                console.log('Using cached data for:', cacheKey);
                return cachedData;
            }
        }
        throw this.handleError(error);
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
