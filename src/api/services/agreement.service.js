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


    async fetchAgreements(page = 1, limit = 5, searchTerm = "") {
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
            const formData = new FormData();
            formData.append("file", file);

             const response =  await httpCommon.post(`${this.baseURL}/${id}/file`, formData, {
                headers: { ...this.getAuthHeader(), "Content-Type": "multipart/form-data" },
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
        console.error("API Error:", error.response?.data || error.message);
        throw {
            message: error.response?.data?.message || error.message || defaultMessage,
            status: error.response?.status || 500,
        };
    }
}

export default new AgreementService();