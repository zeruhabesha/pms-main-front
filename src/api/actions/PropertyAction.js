// store/actions/propertyActions.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import propertyService from '../services/property.service';
import axios from 'axios';

export const fetchProperties = createAsyncThunk(
  'property/fetchProperties',
  async ({ page, limit, search }, { rejectWithValue }) => {
    try {
      const response = await propertyService.fetchProperties(page, limit, search);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addProperty = createAsyncThunk(
  'property/addProperty',
  async (propertyData, { rejectWithValue }) => {
    try {
      const response = await propertyService.createProperty(propertyData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateProperty = createAsyncThunk(
  'property/updateProperty',
  async ({ id, propertyData }, { rejectWithValue }) => {
    try {
      const response = await propertyService.updateProperty(id, propertyData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteProperty = createAsyncThunk(
  'property/deleteProperty',
  async (id, { rejectWithValue }) => {
    try {
      await propertyService.deleteProperty(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const uploadPropertyPhotos = createAsyncThunk(
  'property/uploadPropertyPhotos',
  async ({ propertyId, photos }, { rejectWithValue }) => {
    try {
      const updatedPhotos = await propertyService.uploadPhotos(propertyId, photos);
      return { propertyId, photos: updatedPhotos };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to upload photos');
    }
  }
);

export const updatePropertyPhoto = createAsyncThunk(
  'property/updatePhoto',
  async ({ propertyId, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/v1/properties/${propertyId}/photos`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update photo'
      );
    }
  }
);
