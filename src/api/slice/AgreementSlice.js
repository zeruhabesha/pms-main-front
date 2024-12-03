import { createSlice } from "@reduxjs/toolkit";
import { fetchAgreements, addAgreement, updateAgreement, deleteAgreement } from "../actions/AgreementActions";

const initialState = {
  agreements: [],
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
};

const AgreementSlice = createSlice({
  name: "agreement",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAgreements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgreements.fulfilled, (state, action) => {
        state.loading = false;
        state.agreements = action.payload.agreements || [];
        state.totalPages = action.payload.totalPages || 1;
        state.currentPage = action.payload.currentPage || 1;
      })
      .addCase(fetchAgreements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch agreements";
      })
      .addCase(addAgreement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAgreement.fulfilled, (state, action) => {
        state.loading = false;
        state.agreements.push(action.payload);
      })
      .addCase(addAgreement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateAgreement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAgreement.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.agreements.findIndex(
          (agreement) => agreement._id === action.payload._id
        );
        if (index !== -1) {
          state.agreements[index] = action.payload;
        }
      })
      .addCase(updateAgreement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteAgreement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAgreement.fulfilled, (state, action) => {
        state.loading = false;
        state.agreements = state.agreements.filter(
          (agreement) => agreement._id !== action.payload
        );
      })
      .addCase(deleteAgreement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default AgreementSlice.reducer;
