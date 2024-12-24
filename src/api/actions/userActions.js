import { createAsyncThunk } from '@reduxjs/toolkit';
import UserService from '../services/user.service';

// Fetch Users
export const fetchUsers = createAsyncThunk(
  'user/fetchUsers',
  async ({ page, limit, searchTerm }, { rejectWithValue }) => {
    try {
        const { users, totalPages, currentPage, totalUsers } = await UserService.fetchUsers(page, limit, searchTerm);
      return { users, totalPages, currentPage,  totalUsers };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch Inspectors
export const fetchInspectors = createAsyncThunk(
  'user/fetchInspectors',
  async ({ page, limit, searchTerm }, { rejectWithValue }) => {
    try {
      const { inspectors, totalPages, currentPage, totalInspectors } = await UserService.fetchInspector(page, limit, searchTerm);
      return { inspectors, totalPages, currentPage, totalInspectors };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch Maintainers
export const fetchMaintainers = createAsyncThunk(
  'user/fetchMaintainers',
  async ({ page, limit, searchTerm }, { rejectWithValue }) => {
    try {
      const { maintainers, totalPages, currentPage, totalMaintainers } = await UserService.fetchMaintenance(page, limit, searchTerm);
      return { maintainers, totalPages, currentPage, totalMaintainers };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Add User
export const addUser = createAsyncThunk(
  'user/add',
  async (userData, { rejectWithValue }) => {
    try {
      return await UserService.addUser(userData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update User
export const updateUser = createAsyncThunk(
  'user/update',
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      return await UserService.updateUser(id, userData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Upload User Photo
export const uploadUserPhoto = createAsyncThunk(
  'user/uploadPhoto',
  async ({ id, photo }, { rejectWithValue }) => {
    try {
      const photoUrl = await UserService.uploadUserPhoto(id, photo);
      return { id, photoUrl };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update User Permissions
export const updateUserPermissions = createAsyncThunk(
  'user/updatePermissions',
  async ({ userId, permissions }, { rejectWithValue }) => {
    try {
      return await UserService.updatePermissions(userId, permissions);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete User
export const deleteUser = createAsyncThunk(
  'user/delete',
  async (id, { rejectWithValue }) => {
    try {
      await UserService.deleteUser(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);