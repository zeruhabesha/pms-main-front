// src/api/actions/ComplaintActions.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import ComplaintService from '../services/complaint.service';

export const fetchComplaints = createAsyncThunk(
    'complaint/fetchComplaints',
    async ({ page, limit, search, status }, { rejectWithValue }) => {
        try {
            const response = await ComplaintService.fetchComplaints(page, limit, search, status);
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const addComplaint = createAsyncThunk(
    'complaint/addComplaint',
    async (complaintData, { rejectWithValue }) => {
        try {
            const response = await ComplaintService.addComplaint(complaintData);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: 'Failed to add complaint' }
            );
        }
    }
);

export const updateComplaint = createAsyncThunk(
    'complaint/updateComplaint',
    async ({ id, complaintData }, { rejectWithValue }) => {
        try {
            const response = await ComplaintService.updateComplaint(id, complaintData);
            return response;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: 'Failed to update complaint' }
            );
        }
    }
);


export const assignComplaint = createAsyncThunk(
    'complaint/assignComplaint',
    async ({ id, userId }, { rejectWithValue }) => {
        try {
            const response = await ComplaintService.assignComplaint(id, userId);
            return response;
        } catch (error) {
             return rejectWithValue(
                error.response?.data || { message: 'Failed to assign complaint' }
            );
        }
    }
);

export const submitComplaintFeedback = createAsyncThunk(
    'complaint/submitComplaintFeedback',
    async ({ id, feedback }, { rejectWithValue }) => {
        try {
            const response = await ComplaintService.submitComplaintFeedback(id, feedback);
            return response;
        } catch (error) {
            return rejectWithValue(
                 error.response?.data || { message: 'Failed to submit feedback' }
            );
        }
    }
);

export const deleteComplaint = createAsyncThunk(
    'complaint/deleteComplaint',
    async (id, { rejectWithValue }) => {
        try {
            await ComplaintService.deleteComplaint(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchAssignedComplaints = createAsyncThunk(
    'complaint/fetchAssignedComplaints',
    async ({ userId, page, limit }, { rejectWithValue }) => {
        try {
            const response = await ComplaintService.fetchAssignedComplaints(userId, page, limit);
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchUnassignedComplaints = createAsyncThunk(
    'complaint/fetchUnassignedComplaints',
    async ({ page, limit }, { rejectWithValue }) => {
        try {
            const response = await ComplaintService.fetchUnassignedComplaints(page, limit);
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);