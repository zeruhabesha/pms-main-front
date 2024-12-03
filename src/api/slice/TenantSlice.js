import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTenants, addTenant, updateTenant, deleteTenant  } from '../actions/TenantActions';
import { uploadUserPhoto  } from '../actions/userActions';

// Initial state
const initialState = {
  tenants: [],
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
  totalTenants: 0,
  selectedTenant: null,
  lastUpdated: null
};

// Slice
const tenantSlice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {
    setSelectedTenant: (state, action) => {
      state.selectedTenant = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetTenantState: () => initialState,
    clearSelectedTenant: (state) => {
      state.selectedTenant = null;
    }
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
        state.tenants = action.payload.tenants;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalTenants = action.payload.totalTenants;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchTenants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.tenants = [];
      })

      // Add Tenant
      .addCase(addTenant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTenant.fulfilled, (state, action) => {
        state.loading = false;
        state.tenants = [action.payload, ...state.tenants]; // Add new tenant
        state.totalTenants += 1; // Update total tenants count
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(addTenant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add tenant";
      })
      // Update Tenant
      .addCase(updateTenant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTenant.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tenants.findIndex(
          (tenant) => tenant.id === action.payload.id
        );
        if (index !== -1) {
          state.tenants[index] = {
            ...state.tenants[index],
            ...action.payload,
          };
        }
        state.lastUpdated = new Date().toISOString();
        state.error = null;
        if (state.selectedTenant?.id === action.payload.id) {
          state.selectedTenant = {
            ...state.selectedTenant,
            ...action.payload,
          };
        }
      })
      .addCase(updateTenant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update tenant";
      })

      // Delete Tenant
      .addCase(deleteTenant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTenant.fulfilled, (state, action) => {
        state.loading = false;
        state.tenants = state.tenants.filter(
          (tenant) => tenant.id !== action.payload
        );
        state.totalTenants -= 1;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
        if (state.selectedTenant?.id === action.payload) {
          state.selectedTenant = null;
        }
      })
      .addCase(deleteTenant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(uploadUserPhoto.pending, (state) => {
        state.error = null;
      })
      .addCase(uploadUserPhoto.fulfilled, (state, action) => {
        const { id, photoUrl } = action.payload;
        const user = state.users.find((user) => user._id === id);
        if (user) {
          user.photoUrl = photoUrl;
        }
      })
      .addCase(uploadUserPhoto.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

// Export actions
export const {
  setSelectedTenant,
  clearError,
  resetTenantState,
  clearSelectedTenant
} = tenantSlice.actions;

// Export selectors
export const selectAllTenants = (state) => state.tenant.tenants;
export const selectTenantById = (state, tenantId) =>
  state.tenant.tenants.find((tenant) => tenant.id === tenantId);
export const selectTenantLoading = (state) => state.tenant.loading;
export const selectTenantError = (state) => state.tenant.error;
export const selectSelectedTenant = (state) => state.tenant.selectedTenant;
export const selectTenantPagination = (state) => ({
  currentPage: state.tenant.currentPage,
  totalPages: state.tenant.totalPages,
  totalTenants: state.tenant.totalTenants
});

// Export reducer
export default tenantSlice.reducer;