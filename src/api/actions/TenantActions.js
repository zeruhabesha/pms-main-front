// tenantActions.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import TenantService from '../services/tenant.service';

// Fetch tenants
export const fetchTenants = createAsyncThunk(
    'tenant/fetchTenants',
    async ({ page = 1, limit = 10, search = '' } = {}, { rejectWithValue }) => {
        try {
            const response = await TenantService.fetchTenants(page, limit, search);
            return response;
        } catch (error) {
            return rejectWithValue(error); // Pass the whole error object
        }
    }
);
//Fetch Tenant By Id
export const fetchTenantById = createAsyncThunk(
    'tenant/fetchTenantById',
    async (id, { rejectWithValue }) => {
        try {
          const response = await TenantService.getTenantById(id);
            return response;
        } catch (error) {
             return rejectWithValue(error); // Pass the whole error object
        }
    }
);


// Add tenant
export const addTenant = createAsyncThunk(
    'tenant/addTenant',
    async (tenantData, { rejectWithValue }) => {
        try {
            console.log('Tenant Data Sent:', tenantData);
            const response = await TenantService.addTenant(tenantData);
            console.log('Tenant Created Response:', response);
            return response;
        } catch (error) {
            console.error('Error in Add Tenant Action:', error);
            return rejectWithValue(error.message);
        }
    }
);


// Update tenant
export const updateTenant = createAsyncThunk(
    'tenant/updateTenant',
    async ({ id, tenantData }, { rejectWithValue }) => {
        try {
            const response = await TenantService.updateTenant(id, tenantData);
            return response;
        } catch (error) {
           return rejectWithValue(error);
        }
    }
);

// Upload tenant photo
export const uploadTenantPhoto = createAsyncThunk(
    'tenant/uploadTenantPhoto',
    async ({ id, photo }, { rejectWithValue }) => {
        try {
            const response = await TenantService.uploadPhoto(id, photo);
            return { id, ...response };
        } catch (error) {
            return rejectWithValue(error);
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
             return rejectWithValue(error);
        }
    }
);

// Generate tenant report
export const generateTenantReport = createAsyncThunk(
  'tenant/generateTenantReport',
  async ({startDate, endDate}, { rejectWithValue }) => {
      try {
        const reportData = await TenantService.generateReport(startDate, endDate);
        return reportData
      } catch (error) {
          return rejectWithValue(error); // Return the whole error object
      }
  }
);