import httpCommon from '../http-common';

class MaintenanceService {
  constructor() {
    this.baseURL = `${httpCommon.defaults.baseURL}/maintenances`;
  }

  getAuthHeader() {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }

  async fetchMaintenance(page = 1, limit = 5, searchTerm = '') {
    try {
      const response = await httpCommon.get(this.baseURL, {
        params: { page, limit, search: searchTerm.trim() },
      });
      const data = response?.data?.data;
      if (!data) throw new Error('Invalid response format from server');
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  
  

  async updateMaintenancePhoto(id, photoData) {
    if (!photoData) throw new Error('Photo data is required');
    const formData = new FormData();
    formData.append('photo', photoData);
  
    try {
      const response = await httpCommon.put(`${this.baseURL}/${id}/photo`, formData, {
        headers: {
          ...this.getAuthHeader(),
          'Content-Type': 'multipart/form-data',
        },
      });
      return response?.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  createMediaFormData(mediaFiles, fieldName = 'media') {
    const formData = new FormData();
    mediaFiles.forEach((file) => formData.append(fieldName, file));
    return formData;
  }
  
  // Create a new maintenance record
  async createMaintenance(maintenanceData) {
    try {
      this.validateMaintenanceData(maintenanceData);

      const formData = this.createFormData(maintenanceData);

      const response = await httpCommon.post(this.baseURL, formData, {
        headers: {
          ...this.getAuthHeader(),
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data?.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update an existing maintenance record
  async updateMaintenance(id, maintenanceData) {
    if (!maintenanceData) {
      throw new Error('No data provided for update');
    }

    try {
      const formData = this.createFormData(maintenanceData, true);

      const response = await httpCommon.put(`${this.baseURL}/${id}`, formData, {
        headers: {
          ...this.getAuthHeader(),
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data?.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Upload media (photos/videos) for a maintenance record
  async uploadMaintenanceMedia(id, media) {
    try {
      const formData = new FormData();
      media.forEach((file) => formData.append('media', file));

      const response = await httpCommon.post(`${this.baseURL}/${id}/upload`, formData, {
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

  // Delete a maintenance record
  async deleteMaintenance(id) {
    try {
      await httpCommon.delete(`${this.baseURL}/${id}`, {
        headers: this.getAuthHeader(),
      });

      return id;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Upload additional photos for a maintenance record
  async uploadPhotos(maintenanceId, photos) {
    try {
      const formData = new FormData();
      photos.forEach((photo) => {
        if (photo instanceof File) {
          formData.append('photos', photo);
        }
      });

      const response = await httpCommon.post(`${this.baseURL}/${maintenanceId}/photos`, formData, {
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

  // Validate maintenance data before sending to the server
  validateMaintenanceData(maintenanceData) {
    if (!maintenanceData.title?.trim()) throw new Error('Title is required');
    if (!maintenanceData.maintenanceType?.trim())
      throw new Error('Maintenance Type is required');
    if (!maintenanceData.description?.trim())
      throw new Error('Description is required');
  }

  // Create FormData for multipart/form-data requests
  createFormData(data, excludeFields = []) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (!excludeFields.includes(key) && value != null) {
        if (Array.isArray(value)) {
          value.forEach((item) => formData.append(key, item));
        } else {
          formData.append(key, value);
        }
      }
    });
    return formData;
  }
  

  // Handle API errors
  // handleError(error) {
  //   console.error('API Error:', error.response?.data || error.message);
  //   throw new Error(
  //     error.response?.data?.message || 'An unknown error occurred'
  //   );
  // }
  handleError(error) {
    const message = error?.response?.data?.message || error.message || 'An unknown error occurred';
    console.error('API Error:', message);
    throw new Error(message);
  }
  
  
}

export default new MaintenanceService();
