import { createSlice } from "@reduxjs/toolkit";
import { fetchAgreements, addAgreement, updateAgreement, deleteAgreement } from "../actions/AgreementActions";

const initialState = {
  agreements: [],
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
  selectedAgreement: null,
  expandedRows: {}, // Track expanded rows
};

const agreementSlice = createSlice({
  name: "agreement",
  initialState,
  reducers: {
    setSelectedAgreement: (state, action) => {
      state.selectedAgreement = action.payload;
    },
    clearSelectedAgreement: (state) => {
      state.selectedAgreement = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    toggleExpandedRow: (state, action) => {
      const id = action.payload;
      state.expandedRows[id] = !state.expandedRows[id];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAgreements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgreements.fulfilled, (state, action) => {
        state.loading = false;
        state.agreements = action.payload.agreements;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchAgreements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch agreements";
      })
      .addCase(addAgreement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAgreement.fulfilled, (state, action) => {
        state.loading = false;
        state.agreements = [...state.agreements, action.payload];
      })
      .addCase(addAgreement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to add agreement";
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
        state.error = action.payload?.message || "Failed to update agreement";
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
        state.error = action.payload?.message || "Failed to delete agreement";
      });
  },
});

export const {
  setSelectedAgreement,
  clearSelectedAgreement,
  clearError,
  toggleExpandedRow,
} = agreementSlice.actions;

export const selectExpandedRows = (state) => state.agreement.expandedRows;
export default agreementSlice.reducer;
