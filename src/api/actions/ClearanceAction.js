import { createAsyncThunk } from '@reduxjs/toolkit';
import ClearanceService from '../services/clearance.service';

export const fetchClearances = createAsyncThunk(
    'clearance/fetchClearances',
    async ({ page, limit, search, status }, { rejectWithValue }) => {
        try {
            const response = await ClearanceService.fetchClearances(page, limit, search, status);
            // console.log("Fetched clearances action:", response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchClearanceById = createAsyncThunk(
    'clearance/fetchClearanceById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await ClearanceService.fetchClearanceById(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const addClearance = createAsyncThunk(
    'clearance/addClearance',
    async ({ tenant, property, moveOutDate, inspectionDate, reason, notes }, { rejectWithValue }) => {
        try {
            if (!tenant || !property) {
                throw new Error("Tenant and Property fields are required.");
            }
    
            const payload = {
                tenant: tenant,
                property: property,
                moveOutDate: moveOutDate,
                inspectionDate: inspectionDate,
                reason,
                notes,
            };

            console.log("Dispatching addClearance with payload:", payload);

            const response = await ClearanceService.addClearance(payload);
            return response.data;
        } catch (error) {
            console.error("Error in addClearance:", error);
            return rejectWithValue(error);
        }
    }
);

export const updateClearance = createAsyncThunk(
    'clearance/updateClearance',
    async ({ id, clearanceData }, { rejectWithValue }) => {
        try {
            const response = await ClearanceService.updateClearance(id, clearanceData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const approveClearance = createAsyncThunk(
    'clearance/approveClearance',
    async (id, { rejectWithValue }) => {
        try {
            const response = await ClearanceService.approveClearance(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const inspectClearance = createAsyncThunk(
    'clearance/inspectClearance',
    async ({ id, feedback }, { rejectWithValue }) => {
        try {
            const response = await ClearanceService.inspectClearance(id, feedback);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const rejectClearance = createAsyncThunk(
    'clearance/rejectClearance',
    async (id, { rejectWithValue }) => {
        try {
            const response = await ClearanceService.rejectClearance(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const deleteClearance = createAsyncThunk(
    'clearance/deleteClearance',
    async (id, { rejectWithValue }) => {
        try {
            const response = await ClearanceService.deleteClearance(id);
            return response.id;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchInspectedClearances = createAsyncThunk(
    'clearance/fetchInspectedClearances',
    async ({ userId, page, limit }, { rejectWithValue }) => {
        try {
            const response = await ClearanceService.fetchInspectedClearances(userId, page, limit);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchUninspectedClearances = createAsyncThunk(
    'clearance/fetchUninspectedClearances',
    async ({ page, limit }, { rejectWithValue }) => {
        try {
            const response = await ClearanceService.fetchUninspectedClearances(page, limit);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);