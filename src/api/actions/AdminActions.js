// store/actions/AdminActions.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import AdminService from '../services/admin.service';

export const fetchAdmins = createAsyncThunk(
  'admin/fetchAdmins',
  async ({ page, limit, search }, { rejectWithValue }) => {
    try {
      const response = await AdminService.fetchAdmins(page, limit, search);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const addAdmin = createAsyncThunk(
  'admin/addAdmin',
  async (adminData, { rejectWithValue }) => {
    try {
      const response = await AdminService.addAdmin(adminData);
      return response.data;
    } catch (error) {
      console.error('Add admin error:', error.response || error); // Log detailed error
      return rejectWithValue(
        error.response?.data || { message: 'Failed to add admin due to insufficient permissions or missing token' }
      );
    }
  }
);


export const updateAdmin = createAsyncThunk(
  'admin/updateAdmin',
  async ({ id, adminData }, { rejectWithValue }) => {
    try {
      const response = await AdminService.updateAdmin(id, adminData);
      return response.data;
    } catch (error) {
      console.error('Update admin error:', error);
      return rejectWithValue(
        error.response?.data || { message: 'Failed to update admin' }
      );
    }
  }
);

export const uploadAdminPhoto = createAsyncThunk(
  'Admin/uploadPhoto',
  async ({ id, photo }, { rejectWithValue }) => {
    try {
      const response = await AdminService.uploadAdminPhoto(id, photo);
      return { id, photoUrl: response };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to upload photo');
    }
  }
);


export const deleteAdmin = createAsyncThunk(
  'Admin/deleteAdmin',
  async (id, { rejectWithValue }) => {
    try {
      await AdminService.deleteAdmin(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);