import React, { useState } from 'react';
import { CModal, CModalHeader, CModalBody, CModalTitle, CButton } from '@coreui/react';
import PropertyPhotoModal from './PropertyPhotoModal';

const PropertyDetails = ({
  visible,
  setVisible,
  viewingProperty,
  handlePhotoDelete,
  handlePhotoUpdate,
}) => {
  const [expandedImage, setExpandedImage] = useState(null);
  const [isFullscreenModalVisible, setFullscreenModalVisible] = useState(false);

  // Handle image expansion
  const handleExpandImage = (photo) => {
    setExpandedImage(photo);
    setFullscreenModalVisible(true);
  };

  // Close the full-screen modal
  const handleCloseFullscreen = () => {
    setFullscreenModalVisible(false);
    setExpandedImage(null);
  };

  if (!viewingProperty) return null;

  return (
    <>
      {/* Viewing Property Details Modal */}
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Property Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p><strong>Title:</strong> {viewingProperty.title || 'N/A'}</p>
          <p><strong>Description:</strong> {viewingProperty.description || 'N/A'}</p>
          <p><strong>Address:</strong> {viewingProperty.address || 'N/A'}</p>
          <p><strong>Property Type:</strong> {viewingProperty.propertyType || 'N/A'}</p>
          <p><strong>Price:</strong> ${viewingProperty.price || 'N/A'}</p>
          <p><strong>Rent Price:</strong> ${viewingProperty.rentPrice || 'N/A'}</p>
          <p><strong>Number of Units:</strong> {viewingProperty.numberOfUnits || 'N/A'}</p>
          <p><strong>Floor Plan:</strong> {viewingProperty.floorPlan || 'N/A'}</p>
          <p><strong>Amenities:</strong> {viewingProperty.amenities?.join(', ') || 'None'}</p>
          <p><strong>Photos:</strong></p>
          <div className="d-flex flex-wrap">
            {viewingProperty.photos?.length ? (
              viewingProperty.photos.map((photo, index) => (
                <div key={index} className="m-2" style={{ position: 'relative' }}>
                  <img
                    src={photo.url}
                    alt={`Property Photo ${index + 1}`}
                    style={{ width: 100, height: 100, objectFit: 'cover', cursor: 'pointer' }}
                    onClick={() => handleExpandImage(photo)}
                  />
                  <CButton
                    color="danger"
                    size="sm"
                    style={{ position: 'absolute', top: 0, right: 0 }}
                    onClick={() => handlePhotoDelete(photo.id)}
                  >
                    Delete
                  </CButton>
                </div>
              ))
            ) : (
              <p>No photos available.</p>
            )}
          </div>
        </CModalBody>
      </CModal>

      {/* Fullscreen Photo Modal */}
      {isFullscreenModalVisible && (
        <PropertyPhotoModal
          visible={isFullscreenModalVisible}
          photo={expandedImage}
          onClose={handleCloseFullscreen}
          handlePhotoUpdate={handlePhotoUpdate}
        />
      )}
    </>
  );
};

export default PropertyDetails;
