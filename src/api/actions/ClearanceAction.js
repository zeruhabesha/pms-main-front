import { createAsyncThunk } from '@reduxjs/toolkit';
import ClearanceService from '../services/clearance.service';

export const fetchClearances = createAsyncThunk(
    'clearance/fetchClearances',
    async ({ page, limit, search, status }, { rejectWithValue }) => {
        try {
            const response = await ClearanceService.fetchClearances(page, limit, search, status);
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const addClearance = createAsyncThunk(
    'clearance/addClearance',
    async (clearanceData, { rejectWithValue }) => {
        try {
            const response = await ClearanceService.addClearance(clearanceData);
            return response.data;
        } catch (error) {
             return rejectWithValue(
                error.response?.data || { message: 'Failed to add clearance' }
            );
        }
    }
);

export const updateClearance = createAsyncThunk(
    'clearance/updateClearance',
    async ({ id, clearanceData }, { rejectWithValue }) => {
        try {
             const response = await ClearanceService.updateClearance(id, clearanceData);
            return response;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: 'Failed to update clearance' }
            );
        }
    }
);

export const approveClearance = createAsyncThunk(
    'clearance/approveClearance',
    async (id, { rejectWithValue }) => {
        try {
           const response = await ClearanceService.approveClearance(id);
            return response;
        } catch (error) {
             return rejectWithValue(
                error.response?.data || { message: 'Failed to approve clearance' }
            );
        }
    }
);

export const inspectClearance = createAsyncThunk(
    'clearance/inspectClearance',
    async ({ id, feedback }, { rejectWithValue }) => {
        try {
             const response = await ClearanceService.inspectClearance(id, feedback);
            return response;
        } catch (error) {
            return rejectWithValue(
                 error.response?.data || { message: 'Failed to inspect clearance' }
            );
        }
    }
);

export const rejectClearance = createAsyncThunk(
    'clearance/rejectClearance',
    async (id, { rejectWithValue }) => {
         try {
             const response = await ClearanceService.rejectClearance(id);
             return response;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: 'Failed to reject clearance' }
            );
        }
    }
);


export const deleteClearance = createAsyncThunk(
    'clearance/deleteClearance',
    async (id, { rejectWithValue }) => {
        try {
            await ClearanceService.deleteClearance(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchInspectedClearances = createAsyncThunk(
    'clearance/fetchInspectedClearances',
    async ({ userId, page, limit }, { rejectWithValue }) => {
        try {
            const response = await ClearanceService.fetchInspectedClearances(userId, page, limit);
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchUninspectedClearances = createAsyncThunk(
    'clearance/fetchUninspectedClearances',
    async ({ page, limit }, { rejectWithValue }) => {
        try {
            const response = await ClearanceService.fetchUninspectedClearances(page, limit);
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);