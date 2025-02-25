import httpCommon from "../http-common";
import PropertyAdapter from "./propertyAdapter";
import { decryptData } from "../utils/crypto";

class PropertyService {
  constructor() {
    this.baseURL = `${httpCommon.defaults.baseURL}/properties`;
    this.defaultHeaders = {
      "Content-Type": "application/json",
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

async filterProperties(filterCriteria = {}) {
  try {
    const user = this.getRegisteredBy();

    if (!user) {
      console.warn("User data not available, cannot fetch properties.");
      return {
        properties: [],
        pagination: {
          totalPages: 0,
          totalItems: 0,
          currentPage: 1,
          limit: 10,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
    }

    const { page = 1, limit = 10, ...otherCriteria } = filterCriteria;

    let registeredById;
    if (user.role === "Admin") {
      registeredById = user._id;
      console.log("Registered By ID (Admin):", registeredById);
    } else if (user.role === "Tenant") {
      registeredById = user.registeredByAdmin._id;
      console.log("Registered By ID (Tenant):", registeredById);
    } else {
      registeredById = user.registeredBy._id;
      console.log("Registered By ID (User):", registeredById);
    }

    if (
      !registeredById ||
      typeof registeredById !== "string" ||
      registeredById.length !== 24
    ) {
      console.error("Invalid registeredById:", registeredById);
      throw new Error("Invalid registeredById format or missing registeredBy information");
    }

    const response = await httpCommon.get(
      `/properties/userAdmin/${registeredById}`,
      {
        headers: { ...this.defaultHeaders, ...this.getAuthHeader() },
        params: {
          page,
          limit,
          ...otherCriteria,
        },
      }
    );

    const totalItems = response.data?.data?.totalProperties || 0;
    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = Math.min(page, totalPages || 1);

    return {
      properties: (response.data?.data?.properties || []).map(
        PropertyAdapter.toDTO
      ),
      pagination: {
        totalPages,
        totalItems,
        currentPage,
        limit,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      },
    };
  } catch (error) {
    throw this.handleError(error);
  }
}

async filterPropertiesOpen(filterCriteria = {}) {
  try {
    const user = this.getRegisteredBy();

    if (!user) {
      console.warn("User data not available, cannot fetch properties.");
      return {
        properties: [],
        pagination: {
          totalPages: 0,
          totalItems: 0,
          currentPage: 1,
          limit: 10,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
    }

    const { page = 1, limit = 10, ...otherCriteria } = filterCriteria;

    let registeredById;
    if (user.role === "Admin") {
      registeredById = user._id;
      console.log("Registered By ID (Admin):", registeredById);
    } else if (user.role === "Tenant") {
      registeredById = user.registeredByAdmin._id;
      console.log("Registered By ID (Tenant):", registeredById);
    } else {
      registeredById = user.registeredBy._id;
      console.log("Registered By ID (User):", registeredById);
    }

    if (
      !registeredById ||
      typeof registeredById !== "string" ||
      registeredById.length !== 24
    ) {
      console.error("Invalid registeredById:", registeredById);
      throw new Error("Invalid registeredById format or missing registeredBy information");
    }

    const response = await httpCommon.get(
      `/properties/userAdmin/${registeredById}/open`,
      {
        headers: { ...this.defaultHeaders, ...this.getAuthHeader() },
        params: {
          page,
          limit,
          ...otherCriteria,
        },
      }
    );

    const totalItems = response.data?.data?.totalProperties || 0;
    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = Math.min(page, totalPages || 1);

    return {
      properties: (response.data?.data?.properties || []).map(
        PropertyAdapter.toDTO
      ),
      pagination: {
        totalPages,
        totalItems,
        currentPage,
        limit,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      },
    };
  } catch (error) {
    throw this.handleError(error);
  }
}


  async filterPropertiess(filterCriteria = {}) {
    try {
      const { ...otherCriteria } = filterCriteria;

      const response = await httpCommon.get(this.baseURL, {
        headers: { ...this.defaultHeaders, ...this.getAuthHeader() },
        params: {
          ...otherCriteria,
        },
      });

      // const totalItems = response.data?.data?.totalProperties || 0;
      // const totalPages = Math.ceil(totalItems / limit);
      // const currentPage = Math.min(page, totalPages || 1);

      return {
        properties: (response.data?.data?.properties || []).map(
          PropertyAdapter.toDTO
        ),
        // pagination: {
        //     totalPages,
        //     totalItems,
        //     currentPage,
        //     limit,
        //     hasNextPage: currentPage < totalPages,
        //     hasPreviousPage: currentPage > 1,
        // },
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getPropertyStatusCounts() {
    try {
        const user = this.getRegisteredBy();

        if (!user) {
            console.warn("User data not available, cannot fetch properties.");
            return null;
        }

        let registeredById = null; // ✅ Ensure registeredById always has a value

        switch (user.role) {
            case "Admin":
                registeredById = user._id;
                break;
            case "Tenant":
                registeredById = user.registeredByAdmin._id;
                break;
            default:
                registeredById = user.registeredBy._id;
        }

        if (!registeredById || typeof registeredById !== "string" || registeredById.length !== 24) {
            console.error("Invalid registeredById:", registeredById);
            throw new Error("Invalid registeredById format or missing registeredBy information");
        }

        console.log("Fetching property status counts for registeredById:", registeredById);

        const response = await httpCommon.get(
            `${this.baseURL}/statusCounts/${registeredById}`,  // ✅ Now `registeredById` is always defined
            {
                headers: { ...this.defaultHeaders, ...this.getAuthHeader() },
            }
        );

        console.log("API Response for Property Status Counts:", response.data);

        return response.data;
    } catch (error) {
        throw this.handleError(error, "Failed to fetch property status counts");
    }
}

    // ADDED:  Method to fetch leased properties for a tenant.
    async getLeasedPropertiesForTenant(tenantId) {
        try {
            const response = await httpCommon.get(
                `/properties/leased/user/${tenantId}`,  // Updated URL
                {
                    headers: { ...this.defaultHeaders, ...this.getAuthHeader() },
                }
            );

            return (response.data?.data?.properties || []).map(PropertyAdapter.toDTO); // Assuming response structure is the same
        } catch (error) {
            throw this.handleError(error, "Failed to fetch leased properties for tenant");
        }
    }


  async filterProperties1(filterCriteria = {}) {
    try {
      const response = await httpCommon.get(this.baseURL, {
        headers: { ...this.defaultHeaders, ...this.getAuthHeader() },
      });
      return {
        properties: (response.data?.data?.properties || []).map(
          PropertyAdapter.toDTO
        ),
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getProperties() {
    try {
      const response = await httpCommon.get(`${this.baseURL}`, {
        headers: { ...this.defaultHeaders, ...this.getAuthHeader() },
      });

      return (response.data?.data?.properties || []).map(PropertyAdapter.toDTO);
    } catch (error) {
      throw new Error("Failed to fetch properties");
    }
  }

  async getPropertiesByUser(userId) {
    try {
      const response = await httpCommon.get(`${this.baseURL}/user/${userId}`, {
        headers: { ...this.defaultHeaders, ...this.getAuthHeader() },
      });
      return (response.data?.data?.properties || []).map(PropertyAdapter.toDTO);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getPropertiesByUserAdmin(userId) {
    try {
      const response = await httpCommon.get(`${this.baseURL}/userAdmin/${userId}`, {
        headers: { ...this.defaultHeaders, ...this.getAuthHeader() },
      });
      return (response.data?.data?.properties || []).map(PropertyAdapter.toDTO);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getPropertyReport() {
    try {
      const response = await httpCommon.get(`${this.baseURL}/report`, {
        headers: { ...this.defaultHeaders, ...this.getAuthHeader() },
      });
      return response.data?.data; // Report data might not be properties, so no Adapter here initially
    } catch (error) {
      throw this.handleError(error);
    }
  }


  async addTenant(tenantData) {
    try {
      const response = await httpCommon.post(this.baseURL, tenantData, {
        headers: {
          ...this.getAuthHeader(),
          "Content-Type": "application/json", // Send JSON
        },
      });
      return response.data?.data;
    } catch (error) {
      console.error("API call failed:", error);
      throw this.handleError(error);
    }
  }

  async createProperty(propertyData) {
    try {
      this.validatePropertyData(propertyData);
      const formData = this.createFormData(propertyData);

      const response = await httpCommon.post(this.baseURL, formData, {
        headers: {
          ...this.getAuthHeader(),
          "Content-Type": "multipart/form-data",
        },
      });
      return PropertyAdapter.toDTO(response.data?.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async addPropertyImage(id, photo) {
    try {
      const formData = new FormData();
      formData.append("photos", photo);
      const response = await httpCommon.put(`${this.baseURL}/${id}`, formData, {
        headers: {
          ...this.getAuthHeader(),
          "Content-Type": "multipart/form-data",
        },
      });
      return PropertyAdapter.toDTO(response.data?.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async batchDelete(propertyIds) {
    try {
      await httpCommon.post(
        `${this.baseURL}/delete/multiple`,
        { ids: propertyIds }, // Send IDs in the request body as an object
        {
          headers: { ...this.defaultHeaders, ...this.getAuthHeader() },
        }
      );
      return propertyIds; // Backend returns the deleted IDs
    } catch (error) {
      throw this.handleError(error, "Failed to delete properties");
    }
  }

  async toggleFeatured(id, featured) {
    try {
      //  FEATURED IS NOT A FIELD ON THE BACKEND
      const response = await httpCommon.patch(
        `${this.baseURL}/${id}`, // Remove `/featured`
        { featured }, // Remove featured from here
        { headers: { ...this.defaultHeaders, ...this.getAuthHeader() } }
      );
      return PropertyAdapter.toDTO(response.data?.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateProperty(id, payload) {
    try {
      if (!id) {
        throw new Error("Property ID is required for updating");
      }
      const formData = this.createFormData(payload);
      const response = await httpCommon.put(`${this.baseURL}/${id}`, formData, {
        headers: {
          ...this.getAuthHeader(),
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("service", response.data?.data);
      return PropertyAdapter.toDTO(response.data?.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updatePropertyPhotos(id, photos) {
    try {
      if (!id) {
        throw new Error("Property ID is required for updating");
      }
      const formData = this.createFormData({ photos }, "photos");
      const response = await httpCommon.put(`${this.baseURL}/${id}`, formData, {
        headers: {
          ...this.getAuthHeader(),
          "Content-Type": "multipart/form-data",
        },
      });
      return PropertyAdapter.toDTO(response.data?.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }
  async getTenantById(id) {
    try {
      const response = await httpCommon.get(`${this.baseURL}/tenants/${id}`, {
        headers: this.getAuthHeader(),
      });
      return response.data?.data; // Adjust as per your API response structure
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteProperty(id) {
    try {
      await httpCommon.delete(`${this.baseURL}/${id}`, {
        headers: this.getAuthHeader(),
      });
      return id;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async softDeleteProperty(id) {
    try {
      await httpCommon.put(
        `${this.baseURL}/${id}/delete`,
        {},
        {
          headers: this.getAuthHeader(),
        }
      );
      return id;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  async updatePhotos(id, photos) {
    try {
      const formData = this.createFormData({ photos }, "photos");
      const response = await httpCommon.put(`${this.baseURL}/${id}`, formData, {
        headers: {
          ...this.getAuthHeader(),
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data?.data.photos;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deletePhoto(propertyId, photoId) {
    try {
      await httpCommon.delete(
        `${this.baseURL}/${propertyId}/photos/${photoId}`,
        {
          headers: this.getAuthHeader(),
        }
      );
      return { success: true, photoId, propertyId };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updatePhoto(propertyId, { photo, photoId }) {
    try {
      if (!photoId || !photo) {
        throw new Error("Photo and Photo ID are required");
      }
      const formData = new FormData();
      formData.append("photo", photo);

      const response = await httpCommon.put(
        `${this.baseURL}/${propertyId}/photos/${photoId}`,
        formData,
        {
          headers: {
            ...this.getAuthHeader(),
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return { success: true, data: response.data?.data, photoId };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateStatus(id, status) {
    try {
      const response = await httpCommon.patch(
        `${this.baseURL}/${id}`, // Removed `/status` from URL
        { status },
        {
          headers: this.getAuthHeader(),
        }
      );
      return PropertyAdapter.toDTO(response.data?.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getProperty(id) {
    try {
      if (!id) {
        throw new Error("Property ID is required");
      }
      const response = await httpCommon.get(`${this.baseURL}/${id}`, {
        headers: this.getAuthHeader(),
      });
      console.log("sssssssssssssssss", response.data.data);
      return PropertyAdapter.toDTO(response.data?.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async importProperties(formData) {
    try {
      const response = await httpCommon.post(
        `${this.baseURL}/upload/excel`,
        formData,
        {
          headers: {
            ...this.getAuthHeader(),
            "Content-Type": "multipart/form-data", // Important for file uploads
          },
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, "Failed to import properties from Excel");
    }
  }

  async downloadPhoto(propertyId, photoId) {
    try {
      const response = await httpCommon.get(
        `${this.baseURL}/images/${propertyId}/${photoId}`,
        {
          headers: this.getAuthHeader(),
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", photoId);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      throw this.handleError(error, "Failed to download photo");
    }
  }

  validatePropertyData(propertyData) {
    const requiredFields = {
      title: "Title is required",
      description: "Description is required",
      address: "Address is required",
      price: "Price is required",
      propertyType: "Property Type is required",
      numberOfUnits: "Number of Units is required",
    };

    for (const [field, message] of Object.entries(requiredFields)) {
      if (
        !propertyData[field] ||
        (typeof propertyData[field] === "string" && !propertyData[field].trim())
      ) {
        throw new Error(message);
      }
    }

    // Validate numeric fields
    if (isNaN(propertyData.price) || Number(propertyData.price) <= 0) {
      throw new Error("Price must be a valid number greater than 0");
    }

    if (
      isNaN(propertyData.numberOfUnits) ||
      Number(propertyData.numberOfUnits) <= 0
    ) {
      throw new Error("Number of units must be a valid number greater than 0");
    }
  }

  async uploadPhoto(id, photo) {
    try {
      const formData = new FormData();
      formData.append("photo", photo);
      const response = await httpCommon.put(
        `${this.baseURL}/${id}/photo`,
        formData,
        {
          headers: {
            ...this.getAuthHeader(),
            // Remove Content-Type here as it's automatically set for FormData
          },
        }
      );
      return response.data?.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async uploadExcel(formData) {
    try {
      // Make sure your baseURL is properly set in the service config
      const response = await httpCommon.post(
        `${this.baseURL}/upload/excel`,
        formData, // Send FormData object
        {
          headers: {
            ...this.getAuthHeader(),
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, "Failed to upload Excel file");
    }
  }

  createFormData(data) {
    const formData = new FormData();
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const value = data[key];
        if (value === null || value === undefined) {
          continue; // Skip null or undefined values
        }
        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (item instanceof File) {
              formData.append(`${key}`, item); // Changed to handle multiple files better
            } else {
              formData.append(`${key}[${index}]`, item);
            }
          });
        } else if (value instanceof File) {
          formData.append(key, value);
        } else if (typeof value === "object") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      }
    }
    return formData;
  }
  async getTenantById(id) {
    try {
      const response = await httpCommon.get(`${this.baseURL}/tenants/${id}`, {
        headers: this.getAuthHeader(),
      });
      return response.data?.data; // Adjust as per your API response structure
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error, customMessage) {
    console.error("API Error:", error.response?.data || error.message);

    if (error.response?.data?.error?.includes("EPERM")) {
      return {
        message:
          "Unable to process file upload. Please try again or contact support.",
        status: error.response?.status || 500,
        errors: [
          {
            field: "photos",
            message: "File permission error occurred",
          },
        ],
        httpError: true,
      };
    }
    return {
      message: customMessage || error.response?.data?.message || error.message,
      status: error.response?.status || 500,
      errors: error.response?.data?.errors || [],
      httpError: true,
    };
  }
}

const propertyService = new PropertyService();
export default propertyService;
