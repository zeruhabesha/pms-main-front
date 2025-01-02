// store/services/complaint.service.js
import httpCommon from '../http-common';

class ComplaintService {
    constructor() {
        this.baseURL = `${httpCommon.defaults.baseURL}/complaints`;
    }

    getAuthHeader() {
        const token = localStorage.getItem('token');
        return {
            Authorization: `Bearer ${token}`,
        };
    }

    async fetchComplaints(page = 1, limit = 10, searchTerm = '') {
        try {
            const response = await httpCommon.get('/complaints', {
                headers: this.getAuthHeader(),
                params: {
                    page,
                    limit,
                    search: searchTerm
                }
            });
           
            return response.data.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }


    async addComplaint(complaintData) {
        try {
            const response = await httpCommon.post('/complaints', complaintData, {
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

    async updateComplaint(id, complaintData) {
        try {
            const response = await httpCommon.put(`/complaints/${id}`, complaintData, {
                headers: this.getAuthHeader(),
            });
          
            return response.data.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async assignComplaint(id, userId) {
        try {
            const response = await httpCommon.put(`/complaints/assign/${id}`, { assignedTo: userId }, {
                headers: this.getAuthHeader(),
            });
             return response.data.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async submitComplaintFeedback(id, feedback) {
        try {
            const response = await httpCommon.put(`/complaints/feedback/${id}`, { feedback }, {
                headers: this.getAuthHeader(),
            });
             return response.data.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }


    async deleteComplaint(id) {
        try {
            await httpCommon.delete(`/complaints/${id}`, {
                headers: this.getAuthHeader(),
            });
            return id;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async fetchAssignedComplaints(userId, page = 1, limit = 10) {
        try {
            const response = await httpCommon.get(`/complaints/assigned/${userId}`, {
                headers: this.getAuthHeader(),
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
            const response = await httpCommon.get('/complaints/unassigned/complaints', {
                headers: this.getAuthHeader(),
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
        };
    }
}

export default new ComplaintService();