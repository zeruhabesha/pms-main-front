// GuestActions.js
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
      console.log("GuestActions - createGuest: Guest Data:", guestData);  // Debugging line
      const response = await guestService.createGuest(guestData);
      console.log("GuestActions - createGuest: API Response:", response);
      return response; // return guest data
    } catch (error) {
        console.error("GuestActions - createGuest: Thunk Error:", error);
      throw new GuestError(error.message, error.response?.status || 500, error);
    }
  }
);

export const addGuest = createAsyncThunk(
    'guest/addGuest',
    async (guestData, thunkAPI) => {
        try {
            console.log("GuestActions - addGuest: Guest Data:", guestData);
            const response = await guestService.createGuest(guestData);
            console.log("GuestActions - addGuest: API Response:", response);
            return response;
        } catch (error) {
            console.error("GuestActions - addGuest: Thunk Error:", error);
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
      console.log("GuestActions - fetchGuests: Params:", { page, limit, search, status });
      const response = await guestService.fetchGuests({ page, limit, search, status });
      console.log("GuestActions - fetchGuests: API Response:", response);
      console.log("GuestActions - fetchGuests: API Response:", response.data.data);
      console.log("GuestActions - fetchGuests: API Response:", response.data);

      return response;
    } catch (error) {
      console.error("GuestActions - fetchGuests: Thunk Error:", error);
      throw new GuestError(error.message, error.response?.status || 500, error); //Consistent error handling
    }
  }
);

export const fetchGuestById = createAsyncThunk(
  "guest/fetchGuestById",
  async (id, thunkAPI) => {
    try {
        console.log("GuestActions - fetchGuestById: Guest ID:", id);
      const response = await guestService.fetchGuestById(id);
        console.log("GuestActions - fetchGuestById: API Response:", response);
      return response.data; //This line right here
    } catch (error) {
        console.error("GuestActions - fetchGuestById: Thunk Error:", error);
      throw new GuestError(error.message, error.response?.status || 500, error);
    }
  }
);

export const updateGuest = createAsyncThunk(
  "guest/updateGuest",
  async ({ id, guestData }, thunkAPI) => {
    try {
        console.log("GuestActions - updateGuest: Guest ID:", id, "Data:", guestData);
      const response = await guestService.updateGuest(id, guestData);
        console.log("GuestActions - updateGuest: API Response:", response);
      return response;
    } catch (error) {
        console.error("GuestActions - updateGuest: Thunk Error:", error);
      throw new GuestError(error.message, error.response?.status || 500, error);
    }
  }
);

export const deleteGuest = createAsyncThunk(
  "guest/deleteGuest",
  async (id, thunkAPI) => {
    try {
        console.log("GuestActions - deleteGuest: Guest ID:", id);
      const response = await guestService.deleteGuest(id);
      console.log("GuestActions - deleteGuest: API Response:", response);
      return response;
    } catch (error) {
        console.error("GuestActions - deleteGuest: Thunk Error:", error);
      throw new GuestError(error.message, error.response?.status || 500, error);
    }
  }
);

export const getGuestsByRegisteredBy = createAsyncThunk(
  "guest/getGuestsByRegisteredBy",
  async ({ registeredBy, page = 1, limit = 10, search = "" }, thunkAPI) => {
    try {
        console.log("GuestActions - getGuestsByRegisteredBy: RegisteredBy:", registeredBy, "Params:", { page, limit, search });
      const response = await guestService.getGuestsByRegisteredBy(registeredBy, { page, limit, search });
        console.log("GuestActions - getGuestsByRegisteredBy: API Response:", response);
      return response;
    } catch (error) {
        console.error("GuestActions - getGuestsByRegisteredBy: Thunk Error:", error);
      throw new GuestError(error.message, error.response?.status || 500, error);
    }
  }
);