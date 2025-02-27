import { createSlice } from '@reduxjs/toolkit';
import {
    fetchMaintenances,
    addMaintenance,
    updateMaintenance,
    deleteMaintenance,
    fetchMaintenanceById,
    fetchMaintenanceStatusCounts,  // Import the new action
} from '../actions/MaintenanceActions'; // Ensure all required actions are imported

const initialState = {
    maintenances: [],
    maintenanceDetails: null, // For fetching a single maintenance by ID
    loading: false,
    error: null,
    totalPages: 1,
    currentPage: 1,
    totalMaintenances: 0,
    statusCounts: {},//NEW Initialize statusCounts in the initial state
};

const maintenanceSlice = createSlice({
    name: 'maintenance',
    initialState,
    reducers: {
        resetState: () => initialState,
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch All Maintenances
            .addCase(fetchMaintenances.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMaintenances.fulfilled, (state, action) => {
                const { data } = action.payload;
                state.maintenances = data?.maintenanceRequests || [];
                state.totalPages = data?.totalPages || 1;
                state.currentPage = data?.currentPage || 1;
                state.totalMaintenances = data?.totalRequests || 0;
                state.loading = false;
            })
            .addCase(fetchMaintenances.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch maintenances';
            })
            // Fetch Maintenance Status Counts
            .addCase(fetchMaintenanceStatusCounts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMaintenanceStatusCounts.fulfilled, (state, action) => {
                state.loading = false;
                state.statusCounts = action.payload.data;  // Access the 'data' property from the payload
            })
            .addCase(fetchMaintenanceStatusCounts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch maintenance status counts';
            })

            // Fetch Single Maintenance
            .addCase(fetchMaintenanceById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMaintenanceById.fulfilled, (state, action) => {
                state.loading = false;
                state.maintenanceDetails = action.payload?.data || null;
            })
            .addCase(fetchMaintenanceById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch maintenance details';
            })

            // Add Maintenance
            .addCase(addMaintenance.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addMaintenance.fulfilled, (state, action) => {
                state.loading = false;
                state.maintenances.unshift(action.payload);
                state.totalMaintenances += 1;
            })
            .addCase(addMaintenance.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to add maintenance';
            })

            // Update Maintenance
            .addCase(updateMaintenance.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // In maintenanceSlice.js or relevant reducer
            .addCase(updateMaintenance.fulfilled, (state, action) => {
                state.loading = false;
                const updatedMaintenance = action.payload;
                const index = state.maintenances.findIndex(
                    (maintenance) => maintenance._id === updatedMaintenance._id
                );
                if (index !== -1) {
                    state.maintenances[index] = {
                        ...state.maintenances[index],
                        ...updatedMaintenance,
                        expense: updatedMaintenance.expense, // Ensure expense object is properly updated
                        totalExpenses: updatedMaintenance.totalExpenses,
                        status: updatedMaintenance.status,
                        estimatedCompletionTime: updatedMaintenance.estimatedCompletionTime
                    };
                }
            })
            .addCase(updateMaintenance.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to update maintenance';
            })

            // Delete Maintenance
            .addCase(deleteMaintenance.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteMaintenance.fulfilled, (state, action) => {
                state.loading = false;
                state.maintenances = state.maintenances.filter(
                    (maintenance) => maintenance._id !== action.payload,
                );
                state.totalMaintenances -= 1;
            })
            .addCase(deleteMaintenance.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to delete maintenance';
            });
    },
});

export const { resetState, clearError } = maintenanceSlice.actions;
export default maintenanceSlice.reducer;