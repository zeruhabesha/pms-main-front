// authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { login, logout } from '../actions/authActions';
import { encryptData, decryptData } from '../utils/crypto';

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
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.loading = false;

        // Store encrypted data
        localStorage.setItem('token', encryptData(action.payload.token));
        localStorage.setItem('user', encryptData(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to login';
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      });
  },
});

export const { logoutSync } = authSlice.actions;
export default authSlice.reducer;