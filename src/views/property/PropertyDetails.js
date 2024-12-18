import React, { useState, useCallback } from 'react';
import {
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CButton,
  CRow,
  CCol,
  CCard,
  CCardBody,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilPencil, cilTrash } from '@coreui/icons';
import PropertyPhotoModal from './PropertyPhotoModal';
import AddImage from './AddImage';

const PropertyDetails = ({
  visible,
  setVisible,
  viewingProperty,
  handlePhotoDelete,
  handlePhotoUpdate,
}) => {
  const [isFullscreenModalVisible, setFullscreenModalVisible] = useState(false);
  const [addImageModalVisible, setAddImageModalVisible] = useState(false);
  const [expandedImage, setExpandedImage] = useState(null);
  const [hoveredPhoto, setHoveredPhoto] = useState(null);

  const handleExpandImage = (photo) => {
    setExpandedImage(photo);
    setFullscreenModalVisible(true);
    setAddImageModalVisible(false);
    setVisible(false);
  };

  const handleCloseFullscreen = useCallback(() => {
    setFullscreenModalVisible(false);
    setExpandedImage(null);
    setVisible(true);
  }, [setVisible]);

  const handleAddImageClick = () => {
    setAddImageModalVisible(true);
  };  
  

  const handleCloseAddImageModal = useCallback(() => {
    setAddImageModalVisible(false);
  }, []);

  const handleClose = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  if (!viewingProperty) return null;

  return (
    <>
      <CModal visible={visible} onClose={handleClose} alignment="center" backdrop="static" size="lg">
        <CModalHeader className="bg-dark text-white">
          <CModalTitle>Property Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CCard className="border-0 shadow-sm">
            <CCardBody>
              <CRow className="g-4">
                <CCol xs={12}>
                  <p><strong>Title:</strong> {viewingProperty.title || 'N/A'}</p>
                </CCol>
                <CCol xs={12}>
                  <p><strong>Description:</strong> {viewingProperty.description || 'N/A'}</p>
                </CCol>
                <CCol xs={12}>
                  <p><strong>Address:</strong> {viewingProperty.address || 'N/A'}</p>
                </CCol>
                <CCol xs={12}>
                  <p><strong>Property Type:</strong> {viewingProperty.propertyType || 'N/A'}</p>
                </CCol>
                <CCol xs={12}>
                  <p><strong>Price:</strong> ${viewingProperty.price || 'N/A'}</p>
                </CCol>
                <CCol xs={12}>
                  <p><strong>Rent Price:</strong> ${viewingProperty.rentPrice || 'N/A'}</p>
                </CCol>
                <CCol xs={12}>
                  <p><strong>Number of Units:</strong> {viewingProperty.numberOfUnits || 'N/A'}</p>
                </CCol>
                <CCol xs={12}>
                  <p><strong>Floor Plan:</strong> {viewingProperty.floorPlan || 'N/A'}</p>
                </CCol>
                <CCol xs={12}>
                  <p><strong>Amenities:</strong> {viewingProperty.amenities?.join(', ') || 'None'}</p>
                </CCol>


                <CCol xs={12}>
                  <div className="d-flex flex-wrap">
                    {viewingProperty.photos?.length ? (
                      viewingProperty.photos.map((photo, index) => (
                        <div
                          key={index}
                          className="m-2 photo-container"
                          style={{ position: 'relative', width: 100, height: 100, cursor: 'pointer' }}
                          onMouseEnter={() => setHoveredPhoto(index)}
                          onMouseLeave={() => setHoveredPhoto(null)}
                        >
                          <img
                            src={photo.url}
                            alt={`Property Photo ${index + 1}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onClick={() => handleExpandImage(photo)}
                          />
                          {hoveredPhoto === index && (
                            <div
                              className="photo-actions"
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '8px',
                              }}
                            >
                              <CButton
                                color="light"
                                size="sm"
                                onClick={() => handlePhotoUpdate(photo.id)}
                                title="Edit Photo"
                              >
                                <CIcon icon={cilPencil} />
                              </CButton>
                              <CButton
                                color="danger"
                                size="sm"
                                onClick={() => handlePhotoDelete(photo.id)}
                                title="Delete Photo"
                              >
                                <CIcon icon={cilTrash} />
                              </CButton>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p>No photos available.</p>
                    )}
                  </div>
                </CCol>
                <CCol xs={12}>
                  <CButton color="primary" onClick={handleAddImageClick} title="Add Image">
                    <CIcon icon={cilPlus} />
                  </CButton>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CModalBody>
      </CModal>

      {isFullscreenModalVisible && (
        <PropertyPhotoModal
          visible={isFullscreenModalVisible}
          photo={expandedImage}
          onClose={handleCloseFullscreen}
          handlePhotoUpdate={handlePhotoUpdate}
        />
      )}

<AddImage
  visible={addImageModalVisible}
  onClose={handleCloseAddImageModal}
  propertyId={viewingProperty.id}
  propertyTitle={viewingProperty.title}
  propertyType={viewingProperty.propertyType}
/>

    </>
  );
};

export default PropertyDetails;
