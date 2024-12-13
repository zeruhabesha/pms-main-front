

// PropertyService.js
import httpCommon from '../http-common';
import PropertyAdapter from './propertyAdapter';
import { decryptData } from '../utils/crypto';

class PropertyService {
  constructor() {
    this.baseURL = `${httpCommon.defaults.baseURL}/properties`;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  getAuthHeader() {
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
  }

  async fetchProperties(page = 1, limit = 5, searchTerm = '') {
    try {
      const response = await httpCommon.get(this.baseURL, {
        headers: { ...this.defaultHeaders, ...this.getAuthHeader() },
        params: { page, limit, search: searchTerm },
      });

      return {
        properties: (response.data?.data?.properties || []).map(PropertyAdapter.toDTO),
        totalPages: response.data?.data?.totalPages || 1,
        totalProperties: response.data?.data?.totalProperties || 0,
        currentPage: response.data?.data?.currentPage || page,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createProperty(propertyData) {
    try {
      const formData = this.createFormData(propertyData);
      const response = await httpCommon.post(this.baseURL, formData, {
        headers: {
          ...this.getAuthHeader(),
          'Content-Type': 'multipart/form-data',
        },
      });
      return PropertyAdapter.toDTO(response.data?.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }
  async batchDelete(propertyIds) {
    try {
      await httpCommon.post(`${this.baseURL}/batch-delete`, { propertyIds }, {
        headers: { ...this.defaultHeaders, ...this.getAuthHeader() },
      });
      return propertyIds;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  async toggleFeatured(propertyId, featured) {
    try {
      const response = await httpCommon.patch(`${this.baseURL}/${propertyId}/featured`, 
        { featured },
        { headers: { ...this.defaultHeaders, ...this.getAuthHeader() } }
      );
      return PropertyAdapter.toDTO(response.data?.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  async filterProperties(filterCriteria) {
    try {
      const response = await httpCommon.get(this.baseURL, {
        headers: { ...this.defaultHeaders, ...this.getAuthHeader() },
        params: filterCriteria,
      });
  
      return {
        properties: (response.data?.data?.properties || []).map(PropertyAdapter.toDTO),
        totalPages: response.data?.data?.totalPages || 1,
        totalProperties: response.data?.data?.totalProperties || 0,
        currentPage: response.data?.data?.currentPage || 1,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }
  async updateProperty(id, propertyData) {
    try {
      const formData = this.createFormData(propertyData);
      const response = await httpCommon.put(`${this.baseURL}/${id}`, formData, {
        headers: {
          ...this.getAuthHeader(),
          'Content-Type': 'multipart/form-data',
        },
      });
      return PropertyAdapter.toDTO(response.data?.data);
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
      console.error('Delete Property Error:', error.response); // Log the error response for debugging
      throw this.handleError(error);
    }
  }

  async uploadPhotos(propertyId, photos) {
    try {
      const formData = this.createMediaFormData(photos, 'photos');

      const response = await httpCommon.post(`${this.baseURL}/${propertyId}/photos`, formData, {
        headers: {
          ...this.getAuthHeader(),
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data?.photos;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updatePhotos(propertyId, photos) {
    const formData = new FormData();
    photos.forEach((photo) => {
      formData.append('photos', photo);
    });
  
    const response = await httpCommon.put(`/properties/${propertyId}/photos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  
    return response.data.photos; // Return the updated list of photos
  }
  async updateStatus(propertyId, status) {
    const response = await httpCommon.patch(`/properties/${propertyId}/status`, { status });
    return response.data; // Assuming the API response contains the updated property object
  }
  
  async updatePhoto(id, photo) {
    const formData = new FormData();
    if (!(photo instanceof File)) {
      throw new Error('Invalid photo format');
    }
    formData.append('photo', photo);

    try {
      const response = await httpCommon.put(`${this.baseURL}/${id}/photo`, formData, {
        headers: {
          ...this.getAuthHeader(),
          'Content-Type': 'multipart/form-data',
        },
      });

      return PropertyAdapter.toDTO(response.data?.data); // Ensure consistent response format
    } catch (error) {
      throw this.handleError(error);
    }
  }
  async getProperty(id) {
    try {
      const response = await httpCommon.get(`${this.baseURL}/${id}`, {
        headers: { ...this.defaultHeaders, ...this.getAuthHeader() },
      });
      return PropertyAdapter.toDTO(response.data?.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  async deletePhoto(propertyId, photoId) {
    try {
      await httpCommon.delete(`${this.baseURL}/${propertyId}/photos/${photoId}`, {
        headers: this.getAuthHeader(),
      });
      return { propertyId, photoId };
    } catch (error) {
      throw this.handleError(error);
    }
  }
  validatePropertyData(propertyData) {
    if (!propertyData.title?.trim()) {
      throw new Error('Title is required');
    }
    if (!propertyData.propertyType?.trim()) {
      throw new Error('Property Type is required');
    }
  }

  createFormData(data) {
    const formData = new FormData();

    // Handle files separately
    if (data.photos?.length) {
      data.photos.forEach((photo) => {
        if (photo instanceof File) {
          formData.append('photos', photo);
        }
      });
    }

    // Handle other data
    Object.entries(data).forEach(([key, value]) => {
      if (value != null && key !== 'photos') {
        formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
      }
    });

    return formData;
  }

  createMediaFormData(mediaFiles, fieldName = 'media') {
    const formData = new FormData();
    mediaFiles.forEach((file) => {
      if (file instanceof File) {
        formData.append(fieldName, file);
      }
    });
    return formData;
  }

  handleError(error) {
    const errorResponse = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      status: error.response?.status || 500,
      errors: error.response?.data?.errors || [],
    };

    throw errorResponse;
  }
}

export default PropertyService;
