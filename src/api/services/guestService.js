import httpCommon from '../http-common';
import { decryptData } from '../../api/utils/crypto';

class GuestService {
    constructor() {
        this.baseURL = `${httpCommon.defaults.baseURL}/guests`;
    }

    getAuthHeader() {
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

    async createGuest(guestData) {
        try {
            const response = await httpCommon.post(this.baseURL, guestData, {
                headers: this.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async fetchGuests({ page = 1, limit = 10, search = "", status = "" }) {
        try {
            const response = await httpCommon.get(this.baseURL, {
                 headers: this.getAuthHeader(),
                params: {
                    page,
                    limit,
                    search,
                      status,
                },
            });
            return response.data; // Adjust based on your API response structure
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async fetchGuestById(id) {
        try {
            const response = await httpCommon.get(`${this.baseURL}/${id}`, {
                headers: this.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async updateGuest(id, guestData) {
        try {
            const response = await httpCommon.put(`${this.baseURL}/${id}`, guestData, {
               headers: this.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async deleteGuest(id) {
        try {
            await httpCommon.delete(`${this.baseURL}/${id}`, {
                headers: this.getAuthHeader()
            });
            return id; // Or return a more informative response
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getGuestsByRegisteredBy(registeredBy, { page = 1, limit = 10, search = "" }) {
        try {
            const response = await httpCommon.get(`${this.baseURL}/registeredBy/${registeredBy}`, {
                headers: this.getAuthHeader(),
                params: {
                    page,
                    limit,
                    search,
                },
            });
            return response.data; // Adjust based on your API response structure
        } catch (error) {
            throw this.handleError(error);
        }
    }

    handleError(error) {
       console.error('API Error:', error);
         if (error.response) {
              throw new Error(error.response.data?.message || 'An error occurred');
        }  else {
           throw new Error(error.message || 'An error occurred');
        }
    }
}

export default new GuestService();