import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async action to fetch reports
export const fetchReports = createAsyncThunk(
  'report/fetchReports',
  async ({ startDate, endDate }, thunkAPI) => {
    try {
      const response = await fetch(`/api/reports?start=${startDate}&end=${endDate}`);
      const data = await response.json();
      return data; // Expected data: { maintenanceData, leaseData, tenantData }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Slice
const reportSlice = createSlice({
  name: 'report',
  initialState: {
    maintenanceData: [],
    leaseData: [],
    tenantData: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearReports: (state) => {
      state.maintenanceData = [];
      state.leaseData = [];
      state.tenantData = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false;
        state.maintenanceData = action.payload.maintenanceData;
        state.leaseData = action.payload.leaseData;
        state.tenantData = action.payload.tenantData;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearReports } = reportSlice.actions;
export default reportSlice.reducer;
