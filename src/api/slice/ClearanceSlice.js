import { createSlice } from '@reduxjs/toolkit';
import {
    fetchClearances,
    addClearance,
    updateClearance,
    deleteClearance,
    approveClearance,
    inspectClearance,
    rejectClearance,
    fetchInspectedClearances,
    fetchUninspectedClearances,
    fetchClearanceById
} from '../actions/ClearanceAction';

const initialState = {
    clearances: [],
    selectedClearance: null,
    loading: false,
    error: null,
    totalPages: 1,
    currentPage: 1,
    totalClearances: 0,
    message: null, // Add message for success/error notifications
};

const clearanceSlice = createSlice({
    name: 'clearance',
    initialState,
    reducers: {
        setSelectedClearance: (state, action) => {
            state.selectedClearance = action.payload;
        },
        clearError: (state) => {
            state.error = null;
            state.message = null;  // Also clear the message when clearing errors
        },
        reset: (state) => {
            return { ...initialState }; // Use spread operator to reset to initial state
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addClearance.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addClearance.fulfilled, (state, action) => {
                state.loading = false;
                // state.clearances.push(action.payload);  // Add new clearance
                state.totalClearances = state.totalClearances + 1;
                state.message = 'Clearance added successfully!'; // Set success message
            })
            .addCase(addClearance.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.message = action.error.message; // Also set error message
            })
            .addCase(fetchClearances.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchClearances.fulfilled, (state, action) => {
                state.loading = false;
                state.clearances = action.payload?.data?.clearances || [];
                state.totalPages = action.payload?.data?.totalPages || 1;
                state.currentPage = action.payload?.data?.currentPage || 1;
                state.totalClearances = action.payload?.data?.totalClearances || 0;
            })
            .addCase(fetchClearances.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.message = action.error.message; // Also set error message
            })
            .addCase(fetchClearanceById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchClearanceById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedClearance = action.payload?.data;
            })
            .addCase(fetchClearanceById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.message = action.error.message;
            })
            .addCase(updateClearance.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateClearance.fulfilled, (state, action) => {
                state.loading = false;
                const updatedClearance = action.payload;
                state.clearances = state.clearances.map((clearance) =>
                    clearance._id === updatedClearance._id ? updatedClearance : clearance
                );
                state.message = 'Clearance updated successfully!'; // Set success message
            })
            .addCase(updateClearance.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.message = action.error.message; // Also set error message
            })
            .addCase(deleteClearance.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteClearance.fulfilled, (state, action) => {
                state.loading = false;
                //const deletedId = action.payload?.data?.id; //Corrected this as well
                const deletedId = action.payload;
                state.clearances = state.clearances.filter(
                    (clearance) => clearance._id !== deletedId
                );
                state.totalClearances = state.totalClearances - 1;
                state.message = 'Clearance deleted successfully!'; // Set success message
            })
            .addCase(deleteClearance.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.message = action.error.message; // Also set error message
            })
            .addCase(approveClearance.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(approveClearance.fulfilled, (state, action) => {
                state.loading = false;
                const approvedClearance = action.payload;
                state.clearances = state.clearances.map((clearance) =>
                    clearance._id === approvedClearance._id ? approvedClearance : clearance
                );
                state.message = 'Clearance approved successfully!'; // Set success message
            })
            .addCase(approveClearance.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.message = action.error.message; // Also set error message
            })
            .addCase(inspectClearance.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(inspectClearance.fulfilled, (state, action) => {
                state.loading = false;
                const inspectedClearance = action.payload;
                state.clearances = state.clearances.map((clearance) =>
                    clearance._id === inspectedClearance._id ? inspectedClearance : clearance
                );
                state.message = 'Clearance inspected successfully!'; // Set success message
            })
            .addCase(inspectClearance.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.message = action.error.message; // Also set error message
            })
            .addCase(rejectClearance.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(rejectClearance.fulfilled, (state, action) => {
                state.loading = false;
                const rejectedClearance = action.payload;
                state.clearances = state.clearances.map((clearance) =>
                    clearance._id === rejectedClearance._id ? rejectedClearance : clearance
                );
                state.message = 'Clearance rejected successfully!'; // Set success message
            })
            .addCase(rejectClearance.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.message = action.error.message; // Also set error message
            })
            .addCase(fetchInspectedClearances.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchInspectedClearances.fulfilled, (state, action) => {
                state.loading = false;
                state.clearances = action.payload?.data?.clearances || [];
                state.totalPages = action.payload?.data?.totalPages || 1;
                state.currentPage = action.payload?.data?.currentPage || 1;
            })
            .addCase(fetchInspectedClearances.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.message = action.error.message; // Also set error message
            })
            .addCase(fetchUninspectedClearances.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUninspectedClearances.fulfilled, (state, action) => {
                state.loading = false;
                state.clearances = action.payload?.data?.clearances || [];
                state.totalPages = action.payload?.data?.totalPages || 1;
                state.currentPage = action.payload?.data?.currentPage || 1;
            })
            .addCase(fetchUninspectedClearances.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.message = action.error.message; // Also set error message
            });
        },
        });

export const { reset, clearError, setSelectedClearance } = clearanceSlice.actions;
export default clearanceSlice.reducer;