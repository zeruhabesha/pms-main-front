// frontend/src/api/actions/userActions.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import UserService from '../services/user.service';

// Fetch Users
export const fetchUsers = createAsyncThunk(
    'user/fetchUsers',
    async ({ page, limit, searchTerm }, { rejectWithValue }) => {
        try {
            const { users, totalPages, currentPage, totalUsers } = await UserService.fetchUsers(page, limit, searchTerm);
            return { users, totalPages, currentPage, totalUsers };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Fetch Inspectors
export const fetchInspectors = createAsyncThunk(
    'user/fetchInspectors',
    async (_, { rejectWithValue }) => {
        try {
            const response = await UserService.fetchInspector();
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch inspectors');
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
            // Validate role before sending
            const validRoles = ['Admin', 'Inspector', 'Maintainer', 'User'];
            const formattedRole = userData.role.charAt(0).toUpperCase() + userData.role.slice(1);

            if (!validRoles.includes(formattedRole)) {
                throw new Error(`Invalid role. Must be one of: ${validRoles.join(', ')}`);
            }

            const formattedUserData = {
                ...userData,
                role: formattedRole
            };

            const response = await UserService.addUser(formattedUserData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || {
                message: error.message,
                error: error.toString()
            });
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

// Forgot Password Action
export const forgotPassword = createAsyncThunk( // Add forgotPassword async thunk action in userActions
    'user/forgotPassword',
    async ({ email }, { rejectWithValue }) => {
        try {
            const response = await UserService.forgotPassword(email); // Use UserService for forgotPassword
            if (response?.status === 'success') {
                return response; // Return the successful response data
            } else {
                return rejectWithValue({ message: response?.message || 'Failed to send reset password link.' });
            }
        } catch (error) {
            return rejectWithValue({ message: error.message || 'An error occurred while requesting password reset' });
        }
    }
);