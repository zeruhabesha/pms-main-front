import { createSlice } from '@reduxjs/toolkit';
import { fetchSuperAdmins, addSuperAdmin, updateSuperAdmin, uploadSuperAdminPhoto, deleteSuperAdmin } from '../actions/superAdminActions';


const initialState = {
  superAdmins: [],
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
  selectedSuperAdmin: null,
};

const superAdminSlice = createSlice({
  name: 'superAdmin',
  initialState,
  reducers: {
    resetState: () => initialState,
    setSelectedSuperAdmin: (state, action) => {
      state.selectedSuperAdmin = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Super Admins
      .addCase(fetchSuperAdmins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuperAdmins.fulfilled, (state, action) => {
        state.superAdmins = action.payload.users;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.loading = false;
      })
      .addCase(fetchSuperAdmins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch super admins';
      })

      // Add Super Admin
      .addCase(addSuperAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSuperAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.superAdmins.push(action.payload);
      })
      .addCase(addSuperAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  

      // Update Super Admin case in the extraReducers
      .addCase(updateSuperAdmin.fulfilled, (state, action) => {
        state.loading = false;
        // Find the index of the updated admin
        const index = state.superAdmins.findIndex(admin => admin._id === action.payload._id);
        
        if (index !== -1) {
          // Replace the old entry with the new data
          state.superAdmins[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateSuperAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An error occurred';
      })

      // Upload Photo
      .addCase(uploadSuperAdminPhoto.fulfilled, (state, action) => {
        const { id, photoUrl } = action.payload;
        const admin = state.superAdmins.find((admin) => admin._id === id);
        if (admin) {
          admin.photoUrl = photoUrl;
        }
      })
      .addCase(uploadSuperAdminPhoto.rejected, (state, action) => {
        state.error = action.payload || 'Failed to upload photo';
      })

      // Delete Super Admin
      .addCase(deleteSuperAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSuperAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.superAdmins = state.superAdmins.filter(
          (admin) => admin._id !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteSuperAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An error occurred';
      });
  },
});

export const { resetState, setSelectedSuperAdmin, clearError } = superAdminSlice.actions;
export default superAdminSlice.reducer;