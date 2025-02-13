import { createSlice } from '@reduxjs/toolkit'
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
  fetchClearanceById, // Import the new thunk
} from '../actions/ClearanceAction'

const initialState = {
  clearances: [],
  loading: false,
  error: null,
  selectedClearance: null,
  totalPages: 1,
  currentPage: 1,
  totalClearances: 0,
}

const handleFetchSuccess = (state, action) => {
  state.loading = false
  state.error = null
  state.clearances = action.payload.clearances || [] // Update clearances array
  state.totalPages = action.payload.totalPages || 1
  state.currentPage = action.payload.currentPage || 1
  state.totalClearances = action.payload.totalClearances || 0
}

const handleAddUpdateSuccess = (state, action) => {
  state.loading = false
  state.error = null
  if (action.payload) {
    const updatedClearance = action.payload.data
    const index = state.clearances.findIndex((clearance) => clearance._id === updatedClearance._id)
    if (index !== -1) {
      state.clearances[index] = updatedClearance
    } else {
      state.clearances.unshift(updatedClearance)
    }
  }
}

const handlePending = (state) => {
  state.loading = true
  state.error = null
}

const handleRejected = (state, action) => {
  state.loading = false
  state.error = action.payload?.message || 'An error occurred'
}

const clearanceSlice = createSlice({
  name: 'clearance',
  initialState,
  reducers: {
    reset: () => {
      return initialState
    },
    clearError: (state) => {
      state.error = null
    },
    setSelectedClearance: (state, action) => {
      state.selectedClearance = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClearances.pending, handlePending)
      .addCase(fetchClearances.fulfilled, handleFetchSuccess)
      .addCase(fetchClearances.rejected, handleRejected)
      .addCase(fetchClearanceById.pending, handlePending)
      .addCase(fetchClearanceById.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.selectedClearance = action.payload.data
      })
      .addCase(fetchClearanceById.rejected, handleRejected)
      .addCase(fetchInspectedClearances.pending, handlePending)
      .addCase(fetchInspectedClearances.fulfilled, handleFetchSuccess)
      .addCase(fetchInspectedClearances.rejected, handleRejected)
      .addCase(fetchUninspectedClearances.pending, handlePending)
      .addCase(fetchUninspectedClearances.fulfilled, handleFetchSuccess)
      .addCase(fetchUninspectedClearances.rejected, handleRejected)
      .addCase(addClearance.pending, handlePending)
      .addCase(addClearance.fulfilled, handleAddUpdateSuccess)
      .addCase(addClearance.rejected, handleRejected)
      .addCase(updateClearance.pending, handlePending)
      .addCase(updateClearance.fulfilled, handleAddUpdateSuccess)
      .addCase(updateClearance.rejected, handleRejected)
      .addCase(approveClearance.pending, handlePending)
      .addCase(approveClearance.fulfilled, handleAddUpdateSuccess)
      .addCase(approveClearance.rejected, handleRejected)
      .addCase(inspectClearance.pending, handlePending)
      .addCase(inspectClearance.fulfilled, handleAddUpdateSuccess)
      .addCase(inspectClearance.rejected, handleRejected)
      .addCase(rejectClearance.pending, handlePending)
      .addCase(rejectClearance.fulfilled, handleAddUpdateSuccess)
      .addCase(rejectClearance.rejected, handleRejected)
      .addCase(deleteClearance.pending, handlePending)
      .addCase(deleteClearance.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.clearances = state.clearances.filter(
          (clearance) => clearance._id !== action.payload, // action.payload is now the id
        )
      })
      .addCase(deleteClearance.rejected, handleRejected)
  },
})

export const { reset, clearError, setSelectedClearance } = clearanceSlice.actions
export default clearanceSlice.reducer
