import { createSlice } from '@reduxjs/toolkit';
import {
    fetchClearances,
    addClearance,
    updateClearance,
    deleteClearance,
    approveClearance,
    inspectClearance,
    rejectClearance,
    fetchInspectedClearances,
    fetchUninspectedClearances,
} from '../actions/ClearanceAction';

const initialState = {
    clearances: [],
    loading: false,
    error: null,
    totalPages: 1,
    currentPage: 1,
    totalClearances: 0,
};

const handleFetchSuccess = (state, action) => {
    state.loading = false;
    state.error = null;
    if (action.payload) {
        state.clearances = action.payload.clearances || [];
        state.totalPages = action.payload.totalPages || 1;
        state.currentPage = action.payload.currentPage || 1;
        state.totalClearances = action.payload.totalClearances || 0;
    }
};

const handleAddUpdateSuccess = (state, action) => {
    state.loading = false;
    state.error = null;
    if (action.payload) {
        const updatedClearance = action.payload;
        const index = state.clearances.findIndex(
            (clearance) => clearance._id === updatedClearance._id
        );
        if (index !== -1) {
            state.clearances[index] = updatedClearance;
        } else {
            state.clearances.unshift(updatedClearance);
        }
    }
};

const handlePending = (state) => {
    state.loading = true;
    state.error = null;
};

const handleRejected = (state, action) => {
    state.loading = false;
    state.error = action.payload || 'An error occurred';
};

const clearanceSlice = createSlice({
    name: 'clearance',
    initialState: {
        clearances: [],
        loading: false,
        error: null,
        selectedClearance: null, // Add this to track the selected clearance
        totalPages: 1,
        currentPage: 1,
        totalClearances: 0,
    },
    reducers: {
        reset: (state) => {
            return initialState;
        },
        clearError: (state) => {
            state.error = null;
        },
        setSelectedClearance: (state, action) => {
            state.selectedClearance = action.payload;
        },
    },
    extraReducers: (builder) => {
        const handleFetchSuccess = (state, action) => {
            state.loading = false;
            state.error = null;
            if (action.payload) {
                state.clearances = action.payload.clearances || [];
                state.totalPages = action.payload.totalPages || 1;
                state.currentPage = action.payload.currentPage || 1;
                state.totalClearances = action.payload.totalClearances || 0;
            }
        };

        const handleAddUpdateSuccess = (state, action) => {
            state.loading = false;
            state.error = null;
            if (action.payload) {
                const updatedClearance = action.payload;
                const index = state.clearances.findIndex(
                    (clearance) => clearance._id === updatedClearance._id
                );
                if (index !== -1) {
                    state.clearances[index] = updatedClearance;
                } else {
                    state.clearances.unshift(updatedClearance);
                }
            }
        };

        const handlePending = (state) => {
            state.loading = true;
            state.error = null;
        };

        const handleRejected = (state, action) => {
            state.loading = false;
            state.error = action.payload || 'An error occurred';
        };

        builder
            .addCase(fetchClearances.pending, handlePending)
            .addCase(fetchClearances.fulfilled, handleFetchSuccess)
            .addCase(fetchClearances.rejected, handleRejected)
            .addCase(addClearance.pending, handlePending)
            .addCase(addClearance.fulfilled, handleAddUpdateSuccess)
            .addCase(addClearance.rejected, handleRejected)
            .addCase(updateClearance.pending, handlePending)
            .addCase(updateClearance.fulfilled, handleAddUpdateSuccess)
            .addCase(updateClearance.rejected, handleRejected);
    },
});

export const { reset, clearError, setSelectedClearance } = clearanceSlice.actions;
export default clearanceSlice.reducer;


