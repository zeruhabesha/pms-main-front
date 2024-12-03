import { createSlice } from '@reduxjs/toolkit';
import { fetchAdmins, addAdmin, updateAdmin, uploadAdminPhoto, deleteAdmin } from '../actions/AdminActions';


const initialState = {
  admins: [],
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
  selectedAdmin: null,
};
// const initialState = {
//   admins: [],
//   loading: false,
//   error: null,
//   totalPages: 1,
//   currentPage: 1,
// };

const AdminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Admins
      .addCase(fetchAdmins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdmins.fulfilled, (state, action) => {
        state.loading = false;
        state.admins = action.payload.admins;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchAdmins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      // Add  Admin
      .addCase(addAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.admins.push(action.payload);
      })
      .addCase(addAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdmin.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.admins.findIndex(
          (admin) => admin._id === action.payload._id
        );
        if (index !== -1) {
          state.admins[index] = action.payload;
        }
      })
      .addCase(updateAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Upload Photo
      .addCase(uploadAdminPhoto.fulfilled, (state, action) => {
        const { id, photoUrl } = action.payload;
        const admin = state.admins.find((admin) => admin._id === id);
        if (admin) {
          admin.photoUrl = photoUrl;
        }
      })
      .addCase(uploadAdminPhoto.rejected, (state, action) => {
        state.error = action.payload || 'Failed to upload photo';
      })

      // Delete  Admin
      .addCase(deleteAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.admins = state.admins.filter(
          (admin) => admin._id !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An error occurred';
      });
  },
});

export const { resetState, setSelectedAdmin, clearError } = AdminSlice.actions;
export default AdminSlice.reducer;