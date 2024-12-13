import { createSlice } from "@reduxjs/toolkit";
import {
  fetchTenants,
  addTenant,
  updateTenant,
  deleteTenant,
  uploadTenantPhoto,
} from "../actions/TenantActions";

const initialState = {
  tenants: [],
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
  totalTenants: 0,
  selectedTenant: null,
};

const tenantSlice = createSlice({
  name: "tenant",
  initialState,
  reducers: {
    resetState: (state) => {
      return { ...initialState };
    },
    setSelectedTenant: (state, action) => {
      state.selectedTenant = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tenants
      .addCase(fetchTenants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTenants.fulfilled, (state, action) => {
        state.loading = false;
        state.tenants = action.payload.tenants || [];
        state.totalPages = action.payload.totalPages || 1;
        state.currentPage = action.payload.currentPage || 1;
        state.totalTenants = action.payload.totalTenants || 0;
      })
      .addCase(fetchTenants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch tenants";
      })

      // Add Tenant
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

      // Update Tenant
      .addCase(updateTenant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTenant.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tenants.findIndex((tenant) => tenant.id === action.payload.id);
        if (index !== -1) {
          state.tenants[index] = action.payload;
        }
      })
      .addCase(updateTenant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update tenant";
      })

      // Delete Tenant
      .addCase(deleteTenant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTenant.fulfilled, (state, action) => {
        state.loading = false;
        state.tenants = state.tenants.filter((tenant) => tenant.id !== action.payload);
      })
      .addCase(deleteTenant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete tenant";
      })

      // Upload Tenant Photo
      .addCase(uploadTenantPhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadTenantPhoto.fulfilled, (state, action) => {
        state.loading = false;
        const { id, photoUrl } = action.payload;
        const tenant = state.tenants.find((tenant) => tenant.id === id);
        if (tenant) {
          tenant.photo = photoUrl; // Assuming `photo` is the field where the photo URL is stored
        }
      })
      .addCase(uploadTenantPhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to upload tenant photo";
      });
  },
});

export const { resetState, setSelectedTenant, clearError } = tenantSlice.actions;
export { fetchTenants }; // Ensure fetchTenants is exported for external usage
export default tenantSlice.reducer;
