import { createSlice } from '@reduxjs/toolkit';
import { login, logout, resetPassword, checkStatus } from '../actions/authActions';
import { encryptData, decryptData } from '../utils/crypto'; // Make sure this import is correct

const getDecryptedData = (key) => {
  const encryptedData = localStorage.getItem(key);
  return encryptedData ? decryptData(encryptedData) : null;
};

const initialState = {
  isAuthenticated: !!localStorage.getItem('token'),
  user: getDecryptedData('user'),
  token: getDecryptedData('token'),
  loading: false,
  error: null,
  showResetForm: false,
  showPasswordInput: false,
  userStatus: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutSync(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('maintenances_data');
    },
    clearError(state) {
      state.error = null;
    },
    setShowPasswordInput(state, action) {
      state.showPasswordInput = action.payload;
    },
    clearUserStatus(state) {
      state.userStatus = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.showResetForm = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.loading = false;
        state.showResetForm = false;
        state.showPasswordInput = false;
        localStorage.setItem('token', encryptData(action.payload.token)); // Encrypt before storing
        localStorage.setItem('user', encryptData(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to login';
        state.showResetForm = action.payload?.showResetForm || false;
        state.showPasswordInput = false;
      })
      .addCase(checkStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.userStatus = action.payload;
        state.showPasswordInput = action.payload === 'pending' || action.payload === 'active';
      })
      .addCase(checkStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to check status';
        state.showPasswordInput = false;
      })
      // .addCase(checkStatus.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      //   state.userStatus = null;
      //   state.showPasswordInput = false;
      // })
      // .addCase(checkStatus.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.userStatus = action.payload;
      //   if (action.payload === 'pending' || action.payload === 'active') {
      //     state.showPasswordInput = true;
      //   } else {
      //     state.showPasswordInput = false;
      //   }
      // })
      // .addCase(checkStatus.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload || 'Failed to check status';
      //   state.showPasswordInput = false;
      // })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.showResetForm = false;
        state.showPasswordInput = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to reset password';
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('maintenances_data');
      });
  },
});

export const { logoutSync, clearError, setShowPasswordInput, clearUserStatus } =
  authSlice.actions;
export default authSlice.reducer;