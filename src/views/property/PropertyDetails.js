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
    CSpinner,
    CTable,
    CTableHead,
    CTableBody,
    CTableRow,
    CTableDataCell,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilPencil, cilTrash, cilFullscreen } from '@coreui/icons';
import PropertyPhotoModal from './PropertyPhotoModal';
import AddImage from './AddImage';
import PropTypes from 'prop-types';
import './PropertyDetails.scss';

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
  const [loadingImages, setLoadingImages] = useState([]);
  const [imageErrors, setImageErrors] = useState({});

  const handleExpandImage = (photoUrl) => {
    if (photoUrl) {
      setExpandedImage(photoUrl);
      setFullscreenModalVisible(true);
    } else {
      console.warn('Invalid photo URL');
    }
  };

  const handleCloseFullscreen = useCallback(() => {
    setFullscreenModalVisible(false);
    setExpandedImage(null);
  }, []);

  const handleAddImageClick = () => {
    setAddImageModalVisible(true);
  };

  const handleCloseAddImageModal = useCallback(() => {
    setAddImageModalVisible(false);
  }, []);

  const handleClose = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const handleImageLoad = (index) => {
    setLoadingImages((prevLoading) => prevLoading.filter((i) => i !== index));
  };

  const handleImageError = (index, photo) => {
    setLoadingImages((prevLoading) => prevLoading.filter((i) => i !== index));
    console.error(`Error loading image at index: ${index}, photo:`, photo);

    if (photo?.url) {
      setImageErrors((prevErrors) => ({
        ...prevErrors,
        [index]: `Error loading image ${photo.url}`,
      }));
    } else {
      setImageErrors((prevErrors) => ({
        ...prevErrors,
        [index]: `Error loading image at index: ${index}`,
      }));
    }
  };

  const clearImageError = (index) => {
    setImageErrors((prevErrors) => {
      const { [index]: removed, ...rest } = prevErrors;
      return rest;
    });
  };

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
              <CTable bordered responsive>
                 <CTableBody>
                      <CTableRow>
                           <CTableDataCell className="fw-bold">Title:</CTableDataCell>
                            <CTableDataCell>{viewingProperty.title || 'N/A'}</CTableDataCell>
                         </CTableRow>
                         <CTableRow>
                             <CTableDataCell className="fw-bold">Description:</CTableDataCell>
                            <CTableDataCell>{viewingProperty.description || 'No description available'}</CTableDataCell>
                         </CTableRow>
                         <CTableRow>
                             <CTableDataCell className="fw-bold">Address:</CTableDataCell>
                            <CTableDataCell>{viewingProperty.address || 'N/A'}</CTableDataCell>
                         </CTableRow>
                          <CTableRow>
                             <CTableDataCell className="fw-bold">Property Type:</CTableDataCell>
                            <CTableDataCell>{viewingProperty.propertyType || 'N/A'}</CTableDataCell>
                         </CTableRow>
                         <CTableRow>
                             <CTableDataCell className="fw-bold">Price:</CTableDataCell>
                             <CTableDataCell>{viewingProperty.price ? `$${viewingProperty.price}` : 'N/A'}</CTableDataCell>
                         </CTableRow>
                 </CTableBody>
              </CTable>
              <CRow className="g-4 mt-2">
                 <CCol xs={12}>
                   <div className="d-flex flex-wrap">
                      {viewingProperty.photos?.length ? (
                         viewingProperty.photos.map((photo, index) => (
                           <div
                             key={index}
                             className="m-2 property-photo-container"
                              onMouseEnter={() => setHoveredPhoto(index)}
                              onMouseLeave={() => setHoveredPhoto(null)}
                           >
                              {loadingImages.includes(index) ? (
                                 <div className="d-flex justify-content-center align-items-center h-100 w-100">
                                     <CSpinner size="sm" color="secondary" />
                                  </div>
                                 ) : (
                                 <>
                                     <img
                                         src={photo?.url ? `http://localhost:4000/api/v1/${photo.url}` : '/placeholder-image.png'}
                                         alt={`Property Photo ${index + 1}`}
                                         className="property-photo"
                                         onLoad={() => handleImageLoad(index)}
                                         onError={() => {
                                              handleImageError(index, photo);
                                               clearImageError(index);
                                           }}
                                     />
                                      {imageErrors[index] && (
                                        <img
                                         src="/placeholder-image.png"
                                          alt="Placeholder"
                                          className="property-photo"
                                      />
                                    )}
                                   </>
                                 )}
                                 {hoveredPhoto === index && (
                                     <div className="photo-actions">
                                         <CButton
                                             color="light"
                                            size="sm"
                                           onClick={() => handleExpandImage(`http://localhost:4000/api/v1/${photo.url}`)}
                                             title="Expand Photo"
                                             aria-label="Expand Photo"
                                        >
                                            <CIcon icon={cilFullscreen} />
                                       </CButton>
                                          <CButton
                                             color="light"
                                           size="sm"
                                            onClick={() => handlePhotoUpdate(photo)}
                                             title="Edit Photo"
                                            aria-label="Edit Photo"
                                       >
                                          <CIcon icon={cilPencil} />
                                       </CButton>
                                      <CButton
                                          color="danger"
                                          size="sm"
                                          onClick={() => handlePhotoDelete(photo)}
                                         title="Delete Photo"
                                          aria-label="Delete Photo"
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



PropertyDetails.propTypes = {
    visible: PropTypes.bool,
    setVisible: PropTypes.func,
    viewingProperty: PropTypes.object,
    handlePhotoDelete: PropTypes.func,
    handlePhotoUpdate: PropTypes.func,
}

export default PropertyDetails;