import React, { useState } from 'react';
import { CModal, CModalHeader, CModalBody, CModalTitle } from '@coreui/react';
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
  const [photoToUpdate, setPhotoToUpdate] = useState(null);
  const [newPhoto, setNewPhoto] = useState(null);

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

  // Handle new photo selection
  const handlePhotoChange = (e) => {
    setNewPhoto(e.target.files[0]);
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
          <p><strong>Title:</strong> {viewingProperty.title}</p>
          <p><strong>Description:</strong> {viewingProperty.description}</p>
          <p><strong>Address:</strong> {viewingProperty.address}</p>
          <p><strong>Property Type:</strong> {viewingProperty.propertyType}</p>
          <p><strong>Price:</strong> ${viewingProperty.price}</p>
          <p><strong>Rent Price:</strong> ${viewingProperty.rentPrice || 'N/A'}</p>
          <p><strong>Number of Units:</strong> {viewingProperty.numberOfUnits}</p>
          <p><strong>Floor Plan:</strong> {viewingProperty.floorPlan || 'N/A'}</p>
          <p><strong>Amenities:</strong> {viewingProperty.amenities?.join(', ') || 'None'}</p>
          <p><strong>Photos:</strong></p>
          <PropertyPhotoModal
            isFullscreenModalVisible={isFullscreenModalVisible}
            expandedImage={expandedImage}
            viewingProperty={viewingProperty}
            handleCloseFullscreen={handleCloseFullscreen}
            handleExpandImage={handleExpandImage}
            handlePhotoDelete={handlePhotoDelete}
            handlePhotoUpdate={handlePhotoUpdate}
            photoToUpdate={photoToUpdate}
            setPhotoToUpdate={setPhotoToUpdate}
            newPhoto={newPhoto}
            setNewPhoto={setNewPhoto}
            handlePhotoChange={handlePhotoChange}
          />
        </CModalBody>
      </CModal>
    </>
  );
};

export default PropertyDetails;
