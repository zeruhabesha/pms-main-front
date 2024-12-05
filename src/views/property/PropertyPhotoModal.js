// PropertyPhotoModal.js
import React, { useState } from 'react';
import { CModal, CModalHeader, CModalBody, CModalTitle, CButton, CFormInput } from '@coreui/react';
import { CIcon } from '@coreui/icons-react';
import { cilFullscreen, cilPencil, cilTrash } from '@coreui/icons';

const PropertyPhotoModal = ({
  isFullscreenModalVisible,
  expandedImage,
  viewingProperty,
  handleCloseFullscreen,
  handleExpandImage,
  handlePhotoDelete,
  handlePhotoUpdate,
  photoToUpdate,
  setPhotoToUpdate,
  newPhoto,
  setNewPhoto,
  handlePhotoChange,
}) => {
  return (
    <>
      {/* Full-Screen Image Modal */}
      <CModal visible={isFullscreenModalVisible} onClose={handleCloseFullscreen} size="lg">
        <CModalHeader>
          <CModalTitle>Full-Screen Image</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {expandedImage && (
            <img
              src={`https://pms-backend-sncw.onrender.com/api/v1//properties/${viewingProperty._id}/photos/${expandedImage}`}
              alt="Expanded Property Photo"
              style={{ width: '100%' }}
            /> 
          )}
        </CModalBody>
      </CModal>

      {/* Modal for updating photo */}
      <CModal visible={photoToUpdate !== null} onClose={() => setPhotoToUpdate(null)}>
        <CModalHeader>
          <CModalTitle>Update Photo</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormInput
            type="file"
            onChange={handlePhotoChange} // Handle new photo change
            accept="image/*"
          />
          <CButton color="dark" onClick={handlePhotoUpdate}>
            Update Photo
          </CButton>
        </CModalBody>
      </CModal>

      {/* Photo Display and Control */}
      {viewingProperty.photos && viewingProperty.photos.length > 0 ? (
        viewingProperty.photos.map((photo, index) => (
          <div key={index} className="photo-container" style={{ marginBottom: '10px' }}>
            <img
              src={`https://pms-backend-sncw.onrender.com/api/v1//properties/${viewingProperty._id}/photos/${photo}`}
              alt={`Property Photo ${index + 1}`}
              style={{ width: '100%', maxWidth: '200px', margin: '5px' }}
            />
            <div className="photo-buttons">
              <CButton
                color="light"
                size="sm"
                onClick={() => handlePhotoDelete(photo)}
                className="me-2"
              >
                <CIcon icon={cilTrash} />
              </CButton>
              <CButton
                color="light"
                size="sm"
                onClick={() => {
                  setPhotoToUpdate(photo);
                  setNewPhoto(null);
                }}
                className="me-2"
              >
                <CIcon icon={cilPencil} />
              </CButton>
              <CButton
                color="light"
                size="sm"
                onClick={() => handleExpandImage(photo)} // Fullscreen image handler
              >
                <CIcon icon={cilFullscreen} />
              </CButton>
            </div>
          </div>
        ))
      ) : (
        <p>No photos available</p>
      )}
    </>
  );
};

export default PropertyPhotoModal;
