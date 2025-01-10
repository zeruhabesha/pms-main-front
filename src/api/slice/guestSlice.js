import { createSlice } from "@reduxjs/toolkit";
import {
  createGuest,
  fetchAllGuests,
  fetchGuestById,
  updateGuest,
  deleteGuest,
  getGuestsByRegisteredBy,
} from "../actions/guestActions";

const initialState = {
  guests: [],
  guest: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

const guestSlice = createSlice({
  name: "guest",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createGuest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createGuest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
         state.guests.push(action.payload);
      })
      .addCase(createGuest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(fetchAllGuests.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllGuests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.guests = action.payload;
      })
      .addCase(fetchAllGuests.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(fetchGuestById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchGuestById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.guest = action.payload;
      })
      .addCase(fetchGuestById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateGuest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateGuest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
         state.guests = state.guests.map((guest) =>
          guest._id === action.payload._id ? action.payload : guest
        );
      })
      .addCase(updateGuest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteGuest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteGuest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.guests = state.guests.filter(
          (guest) => guest._id !== action.payload._id
        );
      })
      .addCase(deleteGuest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
       .addCase(getGuestsByRegisteredBy.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getGuestsByRegisteredBy.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.guests = action.payload;
      })
      .addCase(getGuestsByRegisteredBy.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = guestSlice.actions;
export default guestSlice.reducer;