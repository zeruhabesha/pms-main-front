export const PropertyTypes = {
  FETCH_PROPERTIES: 'property/fetchProperties',
  GET_PROPERTY: 'property/getProperty',
  ADD_PROPERTY: 'property/addProperty',
  UPDATE_PROPERTY: 'property/updateProperty',
  DELETE_PROPERTY: 'property/deleteProperty',
  UPLOAD_PHOTOS: 'property/uploadPhotos', // Kept, may be used later or remove if confirmed unused
  UPDATE_PHOTOS: 'property/updatePhotos',
  UPDATE_PROPERTY_PHOTOS: 'property/updatePropertyPhotos',
  DELETE_PHOTO: 'property/deletePhoto',
  UPDATE_STATUS: 'property/updateStatus',
  BATCH_DELETE: 'property/batchDelete',
  TOGGLE_FEATURED: 'property/toggleFeatured',
  FILTER_PROPERTIES: 'property/filterProperties',
  FILTER_PROPERTIES_OPEN: 'property/filterPropertiesOpen', // ADDED - This is critical.
  DOWNLOAD_PHOTO: 'property/downloadPhoto',
  UPDATE_PHOTO: 'property/updatePhoto',
  ADD_PROPERTY_IMAGE: 'property/addPropertyImage',
  IMPORT_PROPERTIES: 'property/importProperties', // Added for excel import
  GET_PROPERTIES_BY_USER: 'property/getPropertiesByUser', // New action type
  GET_PROPERTIES_BY_USER_ADMIN: 'property/getPropertiesByUserAdmin', // New action type
  GET_PROPERTY_REPORT: 'property/getPropertyReport', // New action type
  FETCH_PROPERTY_STATUS_COUNTS: 'property/fetchPropertyStatusCounts',
  GET_LEASED_PROPERTIES_FOR_TENANT: 'property/getLeasedPropertiesForTenant', // ADDED
};