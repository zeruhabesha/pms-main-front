import { createAsyncThunk } from '@reduxjs/toolkit';
import authServices from '../services/auth.services';

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
      const response = await authServices.login(credentials);
      console.log('Full Login API Response:', response);

      if (response?.data?.status === 'success') {
          const { token, refreshToken, user } = response.data?.data || {};
          
          if (!token || !user) {
              throw new Error('Invalid login response: token or user is missing');
          }

          return {
              token,
              refreshToken,
              user,
              status: user.status,
              success: true
          };
      } else {
          return rejectWithValue({
              message: response?.data?.message || 'Login failed. Please check your credentials.'
          });
      }
  } catch (error) {
      return rejectWithValue({
          message: error.response?.data?.message || 'An error occurred during login'
      });
  }
});


export const checkStatus = createAsyncThunk(
  'auth/checkStatus',
  async (email, { rejectWithValue }) => {
    try {
      const response = await authServices.checkStatus(email);
      console.log('Response:', response);

      // Validate the server response
      if (!response || !response) {
        throw new Error('Server did not return data');
      }

      // Check for errors in the server response
      if (response.status === 'error') {
        throw new Error(response.error || response.message || 'An error occurred');
      }

      // Extract and validate the status
      const status = response.data?.status;
      if (!status) {
        throw new Error('Invalid response format: Missing status');
      }

      return status; // Return the status
    } catch (error) {
      console.error('Check Status Error:', error);

      // Handle errors and return meaningful messages
      return rejectWithValue(
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        'Failed to check status'
      );
    }
  }
);




export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (resetData, { rejectWithValue }) => {
    try {
      const response = await authServices.resetPassword(resetData);
      return response.data;
    } catch (error) {
      console.error('Reset Password Error:', error.response ? error.response.data : error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to reset password');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await authServices.logout();
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('maintenances_data');
  return true;
});

export const decryptData = (encryptedData) => {
  try {
    if (!encryptedData) return null; // Crucial check
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    if (bytes.toString() === '') {
      return null; // Handle empty string or invalid decryption
    }
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    console.error('Decryption error:', error);
    return null; // Important: Return null on failure
  }
};