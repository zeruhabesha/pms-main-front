// src/api/services/complaint.service.js
import httpCommon from '../http-common';
import { decryptData } from '../utils/crypto';

class ComplaintService {
    constructor() {
        this.baseURL = `${httpCommon.defaults.baseURL}/complaints`;
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

    async fetchComplaints(page = 1, limit = 10, searchTerm = '', status = '') {
        try {
            const user = this.getRegisteredBy();

            if (!user) {
                console.warn("User data not available, cannot fetch complaints.");
                return {
                    complaints: [],
                    totalPages: 0,
                    currentPage: 1,
                    totalComplaints: 0,
                };
            }

            let registeredById;
            let apiUrl;

            if (user.role === 'Admin') {
                registeredById = user._id;
                apiUrl = `complaints/registered/${registeredById}`;
            } else if (user.role === 'Tenant') {
                registeredById = user._id;
                apiUrl = `complaints/user/${registeredById}`;
            } else if (user.role === 'Inspector') {
                registeredById = user.assignedTo._id;
                apiUrl = `complaints/assigned/${registeredById}`;
            } else {
                console.warn(`Unknown user role: ${user.role}. Fetching all complaints.`);
                apiUrl = `complaints`;  // Or handle this case differently, perhaps an error
            }

            const response = await httpCommon.get(`${apiUrl}`, {
                headers: {
                    ...this.getAuthHeader()
                },
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

    async addComplaint(complaintData) {
        try {
            const response = await httpCommon.post(this.baseURL, complaintData, {
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

    async updateComplaint(id, complaintData) {
        try {
            const response = await httpCommon.put(`${this.baseURL}/${id}`, complaintData, {
                headers: {
                    ...this.getAuthHeader(),
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async assignComplaint(id, userId) { // Expects id, userId
        try {
            const response = await httpCommon.put(`${this.baseURL}/assign/${id}`, { assignedTo: userId }, {
                headers: {
                    ...this.getAuthHeader()
                }
            });
            return response.data.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async submitComplaintFeedback(id, feedback) {
        try {
            const response = await httpCommon.put(`${this.baseURL}/feedback/${id}`, { feedback }, {
                headers: {
                    ...this.getAuthHeader()
                }
            });
            return response.data.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }


    async deleteComplaint(id) {
        try {
            await httpCommon.delete(`${this.baseURL}/${id}`, {
                headers: {
                    ...this.getAuthHeader()
                }
            });
            return id;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async fetchAssignedComplaints(userId, page = 1, limit = 10) {
        try {
            const response = await httpCommon.get(`${this.baseURL}/assigned/${userId}`, {
                headers: {
                    ...this.getAuthHeader()
                },
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

    async fetchUnassignedComplaints(page = 1, limit = 10) {
        try {
            const response = await httpCommon.get(`${this.baseURL}/unassigned/complaints`, {
                headers: {
                    ...this.getAuthHeader()
                },
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

export default new ComplaintService();