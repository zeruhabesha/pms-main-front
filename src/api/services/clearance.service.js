import httpCommon from '../http-common';
import { decryptData } from '../utils/crypto';

class ClearanceService {
    constructor() {
        this.baseURL = `${httpCommon.defaults.baseURL}/clearance`;
    }

    async getAuthHeader() {
        const encryptedToken = localStorage.getItem("token");
        if (!encryptedToken) {
           throw new Error("Authentication token is missing.");
        }
    
        const token = decryptData(encryptedToken);
        if (!token) {
            throw new Error("Invalid authentication token.");
        }
    
        return {
            Authorization: `Bearer ${token}`,
        };
    }


    async fetchClearances(page = 1, limit = 10, searchTerm = '', status = '') {
        try {
            const response = await httpCommon.get(this.baseURL, {
                headers: await this.getAuthHeader(),
                params: {
                    page,
                    limit,
                    search: searchTerm,
                    status,
                }
            });
            return response.data.data;
        } catch (error) {
           throw this.handleError(error);
        }
    }


    async addClearance(clearanceData) {
        try {
            const response = await httpCommon.post(this.baseURL, clearanceData, { headers: await this.getAuthHeader()});
            console.log('Responseservice:', response);
            return response.data;
        } catch (error) {
             throw this.handleError(error);
        }
    }

    async updateClearance(id, clearanceData) {
        try {
            const response = await httpCommon.put(`${this.baseURL}/${id}`, clearanceData, { headers: await this.getAuthHeader()});
           return response.data.data;
        } catch (error) {
             throw this.handleError(error);
        }
    }

    async approveClearance(id) {
        try {
            const response = await httpCommon.put(`${this.baseURL}/approve/${id}`, {}, {headers: await this.getAuthHeader()});
           return response.data.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async inspectClearance(id, feedback) {
        try {
            const response = await httpCommon.put(`${this.baseURL}/inspect/${id}`, { feedback }, { headers: await this.getAuthHeader()});
            return response.data.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

     async rejectClearance(id) {
        try {
            const response = await httpCommon.put(`${this.baseURL}/reject/${id}`, {}, { headers: await this.getAuthHeader() });
             return response.data.data;
        } catch (error) {
           throw this.handleError(error);
        }
    }


    async deleteClearance(id) {
        try {
            await httpCommon.delete(`${this.baseURL}/${id}`, { headers: await this.getAuthHeader() });
            return id;
        } catch (error) {
           throw this.handleError(error);
        }
    }
    
    async fetchInspectedClearances(userId, page = 1, limit = 10) {
        try {
            const response = await httpCommon.get(`${this.baseURL}/inspected/${userId}`, {
                headers: await this.getAuthHeader(),
                params: {
                    page,
                    limit
                }
            });
            return response.data.data;
        } catch (error) {
          throw this.handleError(error);
        }
    }

     async fetchUninspectedClearances(page = 1, limit = 10) {
        try {
            const response = await httpCommon.get(`${this.baseURL}/uninspected/clearances`, {
                 headers: await this.getAuthHeader(),
                params: {
                    page,
                    limit
                }
            });
            return response.data.data;
        } catch (error) {
           throw this.handleError(error);
        }
    }


    handleError(error) {
         console.error('API Error:', error.response?.data || error.message);
        
         const errorObject = {
            message: error.response?.data?.message || error.message,
            status: error.response?.status,
            errorDetails: error.response?.data?.error || null,
        };
        
        throw errorObject; // Throw the error object here
    }
}

export default new ClearanceService();
