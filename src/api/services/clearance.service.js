import httpCommon from '../http-common';

class ClearanceService {
    constructor() {
        this.baseURL = `${httpCommon.defaults.baseURL}/clearances`;
    }

    async fetchClearances(page = 1, limit = 10, searchTerm = '', status = '') {
        try {
            const response = await httpCommon.get(this.baseURL, {
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
            const response = await httpCommon.post(this.baseURL, clearanceData);
            return response.data;
        } catch (error) {
             throw this.handleError(error);
        }
    }

    async updateClearance(id, clearanceData) {
        try {
            const response = await httpCommon.put(`${this.baseURL}/${id}`, clearanceData);
           return response.data.data
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async approveClearance(id) {
        try {
            const response = await httpCommon.put(`${this.baseURL}/approve/${id}`);
            return response.data.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async inspectClearance(id, feedback) {
        try {
            const response = await httpCommon.put(`${this.baseURL}/inspect/${id}`, { feedback });
            return response.data.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

     async rejectClearance(id) {
        try {
            const response = await httpCommon.put(`${this.baseURL}/reject/${id}`);
             return response.data.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }



    async deleteClearance(id) {
        try {
            await httpCommon.delete(`${this.baseURL}/${id}`);
            return id;
        } catch (error) {
            throw this.handleError(error);
        }
    }
    
    async fetchInspectedClearances(userId, page = 1, limit = 10) {
        try {
            const response = await httpCommon.get(`${this.baseURL}/inspected/${userId}`, {
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
        return {
            message: error.response?.data?.message || error.message,
            status: error.response?.status,
            errorDetails: error.response?.data?.error || null,
        };
    }
}

export default new ClearanceService();