import httpCommon from '../http-common';

class GuestService {
    constructor() {
        this.baseURL = `${httpCommon.defaults.baseURL}/guests`;
    }

    async createGuest(guestData) {
        try {
            const response = await httpCommon.post(this.baseURL, guestData);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async fetchGuests({ page = 1, limit = 10, search = "" }) {
        try {
            const response = await httpCommon.get(this.baseURL, {
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

    async fetchGuestById(id) {
        try {
            const response = await httpCommon.get(`${this.baseURL}/${id}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async updateGuest(id, guestData) {
        try {
            const response = await httpCommon.put(`${this.baseURL}/${id}`, guestData);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async deleteGuest(id) {
        try {
            await httpCommon.delete(`${this.baseURL}/${id}`);
            return id; // Or return a more informative response
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getGuestsByRegisteredBy(registeredBy, { page = 1, limit = 10, search = "" }) {
        try {
            const response = await httpCommon.get(`${this.baseURL}/registeredBy/${registeredBy}`, {
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
        console.error('API Error:', error.response?.data || error.message);
        // Provide more specific error details if needed
        return {
            message: error.response?.data?.message || error.message,
            status: error.response?.status,
            errorDetails: error.response?.data?.error || null,
        };
    }
}

export default new GuestService();