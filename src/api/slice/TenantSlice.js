import { createSlice } from "@reduxjs/toolkit";
import {
  fetchTenants,
  addTenant,
  updateTenant,
  deleteTenant,
  uploadTenantPhoto
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
        state.error = action.payload || "Failed to fetch tenants";
      })
      // Handle other actions like addTenant, updateTenant, etc.
      .addCase(addTenant.pending, (state) => {
        state.loading = true;
      })
      .addCase(addTenant.fulfilled, (state, action) => {
        state.loading = false;
        state.tenants.push(action.payload);
      })
      .addCase(addTenant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { resetState, setSelectedTenant, clearError } = tenantSlice.actions;
export { fetchTenants };
export default tenantSlice.reducer;