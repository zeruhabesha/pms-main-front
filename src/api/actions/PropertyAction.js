import { createAsyncThunk } from '@reduxjs/toolkit';
import { PropertyTypes } from '../types/propertyTypes';
import PropertyService from '../services/property.service';

const propertyService = new PropertyService();

export const filterProperties = createAsyncThunk(
    PropertyTypes.FILTER_PROPERTIES,
    async (filterCriteria = {}, { rejectWithValue }) => {
        try {
            const response = await propertyService.filterProperties(filterCriteria);
            return response;
        } catch (error) {
            return rejectWithValue(error.message); // Only pass the message
        }
    }
);

export const addProperty = createAsyncThunk(
    PropertyTypes.ADD_PROPERTY,
    async (propertyData, { rejectWithValue }) => {
        try {
            const response = await propertyService.createProperty(propertyData);
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateProperty = createAsyncThunk(
    PropertyTypes.UPDATE_PROPERTY,
    async ({ id, propertyData }, { rejectWithValue }) => {
        try {
            const response = await propertyService.updateProperty(id, propertyData);
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const getTenantById = createAsyncThunk(
    'tenant/getTenantById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await propertyService.getTenantById(id);
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
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
            return rejectWithValue(error.message);
        }
    }
);

export const updatePhotos = createAsyncThunk(
    PropertyTypes.UPDATE_PHOTOS,
    async ({ propertyId, photos }, { rejectWithValue }) => {
        try {
             const response = await propertyService.updatePhotos(propertyId, photos);
             return { propertyId, photos: response };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


export const getProperty = createAsyncThunk(
    PropertyTypes.GET_PROPERTY,
    async (id, { rejectWithValue }) => {
        try {
            const response = await propertyService.getProperty(id);
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
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
            return rejectWithValue(error.message);
        }
    }
);

export const updatePropertyPhoto = createAsyncThunk(
    PropertyTypes.UPDATE_PROPERTY_PHOTO,
    async ({ id, photo }, { rejectWithValue }) => {
        try {
           const response = await propertyService.updatePhoto(id, photo);
           return response;
        } catch (error) {
           return rejectWithValue(error.message);
        }
    }
);

export const batchDelete = createAsyncThunk(
    PropertyTypes.BATCH_DELETE,
    async (propertyIds, { rejectWithValue }) => {
        try {
            await propertyService.batchDelete(propertyIds);
            return propertyIds;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const toggleFeatured = createAsyncThunk(
    PropertyTypes.TOGGLE_FEATURED,
    async ({ propertyId, featured }, { rejectWithValue }) => {
        try {
            const response = await propertyService.toggleFeatured(propertyId, featured);
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateStatus = createAsyncThunk(
    PropertyTypes.UPDATE_STATUS,
    async ({ propertyId, status }, { rejectWithValue }) => {
        try {
            const response = await propertyService.updateStatus(propertyId, status);
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const downloadPhoto = createAsyncThunk(
     PropertyTypes.DOWNLOAD_PHOTO,
    async ({ propertyId, photoId }, { rejectWithValue }) => {
        try {
              await propertyService.downloadPhoto(propertyId, photoId);
            return { propertyId, photoId }
        } catch (error) {
          return rejectWithValue(error.message);
        }
    }
);