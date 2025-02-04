import { createAsyncThunk } from '@reduxjs/toolkit'
import MaintenanceService from '../services/maintenance.service'

// Fetch maintenance records
export const fetchMaintenances = createAsyncThunk(
  'maintenance/fetchMaintenances',
  async ({ page = 1, limit = 10, searchTerm = '' }, { rejectWithValue }) => {
    try {
      const data = await MaintenanceService.fetchMaintenances(page, limit, searchTerm)
      return { data, success: true }
    } catch (error) {
      return rejectWithValue(error)
    }
  },
)

// Add maintenance record
export const addMaintenance = createAsyncThunk(
  'maintenance/add',
  async (maintenanceData, { rejectWithValue }) => {
    try {
      console.log('Action: Sending maintenance request...')
      const response = await MaintenanceService.addMaintenance(maintenanceData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      console.log('Action: Received response:', response)

      if (!response) {
        throw new Error('Invalid response format')
      }
      return response
    } catch (error) {
      console.error('Action: Error occurred:', error)
      return rejectWithValue({
        message: error.message || 'Failed to create maintenance request',
      })
    }
  },
)

// Update maintenance record
export const updateMaintenance = createAsyncThunk(
  'maintenance/update',
  async ({ id, maintenanceData }, { rejectWithValue }) => {
    try {
      console.log('Action: Sending update request...')
      const response = await MaintenanceService.updateMaintenance(id, maintenanceData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      console.log('Action: Received response:', response)
      if (!response) {
        throw new Error('Invalid response format')
      }
      return response
    } catch (error) {
      console.error('Action: Error occurred:', error)
      return rejectWithValue({
        message: error.message || 'Failed to update maintenance',
      })
    }
  },
)

export const fetchMaintenanceById = createAsyncThunk(
  'maintenance/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await MaintenanceService.fetchMaintenanceById(id) // Fetch the maintenance by ID
      return response.data // Ensure the backend returns the data correctly
    } catch (error) {
      console.error('Error fetching maintenance by ID:', error)
      return rejectWithValue(
        error.response?.data || { message: 'Failed to fetch maintenance details' },
      )
    }
  },
)
// Delete maintenance record
export const deleteMaintenance = createAsyncThunk(
  'maintenance/delete',
  async (id, { rejectWithValue }) => {
    try {
      return await MaintenanceService.deleteMaintenance(id)
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete maintenance')
    }
  },
)
