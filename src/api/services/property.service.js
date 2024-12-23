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


    async filterProperties(filterCriteria = {}) {
        try {
            const {
                page = 1,
                limit = 5,
                ...otherCriteria
            } = filterCriteria;

            const response = await httpCommon.get(this.baseURL, {
                headers: { ...this.defaultHeaders, ...this.getAuthHeader() },
                params: {
                    page,
                    limit,
                    ...otherCriteria,
                },
            });

            const totalItems = response.data?.data?.totalProperties || 0;
            const totalPages = Math.ceil(totalItems / limit);
            const currentPage = Math.min(page, totalPages || 1);

            return {
                properties: (response.data?.data?.properties || []).map(PropertyAdapter.toDTO),
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

    async createProperty(propertyData) {
        try {
            this.validatePropertyData(propertyData);
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



    async updateProperty(id, payload) { // Updated this to accept a generic payload
       try {
         if (!id) {
           throw new Error('Property ID is required for updating');
         }
          const formData = this.createFormData(payload);
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

  async updatePropertyPhotos(id, photos) {
        try {
            if (!id) {
                throw new Error('Property ID is required for updating');
            }
          const formData = this.createFormData({ photos }, 'photos');
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
            throw this.handleError(error);
        }
    }

    async updatePhotos(propertyId, photos) {
        try {
            const formData = this.createFormData({ photos }, 'photos');
            const response = await httpCommon.put(`${this.baseURL}/${propertyId}`, formData, {
                headers: {
                    ...this.getAuthHeader(),
                    'Content-Type': 'multipart/form-data',
                },
            });
             return response.data?.data.photos;
        } catch (error) {
            throw this.handleError(error);
        }
    }


    async deletePhoto(propertyId, photoId) {
        try {
            console.log('Deleting photo with propertyId:', propertyId, 'photoId:', photoId); // Add debugging logs
            await httpCommon.delete(`${this.baseURL}/${propertyId}/photos/${photoId}`, {
                headers: this.getAuthHeader(),
            });
            return { success: true, photoId }; // Return success and photoId
        } catch (error) {
            throw this.handleError(error);
        }
    }
    
    async updatePhoto(propertyId, { photo, photoId }) {
        try {
            console.log('Updating photo with propertyId:', propertyId, 'photoId:', photoId); // Add debugging logs
            if (!photoId || !photo) {
                throw new Error('Photo and Photo ID are required');
            }
            const formData = new FormData();
            formData.append('photo', photo);
    
            const response = await httpCommon.put(`${this.baseURL}/${propertyId}/photos/${photoId}`, formData, {
                headers: {
                    ...this.getAuthHeader(),
                    'Content-Type': 'multipart/form-data',
                },
            });
            return { success: true, data: response.data?.data, photoId };
        } catch (error) {
            throw this.handleError(error);
        }
    }
    
    async updateStatus(propertyId, status) {
        try {
            const response = await httpCommon.patch(`${this.baseURL}/${propertyId}/status`, { status }, {
                headers: this.getAuthHeader(),
            });
            return PropertyAdapter.toDTO(response.data?.data);
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


   async downloadPhoto(propertyId, photoId) {
        try {
            const response = await httpCommon.get(`${this.baseURL}/${propertyId}/photos/${photoId}`, {
                headers: this.getAuthHeader(),
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', photoId);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (error) {
             throw this.handleError(error, 'Failed to download photo');
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

  createFormData(data, mediaFieldName = 'media') {
      const formData = new FormData();

    if (data && data.photos) {
      data.photos.forEach(photo => {
        if (photo instanceof File) {
          formData.append(mediaFieldName, photo);
        } else if (typeof photo === 'string') {
          //This is the previous photo id, so skip it
            console.log('skipping prev photo', photo)
        }
        else {
          console.warn('Skipping non-file photo:', photo);
        }
      });
    }

    if(data && data.photo) {
       if(data.photo instanceof File)
         formData.append(mediaFieldName, data.photo)
     }

      Object.entries(data).forEach(([key, value]) => {
       if (value != null && key !== mediaFieldName && key !== 'photos') { // Exclude photos here
         formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
       }
     });

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
        console.error('API Error:', error.response?.data || error.message);
        const message = customMessage || error.response?.data?.message || error.message || 'An unexpected error occurred';
         throw {
            message: message,
             status: error.response?.status || 500,
            errors: error.response?.data?.errors || [],
            httpError: true // Important for differentiating between network and validation errors
        };
     }
}


export default PropertyService;