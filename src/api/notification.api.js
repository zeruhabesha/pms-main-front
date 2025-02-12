import axios from 'axios';
import httpCommon from './http-common';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://pms-backend-sncw.onrender.com/api/v1/';

export const getUnreadNotifications = async (userId) => {
  try {
    const response = await httpCommon.get(`/notifications/unread/${userId}`);
    return response.data; // Expected format: { dashboard: 1, maintenance: 2, complaint: 3 }
  } catch (error) {
    console.error('Error fetching unread notifications:', error);
    return {};
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await httpCommon.patch(`/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return null;
  }
};

export const markAllNotificationsAsRead = async (userId) => {
  try {
    const response = await httpCommon.patch(`/notifications/${userId}/read-all`);
    return response.data;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return null;
  }
};

export const deleteNotification = async (notificationId) => {
  try {
    const response = await httpCommon.delete(`/notifications/${notificationId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting notification:', error);
    return null;
  }
};
