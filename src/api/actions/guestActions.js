import { createAsyncThunk } from "@reduxjs/toolkit";
import guestService from "../services/guestService";

class GuestError extends Error {
  constructor(message, statusCode, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export const createGuest = createAsyncThunk(
  "guest/createGuest",
  async (guestData, thunkAPI) => {
    try {
      const response = await guestService.createGuest(guestData);
      return response;
    } catch (error) {
      //Handle errors consistently using GuestError
      if (error.response) {
        throw new GuestError(error.response.data.message || "Server error", error.response.status, error.response.data);
      } else {
        throw new GuestError("Network error", 0, error);
      }
    }
  }
);
export const addGuest = createAsyncThunk(
    'guest/addGuest',
    async (guestData, thunkAPI) => {
        try {
            const response = await guestService.createGuest(guestData);
            return response;
        } catch (error) {
            if (error.response) {
                throw new GuestError(error.response.data.message || "Server error", error.response.status, error.response.data);
            } else {
                throw new GuestError("Network error", 0, error);
            }
        }
    }
);

export const fetchGuests = createAsyncThunk(
  "guest/fetchGuests",
  async ({ page = 1, limit = 10, search = "", status = "" }, thunkAPI) => {
    try {
      const response = await guestService.fetchGuests({ page, limit, search, status });
      return response;
    } catch (error) {
      throw new GuestError(error.message, error.response?.status || 500, error); //Consistent error handling
    }
  }
);

export const fetchGuestById = createAsyncThunk(
  "guest/fetchGuestById",
  async (id, thunkAPI) => {
    try {
      const response = await guestService.fetchGuestById(id);
      return response;
    } catch (error) {
      throw new GuestError(error.message, error.response?.status || 500, error);
    }
  }
);

export const updateGuest = createAsyncThunk(
  "guest/updateGuest",
  async ({ id, guestData }, thunkAPI) => {
    try {
      const response = await guestService.updateGuest(id, guestData);
      return response;
    } catch (error) {
      throw new GuestError(error.message, error.response?.status || 500, error);
    }
  }
);

export const deleteGuest = createAsyncThunk(
  "guest/deleteGuest",
  async (id, thunkAPI) => {
    try {
      const response = await guestService.deleteGuest(id);
      return response;
    } catch (error) {
      throw new GuestError(error.message, error.response?.status || 500, error);
    }
  }
);

export const getGuestsByRegisteredBy = createAsyncThunk(
  "guest/getGuestsByRegisteredBy",
  async ({ registeredBy, page = 1, limit = 10, search = "" }, thunkAPI) => {
    try {
      const response = await guestService.getGuestsByRegisteredBy(registeredBy, { page, limit, search });
      return response;
    } catch (error) {
      throw new GuestError(error.message, error.response?.status || 500, error);
    }
  }
);