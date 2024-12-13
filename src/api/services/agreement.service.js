import httpCommon from "../http-common";

class AgreementService {
  constructor() {
    this.baseURL = `${httpCommon.defaults.baseURL}/lease`;
  }

  getAuthHeader() {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async fetchAgreements(page = 1, limit = 5, searchTerm = "") {
    try {
      const response = await httpCommon.get(`${this.baseURL}`, {
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
      this.handleError(error, "Failed to fetch agreements");
    }
  }

  async addAgreement(agreementData) {
    return this.handleRequest(
      () =>
        httpCommon.post(`${this.baseURL}`, agreementData, {
          headers: { ...this.getAuthHeader(), "Content-Type": "application/json" },
        }),
      "Failed to add agreement"
    );
  }

  async updateAgreement(id, agreementData) {
    return this.handleRequest(
      () =>
        httpCommon.put(`${this.baseURL}/${id}`, agreementData, {
          headers: { ...this.getAuthHeader(), "Content-Type": "application/json" },
        }),
      "Failed to update agreement"
    );
  }

  async deleteAgreement(id) {
    return this.handleRequest(
      () =>
        httpCommon.delete(`${this.baseURL}/${id}`, {
          headers: this.getAuthHeader(),
        }),
      "Failed to delete agreement"
    );
  }

  async uploadAgreementFile(id, file) {
    const formData = new FormData();
    formData.append("file", file);

    return this.handleRequest(
      () =>
        httpCommon.post(`${this.baseURL}/${id}/file`, formData, {
          headers: { ...this.getAuthHeader(), "Content-Type": "multipart/form-data" },
        }),
      "Failed to upload agreement file"
    );
  }

  async downloadAgreementFile(fileName) {
    if (!fileName) throw new Error("File name is required for download");

    try {
      const response = await httpCommon.get(`${this.baseURL}/download/${fileName}`, {
        headers: this.getAuthHeader(),
        responseType: "blob", // Treat response as file blob
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName); // Set downloaded file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      this.handleError(error, "Failed to download file");
    }
  }

  async handleRequest(requestFn, defaultErrorMessage) {
    try {
      const response = await requestFn();
      return response.data?.data || response.data;
    } catch (error) {
      this.handleError(error, defaultErrorMessage);
    }
  }

  handleError(error, defaultMessage = "An error occurred") {
    console.error("API Error:", error.response?.data || error.message);
    throw {
      message: error.response?.data?.message || defaultMessage,
      status: error.response?.status || 500,
    };
  }
}

export default new AgreementService();
