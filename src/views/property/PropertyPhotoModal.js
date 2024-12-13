import React, { useState } from 'react';
import { CModal, CModalHeader, CModalBody, CModalTitle, CButton, CFormInput } from '@coreui/react';
import { CIcon } from '@coreui/icons-react';
import { cilFullscreen, cilPencil, cilTrash } from '@coreui/icons';

const PropertyPhotoModal = ({
  isFullscreenModalVisible,
  expandedImage,
  viewingProperty = { photos: [] },
  handleCloseFullscreen,
  handleExpandImage,
  handlePhotoDelete,
  handlePhotoUpdate,
}) => {
  const [photoToUpdate, setPhotoToUpdate] = useState(null);
  const [newPhoto, setNewPhoto] = useState(null);

  const handlePhotoChange = (e) => {
    setNewPhoto(e.target.files[0]);
  };

  return (
    <>
      {/* Full-Screen Image Modal */}
      <CModal visible={isFullscreenModalVisible} onClose={handleCloseFullscreen} size="lg">
        <CModalHeader>
          <CModalTitle>Full-Screen Image</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {expandedImage ? (
            <img
              src={expandedImage.url}
              alt="Expanded Property Photo"
              style={{ width: '100%' }}
            />
          ) : (
            <p>No image available</p>
          )}
        </CModalBody>
      </CModal>

      {/* Modal for Updating Photo */}
      <CModal visible={photoToUpdate !== null} onClose={() => setPhotoToUpdate(null)}>
        <CModalHeader>
          <CModalTitle>Update Photo</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormInput type="file" onChange={handlePhotoChange} accept="image/*" />
          <CButton
            color="dark"
            onClick={() => {
              if (newPhoto && photoToUpdate) {
                handlePhotoUpdate(photoToUpdate, newPhoto);
                setPhotoToUpdate(null);
              }
            }}
          >
            Update Photo
          </CButton>
        </CModalBody>
      </CModal>

      {/* Photo Display and Control */}
      <div className="photo-gallery">
        {viewingProperty.photos && viewingProperty.photos.length > 0 ? (
          viewingProperty.photos.map((photo, index) => (
            <div key={index} className="photo-container" style={{ marginBottom: '10px' }}>
              <img
                src={photo.url}
                alt={`Property Photo ${index + 1}`}
                style={{ width: '100%', maxWidth: '200px', margin: '15px', height: 'auto' }}
              />
              <div className="photo-buttons">
                <CButton
                  color="light"
                  size="sm"
                  onClick={() => handlePhotoDelete(photo)}
                  className="me-2"
                  title="Delete Photo"
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
                  title="Edit Photo"
                >
                  <CIcon icon={cilPencil} />
                </CButton>
                <CButton
                  color="light"
                  size="sm"
                  onClick={() => handleExpandImage(photo)}
                  title="Expand Photo"
                >
                  <CIcon icon={cilFullscreen} />
                </CButton>
              </div>
            </div>
          ))
        ) : (
          <p>No photos available</p>
        )}
      </div>
    </>
  );
};

export default PropertyPhotoModal;
