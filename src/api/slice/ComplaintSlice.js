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
    loading: false,
    error: null,
    totalPages: 1,
    currentPage: 1,
    totalComplaints: 0,
};

const ComplaintSlice = createSlice({
    name: 'complaint',
    initialState,
    reducers: {
        reset: (state) => {
            state.complaints = [];
            state.loading = false;
            state.error = null;
            state.totalPages = 1;
            state.currentPage = 1;
            state.totalComplaints = 0;
        },
    },
    extraReducers: (builder) => {
        const handleFetchSuccess = (state, action) => {
            state.loading = false;
            state.complaints = action.payload.complaints;
            state.totalPages = action.payload.totalPages;
            state.currentPage = action.payload.currentPage;
            state.totalComplaints = action.payload.totalComplaints;
        };
        const handleAddUpdateSuccess = (state, action) => {
            state.loading = false;
            const updatedComplaint = action.payload;
            const index = state.complaints.findIndex(
                (complaint) => complaint._id === updatedComplaint._id
            );
            if (index !== -1) {
                state.complaints[index] = updatedComplaint;
            } else {
                state.complaints.push(updatedComplaint);
            }
        };

        const handlePending = (state) => {
            state.loading = true;
            state.error = null;
        };
        const handleRejected = (state, action) => {
            state.loading = false;
            state.error = action.payload;
        };

        // Add your extra reducers as in the original code
        builder
            .addCase(fetchComplaints.pending, handlePending)
            .addCase(fetchComplaints.fulfilled, handleFetchSuccess)
            .addCase(fetchComplaints.rejected, handleRejected)
            .addCase(addComplaint.pending, handlePending)
            .addCase(addComplaint.fulfilled, handleAddUpdateSuccess)
            .addCase(addComplaint.rejected, handleRejected)
            .addCase(updateComplaint.pending, handlePending)
            .addCase(updateComplaint.fulfilled, handleAddUpdateSuccess)
            .addCase(updateComplaint.rejected, handleRejected)
            .addCase(assignComplaint.pending, handlePending)
            .addCase(assignComplaint.fulfilled, handleAddUpdateSuccess)
            .addCase(assignComplaint.rejected, handleRejected)
            .addCase(submitComplaintFeedback.pending, handlePending)
            .addCase(submitComplaintFeedback.fulfilled, handleAddUpdateSuccess)
            .addCase(submitComplaintFeedback.rejected, handleRejected)
            .addCase(deleteComplaint.pending, handlePending)
            .addCase(deleteComplaint.fulfilled, (state, action) => {
                state.loading = false;
                state.complaints = state.complaints.filter(
                    (complaint) => complaint._id !== action.payload
                );
                state.error = null;
            })
            .addCase(deleteComplaint.rejected, handleRejected)
            .addCase(fetchAssignedComplaints.pending, handlePending)
            .addCase(fetchAssignedComplaints.fulfilled, handleFetchSuccess)
            .addCase(fetchAssignedComplaints.rejected, handleRejected)
            .addCase(fetchUnassignedComplaints.pending, handlePending)
            .addCase(fetchUnassignedComplaints.fulfilled, handleFetchSuccess)
            .addCase(fetchUnassignedComplaints.rejected, handleRejected);
    },
});

export const { reset } = ComplaintSlice.actions; // Export the reset action
export default ComplaintSlice.reducer;
