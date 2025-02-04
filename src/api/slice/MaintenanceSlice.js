import { createSlice } from '@reduxjs/toolkit'
import {
  fetchMaintenances,
  addMaintenance,
  updateMaintenance,
  deleteMaintenance,
  fetchMaintenanceById,
} from '../actions/MaintenanceActions' // Ensure all required actions are imported

const initialState = {
  maintenances: [],
  maintenanceDetails: null, // For fetching a single maintenance by ID
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
  totalMaintenances: 0,
}

const maintenanceSlice = createSlice({
  name: 'maintenance',
  initialState,
  reducers: {
    resetState: () => initialState,
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Maintenances
      .addCase(fetchMaintenances.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMaintenances.fulfilled, (state, action) => {
        const { data } = action.payload
        state.maintenances = data?.maintenanceRequests || []
        state.totalPages = data?.totalPages || 1
        state.currentPage = data?.currentPage || 1
        state.totalMaintenances = data?.totalRequests || 0
        state.loading = false
      })
      .addCase(fetchMaintenances.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to fetch maintenances'
      })

      // Fetch Single Maintenance
      .addCase(fetchMaintenanceById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMaintenanceById.fulfilled, (state, action) => {
        state.loading = false
        state.maintenanceDetails = action.payload?.data || null
      })
      .addCase(fetchMaintenanceById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to fetch maintenance details'
      })

      // Add Maintenance
      .addCase(addMaintenance.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addMaintenance.fulfilled, (state, action) => {
        state.loading = false
        state.maintenances.unshift(action.payload)
        state.totalMaintenances += 1
      })
      .addCase(addMaintenance.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to add maintenance'
      })

      // Update Maintenance
      .addCase(updateMaintenance.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateMaintenance.fulfilled, (state, action) => {
        state.loading = false
        const updatedMaintenance = action.payload
        const index = state.maintenances.findIndex(
          (maintenance) => maintenance._id === updatedMaintenance._id,
        )
        if (index !== -1) {
          state.maintenances[index] = updatedMaintenance
        }
      })
      .addCase(updateMaintenance.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to update maintenance'
      })

      // Delete Maintenance
      .addCase(deleteMaintenance.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteMaintenance.fulfilled, (state, action) => {
        state.loading = false
        state.maintenances = state.maintenances.filter(
          (maintenance) => maintenance._id !== action.payload?.id,
        )
        state.totalMaintenances -= 1
      })
      .addCase(deleteMaintenance.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to delete maintenance'
      })
  },
})

export const { resetState, clearError } = maintenanceSlice.actions
export default maintenanceSlice.reducer
