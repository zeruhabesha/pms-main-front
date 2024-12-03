// ReportAction.js
import { fetchMaintenanceReport, fetchLeaseReport, fetchTenantReport } from '../services/report.service';

// Action types
const FETCH_REPORTS_SUCCESS = 'FETCH_REPORTS_SUCCESS';
const FETCH_REPORTS_FAILURE = 'FETCH_REPORTS_FAILURE';
const SET_LOADING = 'SET_LOADING';

// Action creators
export const fetchReports = (startDate, endDate) => async (dispatch) => {
    dispatch({ type: 'FETCH_REPORTS_REQUEST' });
    try {
      const response = await fetch(`/api/reports?start=${startDate}&end=${endDate}`);
      const data = await response.json();
      dispatch({
        type: 'FETCH_REPORTS_SUCCESS',
        payload: {
          maintenanceData: data.maintenanceData,
          leaseData: data.leaseData,
          tenantData: data.tenantData,
        },
      });
    } catch (error) {
      dispatch({
        type: 'FETCH_REPORTS_FAILURE',
        payload: { error: error.message },
      });
    }
  };
  

// Set loading state
export const setLoading = (loading) => ({
  type: SET_LOADING,
  payload: loading,
});
