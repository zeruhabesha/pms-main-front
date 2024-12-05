import { createAsyncThunk } from '@reduxjs/toolkit';
import MaintenanceService from '../services/maintenance.service';

export const fetchMaintenance = createAsyncThunk(
  'maintenance/fetchMaintenance',
  async ({ page = 1, limit = 5, search = '' }, { rejectWithValue }) => {
    try {
      const response = await MaintenanceService.fetchMaintenance(page, limit, search);
      const { maintenanceRequests, totalPages, currentPage, totalMaintenanceRequests } = response || {};
      if (!maintenanceRequests) {
        throw new Error('No maintenance requests found');
      }
      return { maintenanceRequests, totalPages, currentPage, totalMaintenanceRequests };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch maintenance requests'
      );
    }
  }
);




export const addMaintenance = createAsyncThunk(
  'maintenance/addMaintenance',
  async (maintenanceData, { rejectWithValue }) => {
    try {
      const response = await MaintenanceService.createMaintenance(maintenanceData);
      if (!response) throw new Error('Invalid response from server');
      return response;
    } catch (error) {
      console.error('Add Maintenance Error:', error.response || error);
      return rejectWithValue(
        error.response?.data || { message: 'Failed to add maintenance record' }
      );
    }
  }
);


// Update an existing maintenance record
export const updateMaintenance = createAsyncThunk(
  'maintenance/updateMaintenance',
  async ({ id, maintenanceData }, { rejectWithValue }) => {
    try {
      const response = await MaintenanceService.updateMaintenance(id, maintenanceData);
      return response.data;
    } catch (error) {
      console.error('Update maintenance error:', error);
      return rejectWithValue(
        error.response?.data || { message: 'Failed to update maintenance record' }
      );
    }
  }
);

// Upload a photo or video for a maintenance record
export const uploadMaintenanceMedia = createAsyncThunk(
  'maintenance/uploadMedia',
  async ({ id, media }, { rejectWithValue }) => {
    try {
      const response = await MaintenanceService.uploadMaintenanceMedia(id, media);
      return { id, mediaUrl: response.data };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to upload media');
    }
  }
);

// Delete a maintenance record
export const deleteMaintenance = createAsyncThunk(
  'maintenance/deleteMaintenance',
  async (id, { rejectWithValue }) => {
    try {
      await MaintenanceService.deleteMaintenance(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete maintenance record');
    }
  }
);


// Update a photo or media for a maintenance record
export const updateMaintenancePhoto = createAsyncThunk(
  'maintenance/updateMaintenancePhoto',
  async ({ id, photoData }, { rejectWithValue }) => {
    try {
      const response = await MaintenanceService.updateMaintenancePhoto(id, photoData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'Failed to update maintenance photo' }
      );
    }
  }
);

