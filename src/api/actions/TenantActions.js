import { createAsyncThunk } from '@reduxjs/toolkit';
import TenantService from '../services/tenant.service';

// Fetch tenants
export const fetchTenants = createAsyncThunk(
  'tenant/fetchTenants',
  async ({ page = 1, limit = 5, search = '' }, { rejectWithValue }) => {
    try {
      return await TenantService.fetchTenants(page, limit, search);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Add tenant
export const addTenant = createAsyncThunk(
  'tenant/addTenant',
  async (tenantData, { rejectWithValue }) => {
    try {
      return await TenantService.addTenant(tenantData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update tenant
export const updateTenant = createAsyncThunk(
  'tenant/updateTenant',
  async ({ id, tenantData }, { rejectWithValue }) => {
    try {
      return await TenantService.updateTenant(id, tenantData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete tenant
export const deleteTenant = createAsyncThunk(
  'tenant/deleteTenant',
  async (id, { rejectWithValue }) => {
    try {
      await TenantService.deleteTenant(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const uploadTenantPhoto = createAsyncThunk(
  'tenant/uploadTenantPhoto',
  async ({ id, photo }, { rejectWithValue }) => {
    try {
      const response = await TenantService.uploadPhoto(id, photo);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to upload photo');
    }
  }
);

