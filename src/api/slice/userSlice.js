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
    forgotPassword // import forgotPassword from userActions
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
    forgotPasswordSuccess: false, // Add state for forgot password success
    forgotPasswordError: null,    // Add state for forgot password error
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
            state.forgotPasswordError = null; // Also clear forgotPasswordError
        },
        resetForgotPasswordState: (state) => { // Add reset forgot password state reducer
            state.forgotPasswordSuccess = false;
            state.forgotPasswordError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Users
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.forgotPasswordSuccess = false; // Reset forgot password state
                state.forgotPasswordError = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                 state.users = action.payload.users;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
                state.totalUsers = action.payload.totalUsers
                state.role = 'user';
                state.loading = false;
                state.forgotPasswordSuccess = false; // Reset forgot password state
                state.forgotPasswordError = null;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch users';
                state.forgotPasswordSuccess = false; // Reset forgot password state
                state.forgotPasswordError = null;
            })

            // Fetch Inspectors
            .addCase(fetchInspectors.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.forgotPasswordSuccess = false; // Reset forgot password state
                state.forgotPasswordError = null;
            })
            .addCase(fetchInspectors.fulfilled, (state, action) => {
                state.inspectors = action.payload.inspectors;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
                state.totalInspectors = action.payload.totalInspectors
                 state.role = 'inspector';
                state.loading = false;
                state.forgotPasswordSuccess = false; // Reset forgot password state
                state.forgotPasswordError = null;
            })
            .addCase(fetchInspectors.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch inspectors';
                state.forgotPasswordSuccess = false; // Reset forgot password state
                state.forgotPasswordError = null;
            })

            // Fetch Maintainers
            .addCase(fetchMaintainers.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.forgotPasswordSuccess = false; // Reset forgot password state
                state.forgotPasswordError = null;
            })
            .addCase(fetchMaintainers.fulfilled, (state, action) => {
                state.maintainers = action.payload.maintainers;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
                state.totalMaintainers = action.payload.totalMaintainers;
                state.role = 'maintainer';
                state.loading = false;
                state.forgotPasswordSuccess = false; // Reset forgot password state
                state.forgotPasswordError = null;
            })
            .addCase(fetchMaintainers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch maintainers';
                state.forgotPasswordSuccess = false; // Reset forgot password state
                state.forgotPasswordError = null;
            })

            // Add User
            .addCase(addUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.forgotPasswordSuccess = false; // Reset forgot password state
                state.forgotPasswordError = null;
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    // Add user to appropriate list based on role
                    const newUser = action.payload;
                    switch (newUser.role) {
                        case 'Inspector':
                            state.inspectors = [newUser, ...state.inspectors];
                            break;
                        case 'Maintainer':
                            state.maintainers = [newUser, ...state.maintainers];
                            break;
                        default:
                            state.users = [newUser, ...state.users];
                    }
                }
                state.forgotPasswordSuccess = false; // Reset forgot password state
                state.forgotPasswordError = null;
            })
            .addCase(addUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to add user';
                state.forgotPasswordSuccess = false; // Reset forgot password state
                state.forgotPasswordError = null;
            })

            // Update User
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.forgotPasswordSuccess = false; // Reset forgot password state
                state.forgotPasswordError = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.users.findIndex((user) => user._id === action.payload._id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
                state.forgotPasswordSuccess = false; // Reset forgot password state
                state.forgotPasswordError = null;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.forgotPasswordSuccess = false; // Reset forgot password state
                state.forgotPasswordError = null;
            })

            // Upload Photo
            .addCase(uploadUserPhoto.pending, (state) => {
                state.error = null;
                state.forgotPasswordSuccess = false; // Reset forgot password state
                state.forgotPasswordError = null;
            })
            .addCase(uploadUserPhoto.fulfilled, (state, action) => {
                const { id, photoUrl } = action.payload;
                const user = state.users.find((user) => user._id === id);
                if (user) {
                    user.photoUrl = photoUrl;
                }
                state.forgotPasswordSuccess = false; // Reset forgot password state
                state.forgotPasswordError = null;
            })
            .addCase(uploadUserPhoto.rejected, (state, action) => {
                state.error = action.payload;
                state.forgotPasswordSuccess = false; // Reset forgot password state
                state.forgotPasswordError = null;
            })

            // Delete User
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.forgotPasswordSuccess = false; // Reset forgot password state
                state.forgotPasswordError = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users = state.users.filter((user) => user._id !== action.payload);
                state.forgotPasswordSuccess = false; // Reset forgot password state
                state.forgotPasswordError = null;
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.forgotPasswordSuccess = false; // Reset forgot password state
                state.forgotPasswordError = null;
            })

            // Update Permissions
            .addCase(updateUserPermissions.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.forgotPasswordSuccess = false; // Reset forgot password state
                state.forgotPasswordError = null;
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
                state.forgotPasswordSuccess = false; // Reset forgot password state
                state.forgotPasswordError = null;
            })
            .addCase(updateUserPermissions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to update permissions';
                state.forgotPasswordSuccess = false; // Reset forgot password state
                state.forgotPasswordError = null;
            })
            // Forgot Password Reducers in userSlice
            .addCase(forgotPassword.pending, (state) => {
                state.loading = true;
                state.forgotPasswordSuccess = false;
                state.forgotPasswordError = null;
                state.error = null; // Clear general error when starting forgot password in userSlice
            })
            .addCase(forgotPassword.fulfilled, (state) => {
                state.loading = false;
                state.forgotPasswordSuccess = true;
                state.forgotPasswordError = null;
                state.error = null; // Clear general error on forgot password success in userSlice
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.forgotPasswordSuccess = false;
                state.forgotPasswordError = action.payload?.message || 'Failed to send reset password link.';
                state.error = action.payload?.message || 'Failed to send reset password link.'; // Set general error as well in userSlice
            });
    },
});

export const { resetState, setSelectedUser, clearError, resetForgotPasswordState } = userSlice.actions;
export default userSlice.reducer;