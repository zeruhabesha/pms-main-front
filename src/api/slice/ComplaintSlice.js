// src/api/slice/ComplaintSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchComplaints, addComplaint, updateComplaint, deleteComplaint, assignComplaint, submitComplaintFeedback, fetchAssignedComplaints, fetchUnassignedComplaints } from '../actions/ComplaintAction';

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
    reducers: {},
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
            const index = state.complaints.findIndex((complaint) => complaint._id === updatedComplaint._id);
                if (index !== -1) {
                     state.complaints[index] = updatedComplaint;
                   } else {
                      state.complaints.push(updatedComplaint)
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
        // Fetch Complaints
        builder
            .addCase(fetchComplaints.pending, handlePending)
            .addCase(fetchComplaints.fulfilled, handleFetchSuccess)
            .addCase(fetchComplaints.rejected, handleRejected)
            // Add Complaint
            .addCase(addComplaint.pending, handlePending)
            .addCase(addComplaint.fulfilled, handleAddUpdateSuccess)
            .addCase(addComplaint.rejected, handleRejected)
            // Update Complaint
            .addCase(updateComplaint.pending, handlePending)
            .addCase(updateComplaint.fulfilled, handleAddUpdateSuccess)
            .addCase(updateComplaint.rejected, handleRejected)
            // Assign Complaint
            .addCase(assignComplaint.pending, handlePending)
            .addCase(assignComplaint.fulfilled, handleAddUpdateSuccess)
            .addCase(assignComplaint.rejected, handleRejected)
            // Submit Feedback
            .addCase(submitComplaintFeedback.pending, handlePending)
            .addCase(submitComplaintFeedback.fulfilled, handleAddUpdateSuccess)
            .addCase(submitComplaintFeedback.rejected, handleRejected)
            // Delete Complaint
            .addCase(deleteComplaint.pending, handlePending)
            .addCase(deleteComplaint.fulfilled, (state, action) => {
                state.loading = false;
                state.complaints = state.complaints.filter(
                    (complaint) => complaint._id !== action.payload
                );
                state.error = null;
            })
            .addCase(deleteComplaint.rejected, handleRejected)
            // Fetch Assigned Complaints
            .addCase(fetchAssignedComplaints.pending, handlePending)
            .addCase(fetchAssignedComplaints.fulfilled, handleFetchSuccess)
            .addCase(fetchAssignedComplaints.rejected, handleRejected)
            // Fetch Unassigned Complaints
            .addCase(fetchUnassignedComplaints.pending, handlePending)
            .addCase(fetchUnassignedComplaints.fulfilled, handleFetchSuccess)
            .addCase(fetchUnassignedComplaints.rejected, handleRejected);
    },
});

export default ComplaintSlice.reducer;