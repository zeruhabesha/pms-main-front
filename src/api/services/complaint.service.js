// src/api/services/complaint.service.js
import httpCommon from '../http-common';

class ComplaintService {
    constructor() {
        this.baseURL = `${httpCommon.defaults.baseURL}/complaints`;
    }

    async fetchComplaints(page = 1, limit = 10, searchTerm = '', status = '') {
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


    async addComplaint(complaintData) {
        try {
            const response = await httpCommon.post(this.baseURL, complaintData, {
                headers: {
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
            const response = await httpCommon.put(`${this.baseURL}/${id}`, complaintData);
          
            return response.data.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async assignComplaint(id, userId) {
        try {
            const response = await httpCommon.put(`${this.baseURL}/assign/${id}`, { assignedTo: userId });
             return response.data.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async submitComplaintFeedback(id, feedback) {
        try {
            const response = await httpCommon.put(`${this.baseURL}/feedback/${id}`, { feedback });
             return response.data.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }


    async deleteComplaint(id) {
        try {
            await httpCommon.delete(`${this.baseURL}/${id}`);
            return id;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async fetchAssignedComplaints(userId, page = 1, limit = 10) {
        try {
            const response = await httpCommon.get(`${this.baseURL}/assigned/${userId}`, {
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