import { createAsyncThunk } from '@reduxjs/toolkit';
import TenantService from '../services/tenant.service';

// Fetch tenants
export const fetchTenants = createAsyncThunk(
    'tenant/fetchTenants',
    async ({ page = 1, limit = 5, search = '' } = {}, { rejectWithValue }) => {
        try {
            const response = await TenantService.fetchTenants(page, limit, search);
            return response;
        } catch (error) {
            return rejectWithValue(error.message); // Pass only the error message
        }
    }
);


// Add tenant
export const addTenant = createAsyncThunk(
    'tenant/addTenant',
    async (tenantData, { rejectWithValue }) => {
        try {
            const response = await TenantService.addTenant(tenantData);
            return response;
        } catch (error) {
            return rejectWithValue(error.message); // Pass only the error message
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
           return rejectWithValue(error.message);
        }
    }
);

// Upload tenant photo
export const uploadTenantPhoto = createAsyncThunk(
    'tenant/uploadTenantPhoto',
    async ({ id, photo }, { rejectWithValue }) => {
        try {
            const photoUrl = await TenantService.uploadPhoto(id, photo);
            return { id, photoUrl };
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
            return id; // Return the deleted tenant ID
        } catch (error) {
            return rejectWithValue(error.message); // Pass only the error message
        }
    }
);