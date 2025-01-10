import { createAsyncThunk } from "@reduxjs/toolkit";
import guestService from "../services/guestService";

export const createGuest = createAsyncThunk(
  "guest/createGuest",
  async (guestData, thunkAPI) => {
    try {
      return await guestService.createGuest(guestData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchAllGuests = createAsyncThunk(
  "guest/fetchAllGuests",
  async (_, thunkAPI) => {
    try {
      return await guestService.fetchAllGuests();
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchGuestById = createAsyncThunk(
  "guest/fetchGuestById",
  async (id, thunkAPI) => {
    try {
      return await guestService.fetchGuestById(id);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateGuest = createAsyncThunk(
  "guest/updateGuest",
  async ({ id, guestData }, thunkAPI) => {
    try {
      return await guestService.updateGuest(id, guestData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteGuest = createAsyncThunk(
  "guest/deleteGuest",
  async (id, thunkAPI) => {
    try {
      return await guestService.deleteGuest(id);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const getGuestsByRegisteredBy = createAsyncThunk(
  "guest/getGuestsByRegisteredBy",
  async (registeredBy, thunkAPI) => {
    try {
      return await guestService.getGuestsByRegisteredBy(registeredBy);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);