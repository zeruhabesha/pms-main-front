import { createSlice } from '@reduxjs/toolkit';
import {
    createGuest,
    fetchGuests,
    fetchGuestById,
    updateGuest,
    deleteGuest,
    getGuestsByRegisteredBy,
} from '../actions/guestActions';

const initialState = {
    guests: [],
    guestDetails: null,
    loading: false,
    error: null,
    totalPages: 1,
    currentPage: 1,
    totalGuests: 0,
    message: null,
};

const guestSlice = createSlice({
    name: 'guest',
    initialState,
    reducers: {
        setSelectedGuest: (state, action) => {
            state.guestDetails = action.payload;
        },
        clearError: (state) => {
            state.error = null;
            state.message = null;
        },
        reset: (state) => {
            state.loading = false;
            state.error = null;
            state.message = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createGuest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createGuest.fulfilled, (state, action) => {
                state.loading = false;
               // state.guests.push(action.payload.guest);
                state.totalGuests = state.totalGuests + 1;
            })
            .addCase(createGuest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.message = action.error;
            })
            .addCase(fetchGuests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGuests.fulfilled, (state, action) => {
                state.loading = false;
                state.guests = action.payload.data.guests;
                state.totalGuests = action.payload.data.totalGuests;
                state.totalPages = action.payload.data.totalPages;
                state.currentPage = action.payload.data.currentPage;
            })
            .addCase(fetchGuests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.message = action.error;
            })
            .addCase(fetchGuestById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGuestById.fulfilled, (state, action) => {
                state.loading = false;
                state.guestDetails = action.payload.guest;
            })
            .addCase(fetchGuestById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.message = action.error;
            })
            .addCase(updateGuest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateGuest.fulfilled, (state, action) => {
                state.loading = false;
                const updatedGuest = action.payload.guest;
                state.guests = state.guests.map((guest) =>
                    guest._id === updatedGuest._id ? updatedGuest : guest
                );
            })
            .addCase(updateGuest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.message = action.error;
            })
            .addCase(deleteGuest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteGuest.fulfilled, (state, action) => {
                state.loading = false;
                state.guests = state.guests.filter(
                    (guest) => guest._id !== action.payload.guest._id
                );
                state.totalGuests = state.totalGuests - 1;
            })
            .addCase(deleteGuest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.message = action.error;
            })
            .addCase(getGuestsByRegisteredBy.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getGuestsByRegisteredBy.fulfilled, (state, action) => {
                state.loading = false;
                state.guests = action.payload.guests;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(getGuestsByRegisteredBy.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.message = action.error;
            });
    },
});

export const { setSelectedGuest, clearError, reset } = guestSlice.actions;
export default guestSlice.reducer;