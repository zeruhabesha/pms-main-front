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

    async getRegisteredBy() {
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

    async fetchClearances(page = 1, limit = 10, searchTerm = '', status = '') {
        try {
            const user = await this.getRegisteredBy();
    
            if (!user) {
                console.warn("User data not available, cannot fetch clearances.");
                return {
                    clearances: [],
                    totalPages: 0,
                    currentPage: 1,
                    totalClearances: 0,
                };
            }
    
            let registeredById;
            let registeredByAdmin;
            let apiUrl;
    
            if (user.role === 'Admin') {
                registeredById = user._id;
                apiUrl = `clearance/registeredBy/${registeredById}`;
            } else if (user.role === 'Tenant') {
                registeredById = user._id;
                apiUrl = `clearance/tenant/${registeredById}`;
            } else if (user.role === 'Inspector') {
                registeredById = user.assignedTo._id;
                apiUrl = `clearance/inspected/${registeredById}`;
            } else {
                console.warn(`Unknown user role: ${user.role}. Fetching all clearances.`);
                apiUrl = `clearance`;  // Or handle this case differently, perhaps an error
            }
    
            const response = await  httpCommon.get(`${apiUrl}`, {
                headers: await this.getAuthHeader(),
                params: {
                    page,
                    limit,
                    search: searchTerm,
                    status,
                }
            });
    
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async fetchClearanceById(id) {
        try {
            const response = await httpCommon.get(`${this.baseURL}/${id}`, {
                headers: await this.getAuthHeader(),
            });
            return response.data; // Return the entire response data
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async addClearance({ tenant, property, moveOutDate, inspectionDate, reason, notes }) {
        try {
            if (!tenant || !property) {
                throw new Error("Tenant and Property are required.");
            }

            // Log tenant and property IDs to check their format
            console.log("Tenant ID before API call:", tenant);
            console.log("Property ID before API call:", property);

            // Ensure tenant and property IDs are strings
            const tenantId = String(tenant).trim();
            const propertyId = String(property).trim();

            if (!tenantId || !propertyId) {
                throw new Error("Invalid Tenant or Property ID.");
            }

            const payload = {
                tenant: tenantId,
                property: propertyId,
                moveOutDate: new Date(moveOutDate).toISOString(),
                inspectionDate: inspectionDate ? new Date(inspectionDate).toISOString() : null, //added ternary operator to account for null value of inspection date,
                reason,
                notes,
            };
            const response = await httpCommon.post(this.baseURL, payload, { headers: await this.getAuthHeader() });
            // if (!response.data || !response.data._id || !response.data.id) {
            //     throw new Error("Invalid response from the server");
            // }
             console.log("Clearance added successfully:", response.data);
             return response.data;
            } catch (error) {
            console.error("Error in ClearanceService.addClearance:", error.response?.data || error.message);
            throw this.handleError(error);
        }
    }





    async updateClearance(id, clearanceData) {
        try {
            const response = await httpCommon.put(`${this.baseURL}/${id}`, clearanceData, { headers: await this.getAuthHeader()});
           return response.data; // Return the entire response data
        } catch (error) {
             throw this.handleError(error);
        }
    }

    async approveClearance(id) {
        try {
            const response = await httpCommon.put(`${this.baseURL}/approve/${id}`, {}, {headers: await this.getAuthHeader()});
           return response.data; // Return the entire response data
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async inspectClearance(id, feedback) {
        try {
            const response = await httpCommon.put(`${this.baseURL}/inspect/${id}`, { feedback }, { headers: await this.getAuthHeader()});
            return response.data; // Return the entire response data
        } catch (error) {
            throw this.handleError(error);
        }
    }

     async rejectClearance(id) {
        try {
            const response = await httpCommon.put(`${this.baseURL}/reject/${id}`, {}, { headers: await this.getAuthHeader() });
             return response.data; // Return the entire response data
        } catch (error) {
           throw this.handleError(error);
        }
    }


    async deleteClearance(id) {
        try {
            await httpCommon.delete(`${this.baseURL}/${id}`, { headers: await this.getAuthHeader() });
            return {id:id}; // Return the id within an object
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
             return response.data; // Return the entire response data
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
             return response.data; // Return the entire response data
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