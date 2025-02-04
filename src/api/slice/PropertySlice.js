import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  filterProperties,
  addProperty,
  updateProperty,
  deleteProperty,
  updatePhotos,
  getProperty,
  deletePhoto,
  batchDelete,
  toggleFeatured,
  updateStatus,
  updatePhoto,
  updatePropertyPhotos,
  addPropertyImage,
  fetchProperties,
} from '../actions/PropertyAction'

const initialState = {
  properties: [],
  loading: false,
  error: null,
  pagination: {
    totalPages: 1,
    totalItems: 0,
    currentPage: 1,
    limit: 5,
    hasNextPage: false,
    hasPreviousPage: false,
  },
  selectedProperty: null,
}

const propertySlice = createSlice({
  name: 'property',
  initialState,
  reducers: {
    setSelectedProperty: (state, action) => {
      state.selectedProperty = action.payload
    },
    clearSelectedProperty: (state) => {
      state.selectedProperty = null
    },
    resetState: (state) => {
      state.properties = []
      state.loading = false
      state.error = null
      state.pagination = {
        totalPages: 1,
        totalItems: 0,
        currentPage: 1,
        limit: 5,
        hasNextPage: false,
        hasPreviousPage: false,
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false
        state.properties = action.payload.properties
        state.pagination = action.payload.pagination
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(filterProperties.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(filterProperties.fulfilled, (state, action) => {
        state.loading = false
        state.properties = action.payload.properties
        state.pagination = action.payload.pagination
      })
      .addCase(filterProperties.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.properties = []
      })
      .addCase(addProperty.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addProperty.fulfilled, (state, action) => {
        state.loading = false
        state.properties = [action.payload, ...state.properties]
        state.error = null
      })
      .addCase(addProperty.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updateProperty.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateProperty.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.properties = state.properties.map((property) =>
          property.id === action.payload.id ? { ...property, ...action.payload } : property,
        )
        if (state.selectedProperty?.id === action.payload.id) {
          state.selectedProperty = { ...state.selectedProperty, ...action.payload }
        }
      })
      .addCase(updateProperty.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updatePropertyPhotos.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updatePropertyPhotos.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.properties = state.properties.map((property) =>
          property.id === action.payload.id
            ? { ...property, photos: action.payload.photos }
            : property,
        )
        if (state.selectedProperty?.id === action.payload.id) {
          state.selectedProperty = { ...state.selectedProperty, photos: action.payload.photos }
        }
      })
      .addCase(updatePropertyPhotos.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(deleteProperty.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.properties = state.properties.filter((property) => property.id !== action.payload)
        if (state.selectedProperty?.id === action.payload) {
          state.selectedProperty = null
        }
      })
      .addCase(deleteProperty.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updatePhotos.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updatePhotos.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.properties = state.properties.map((property) => {
          if (property.id === action.payload.propertyId) {
            return { ...property, photos: action.payload.photos }
          }
          return property
        })
        if (state.selectedProperty?.id === action.payload.propertyId) {
          state.selectedProperty = { ...state.selectedProperty, photos: action.payload.photos }
        }
      })
      .addCase(updatePhotos.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(getProperty.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getProperty.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.selectedProperty = action.payload
      })
      .addCase(getProperty.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(deletePhoto.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deletePhoto.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        if (action.payload.success && state.selectedProperty) {
          state.selectedProperty.photos = state.selectedProperty.photos.filter(
            (photo) => photo.id !== action.payload.photoId,
          )
          state.properties = state.properties.map((property) => {
            if (property.id === action.payload.propertyId) {
              return { ...property, photos: state.selectedProperty.photos }
            }
            return property
          })
        }
      })
      .addCase(deletePhoto.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updatePhoto.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updatePhoto.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        if (state.selectedProperty && action.payload.success) {
          state.selectedProperty.photos = state.selectedProperty.photos.map((photo) =>
            photo.id === action.payload.photoId
              ? { ...photo, url: action.payload.data.photoUrl }
              : photo,
          )

          state.properties = state.properties.map((property) => {
            if (property.id === state.selectedProperty.id) {
              return { ...property, photos: state.selectedProperty.photos }
            }
            return property
          })
        }
      })
      .addCase(updatePhoto.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(batchDelete.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(batchDelete.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.properties = state.properties.filter(
          (property) => !action.payload.includes(property.id),
        )
        if (state.selectedProperty?.id && action.payload.includes(state.selectedProperty.id)) {
          state.selectedProperty = null
        }
      })
      .addCase(batchDelete.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(toggleFeatured.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(toggleFeatured.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.properties = state.properties.map((property) =>
          property.id === action.payload.id ? { ...property, ...action.payload } : property,
        )
        if (state.selectedProperty?.id === action.payload.id) {
          state.selectedProperty = { ...state.selectedProperty, ...action.payload }
        }
      })
      .addCase(toggleFeatured.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updateStatus.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateStatus.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.properties = state.properties.map((property) =>
          property.id === action.payload.id ? { ...property, ...action.payload } : property,
        )
        if (state.selectedProperty?.id === action.payload.id) {
          state.selectedProperty = { ...state.selectedProperty, ...action.payload }
        }
      })
      .addCase(updateStatus.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(addPropertyImage.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addPropertyImage.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        if (state.selectedProperty && state.selectedProperty.id === action.payload.id) {
          state.selectedProperty = { ...state.selectedProperty, ...action.payload }
        }

        state.properties = state.properties.map((property) => {
          if (property.id === action.payload.id) {
            return { ...property, ...action.payload }
          }
          return property
        })
      })
      .addCase(addPropertyImage.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { setSelectedProperty, clearSelectedProperty, resetState } = propertySlice.actions
export default propertySlice.reducer
