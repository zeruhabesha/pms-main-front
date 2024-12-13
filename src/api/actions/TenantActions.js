// store/actions/TenantActions.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import TenantService from '../services/tenant.service';

// Fetch tenants
export const fetchTenants = createAsyncThunk(
  'tenant/fetchTenants',
  async ({ page = 1, limit = 5, search = '' }, { rejectWithValue }) => {
    try {
      const response = await TenantService.fetchTenants(page, limit, search);
      return response; // Return the response directly
    } catch (error) {
      console.error('Fetch tenants error:', error.response || error);
      return rejectWithValue(
        error.response?.data || { message: 'Failed to fetch tenants' }
      );
    }
  }
);


// Add tenant
export const addTenant = createAsyncThunk(
  'tenant/addTenant',
  async (tenantData, { rejectWithValue }) => {
    try {
      const response = await TenantService.addTenant(tenantData);
      return response; // Return the response directly
    } catch (error) {
      console.error('Add tenant error:', error.response || error);
      return rejectWithValue(
        error.response?.data || {
          message: 'Failed to add tenant due to insufficient permissions or missing token',
        }
      );
    }
  }
);

// Update tenant
export const updateTenant = createAsyncThunk(
  'tenant/updateTenant',
  async ({ id, tenantData }, { rejectWithValue }) => {
    try {
      const response = await TenantService.updateTenant(id, tenantData);
      return response; // Return the response directly
    } catch (error) {
      console.error('Update tenant error:', error.response || error);
      return rejectWithValue(
        error.response?.data || { message: 'Failed to update tenant' }
      );
    }
  }
);

// Upload tenant photo
export const uploadTenantPhoto = createAsyncThunk(
  'tenant/uploadTenantPhoto',
  async ({ id, photo }, { rejectWithValue }) => {
    try {
      const photoUrl = await TenantService.uploadPhoto(id, photo);
      return { id, photoUrl }; // Return id and photoUrl
    } catch (error) {
      console.error('Upload tenant photo error:', error.response || error);
      return rejectWithValue(
        error.response?.data || { message: 'Failed to upload photo' }
      );
    }
  }
);

// Delete tenant
export const deleteTenant = createAsyncThunk(
  'tenant/deleteTenant',
  async (id, { rejectWithValue }) => {
    try {
      await TenantService.deleteTenant(id);
      return id; // Return the deleted tenant ID
    } catch (error) {
      console.error('Delete tenant error:', { tenantId: id, error });
      return rejectWithValue(
        error.response?.data || { message: `Failed to delete tenant with ID: ${id}` }
      );
    }
  }
);

