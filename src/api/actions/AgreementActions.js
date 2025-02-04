import { createAsyncThunk } from "@reduxjs/toolkit";
import AgreementService from "../services/agreement.service";

// Fetch agreements
export const fetchAgreements = createAsyncThunk(
    "agreement/fetchAgreements",
    async ({ page = 1, limit = 10, searchTerm = "" }, { rejectWithValue }) => {
        try {
            const response = await AgreementService.fetchAgreements(page, limit, searchTerm);
             // Directly return the data expected by the slice
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Fetch a single agreement
export const fetchAgreement = createAsyncThunk(
    "agreement/fetchAgreement",
    async (id, { rejectWithValue }) => {
        try {
            const response = await AgreementService.fetchAgreement(id);
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Add agreement
export const addAgreement = createAsyncThunk(
    "agreement/addAgreement",
    async (agreementData, { rejectWithValue }) => {
        try {
            const response = await AgreementService.addAgreement(agreementData);
            console.log('ffjhgsjhgfjhgds',response);
           return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Update agreement
export const updateAgreement = createAsyncThunk(
    "agreement/updateAgreement",
    async ({ id, agreementData }, { rejectWithValue }) => {
        try {
            const response = await AgreementService.updateAgreement(id, agreementData);
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Delete agreement
export const deleteAgreement = createAsyncThunk(
    "agreement/deleteAgreement",
    async (id, { rejectWithValue }) => {
        try {
            await AgreementService.deleteAgreement(id);
             return id; // Return the id to the state so that we can update the ui
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Download agreement file
export const downloadAgreementFile = createAsyncThunk(
    "agreement/downloadAgreementFile",
    async (fileName, { rejectWithValue }) => {
        try {
            await AgreementService.downloadAgreementFile(fileName);
             return  fileName; // Return the file name so that we can update the state
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

//upload agreement file
export const uploadAgreementFile = createAsyncThunk(
    "agreement/uploadAgreementFile",
     async ({ id, file }, { rejectWithValue }) => {
        try {
            const response =  await AgreementService.uploadAgreementFile(id, file);
            return response;
        } catch (error) {
           return rejectWithValue(error.message);
        }
    }
);