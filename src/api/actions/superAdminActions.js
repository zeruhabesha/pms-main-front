// store/actions/superAdminActions.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import SuperAdminService from '../services/superadmin.service';

export const fetchSuperAdmins = createAsyncThunk(
  'superAdmin/fetchSuperAdmins',
  async ({ page, limit, search }, { rejectWithValue }) => {
    try {
      const response = await SuperAdminService.fetchSuperAdmins(page, limit, search);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addSuperAdmin = createAsyncThunk(
  'superAdmin/add',
  async (superAdminData, { rejectWithValue }) => {
    try {
      // Call the service method to add a Super Admin
      const response = await SuperAdminService.addSuperAdmin(superAdminData);
      return response.data; // Return the response data on success
    } catch (error) {
      return rejectWithValue({
        message: error.message || 'Failed to add Super Admin',
        status: error.status || 500,
      });
    }
  }
);


export const updateSuperAdmin = createAsyncThunk(
  'superAdmin/updateSuperAdmin',
  async ({ id, superAdminData }, { rejectWithValue }) => {
    try {
      return await SuperAdminService.updateSuperAdmin(id, superAdminData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const uploadSuperAdminPhoto = createAsyncThunk(
  'superAdmin/uploadPhoto',
  async ({ id, photo }, { rejectWithValue }) => {
    try {
      const response = await SuperAdminService.uploadSuperAdminPhoto(id, photo);
      return { id, photoUrl: response };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to upload photo');
    }
  }
);


export const deleteSuperAdmin = createAsyncThunk(
  'superAdmin/deleteSuperAdmin',
  async (id, { rejectWithValue }) => {
    try {
      await SuperAdminService.deleteSuperAdmin(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);