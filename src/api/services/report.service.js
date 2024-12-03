// report.service.js
import axios from 'axios';

// API base URL
const API_URL = 'http://localhost:4000/api/v1';

export const fetchMaintenanceReport = async (startDate, endDate) => {
  try {
    const response = await axios.get(`${API_URL}/maintenances/report`, {
      params: { startDate, endDate },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching maintenance report:', error);
    throw error;
  }
};

export const fetchLeaseReport = async (startDate, endDate) => {
  try {
    const response = await axios.get(`${API_URL}/lease/report`, {
      params: { startDate, endDate },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching lease report:', error);
    throw error;
  }
};

export const fetchTenantReport = async (startDate, endDate) => {
  try {
    const response = await axios.get(`${API_URL}/tenants/report`, {
      params: { startDate, endDate },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching tenant report:', error);
    throw error;
  }
};
