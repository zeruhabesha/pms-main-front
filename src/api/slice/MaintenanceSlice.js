import { createSlice } from '@reduxjs/toolkit';
import {
  fetchMaintenance,
  addMaintenance,
  updateMaintenance,
  deleteMaintenance,
} from '../actions/MaintenanceActions';

const initialState = {
  maintenanceRequests: [], // Updated field
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
  totalMaintenanceRequests: 0, // Total count from the response
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
        state.loading = false;
        state.maintenanceRequests = action.payload.maintenanceRequests;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalMaintenanceRequests = action.payload.totalMaintenanceRequests;
        state.error = null;
      })
      .addCase(fetchMaintenance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.maintenanceRequests = [];
      })
      .addCase(addMaintenance.fulfilled, (state, action) => {
        state.maintenanceRequests = [action.payload, ...state.maintenanceRequests];
        state.totalMaintenanceRequests += 1;
      })
      .addCase(updateMaintenance.fulfilled, (state, action) => {
        const index = state.maintenanceRequests.findIndex(
          (request) => request._id === action.payload._id
        );
        if (index !== -1) {
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
