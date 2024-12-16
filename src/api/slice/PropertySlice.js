import { createSlice } from '@reduxjs/toolkit';
import {
  fetchProperties,
  addProperty,
  updateProperty,
  deleteProperty,
  uploadPhotos,
  updatePhotos,
  getProperty,
  deletePhoto,
  updateStatus,
  batchDelete,
  toggleFeatured,
  filterProperties,
  updatePropertyPhoto,
} from '../actions/PropertyAction';

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
  featuredProperties: [],
  filters: {},
  lastUpdated: null,
};

const propertySlice = createSlice({
  name: 'property',
  initialState,
  reducers: {
    resetState: () => initialState,
    setSelectedProperty: (state, action) => {
      state.selectedProperty = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    // Handle common loading and error states for all async actions
    const commonActions = [
      fetchProperties,
      addProperty,
      updateProperty,
      deleteProperty,
      uploadPhotos,
      updatePhotos,
      deletePhoto,
      updateStatus,
      batchDelete,
      toggleFeatured,
      filterProperties,
      updatePropertyPhoto,
    ];

    commonActions.forEach((action) => {
      builder
        .addCase(action.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(action.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'An unexpected error occurred';
        });
    });

    // Handle individual success states for async actions
    builder
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = action.payload.properties;
        state.pagination = action.payload.pagination;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(filterProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = action.payload.properties;
        state.pagination = action.payload.pagination;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(addProperty.fulfilled, (state, action) => {
        state.loading = false;
        state.properties.unshift(action.payload);
      })
      .addCase(updateProperty.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.properties.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.properties[index] = action.payload;
        }
      })
      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = state.properties.filter((p) => p.id !== action.payload);
      })
      .addCase(uploadPhotos.fulfilled, (state, action) => {
        state.loading = false;
        const { propertyId, photos } = action.payload;
        const property = state.properties.find((p) => p.id === propertyId);
        if (property) {
          property.photos = photos;
        }
      })
      .addCase(getProperty.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProperty = action.payload;
      })
      .addCase(deletePhoto.fulfilled, (state, action) => {
        state.loading = false;
        const { propertyId, photoId } = action.payload;
        const property = state.properties.find((p) => p.id === propertyId);
        if (property) {
          property.photos = property.photos.filter((photo) => photo.id !== photoId);
        }
      })
      .addCase(updatePropertyPhoto.fulfilled, (state, action) => {
        state.loading = false;
        const { id, photo } = action.payload;
        const property = state.properties.find((p) => p.id === id);
        if (property) {
          property.photos = Array.isArray(property.photos)
            ? [...property.photos, photo]
            : [photo];
        }
      })
      .addCase(updateStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.properties.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.properties[index] = action.payload;
        }
      })
      .addCase(batchDelete.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = state.properties.filter((p) => !action.payload.includes(p.id));
      })
      .addCase(toggleFeatured.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.properties.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.properties[index] = action.payload;
        }
        if (action.payload.featured) {
          state.featuredProperties.push(action.payload);
        } else {
          state.featuredProperties = state.featuredProperties.filter((p) => p.id !== action.payload.id);
        }
      });
  },
});

export const { resetState, setSelectedProperty, clearError, updateFilters, setPagination } = propertySlice.actions;
export default propertySlice.reducer;
