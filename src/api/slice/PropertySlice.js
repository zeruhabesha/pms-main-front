// src/api/slice/propertySlice.js
import { createSlice } from "@reduxjs/toolkit";
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
    softDeleteProperty,
    importProperties,
    getPropertiesByUser,
    getPropertiesByUserAdmin,
    getPropertyReport,
    fetchPropertyStatusCounts,
    filterPropertiesOpen, // Import the new action
    getLeasedPropertiesForTenant, // Import the new thunk
  } from "../actions/PropertyAction"; // Make sure this path is correct

  const initialState = {
    properties: [],
    loading: false,
    error: null,
    statusCounts: null,
    pagination: {
        totalPages: 1,
        totalItems: 0,
        currentPage: 1,
        limit: 5,
        hasNextPage: false,
        hasPreviousPage: false,
    },
    selectedProperty: null,
    importResult: null,
    report: null,
};

const propertySlice = createSlice({
    name: "property",
    initialState,
    reducers: {
        setSelectedProperty: (state, action) => {
            state.selectedProperty = action.payload;
        },
        clearSelectedProperty: (state) => {
            state.selectedProperty = null;
        },
        resetState: (state) => {
            state.properties = [];
            state.loading = false;
            state.error = null;
            state.pagination = {
                totalPages: 1,
                totalItems: 0,
                currentPage: 1,
                limit: 5,
                hasNextPage: false,
                hasPreviousPage: false,
            };
            state.importResult = null;
            state.report = null;
        },
    },
    extraReducers: (builder) => {
      builder
          // ... other extraReducers ...
          .addCase(getLeasedPropertiesForTenant.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(getLeasedPropertiesForTenant.fulfilled, (state, action) => {
            state.loading = false;
            state.properties = action.payload || []; // Set leased properties in the state
            state.error = null;
          })
          .addCase(getLeasedPropertiesForTenant.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Failed to fetch leased properties";
            state.properties = []; // Clear properties on error
          })
          .addCase(fetchPropertyStatusCounts.pending, (state) => {
              state.loading = true;
              state.error = null;
          })
          .addCase(fetchPropertyStatusCounts.fulfilled, (state, action) => {
              state.loading = false;
              console.log("Fetched Property Status Counts:", action.payload);

              if (action.payload) {
                  state.statusCounts = action.payload;
              } else {
                  state.statusCounts = null;
              }

              state.error = null;
          })
          .addCase(fetchPropertyStatusCounts.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload;
          })
          .addCase(fetchProperties.pending, (state) => {
              state.loading = true;
              state.error = null;
          })
          .addCase(fetchProperties.fulfilled, (state, action) => {
              state.loading = false;
              state.properties = action.payload.properties;
              state.pagination = action.payload.pagination;
          })
          .addCase(fetchProperties.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload;
          })
          .addCase(filterProperties.pending, (state) => {
              state.loading = true;
          })
          .addCase(filterProperties.fulfilled, (state, action) => {
              state.loading = false;
              state.properties = action.payload.properties || [];
              state.pagination = action.payload.pagination || state.pagination;
          })
          .addCase(filterProperties.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload || "Failed to fetch properties";
          })
          // ADDED: Reducers for the Open Filter
          .addCase(filterPropertiesOpen.pending, (state) => {
              state.loading = true;
          })
          .addCase(filterPropertiesOpen.fulfilled, (state, action) => {
              state.loading = false;
              state.properties = action.payload.properties || [];
              state.pagination = action.payload.pagination; // Corrected the pagination
          })
          .addCase(filterPropertiesOpen.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload || "Failed to fetch open properties";
          })
          .addCase(addProperty.pending, (state) => {
              state.loading = true;
              state.error = null;
          })
          .addCase(addProperty.fulfilled, (state, action) => {
              state.loading = false;
              state.properties = [action.payload, ...state.properties];
              state.error = null;
          })
          .addCase(addProperty.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload;
          })
          .addCase(updateProperty.pending, (state) => {
              state.loading = true;
              state.error = null;
          })
          .addCase(updateProperty.fulfilled, (state, action) => {
              state.loading = false;
              state.error = null;
              state.properties = state.properties.map((property) =>
                  property.id === action.payload.id
                      ? { ...property, ...action.payload }
                      : property
              );
              if (state.selectedProperty?.id === action.payload.id) {
                  state.selectedProperty = {
                      ...state.selectedProperty,
                      ...action.payload,
                  };
              }
          })
          .addCase(updateProperty.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload;
          })
          .addCase(updatePropertyPhotos.pending, (state) => {
              state.loading = true;
              state.error = null;
          })
          .addCase(updatePropertyPhotos.fulfilled, (state, action) => {
              state.loading = false;
              state.error = null;
              state.properties = state.properties.map((property) =>
                  property.id === action.payload.id
                      ? { ...property, photos: action.payload.photos }
                      : property
              );
              if (state.selectedProperty?.id === action.payload.id) {
                  state.selectedProperty = {
                      ...state.selectedProperty,
                      photos: action.payload.photos,
                  };
              }
          })
          .addCase(updatePropertyPhotos.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload;
          })
          // Soft Delete Cases
          .addCase(softDeleteProperty.pending, (state) => {
              state.loading = true;
              state.error = null;
          })
          .addCase(softDeleteProperty.fulfilled, (state, action) => {
              state.loading = false;
              state.error = null;
              state.properties = state.properties.map((property) => {
                  if (property.id === action.payload) {
                      return { ...property, isDeleted: true };
                  }
                  return property;
              });

              if (state.selectedProperty?.id === action.payload) {
                  state.selectedProperty = {
                      ...state.selectedProperty,
                      isDeleted: true,
                  };
              }
          })
          .addCase(softDeleteProperty.rejected, (state) => {
              state.loading = false;
              state.error = action.payload;
          })
          .addCase(deleteProperty.pending, (state) => {
              state.loading = true;
              state.error = null;
          })
          .addCase(deleteProperty.fulfilled, (state, action) => {
              state.loading = false;
              state.error = null;
              state.properties = state.properties.filter(
                  (property) => property.id !== action.payload
              );
              if (state.selectedProperty?.id === action.payload) {
                  state.selectedProperty = null;
              }
          })
          .addCase(deleteProperty.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload;
          })
          // Soft Batch Delete
          .addCase(batchDelete.pending, (state) => {
              state.loading = true;
              state.error = null;
          })
          .addCase(batchDelete.fulfilled, (state, action) => {
              state.loading = false;
              state.error = null;
              state.properties = state.properties.map((property) => {
                  if (action.payload.includes(property.id)) {
                      return { ...property, isDeleted: true };
                  }
                  return property;
              });
              if (
                  state.selectedProperty?.id &&
                  action.payload.includes(state.selectedProperty.id)
              ) {
                  state.selectedProperty = {
                      ...state.selectedProperty,
                      isDeleted: true,
                  };
              }
          })
          .addCase(batchDelete.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload;
          })
          .addCase(updatePhotos.pending, (state) => {
              state.loading = true;
              state.error = null;
          })
          .addCase(updatePhotos.fulfilled, (state, action) => {
              state.loading = false;
              state.error = null;
              state.properties = state.properties.map((property) => {
                  if (property.id === action.payload.propertyId) {
                      return { ...property, photos: action.payload.photos };
                  }
                  return property;
              });
              if (state.selectedProperty?.id === action.payload.propertyId) {
                  state.selectedProperty = {
                      ...state.selectedProperty,
                      photos: action.payload.photos,
                  };
              }
          })
          .addCase(updatePhotos.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload;
          })
          .addCase(getProperty.pending, (state) => {
              state.loading = true;
              state.error = null;
          })
          .addCase(getProperty.fulfilled, (state, action) => {
              state.loading = false;
              state.error = null;
              state.selectedProperty = action.payload;
          })
          .addCase(getProperty.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload;
          })
          .addCase(deletePhoto.pending, (state) => {
              state.loading = true;
              state.error = null;
          })
          .addCase(deletePhoto.fulfilled, (state, action) => {
              state.loading = false;
              state.error = null;
              if (action.payload.success && state.selectedProperty) {
                  state.selectedProperty.photos = state.selectedProperty.photos.filter(
                      (photo) => photo.id !== action.payload.photoId
                  );
                  state.properties = state.properties.map((property) => {
                      if (property.id === action.payload.propertyId) {
                          return { ...property, photos: state.selectedProperty.photos };
                      }
                      return property;
                  });
              }
          })
          .addCase(deletePhoto.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload;
          })
          .addCase(updatePhoto.pending, (state) => {
              state.loading = true;
              state.error = null;
          })
          .addCase(updatePhoto.fulfilled, (state, action) => {
              state.loading = false;
              state.error = null;
              if (state.selectedProperty && action.payload.success) {
                  state.selectedProperty.photos = state.selectedProperty.photos.map(
                      (photo) =>
                          photo.id === action.payload.photoId
                              ? { ...photo, url: action.payload.data.photoUrl }
                              : photo
                  );

                  state.properties = state.properties.map((property) => {
                      if (property.id === state.selectedProperty.id) {
                          return { ...property, photos: state.selectedProperty.photos };
                      }
                      return property;
                  });
              }
          })
          .addCase(updatePhoto.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload;
          })

          .addCase(toggleFeatured.pending, (state) => {
              state.loading = true;
              state.error = null;
          })
          .addCase(toggleFeatured.fulfilled, (state, action) => {
              state.loading = false;
              state.error = null;
              state.properties = state.properties.map((property) =>
                  property.id === action.payload.id
                      ? { ...property, ...action.payload }
                      : property
              );
              if (state.selectedProperty?.id === action.payload.id) {
                  state.selectedProperty = {
                      ...state.selectedProperty,
                      ...action.payload,
                  };
              }
          })
          .addCase(toggleFeatured.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload;
          })
          .addCase(updateStatus.pending, (state) => {
              state.loading = true;
              state.error = null;
          })
          .addCase(updateStatus.fulfilled, (state, action) => {
              state.loading = false;
              state.error = null;
              state.properties = state.properties.map((property) =>
                  property.id === action.payload.id
                      ? { ...property, ...action.payload }
                      : property
              );
              if (state.selectedProperty?.id === action.payload.id) {
                  state.selectedProperty = {
                      ...state.selectedProperty,
                      ...action.payload,
                  };
              }
          })
          .addCase(updateStatus.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload;
          })
          .addCase(addPropertyImage.pending, (state) => {
              state.loading = true;
              state.error = null;
          })
          .addCase(addPropertyImage.fulfilled, (state, action) => {
              state.loading = false;
              state.error = null;
              if (
                  state.selectedProperty &&
                  state.selectedProperty.id === action.payload.id
              ) {
                  state.selectedProperty = {
                      ...state.selectedProperty,
                      ...action.payload,
                  };
              }

              state.properties = state.properties.map((property) => {
                  if (property.id === action.payload.id) {
                      return { ...property, ...action.payload };
                  }
                  return property;
              });
          })
          .addCase(addPropertyImage.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload;
          })
          // Correcting the importProperties.fulfilled case
          .addCase(importProperties.pending, (state) => {
              state.loading = true;
              state.error = null;
              state.importResult = null;
          })
          .addCase(importProperties.fulfilled, (state, action) => {
              state.loading = false;
              state.error = null;
              state.importResult = action.payload;

              if (action.payload.data && Array.isArray(action.payload.data)) {
                  state.properties = [...state.properties, ...action.payload.data];
              } else {
                  console.error("action.payload.data is not an array:", action.payload);
                  state.error = "Invalid data format from import";
              }
          })
          .addCase(importProperties.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload;
              state.importResult = null;
          })
          .addCase(getPropertiesByUser.pending, (state) => {
              state.loading = true;
              state.error = null;
          })
          .addCase(getPropertiesByUser.fulfilled, (state, action) => {
              state.loading = false;
              state.properties = action.payload;
              state.error = null;
          })
          .addCase(getPropertiesByUser.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload;
          })
          .addCase(getPropertiesByUserAdmin.pending, (state) => {
              state.loading = true;
              state.error = null;
          })
          .addCase(getPropertiesByUserAdmin.fulfilled, (state, action) => {
              state.loading = false;
              state.properties = action.payload;
              state.error = null;
          })
          .addCase(getPropertiesByUserAdmin.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload;
          })
          .addCase(getPropertyReport.pending, (state) => {
              state.loading = true;
              state.error = null;
              state.report = null;
          })
          .addCase(getPropertyReport.fulfilled, (state, action) => {
              state.loading = false;
              state.report = action.payload;
              state.error = null;
          })
          .addCase(getPropertyReport.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload;
              state.report = null;
          })
  },
});

export const { setSelectedProperty, clearSelectedProperty, resetState } =
    propertySlice.actions;
export default propertySlice.reducer;