import { createSlice } from "@reduxjs/toolkit";
import {
    fetchAgreements,
    addAgreement,
    updateAgreement,
    deleteAgreement,
    uploadAgreementFile,
    fetchAgreement,
} from "../actions/AgreementActions";

const initialState = {
    agreements: [],
    loading: false,
    error: null,
    totalPages: 1,
    currentPage: 1,
    selectedAgreement: null,
    expandedRows: {},
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
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },
        toggleExpandedRow: (state, action) => {
            const id = action.payload;
            state.expandedRows[id] = !state.expandedRows[id];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAgreements.fulfilled, (state, action) => {
                state.loading = false;
                state.agreements = action.payload.agreements;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(fetchAgreement.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedAgreement = action.payload;
            })
            .addCase(addAgreement.fulfilled, (state, action) => {
                state.loading = false;
                state.agreements.unshift(action.payload);
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
            .addCase(deleteAgreement.fulfilled, (state, action) => {
                state.loading = false;
                state.agreements = state.agreements.filter(
                    (agreement) => agreement._id !== action.payload
                );
            })
            .addCase(uploadAgreementFile.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.agreements.findIndex(
                    (agreement) => agreement._id === action.payload._id
                );
                if (index !== -1) {
                    state.agreements[index] = {
                        ...state.agreements[index],
                        documents: action.payload.documents,
                    };
                }
            });

        // Common `pending` handler for all async actions
        builder.addMatcher(
            (action) => action.type.endsWith("/pending"),
            (state) => {
                state.loading = true;
                state.error = null;
            }
        );

        builder.addMatcher(
            (action) => action.type.endsWith("/rejected"),
            (state, action) => {
                state.loading = false;
                state.error = action.error?.message || "An unexpected error occurred";
            }
        );
    },
});

export const {
    setSelectedAgreement,
    clearSelectedAgreement,
    clearError,
    toggleExpandedRow,
    setCurrentPage,
} = agreementSlice.actions;

export const selectExpandedRows = (state) => state.agreement.expandedRows;
export default agreementSlice.reducer;
