import React, { useState, useCallback, useEffect } from 'react';
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
  const [hoveredPhoto, setHoveredPhoto] = useState(null); // Initialize hoveredPhoto state

  const handleExpandImage = (photoUrl) => {
      if (photoUrl) {
          setExpandedImage(photoUrl);
          setFullscreenModalVisible(true);
      } else {
          console.warn('Invalid photo URL provided to handleExpandImage');
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
      setVisible(true);
  }, [setVisible]);

  if (!viewingProperty) return null;

  return (
      <>
         <CModal visible={visible} onClose={() => setVisible(false)} alignment="center" backdrop="static" size="lg">
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
                                    <CTableRow>
                                       <CTableDataCell className="fw-bold">Rent Price:</CTableDataCell>
                                        <CTableDataCell>{viewingProperty.rentPrice ? `$${viewingProperty.rentPrice}` : 'N/A'}</CTableDataCell>
                                    </CTableRow>
                                    <CTableRow>
                                         <CTableDataCell className="fw-bold">Number of Units:</CTableDataCell>
                                         <CTableDataCell>{viewingProperty.numberOfUnits || 'N/A'}</CTableDataCell>
                                    </CTableRow>
                                    <CTableRow>
                                         <CTableDataCell className="fw-bold">Floor Plan:</CTableDataCell>
                                         <CTableDataCell>{viewingProperty.floorPlan || 'N/A'}</CTableDataCell>
                                    </CTableRow>
                                     <CTableRow>
                                         <CTableDataCell className="fw-bold">Amenities:</CTableDataCell>
                                         <CTableDataCell>
                                             {viewingProperty.amenities && viewingProperty.amenities.length > 0
                                                ? viewingProperty.amenities.join(', ')
                                                 : 'N/A'}
                                         </CTableDataCell>
                                     </CTableRow>
                                </CTableBody>
                            </CTable>
                              {/* Photos Section */}
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
                                                    <img
                                                        src={photo?.url ? `http://localhost:4000/api/v1/${photo.url}` : '/placeholder-image.png'}
                                                        alt={`Property Photo ${index + 1}`}
                                                        className="property-photo"
                                                        onError={() => console.error(`Error loading photo at index ${index}`)}
                                                    />
                                                    {hoveredPhoto === index && (
                                                        <div className="photo-actions">
                                                            <CButton
                                                                color="light"
                                                                size="sm"
                                                                onClick={() => handleExpandImage(`http://localhost:4000/api/v1/${photo.url}`)}
                                                            >
                                                                <CIcon icon={cilFullscreen} />
                                                            </CButton>
                                                            <CButton
                                                                color="light"
                                                                size="sm"
                                                                onClick={() => handlePhotoUpdate(photo)}
                                                            >
                                                                <CIcon icon={cilPencil} />
                                                            </CButton>
                                                            <CButton
                                                                color="danger"
                                                                size="sm"
                                                                onClick={() => handlePhotoDelete(photo)}
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
                                    <CButton color="primary" onClick={handleAddImageClick}>
                                        Add Photo
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
                confirmUpdatePhoto={handlePhotoUpdate}
                setVisible={setVisible}
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