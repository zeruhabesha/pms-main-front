// authActions.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import authServices from '../services/auth.services';

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await authServices.login(credentials);
    console.log('Full Login API Response:', response);

    const { token, user } = response.data?.data || {};

    if (!token || !user) {
      throw new Error('Invalid login response: token or user is missing');
    }

    return { token, user };
  } catch (error) {
    console.error('Login Error:', error.response ? error.response.data : error.message);
    return rejectWithValue(error.response?.data?.message || 'Failed to login');
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  await authServices.logout();
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  return true;
});