import httpCommon from "../http-common";
import { decryptData } from '../utils/crypto';

class AgreementService {
    constructor() {
        this.baseURL = `${httpCommon.defaults.baseURL}/lease`;
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

        return { Authorization: `Bearer ${token}` };
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


    async fetchAgreements(page = 1, limit = 10, searchTerm = "") {
        try {
            const user = this.getRegisteredBy(); // Get the user object from local storage

            if (!user) {
                console.warn("User data not available, cannot fetch agreements.");
                return {
                    agreements: [],
                    totalPages: 0,
                    currentPage: page,
                };
            }

            let registeredById;
            if (user.role === 'Admin') {
                registeredById = user._id; // Admin fetches data by their own _id
            } else {
                registeredById = user.registeredBy; // Regular user fetches data by registeredBy
            }

            const response = await httpCommon.get(`lease/registeredBy/${registeredById}`, {
                headers: await this.getAuthHeader(),
                params: { page, limit, search: searchTerm },
            });

            const { data } = response.data;

            return {
                agreements: data?.leases || [],
                totalPages: data?.totalPages || 1,
                currentPage: data?.currentPage || page,
            };
        } catch (error) {
            throw this.handleError(error, "Failed to fetch agreements");
        }
    }

    async addAgreement(agreementData) {
        try {
            console.log('Service: Adding agreement with data:', agreementData);
    
            const headers = await this.getAuthHeader();
            console.log('Service: Auth headers:', headers);
    
            const response = await httpCommon.post(this.baseURL, agreementData, {
                headers: {
                    ...headers,
                    "Content-Type": "multipart/form-data"  // Ensure correct content type
                },
            });
    
            console.log('Service: Response received:', response);
            return response.data?.data;
        } catch (error) {
            console.error('Service: Error in addAgreement:', error);
            throw this.handleError(error, "Failed to add agreement");
        }
    }

    async updateAgreement(id, agreementData) {
        try {
            const formData = new FormData();
            for (const key in agreementData) {
                if (agreementData.hasOwnProperty(key) && key !== 'documents') {
                    formData.append(key, typeof agreementData[key] === "object" ? JSON.stringify(agreementData[key]) : agreementData[key]);
                }
            }

            if (agreementData.documents && Array.isArray(agreementData.documents)) {
                agreementData.documents.forEach(file => formData.append('documents', file));
            }

            const response = await httpCommon.put(`${this.baseURL}/${id}`, formData, {
                headers: {
                    ...await this.getAuthHeader(),
                    "Content-Type": "multipart/form-data"
                },
            });

            return response.data?.data;
        } catch (error) {
            throw this.handleError(error, "Failed to update agreement");
        }
    }

    async uploadAgreementFile(id, file) {
        try {
            if (!id || !file) {
                throw new Error("Both 'id' and 'file' are required for uploading the agreement file.");
            }

            const formData = new FormData();
            formData.append("documents", file);

            const response = await httpCommon.post(`${this.baseURL}/${id}/file`, formData, {
                headers: {
                    ...await this.getAuthHeader(),
                    "Content-Type": "multipart/form-data",
                },
            });

            return response.data?.data;
        } catch (error) {
            throw this.handleError(error, "Failed to upload agreement file");
        }
    }

    async downloadAgreementFile(fileName) {
        if (!fileName) throw new Error("File name is required for download");

        try {
            const response = await httpCommon.get(`${this.baseURL}/download/${fileName}`, {
                headers: await this.getAuthHeader(),
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            return fileName;
        } catch (error) {
            throw this.handleError(error, "Failed to download file");
        }
    }

    async deleteAgreement(id) {
        try {
            await httpCommon.delete(`${this.baseURL}/${id}`, {
              headers: await this.getAuthHeader(),
            });
             return id; // Return the id to the state so that we can update the ui
        } catch (error) {
            throw this.handleError(error, "Failed to delete agreement");
        }
    }
    
    handleError(error, defaultMessage) {
        const message = error.response?.data?.message || error.message || defaultMessage;
        console.error("API Error:", message);
        throw { message };
    }
}

export default new AgreementService();