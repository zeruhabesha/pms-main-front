import { createSlice } from '@reduxjs/toolkit';
import { fetchMaintenance, addMaintenance, updateMaintenance, deleteMaintenance } from '../actions/MaintenanceActions';

const initialState = {
  maintenanceRequests: [],
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
  totalMaintenanceRequests: 0,
};

const maintenanceSlice = createSlice({
  name: 'maintenance',
  initialState,
  reducers: {
    resetState: (state) => {
      state.maintenanceRequests = [];
      state.loading = false;
      state.error = null;
      state.totalPages = 1;
      state.currentPage = 1;
      state.totalMaintenanceRequests = 0;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Maintenance Requests
      .addCase(fetchMaintenance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMaintenance.fulfilled, (state, action) => {
        const { maintenanceRequests, totalPages, currentPage, totalRequests } = action.payload;
        state.loading = false;
        state.maintenanceRequests = maintenanceRequests;
        state.totalPages = totalPages;
        state.currentPage = currentPage;
        state.totalMaintenanceRequests = totalRequests;
      })
      .addCase(fetchMaintenance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch maintenance requests';
      })
      // Add Maintenance Request
      .addCase(addMaintenance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMaintenance.fulfilled, (state, action) => {
        state.loading = false;
        state.maintenanceRequests.unshift(action.payload);
        state.totalMaintenanceRequests += 1;
      })
      .addCase(addMaintenance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Maintenance Request
      .addCase(updateMaintenance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMaintenance.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.maintenanceRequests.findIndex(
          (request) => request._id === action.payload._id
        );
        if (index >= 0) {
          state.maintenanceRequests[index] = action.payload;
        }
      })
      .addCase(updateMaintenance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Maintenance Request
      .addCase(deleteMaintenance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMaintenance.fulfilled, (state, action) => {
        state.loading = false;
        state.maintenanceRequests = state.maintenanceRequests.filter(
          (request) => request._id !== action.payload
        );
        state.totalMaintenanceRequests -= 1;
      })
      .addCase(deleteMaintenance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete maintenance request';
      });
  },
});

export const { resetState, clearError } = maintenanceSlice.actions;
export default maintenanceSlice.reducer;