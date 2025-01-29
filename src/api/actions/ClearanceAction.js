import { createAsyncThunk } from '@reduxjs/toolkit';
import ClearanceService from '../services/clearance.service';


export const fetchClearances = createAsyncThunk(
    'clearance/fetchClearances',
    async ({ page, limit, search, status }, { rejectWithValue }) => {
        try {
            const response = await ClearanceService.fetchClearances(page, limit, search, status);
            return response;
        } catch (error) {
            return rejectWithValue(error);
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
             await ClearanceService.deleteClearance(id);
            return id;
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
           return response;
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
           return response;
        } catch (error) {
           return rejectWithValue(error);
        }
    }
);
