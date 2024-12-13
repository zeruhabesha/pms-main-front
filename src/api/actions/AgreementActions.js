import { createAsyncThunk } from "@reduxjs/toolkit";
import AgreementService from "../services/agreement.service";

// Fetch agreements
export const fetchAgreements = createAsyncThunk(
  "agreement/fetchAgreements",
  async ({ page = 1, limit = 5, searchTerm = "" }, { rejectWithValue }) => {
    try {
      const response = await AgreementService.fetchAgreements(page, limit, searchTerm);
      console.log("Fetched Agreements Response:", response);

      return {
        agreements: response.agreements,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
      };
    } catch (error) {
      console.error("Fetch agreements error:", error.response || error.message);
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch agreements" }
      );
    }
  }
);

// Add agreement
export const addAgreement = createAsyncThunk(
  "agreement/addAgreement",
  async (agreementData, { rejectWithValue }) => {
    try {
      const response = await AgreementService.addAgreement(agreementData);
      console.log("Added Agreement Response:", response);

      return response;
    } catch (error) {
      console.error("Add agreement error:", error.response || error.message);
      return rejectWithValue(
        error.response?.data || { message: "Failed to add agreement" }
      );
    }
  }
);

// Update agreement
export const updateAgreement = createAsyncThunk(
  "agreement/updateAgreement",
  async ({ id, agreementData }, { rejectWithValue }) => {
    try {
      const response = await AgreementService.updateAgreement(id, agreementData);
      console.log("Updated Agreement Response:", response);

      return response;
    } catch (error) {
      console.error("Update agreement error:", error.response || error.message);
      return rejectWithValue(
        error.response?.data || { message: "Failed to update agreement" }
      );
    }
  }
);

// Delete agreement
export const deleteAgreement = createAsyncThunk(
  "agreement/deleteAgreement",
  async (id, { rejectWithValue }) => {
    try {
      await AgreementService.deleteAgreement(id);
      console.log("Deleted Agreement ID:", id);

      return id;
    } catch (error) {
      console.error("Delete agreement error:", error.response || error.message);
      return rejectWithValue(
        error.response?.data || { message: "Failed to delete agreement" }
      );
    }
  }
);

// Download agreement file
export const downloadAgreementFile = createAsyncThunk(
  "agreement/downloadAgreementFile",
  async (fileName, { rejectWithValue }) => {
    try {
      await AgreementService.downloadAgreementFile(fileName);
      console.log(`File ${fileName} downloaded successfully.`);
    } catch (error) {
      console.error("Download agreement file error:", error.response || error.message);
      return rejectWithValue(
        error.response?.data || { message: "Failed to download agreement file" }
      );
    }
  }
);
