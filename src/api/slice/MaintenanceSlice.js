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
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMaintenance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMaintenance.fulfilled, (state, action) => {
        const { maintenanceRequests, totalPages, currentPage, totalMaintenanceRequests } = action.payload;
        state.loading = false;
        state.maintenanceRequests = maintenanceRequests;
        state.totalPages = totalPages;
        state.currentPage = currentPage;
        state.totalMaintenanceRequests = totalMaintenanceRequests;
      })
      .addCase(fetchMaintenance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addMaintenance.fulfilled, (state, action) => {
        state.maintenanceRequests.unshift(action.payload);
        state.totalMaintenanceRequests += 1;
      })
      .addCase(updateMaintenance.fulfilled, (state, action) => {
        const index = state.maintenanceRequests.findIndex(
          (request) => request._id === action.payload._id
        );
        if (index >= 0) {
          state.maintenanceRequests[index] = action.payload;
        }
      })
      .addCase(deleteMaintenance.fulfilled, (state, action) => {
        state.maintenanceRequests = state.maintenanceRequests.filter(
          (request) => request._id !== action.payload
        );
        state.totalMaintenanceRequests -= 1;
      });
  },
});

export const { clearError } = maintenanceSlice.actions;
export default maintenanceSlice.reducer;
