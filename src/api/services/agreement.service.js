import httpCommon from "../http-common";

class AgreementService {
  constructor() {
    this.baseURL = `${httpCommon.defaults.baseURL}/lease`;
  }

  getAuthHeader() {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  async fetchAgreements(page = 1, limit = 5, searchTerm = "") {
    try {
      const response = await httpCommon.get(`/lease`, {
        params: { page, limit, search: searchTerm },
        headers: this.getAuthHeader(),
      });

      if (response.data?.status === "success" && response.data.data) {
        return response.data.data;
      } else {
        throw new Error("Unexpected API response format");
      }
    } catch (error) {
      console.error("Error fetching agreements:", error.response?.data || error.message);
      throw this.handleError(error);
    }
  }

  async addAgreement(agreementData) {
    try {
      const response = await httpCommon.post(`/lease`, agreementData, {
        headers: {
          ...this.getAuthHeader(),
          "Content-Type": "application/json",
        },
      });
      return response.data?.data;
    } catch (error) {
      console.error("Error adding agreement:", error.response?.data || error.message);
      throw this.handleError(error);
    }
  }

  async updateAgreement(id, agreementData) {
    try {
      const response = await httpCommon.put(`/lease/${id}`, agreementData, {
        headers: {
          ...this.getAuthHeader(),
          "Content-Type": "application/json",
        },
      });
      return response.data?.data;
    } catch (error) {
      console.error("Error updating agreement:", error.response?.data || error.message);
      throw this.handleError(error);
    }
  }

  async deleteAgreement(id) {
    try {
      await httpCommon.delete(`/lease/${id}`, {
        headers: this.getAuthHeader(),
      });
      return id;
    } catch (error) {
      console.error("Error deleting agreement:", error.response?.data || error.message);
      throw this.handleError(error);
    }
  }

  handleError(error) {
    return {
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
    };
  }
}

export default new AgreementService();
