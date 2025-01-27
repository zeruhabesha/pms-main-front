import { createSlice } from '@reduxjs/toolkit';
import { login, logout, resetPassword, checkStatus } from '../actions/authActions';
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
    showResetForm: false,
    showPasswordInput: false,
    userStatus: null, // Store user status
    
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
        logoutSync(state) {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            state.userStatus = null;
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
        }

      },
      extraReducers: (builder) => {
          builder
          .addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.showResetForm = false;
            state.showPasswordInput = false;
            state.userStatus = null;
        })
        .addCase(login.fulfilled, (state, action) => {
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.refreshToken = action.payload.refreshToken;
          state.loading = false;
          state.userStatus = action.payload.user.status;
          state.showResetForm = false;
          state.showPasswordInput = false;
          
          // Store encrypted data in localStorage
          localStorage.setItem('token', encryptData(action.payload.token));
          localStorage.setItem('refreshToken', encryptData(action.payload.refreshToken));
          localStorage.setItem('user', encryptData(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'An error occurred during login';
        state.showResetForm = false;
        state.showPasswordInput = false;
        state.userStatus = null;
        
        // Clear localStorage on login failure
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    })
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
                 state.error = action.payload;
                  state.showPasswordInput = false;
            })
            // .addCase(login.fulfilled, (state, action) => {
            //   const { token, user, status, success } = action.payload;
            //   if (success) {
            //     state.error = message || 'Login failed. Please check your credentials';
            //     state.userStatus = status; //Store user status
            //   } else {
            //       state.isAuthenticated = true;
            //       state.user = user;
            //       state.token = token;
            //       state.loading = false;
            //       state.userStatus = status;
            //       localStorage.setItem('token', encryptData(token)); // Encrypt before storing
            //       localStorage.setItem('user', encryptData(user)); // Encrypt before storing
            //     }
            // })
            .addCase(checkStatus.fulfilled, (state, action) => {
              state.userStatus = action.payload;
            });

    },
});

export const { logoutSync, clearError, setShowPasswordInput, clearUserStatus } = authSlice.actions;
export default authSlice.reducer;