import httpCommon from '../http-common'
import { encryptData, decryptData } from '../utils/crypto'

class MaintenanceService {
  constructor() {
    this.baseURL = `${httpCommon.defaults.baseURL}/maintenances`
  }

  getAuthHeader() {
    const encryptedToken = localStorage.getItem('token')
    if (!encryptedToken) {
      console.warn('No token found in local storage')
      return {}
    }
    const token = decryptData(encryptedToken)
    if (!token) {
      console.warn('Failed to decrypt token')
      return {}
    }
    return {
      Authorization: `Bearer ${token}`,
    }
  }

  async fetchMaintenances(page = 1, limit = 10, searchTerm = '') {
    try {
      const response = await httpCommon.get('/maintenances', {
        headers: this.getAuthHeader(),
        params: { page, limit, search: searchTerm },
      })

      const { data } = response
      console.log('Fetched maintenances:', data)
      console.log('Fetched maintenances data:', data?.data)

      if (data?.data) {
        localStorage.setItem(
          'maintenances_data',
          encryptData({
            timestamp: new Date().getTime(),
            maintenances: data.data, //Store the entire object containing array
          }),
        )
      }

      return data.data
    } catch (error) {
      return this.handleCachedData(error, 'maintenances_data', 'Fetching maintenances failed.')
    }
  }

  async addMaintenance(maintenanceData) {
    try {
      console.log('Service: Sending maintenance request...')

      if (!(maintenanceData instanceof FormData)) {
        throw new Error('Invalid data format: FormData expected')
      }

      const response = await httpCommon.post('/maintenances', maintenanceData, {
        headers: {
          ...this.getAuthHeader(),
          'Content-Type': 'multipart/form-data',
        },
      })

      console.log('Service: Received response:', response)

      if (!response.data) {
        throw new Error('Invalid response from server')
      }

      return response.data
    } catch (error) {
      console.error('Service: Error details:', error)

      // Extract error details
      const message = error.response?.data?.message || 'Failed to create maintenance request'
      throw new Error(message) // Throw a serializable error message
    }
  }

  async updateMaintenance(id, maintenanceData) {
    try {
      const formData = this.createFormData(maintenanceData)

      const response = await httpCommon.put(`/maintenances/${id}`, formData, {
        headers: {
          ...this.getAuthHeader(),
          'Content-Type': 'multipart/form-data',
        },
      })

      //   this.updateCachedMaintenance(id, response.data?.data)
      return response.data?.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async deleteMaintenance(id) {
    try {
      await httpCommon.delete(`/maintenances/${id}`, {
        headers: this.getAuthHeader(),
      })

      this.removeCachedMaintenance(id)
      return id
    } catch (error) {
      throw this.handleError(error)
    }
  }

  clearCache() {
    localStorage.removeItem('maintenances_data')
    console.log('Maintenance cache cleared')
  }

  createFormData(data) {
    const formData = new FormData()
    for (const key in data) {
      if (data[key] !== null && data[key] !== undefined) {
        if (key === 'requestedFiles' && Array.isArray(data[key])) {
          data[key].forEach((file) => formData.append(key, file))
        } else {
          formData.append(key, data[key])
        }
      }
    }
    return formData
  }

  async fetchMaintenanceById(id) {
    if (!id) {
      throw new Error('Maintenance ID is required')
    }

    try {
      const response = await httpCommon.get(`/maintenances/${id}`, {
        headers: this.getAuthHeader(),
      })

      console.log('Fetched maintenance details:', response.data)
      return response.data
    } catch (error) {
      console.error('Error fetching maintenance by ID:', error.response || error.message)
      throw this.handleError(error)
    }
  }

  updateCachedMaintenance(id, updatedData) {
    const encryptedCache = localStorage.getItem('maintenances_data')
    if (encryptedCache) {
      const cachedData = decryptData(encryptedCache)
      console.log('Cached Data before update:', cachedData) // Log the cached data

      if (cachedData && cachedData.maintenances && Array.isArray(cachedData.maintenances)) {
        const updatedMaintenances = cachedData.maintenances.map((item) =>
          item._id === id ? { ...item, ...updatedData } : item,
        )
        localStorage.setItem(
          'maintenances_data',
          encryptData({
            ...cachedData,
            maintenances: updatedMaintenances,
            timestamp: new Date().getTime(),
          }),
        )
      }
    }
  }

  removeCachedMaintenance(id) {
    const encryptedCache = localStorage.getItem('maintenances_data')
    if (encryptedCache) {
      const cachedData = decryptData(encryptedCache)
      if (cachedData && cachedData.maintenances && Array.isArray(cachedData.maintenances)) {
        //Ensure that the key exists and is an array
        const updatedMaintenances = cachedData.maintenances.filter((item) => item._id !== id)
        localStorage.setItem(
          'maintenances_data',
          encryptData({
            ...cachedData,
            maintenances: updatedMaintenances,
            timestamp: new Date().getTime(),
          }),
        )
      }
    }
  }

  handleCachedData(error, cacheKey, logMessage) {
    console.error(logMessage, error)
    const encryptedCache = localStorage.getItem(cacheKey)
    if (encryptedCache) {
      const cachedData = decryptData(encryptedCache)
      if (
        cachedData &&
        new Date().getTime() - cachedData.timestamp < 3600000 &&
        cachedData.maintenances
      ) {
        console.log('Using cached data for:', cacheKey)
        return cachedData // return the cached data
      }
    }
    throw this.handleError(error)
  }

  handleError(error) {
    console.error('API Error:', error)

    // If it's already an Error object, return it
    if (error instanceof Error) {
      return error
    }

    // If it's a response error
    if (error.response?.data) {
      return new Error(error.response.data.message || 'Server error occurred')
    }

    // Default error
    return new Error(error.message || 'An unexpected error occurred')
  }
}

export default new MaintenanceService()
