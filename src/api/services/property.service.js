import httpCommon from '../http-common';

class PropertyService {
  constructor() {
    this.baseURL = `${httpCommon.defaults.baseURL}/properties`;
  }

  getAuthHeader() {
    const token = localStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  async fetchProperties(page = 1, limit = 5, searchTerm = '') {
    try {
      const response = await httpCommon.get('/properties', {
        headers: this.getAuthHeader(),
        params: { page, limit, search: searchTerm },
      });
      return {
        properties: response.data?.data?.properties || [],
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
      this.validatePropertyData(propertyData);
      const formData = this.createFormData(propertyData);
      
      const response = await httpCommon.post('/properties', formData, {
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

  async updateProperty(id, propertyData) {
    try {
      if (!propertyData) {
        throw new Error("No data provided for update");
      }

      const formData = this.createFormData(propertyData, true);
      
      const response = await httpCommon.put(`/properties/${id}`, formData, {
        headers: {
          ...this.getAuthHeader(),
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.data) {
        throw new Error('No data received from server');
      }

      return response.data?.data;
    } catch (error) {
      console.error('Property Update Error:', error.response?.data || error);
      throw this.handleError(error);
    }
  }

  async deleteProperty(id) {
    try {
      await httpCommon.delete(`/properties/${id}`, {
        headers: this.getAuthHeader(),
      });
      return id;
    } catch (error) {
      throw this.handleError(error);
    }
  }


  async uploadPhotos(propertyId, photos) {
    try {
      const formData = new FormData();
      photos.forEach((photo) => {
        if (photo instanceof File) {
          formData.append('photos', photo);
        }
      });
  
      const response = await httpCommon.post(`${this.baseURL}/${propertyId}/photos`, formData, {
        headers: {
          ...this.getAuthHeader(),
          'Content-Type': 'multipart/form-data',
        },
      });
  
      return response.data; // Assume response contains updated photos
    } catch (error) {
      throw this.handleError(error);
    }
  }
  

  validatePropertyData(propertyData) {
    if (!propertyData.title?.trim()) throw new Error('Title is required');
    if (!propertyData.propertyType?.trim()) throw new Error('Property Type is required');
  }

  createFormData(propertyData, isUpdate = false) {
    const formData = new FormData();

    if (isUpdate && propertyData.existingPhotos) {
      formData.append('existingPhotos', JSON.stringify(propertyData.existingPhotos));
    }

    if (propertyData.photos?.length) {
      propertyData.photos.forEach(file => {
        if (file instanceof File) {
          formData.append('photos', file);
        }
      });
    }

    Object.entries(propertyData).forEach(([key, value]) => {
      if (!['photos', 'existingPhotos'].includes(key) && value != null) {
        formData.append(key, Array.isArray(value) ? JSON.stringify(value) : value);
      }
    });

    return formData;
  }

  handleError(error) {
    return {
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
    };
  }
}

export default new PropertyService();