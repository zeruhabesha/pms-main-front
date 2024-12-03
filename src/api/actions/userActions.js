import { createAsyncThunk } from '@reduxjs/toolkit';
import UserService from '../services/user.service';

export const fetchUsers = createAsyncThunk(
  'user/fetchUsers',
  async ({ page, limit, search }, { rejectWithValue }) => {
    try {
      return await UserService.fetchUsers(page, limit, search);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

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
