// GuestService.js
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
            console.log("GuestService - createGuest: Sending to API:", guestData);
            const response = await httpCommon.post(this.baseURL, guestData, {
                headers: this.getAuthHeader()
            });
            console.log("GuestService - createGuest: API Response:", response);  // Log the raw response
            return response.data;
        } catch (error) {
            console.error("GuestService - createGuest: API Error:", error);
            throw this.handleError(error);
        }
    }

    async fetchGuests({ page = 1, limit = 10, search = "", status = "" }) {
        try {
            console.log("GuestService - fetchGuests: Fetching guests with params:", { page, limit, search, status });
            const response = await httpCommon.get( `${this.baseURL}/user`, {
               
                headers: this.getAuthHeader(),
                params: {
                    page,
                    limit,
                    search,
                    status,
                },
            });
            console.log("GuestService - fetchGuests: API Response:", response);
            console.log("GuestService - fetchGuests: API Response:", response.data);
            console.log("GuestService - fetchGuests: API Response:", response.data.data);

            return response.data;
        } catch (error) {
            console.error("GuestService - fetchGuests: API Error:", error);
            throw this.handleError(error);
        }
    }

    async fetchGuestById(id) {
        try {
            console.log("GuestService - fetchGuestById: Fetching guest with ID:", id);
            const response = await httpCommon.get(`${this.baseURL}/${id}`, {
                headers: this.getAuthHeader()
            });
            console.log("GuestService - fetchGuestById: API Response:", response);
            return response.data;
        } catch (error) {
            console.error("GuestService - fetchGuestById: API Error:", error);
            throw this.handleError(error);
        }
    }

    async updateGuest(id, guestData) {
        try {
            console.log("GuestService - updateGuest: Updating guest with ID:", id, "Data:", guestData);
            const response = await httpCommon.put(`${this.baseURL}/${id}`, guestData, {
                headers: this.getAuthHeader()
            });
            console.log("GuestService - updateGuest: API Response:", response);
            return response.data;
        } catch (error) {
            console.error("GuestService - updateGuest: API Error:", error);
            throw this.handleError(error);
        }
    }

    async deleteGuest(id) {
        try {
            console.log("GuestService - deleteGuest: Deleting guest with ID:", id);
            const response = await httpCommon.delete(`${this.baseURL}/${id}`, {
                headers: this.getAuthHeader()
            });
            console.log("GuestService - deleteGuest: API Response:", response);
            return id;
        } catch (error) {
            console.error("GuestService - deleteGuest: API Error:", error);
            throw this.handleError(error);
        }
    }

    async getGuestsByRegisteredBy(registeredBy, { page = 1, limit = 10, search = "" }) {
        try {
            console.log("GuestService - getGuestsByRegisteredBy: Fetching guests by registeredBy:", registeredBy, "with params:", { page, limit, search });
            const response = await httpCommon.get(`${this.baseURL}/registeredBy/${registeredBy}`, {
                headers: this.getAuthHeader(),
                params: {
                    page,
                    limit,
                    search,
                },
            });
            console.log("GuestService - getGuestsByRegisteredBy: API Response:", response);
            return response.data;
        } catch (error) {
            console.error("GuestService - getGuestsByRegisteredBy: API Error:", error);
            throw this.handleError(error);
        }
    }

    handleError(error) {
        console.error('API Error:', error);
        if (error.response) {
            console.error('API Error - Response data:', error.response.data);
            console.error('API Error - Response status:', error.response.status);
            console.error('API Error - Response headers:', error.response.headers);
            throw new Error(error.response.data?.message || 'An error occurred');
        } else if (error.request) {
            console.error('API Error - No response received. Request details:', error.request);
            throw new Error('No response received from the server.');
        } else {
            console.error('API Error - Request setup error:', error.message);
            throw new Error(error.message || 'An error occurred');
        }
    }
}

export default new GuestService();