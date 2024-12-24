import React, { useState } from 'react';
import {
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CButton,
  CFormInput,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
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
              src={expandedImage.url || expandedImage}
              alt="Expanded Property Photo"
              style={{ width: '100%', height: 'auto' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/placeholder-image.png'; // Fallback image
              }}
            />
          ) : (
            <p>No image available</p>
          )}
          <CButton color="secondary" onClick={handleCloseFullscreen} className="mt-3">
            Close
          </CButton>
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
            className="mt-3"
            onClick={() => {
              if (newPhoto && photoToUpdate) {
                handlePhotoUpdate(photoToUpdate, newPhoto);
                setPhotoToUpdate(null);
                setNewPhoto(null);
              }
            }}
          >
            Update Photo
          </CButton>
        </CModalBody>
      </CModal>

      {/* Photo Gallery */}
      <div className="photo-gallery d-flex flex-wrap">
  {viewingProperty.photos && viewingProperty.photos.length > 0 ? (
    viewingProperty.photos.map((photo, index) => (
      <div
        key={index}
        className="photo-container"
        style={{
          marginBottom: '10px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <img
          src={photo.url}
          alt={`Property Photo ${index + 1}`}
          style={{
            width: '100%',
            maxWidth: '200px',
            margin: '15px',
            height: 'auto',
            border: '1px solid #ddd',
            borderRadius: '5px',
          }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/placeholder-image.png'; // Fallback image
          }}
        />
        <div className="photo-buttons mt-2">
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
            onClick={() => handleExpandImage(photo.url)}
            title="Expand Photo"
          >
            <CIcon icon={cilFullscreen} />
          </CButton>
        </div>
      </div>
    ))
  ) : (
    <div className="no-photos-available text-center w-100">
      <p className="text-muted mb-3">No photos available for this property.</p>
      <CButton
        color="dark"
        onClick={() => {
          setPhotoToUpdate(null); // Clear photoToUpdate state
          setNewPhoto(null); // Clear newPhoto state
        }}
      >
        Add Photo
      </CButton>
    </div>
  )}
</div>

    </>
  );
};

export default PropertyPhotoModal;
