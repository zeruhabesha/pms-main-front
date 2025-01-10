import { createSlice } from '@reduxjs/toolkit';
import {
    fetchUsers,
    fetchInspectors,
    fetchMaintainers,
    addUser,
    updateUser,
    uploadUserPhoto,
    deleteUser,
    updateUserPermissions,
} from '../actions/userActions';

const initialState = {
    users: [],
    inspectors: [],
    maintainers: [],
    loading: false,
    error: null,
    totalPages: 1,
    currentPage: 1,
    totalUsers: 0,
    totalInspectors: 0,
    totalMaintainers:0,
    selectedUser: null,
    role: 'user',
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        resetState: () => initialState,
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Users
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                 state.users = action.payload.users;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
                state.totalUsers = action.payload.totalUsers
                state.role = 'user';
                state.loading = false;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch users';
            })

            // Fetch Inspectors
            .addCase(fetchInspectors.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchInspectors.fulfilled, (state, action) => {
                state.inspectors = action.payload.inspectors;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
                state.totalInspectors = action.payload.totalInspectors
                 state.role = 'inspector';
                state.loading = false;
            })
            .addCase(fetchInspectors.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch inspectors';
            })

            // Fetch Maintainers
            .addCase(fetchMaintainers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMaintainers.fulfilled, (state, action) => {
                state.maintainers = action.payload.maintainers;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
                state.totalMaintainers = action.payload.totalMaintainers;
                state.role = 'maintainer';
                state.loading = false;
            })
            .addCase(fetchMaintainers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch maintainers';
            })

            // Add User
            .addCase(addUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.users = [action.payload, ...state.users];
                } else {
                    state.error = 'Failed to add user: No data returned';
                }
            })
            .addCase(addUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to add user';
            })

            // Update User
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.users.findIndex((user) => user._id === action.payload._id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Upload Photo
            .addCase(uploadUserPhoto.pending, (state) => {
                state.error = null;
            })
            .addCase(uploadUserPhoto.fulfilled, (state, action) => {
                const { id, photoUrl } = action.payload;
                const user = state.users.find((user) => user._id === id);
                if (user) {
                    user.photoUrl = photoUrl;
                }
            })
            .addCase(uploadUserPhoto.rejected, (state, action) => {
                state.error = action.payload;
            })

            // Delete User
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users = state.users.filter((user) => user._id !== action.payload);
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update Permissions
            .addCase(updateUserPermissions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserPermissions.fulfilled, (state, action) => {
                state.loading = false;
                const updatedUser = action.payload;
                 // Update all user lists after permission update
                let index = state.users.findIndex((user) => user._id === updatedUser._id);
                if(index !== -1) state.users[index] = updatedUser;

                index = state.inspectors.findIndex(user => user._id === updatedUser._id);
                 if(index !== -1) state.inspectors[index] = updatedUser;


                 index = state.maintainers.findIndex(user => user._id === updatedUser._id);
                 if(index !== -1) state.maintainers[index] = updatedUser;
            })
            .addCase(updateUserPermissions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to update permissions';
            });
    },
});

export const { resetState, setSelectedUser, clearError } = userSlice.actions;
export default userSlice.reducer;