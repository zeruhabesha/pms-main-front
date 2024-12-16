import { createSlice } from '@reduxjs/toolkit';
import { fetchMaintenances, addMaintenance, updateMaintenance, deleteMaintenance } from '../actions/MaintenanceActions';

const initialState = {
  maintenances: [], // Changed from maintenanceRequests to match usage
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
  totalMaintenances: 0, // Changed from totalMaintenanceRequests to match usage
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
      // Fetch Maintenance Requests
      .addCase(fetchMaintenances.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMaintenances.fulfilled, (state, action) => {
        const { data } = action.payload;
        state.maintenances = data.maintenances || [];
        state.totalPages = data.totalPages || 1;
        state.currentPage = data.currentPage || 1;
        state.totalMaintenances = data.totalRequests || 0;
        state.loading = false;
      })
      .addCase(fetchMaintenances.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch maintenances';
      })
      // Add Maintenance Request
      .addCase(addMaintenance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMaintenance.fulfilled, (state, action) => {
        state.loading = false;
        state.maintenances.unshift(action.payload.data);
        state.totalMaintenances += 1;
      })
      .addCase(addMaintenance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      // Update Maintenance Request
      .addCase(updateMaintenance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMaintenance.fulfilled, (state, action) => {
        state.loading = false;
        const updatedMaintenance = action.payload.data;
        const index = state.maintenances.findIndex(
          (maintenance) => maintenance._id === updatedMaintenance._id
        );
        if (index !== -1) {
          state.maintenances[index] = updatedMaintenance;
        }
      })
      .addCase(updateMaintenance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      // Delete Maintenance Request
      .addCase(deleteMaintenance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMaintenance.fulfilled, (state, action) => {
        state.loading = false;
        state.maintenances = state.maintenances.filter(
          (maintenance) => maintenance._id !== action.payload.id
        );
        state.totalMaintenances -= 1;
      })
      .addCase(deleteMaintenance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      });
  },
});

export const { resetState, clearError } = maintenanceSlice.actions;
export default maintenanceSlice.reducer;