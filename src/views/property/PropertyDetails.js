import React, { useState, useEffect, useCallback } from 'react';
import {
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
import { cilPlus, cilPencil, cilTrash, cilFullscreen, cilArrowLeft } from '@coreui/icons';
import PropertyPhotoModal from './PropertyPhotoModal';
import AddImage from './AddImage';
import './PropertyDetails.scss';
import { useParams, useNavigate } from 'react-router-dom'; // Import useParams
import { getProperty } from '../../api/actions/PropertyAction';
import { useDispatch } from 'react-redux';


const PropertyDetails = () => {
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFullscreenModalVisible, setFullscreenModalVisible] = useState(false);
    const [addImageModalVisible, setAddImageModalVisible] = useState(false);
    const [expandedImage, setExpandedImage] = useState(null);
    const [hoveredPhoto, setHoveredPhoto] = useState(null);
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                setLoading(true);
                const response = await dispatch(getProperty(id)).unwrap();
                setProperty(response);
                setError(null);
            } catch (err) {
                setError(err.message || 'Failed to load property details.');
                setProperty(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [dispatch, id]);

    const handleExpandImage = (photoUrl) => {
      if (photoUrl) {
          setExpandedImage(photoUrl); // Set the expanded image URL
          setFullscreenModalVisible(true); // Show the modal
      } else {
          console.error('Invalid photo URL provided to handleExpandImage');
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

    const handlePhotoDelete = async (photo) => {
        // TODO : Implementation of deleting photo
        console.log(`Delete photo ID ${photo.id}`)
    }

    const handlePhotoUpdate = async (photo) => {
        // TODO : Implementation of updating photo
       setAddImageModalVisible(true);
    }
    const handleUpdatePhotoSuccess = () => {
         setAddImageModalVisible(false);
    }
    

    if (loading) {
        return <CSpinner color="dark" />;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }
    if (!property) {
        return <p>No property found!</p>;
    }

    return (
        <>
             <CButton color="secondary" onClick={() => navigate('/property')} className="mb-3">
                    <CIcon icon={cilArrowLeft} /> Back to Properties
              </CButton>
            <CCard className="border-0 shadow-sm">
                <CCardBody>
                    <CTable bordered responsive>
                        <CTableBody>
                            <CTableRow>
                                <CTableDataCell className="fw-bold">Title:</CTableDataCell>
                                <CTableDataCell>{property.title || 'N/A'}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell className="fw-bold">Description:</CTableDataCell>
                                <CTableDataCell>{property.description || 'No description available'}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell className="fw-bold">Address:</CTableDataCell>
                                <CTableDataCell>{property.address || 'N/A'}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell className="fw-bold">Property Type:</CTableDataCell>
                                <CTableDataCell>{property.propertyType || 'N/A'}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell className="fw-bold">Price:</CTableDataCell>
                                <CTableDataCell>{property.price ? `$${property.price}` : 'N/A'}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell className="fw-bold">Rent Price:</CTableDataCell>
                                <CTableDataCell>{property.rentPrice ? `$${property.rentPrice}` : 'N/A'}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell className="fw-bold">Number of Units:</CTableDataCell>
                                <CTableDataCell>{property.numberOfUnits || 'N/A'}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell className="fw-bold">Floor Plan:</CTableDataCell>
                                <CTableDataCell>{property.floorPlan || 'N/A'}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableDataCell className="fw-bold">Amenities:</CTableDataCell>
                                <CTableDataCell>
                                    {property.amenities && property.amenities.length > 0
                                        ? property.amenities.join(', ')
                                        : 'N/A'}
                                </CTableDataCell>
                            </CTableRow>
                        </CTableBody>
                    </CTable>
                    {/* Photos Section */}
                    <CRow className="g-4 mt-2">
                        <CCol xs={12}>
                            <div className="d-flex flex-wrap">
                                {property.photos?.length ? (
                                    property.photos.map((photo, index) => (
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
    onClick={() => handleExpandImage(photo?.url ? `http://localhost:4000/api/v1/${photo.url}` : null)}
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
                            <CButton color="dark" onClick={handleAddImageClick}>
                                Add Photo
                            </CButton>
                        </CCol>
                    </CRow>
                </CCardBody>
            </CCard>
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
                propertyId={property.id}
                propertyTitle={property.title}
                confirmUpdatePhoto={handlePhotoUpdate}
               photoId={property.photoId}
            />
        </>
    );
};

export default PropertyDetails;