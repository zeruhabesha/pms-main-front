// tenantSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchTenants,
    addTenant,
    updateTenant,
  deleteTenant,
  uploadTenantPhoto,
  fetchTenantById,
    generateTenantReport
} from "../actions/TenantActions";

const initialState = {
  tenants: [],
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
  totalTenants: 0,
    selectedTenant: null,
    tenantDetails: null,  // Add this to store the details of a single tenant
  report:null,
  reportLoading: false
};

const tenantSlice = createSlice({
  name: "tenant",
  initialState,
  reducers: {
    resetState: (state) => {
      state.tenants = [];
      state.loading = false;
      state.error = null;
      state.totalPages = 1;
      state.currentPage = 1;
      state.totalTenants = 0;
        state.selectedTenant = null;
        state.tenantDetails = null
        state.report = null;
        state.reportLoading = false;
    },
      setSelectedTenant: (state, action) => {
          state.selectedTenant = action.payload;
           state.tenantDetails = state.tenants.find(tenant => tenant._id === action.payload) || null;
      },
    clearError: (state) => {
      state.error = null;
    },
  },
    extraReducers: (builder) => {
    builder
      .addCase(fetchTenants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTenants.fulfilled, (state, action) => {
        state.loading = false;
        state.tenants = action.payload.tenants;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalTenants = action.payload.totalTenants;
      })
      .addCase(fetchTenants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch tenants";
      })
        .addCase(fetchTenantById.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchTenantById.fulfilled, (state, action) => {
            state.loading = false;
            state.tenantDetails = action.payload;
        })
        .addCase(fetchTenantById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Failed to fetch tenant details";
        })
      // Handle other actions like addTenant, updateTenant, etc.
      .addCase(addTenant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTenant.fulfilled, (state, action) => {
        state.loading = false;
        state.tenants.push(action.payload);
      })
      .addCase(addTenant.rejected, (state, action) => {
        state.loading = false;
          state.error = action.payload?.message || "Failed to add tenant";
      })
        .addCase(updateTenant.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateTenant.fulfilled, (state, action) => {
            state.loading = false;
          const updatedTenant = action.payload;
            state.tenants = state.tenants.map(tenant => tenant._id === updatedTenant._id ? updatedTenant : tenant);
            state.tenantDetails = updatedTenant
        })
        .addCase(updateTenant.rejected, (state, action) => {
            state.loading = false;
           state.error = action.payload?.message || "Failed to update tenant";
        })
       .addCase(uploadTenantPhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
              // In tenantSlice.js
      .addCase(uploadTenantPhoto.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTenant = action.payload;
        state.tenants = state.tenants.map(tenant => 
            tenant._id === updatedTenant._id ? updatedTenant : tenant
        );
        if (state.tenantDetails?._id === updatedTenant._id) {
            state.tenantDetails = updatedTenant;
        }
      })
      .addCase(uploadTenantPhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to upload photo";
      })
        .addCase(deleteTenant.pending, (state) => {
          state.loading = true;
          state.error = null
      })
        .addCase(deleteTenant.fulfilled, (state, action) => {
            state.loading = false;
            state.tenants = state.tenants.filter((tenant) => tenant._id !== action.payload);
            state.selectedTenant = null;
        })
       .addCase(deleteTenant.rejected, (state, action) => {
            state.loading = false;
           state.error = action.payload?.message || "Failed to delete tenant";
      })
        .addCase(generateTenantReport.pending, (state) => {
            state.reportLoading = true;
            state.error = null
        })
        .addCase(generateTenantReport.fulfilled, (state, action) => {
            state.reportLoading = false;
            state.report = action.payload;
        })
       .addCase(generateTenantReport.rejected, (state, action) => {
          state.reportLoading = false;
          state.error = action.payload?.message || "Failed to generate report";
        })

  },
});

export const { resetState, setSelectedTenant, clearError } = tenantSlice.actions;
export { 
  fetchTenants, 
  fetchTenantById, 
  addTenant, // This was missing from exports
  updateTenant, 
  deleteTenant, 
  uploadTenantPhoto, 
  generateTenantReport 
};
export default tenantSlice.reducer;