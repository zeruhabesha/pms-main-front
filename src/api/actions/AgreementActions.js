import { createAsyncThunk } from "@reduxjs/toolkit";
import AgreementService from "../services/agreement.service";

export const fetchAgreements = createAsyncThunk(
  "agreement/fetchAgreements",
  async ({ page = 1, limit = 5, searchTerm = "" }, { rejectWithValue }) => {
    try {
      const response = await AgreementService.fetchAgreements(page, limit, searchTerm);
      if (!response || typeof response.totalPages !== "number" || !Array.isArray(response.leases)) {
        throw new Error("Invalid API response structure");
      }
      return {
        agreements: response.leases,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
      };
    } catch (error) {
      console.error("Fetch agreements failed:", error.message);
      return rejectWithValue(error.message || "Failed to fetch agreements");
    }
  }
);

export const addAgreement = createAsyncThunk(
  "agreement/addAgreement",
  async (agreementData, { rejectWithValue }) => {
    try {
      const response = await AgreementService.addAgreement(agreementData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to add agreement");
    }
  }
);

export const updateAgreement = createAsyncThunk(
  "agreement/updateAgreement",
  async ({ id, agreementData }, { rejectWithValue }) => {
    try {
      const response = await AgreementService.updateAgreement(id, agreementData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update agreement");
    }
  }
);

export const deleteAgreement = createAsyncThunk(
  "agreement/deleteAgreement",
  async (id, { rejectWithValue }) => {
    try {
      await AgreementService.deleteAgreement(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to delete agreement");
    }
  }
);
