import { createSlice } from "@reduxjs/toolkit";
import {
    createGuest,
    fetchGuests,
    fetchGuestById,
    updateGuest,
    deleteGuest,
    getGuestsByRegisteredBy,
} from "../actions/guestActions";

const initialState = {
    guests: [],
    guestDetails: null,
    loading: false,
    error: null,
    message: "",
    totalPages: 1,
    currentPage: 1,
    selectedGuest: null,
};

const guestSlice = createSlice({
    name: "guest",
    initialState,
    reducers: {
        reset: (state) => {
            state.loading = false;
            state.error = null;
            state.message = "";
        },
        setSelectedGuest: (state, action) => {
            state.selectedGuest = action.payload;
        },
        clearError: (state) => {
            state.error = null;
            state.message = ""
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
                state.guests.push(action.payload);
            })
            .addCase(createGuest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchGuests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGuests.fulfilled, (state, action) => {
                state.loading = false;
                state.guests = action.payload.guests;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(fetchGuests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchGuestById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGuestById.fulfilled, (state, action) => {
                state.loading = false;
                state.guestDetails = action.payload;
            })
            .addCase(fetchGuestById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateGuest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateGuest.fulfilled, (state, action) => {
                state.loading = false;
                state.guests = state.guests.map((guest) =>
                    guest._id === action.payload._id ? action.payload : guest
                );
            })
            .addCase(updateGuest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteGuest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteGuest.fulfilled, (state, action) => {
                state.loading = false;
                state.guests = state.guests.filter(
                    (guest) => guest._id !== action.payload._id
                );
            })
            .addCase(deleteGuest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
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
                 state.error = action.payload;
            });
    },
});

export const { reset, clearError, setSelectedGuest } = guestSlice.actions;
export default guestSlice.reducer;