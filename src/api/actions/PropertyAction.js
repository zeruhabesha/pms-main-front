import { createAsyncThunk } from '@reduxjs/toolkit';
import { PropertyTypes } from '../types/propertyTypes';
import PropertyService from '../services/property.service';

const propertyService = new PropertyService();

export const fetchProperties = createAsyncThunk(
  PropertyTypes.FETCH_PROPERTIES,
  async ({ page = 1, limit = 5, search = '' }, { rejectWithValue }) => {
    try {
      return await propertyService.fetchProperties(page, limit, search);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch properties');
    }
  }
);

export const addProperty = createAsyncThunk(
  PropertyTypes.ADD_PROPERTY,
  async (propertyData, { rejectWithValue }) => {
    try {
      return await propertyService.createProperty(propertyData);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add property');
    }
  }
);

export const updateProperty = createAsyncThunk(
  PropertyTypes.UPDATE_PROPERTY,
  async ({ id, propertyData }, { rejectWithValue }) => {
    try {
      return await propertyService.updateProperty(id, propertyData);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update property');
    }
  }
);

export const deleteProperty = createAsyncThunk(
  PropertyTypes.DELETE_PROPERTY,
  async (id, { rejectWithValue }) => {
    try {
      await propertyService.deleteProperty(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete property');
    }
  }
);

export const uploadPhotos = createAsyncThunk(
  PropertyTypes.UPLOAD_PHOTOS,
  async ({ propertyId, photos }, { rejectWithValue }) => {
    try {
      const uploadedPhotos = await propertyService.uploadPhotos(propertyId, photos);
      return { propertyId, photos: uploadedPhotos };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to upload photos');
    }
  }
);

export const getProperty = createAsyncThunk(
  'property/getProperty',
  async (id, { rejectWithValue }) => {
    try {
      const response = await propertyService.getProperty(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch property');
    }
  }
);

export const deletePhoto = createAsyncThunk(
  PropertyTypes.DELETE_PHOTO,
  async ({ propertyId, photoId }, { rejectWithValue }) => {
    try {
      await propertyService.deletePhoto(propertyId, photoId);
      return { propertyId, photoId };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete photo');
    }
  }
);

export const updatePropertyPhoto = createAsyncThunk(
  'property/updatePropertyPhoto',
  async ({ id, photo }, { rejectWithValue }) => {
    try {
      return await propertyService.updatePhoto(id, photo);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update property photo');
    }
  }
);

// Placeholder for batch delete and toggleFeatured if the service methods are implemented
export const batchDelete = createAsyncThunk(
  PropertyTypes.BATCH_DELETE,
  async (propertyIds, { rejectWithValue }) => {
    try {
      await propertyService.batchDelete(propertyIds); // Ensure method exists
      return propertyIds;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to batch delete properties');
    }
  }
);

export const toggleFeatured = createAsyncThunk(
  PropertyTypes.TOGGLE_FEATURED,
  async ({ propertyId, featured }, { rejectWithValue }) => {
    try {
      const updatedProperty = await propertyService.toggleFeatured(propertyId, featured); // Ensure method exists
      return updatedProperty;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to toggle featured status');
    }
  }
);

export const filterProperties = createAsyncThunk(
  PropertyTypes.FILTER_PROPERTIES,
  async (filterCriteria, { rejectWithValue }) => {
    try {
      return await propertyService.filterProperties(filterCriteria); // Ensure method exists
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to filter properties');
    }
  }
);

export const updatePhotos = createAsyncThunk(
  'property/updatePhotos',
  async ({ propertyId, photos }, { rejectWithValue }) => {
    try {
      const response = await propertyService.updatePhotos(propertyId, photos);
      return { propertyId, photos: response }; // Return the updated photos
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update photos');
    }
  }
);

export const updateStatus = createAsyncThunk(
  'property/updateStatus',
  async ({ propertyId, status }, { rejectWithValue }) => {
    try {
      const response = await propertyService.updateStatus(propertyId, status);
      return response.data; // Assuming the API returns the updated property object
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update property status');
    }
  }
);
