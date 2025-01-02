import httpCommon from "../http-common";
import { encryptData, decryptData } from '../utils/crypto';

class AgreementService {
    constructor() {
        this.baseURL = `${httpCommon.defaults.baseURL}/lease`;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
        };
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
    


    async fetchAgreements(page = 1, limit = 10, searchTerm = "") {
        try {
            const response = await httpCommon.get(this.baseURL, {
                headers: this.getAuthHeader(),
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

    async fetchAgreement(id) {
        try {
             const response = await httpCommon.get(`${this.baseURL}/${id}`, {
                 headers: this.getAuthHeader()
            });
            return response.data?.data;
        } catch (error) {
            throw this.handleError(error, "Failed to fetch agreement");
        }
    }

    async addAgreement(agreementData) {
        try {
            const formData = new FormData();

            // Append other fields from agreementData to formData
            for (const key in agreementData) {
                if (agreementData.hasOwnProperty(key) && key !== 'documents') {
                     formData.append(key, agreementData[key]);
                }
            }
           // Append documents (files) to formData
           if(agreementData.documents && Array.isArray(agreementData.documents)){
                 agreementData.documents.forEach((file, index) => {
                     formData.append(`documents[${index}]`, file);
                 });
            }

            const response = await httpCommon.post(this.baseURL, formData, {
                headers: { ...this.getAuthHeader(), "Content-Type": "multipart/form-data" },
            });
            return response.data?.data;

        } catch (error) {
            throw this.handleError(error, "Failed to add agreement");
        }
    }

    async updateAgreement(id, agreementData) {
        try {
            const response = await httpCommon.put(`${this.baseURL}/${id}`, agreementData, {
                headers: { ...this.getAuthHeader(), ...this.defaultHeaders },
            });
            return response.data?.data;
        } catch (error) {
            throw this.handleError(error, "Failed to update agreement");
        }
    }

    async deleteAgreement(id) {
        try {
            await httpCommon.delete(`${this.baseURL}/${id}`, {
                headers: this.getAuthHeader(),
            });
            return id;
        } catch (error) {
            throw this.handleError(error, "Failed to delete agreement");
        }
    }

    async uploadAgreementFile(id, file) {
        try {
            // Validate input
            if (!id || !file) {
                throw new Error("Both 'id' and 'file' are required for uploading the agreement file.");
            }
    
            // Prepare the FormData object
            const formData = new FormData();
            formData.append("documents", file); // Ensure 'documents' matches the backend expectation
    
            // Make the API call
            const response = await httpCommon.post(
                `${this.baseURL}/${id}/file`,
                formData,
                {
                    headers: {
                        ...this.getAuthHeader(),
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
    
            // Return the server response data
            return response.data?.data;
        } catch (error) {
            // Handle errors using the centralized handleError method
            throw this.handleError(error, "Failed to upload agreement file");
        }
    }
    


    async downloadAgreementFile(fileName) {
        if (!fileName) throw new Error("File name is required for download");

        try {
             const response = await httpCommon.get(`${this.baseURL}/download/${fileName}`, {
                headers: this.getAuthHeader(),
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            throw this.handleError(error, "Failed to download file");
        }
    }

    handleError(error, defaultMessage) {
        const message = error.response?.data?.message || error.message || defaultMessage;
        const status = error.response?.status || 500;
        console.error("API Error:", { message, status });
        throw { message, status };
    }
    
}

export default new AgreementService();