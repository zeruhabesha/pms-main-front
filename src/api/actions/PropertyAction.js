import { createAsyncThunk } from "@reduxjs/toolkit";
import { PropertyTypes } from "../types/propertyTypes";
import propertyService from "../services/property.service";
import axios from "axios";

const BASE_URL = "https://pms-backend-sncw.onrender.com/api/v1/";

export const fetchProperties = createAsyncThunk(
  PropertyTypes.FETCH_PROPERTIES,
  async (_, { rejectWithValue }) => {
    try {
      const response = await propertyService.filterProperties();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const filterProperties = createAsyncThunk(
  PropertyTypes.FILTER_PROPERTIES,
  async (filterCriteria = {}, { rejectWithValue }) => {
    try {
      const response = await propertyService.filterProperties(filterCriteria);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
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

export const addPropertyImage = createAsyncThunk(
  PropertyTypes.ADD_PROPERTY_IMAGE,
  async ({ id, photo }, { rejectWithValue }) => {
    try {
      const response = await propertyService.addPropertyImage(id, photo);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProperty = createAsyncThunk(
  PropertyTypes.UPDATE_PROPERTY,
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await propertyService.updateProperty(id, payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const updatePropertyPhotos = createAsyncThunk(
  PropertyTypes.UPDATE_PROPERTY_PHOTOS,
  async ({ id, photos }, { rejectWithValue }) => {
    try {
      const response = await propertyService.updatePropertyPhotos(id, photos);
      return { id, photos: response };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const getTenantById = createAsyncThunk(
  "tenant/getTenantById",
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

export const softDeleteProperty = createAsyncThunk(
  PropertyTypes.SOFT_DELETE_PROPERTY,
  async (id, { rejectWithValue }) => {
    try {
      await propertyService.softDeleteProperty(id);
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
      return { success: true, photoId, propertyId };
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
      const response = await propertyService.toggleFeatured(
        propertyId,
        featured
      );
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
      return { propertyId, photoId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePhoto = createAsyncThunk(
  PropertyTypes.UPDATE_PHOTO, // Changed the name here as well
  async ({ id, photo, photoId }, { rejectWithValue }) => {
    try {
      const response = await propertyService.updatePhoto(id, {
        photo,
        photoId,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const importProperties = createAsyncThunk(
  "property/importProperties",
  async (excel, { rejectWithValue }) => {
    try {
      const response = await propertyService.uploadExcel(excel);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getPropertiesByUser = createAsyncThunk(
  PropertyTypes.GET_PROPERTIES_BY_USER,
  async (userId, { rejectWithValue }) => {
    try {
      const response = await propertyService.getPropertiesByUser(userId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getPropertiesByUserAdmin = createAsyncThunk(
  PropertyTypes.GET_PROPERTIES_BY_USER_ADMIN,
  async (userId, { rejectWithValue }) => {
    try {
      const response = await propertyService.getPropertiesByUserAdmin(userId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getPropertyReport = createAsyncThunk(
  PropertyTypes.GET_PROPERTY_REPORT,
  async (_, { rejectWithValue }) => { // No userId needed for report endpoint
    try {
      const response = await propertyService.getPropertyReport();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);