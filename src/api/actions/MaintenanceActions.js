import { createAsyncThunk } from '@reduxjs/toolkit';
import MaintenanceService from '../services/maintenance.service';

// Fetch maintenance records

export const fetchMaintenances = createAsyncThunk(
  'maintenance/fetchMaintenances',
  async ({ page = 1, limit = 10, searchTerm = '' }, { rejectWithValue }) => {
    try {
      const data = await MaintenanceService.fetchMaintenances(page, limit, searchTerm)
      console.log('data', data)

      return { data, success: true }
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch maintenances' })
    }
  },
)
// Add maintenance record
export const addMaintenance = createAsyncThunk(
  'maintenance/addMaintenance',
  async (maintenanceData, { rejectWithValue }) => {
    try {
      const response = await MaintenanceService.addMaintenance(maintenanceData);
      return {
        data: response,
        success: true,
      };
    } catch (error) {
      console.error('Add maintenance error:', error.response || error);
      return rejectWithValue(
        error.response?.data || { message: 'Failed to add maintenance record' }
      );
    }
  }
);

// Update maintenance record
export const updateMaintenance = createAsyncThunk(
  'maintenance/updateMaintenance',
  async ({ id, maintenanceData }, { rejectWithValue }) => {
    try {
      const response = await MaintenanceService.updateMaintenance(id, maintenanceData);
      return {
        data: response,
        success: true,
      };
    } catch (error) {
      console.error('Update maintenance error:', error.response || error);
      return rejectWithValue(
        error.response?.data || { message: 'Failed to update maintenance record' }
      );
    }
  }
);

// Delete maintenance record
export const deleteMaintenance = createAsyncThunk(
  'maintenance/deleteMaintenance',
  async (id, { rejectWithValue }) => {
    try {
      await MaintenanceService.deleteMaintenance(id);
      return {
        id,
        success: true,
      };
    } catch (error) {
      console.error('Delete maintenance error:', error.response || error);
      return rejectWithValue(
        error.response?.data || { message: 'Failed to delete maintenance record' }
      );
    }
  }
);
