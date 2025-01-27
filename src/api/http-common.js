// src/api/http-common.js
import axios from 'axios'
import { encryptData, decryptData } from './utils/crypto';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

const httpCommon = axios.create({
  baseURL,
});

// Utility functions for token management
const tokenManager = {
  getToken() {
    try {
      const encryptedToken = localStorage.getItem('token');
      if (!encryptedToken) return null;

      const token = decryptData(encryptedToken);
      if (!token) return null;

      // Validate token structure (very important)
      if (typeof token !== 'string' || !token.includes('.')) {
        throw new Error('Invalid token format');
      }

      const tokenData = JSON.parse(atob(token.split('.')[1]));
      if (!tokenData || tokenData.exp * 1000 < Date.now()) {
          this.clearTokens();
          return null;
      }

      return token;
    } catch (error) {
      console.error('Token retrieval error:', error);
      this.clearTokens();
      return null;
    }
  },

  getRefreshToken() {
    try {
      const encryptedRefreshToken = localStorage.getItem('refreshToken')
      if (!encryptedRefreshToken) return null
      return decryptData(encryptedRefreshToken)
    } catch (error) {
      console.error('Refresh token retrieval error:', error)
      return null
    }
  },

  setTokens(token, refreshToken) {
    if (token) {
      localStorage.setItem('token', encryptData(token))
    }
    if (refreshToken) {
      localStorage.setItem('refreshToken', encryptData(refreshToken))
    }
  },

  clearTokens() {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
  },
}

// Request interceptor
httpCommon.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken()
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor
httpCommon.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = tokenManager.getRefreshToken()
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        // Attempt to refresh the token
        const response = await axios.post(`${baseURL}/auth/refresh-token`, {
          refreshToken,
        })

        const { token: newToken, refreshToken: newRefreshToken } = response.data

        // Store new tokens
        tokenManager.setTokens(newToken, newRefreshToken)

        // Update the failed request's authorization header
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`

        // Retry the original request
        return httpCommon(originalRequest)
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect to login
        tokenManager.clearTokens()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error)
      // You might want to implement offline handling here
      return Promise.reject({
        message: 'Network error occurred. Please check your internet connection.',
        isNetworkError: true,
      })
    }

    return Promise.reject(error)
  },
)


// Add custom methods to handle common scenarios
httpCommon.setAuthTokens = (token, refreshToken) => {
  tokenManager.setTokens(token, refreshToken)
}

httpCommon.clearAuth = () => {
  tokenManager.clearTokens()
}

httpCommon.isAuthenticated = () => {
  return !!tokenManager.getToken()
}

export default httpCommon