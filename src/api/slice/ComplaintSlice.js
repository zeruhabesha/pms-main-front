import { createSlice } from '@reduxjs/toolkit';
import {
    fetchComplaints,
    addComplaint,
    updateComplaint,
    deleteComplaint,
    assignComplaint,
    submitComplaintFeedback,
    fetchAssignedComplaints,
    fetchUnassignedComplaints,
} from '../actions/ComplaintAction';

const initialState = {
    complaints: [],
    complaintDetails: null, // Added for single complaint details
    loading: false,
    error: null,
    totalPages: 1,
    currentPage: 1,
    totalComplaints: 0,
    message: null, // Added for messages (e.g., success messages)
};

const ComplaintSlice = createSlice({
    name: 'complaint',
    initialState,
    reducers: {
        setSelectedComplaint: (state, action) => {
            state.complaintDetails = action.payload;
        },
        clearError: (state) => {
            state.error = null;
            state.message = null;
        },
        reset: (state) => {
            state.loading = false;
            state.error = null;
            state.message = null; // Ensure message is reset
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addComplaint.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addComplaint.fulfilled, (state, action) => {
                state.loading = false;
                //state.complaints.push(action.payload); // Add the new complaint to the list
                state.totalComplaints = state.totalComplaints + 1; // Update the total count if necessary
            })
            .addCase(addComplaint.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.message = action.error;
            })
            .addCase(fetchComplaints.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchComplaints.fulfilled, (state, action) => {
                state.loading = false;
                state.complaints = action.payload.complaints;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
                state.totalComplaints = action.payload.totalComplaints;
            })
            .addCase(fetchComplaints.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.message = action.error;
            })
            .addCase(updateComplaint.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateComplaint.fulfilled, (state, action) => {
                state.loading = false;
                const updatedComplaint = action.payload;
                state.complaints = state.complaints.map((complaint) =>
                    complaint._id === updatedComplaint._id ? updatedComplaint : complaint
                );
            })
            .addCase(updateComplaint.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.message = action.error;
            })
            .addCase(deleteComplaint.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteComplaint.fulfilled, (state, action) => {
                state.loading = false;
                state.complaints = state.complaints.filter(
                    (complaint) => complaint._id !== action.payload
                );
                state.totalComplaints = state.totalComplaints - 1;
            })
            .addCase(deleteComplaint.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.message = action.error;
            })
            .addCase(assignComplaint.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(assignComplaint.fulfilled, (state, action) => {
                state.loading = false;
                const assignedComplaint = action.payload;
                state.complaints = state.complaints.map((complaint) =>
                    complaint._id === assignedComplaint._id ? assignedComplaint : complaint
                );
            })
            .addCase(assignComplaint.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.message = action.error;
            })
            .addCase(submitComplaintFeedback.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(submitComplaintFeedback.fulfilled, (state, action) => {
                state.loading = false;
                const feedbackComplaint = action.payload;
                state.complaints = state.complaints.map((complaint) =>
                    complaint._id === feedbackComplaint._id ? feedbackComplaint : complaint
                );
            })
            .addCase(submitComplaintFeedback.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.message = action.error;
            })
            .addCase(fetchAssignedComplaints.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAssignedComplaints.fulfilled, (state, action) => {
                state.loading = false;
                state.complaints = action.payload.complaints;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(fetchAssignedComplaints.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.message = action.error;
            })
            .addCase(fetchUnassignedComplaints.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUnassignedComplaints.fulfilled, (state, action) => {
                state.loading = false;
                state.complaints = action.payload.complaints;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(fetchUnassignedComplaints.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.message = action.error;
            });
    },
});

export const { setSelectedComplaint, clearError, reset } = ComplaintSlice.actions;
export default ComplaintSlice.reducer;