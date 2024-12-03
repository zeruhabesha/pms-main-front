import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProperties, deleteProperty, updatePropertyPhoto } from '../../api/actions/PropertyAction';
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CFormInput,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CButton,
  CSpinner,
} from '@coreui/react';
import { CIcon } from '@coreui/icons-react';
import { cilList, cilTrash, cilPencil, cilFullscreen } from '@coreui/icons';
import PropertyDetails from './PropertyDetails';
import PropertyTable from './PropertyTable';
import AddProperty from './AddProperty';
import PropertyDeleteModal from './PropertyDeleteModal';
import '../Super.scss';
import './property.scss';

const ViewProperty = () => {
  const dispatch = useDispatch();
  const { properties, loading, error, totalPages } = useSelector((state) => state.property);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [visible, setVisible] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [viewingProperty, setViewingProperty] = useState(null);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [propertyModalVisible, setPropertyModalVisible] = useState(false);
  const [photoToUpdate, setPhotoToUpdate] = useState(null); // New state for the photo to update
  const [newPhoto, setNewPhoto] = useState(null); // New state for the new photo
  const [expandedImage, setExpandedImage] = useState(null); // State to hold the image to be expanded
  const [isFullscreenModalVisible, setFullscreenModalVisible] = useState(false); // Fullscreen modal visibility

  const itemsPerPage = 5;

  // Fetch properties
  useEffect(() => {
    const loadProperties = async () => {
      try {
        await dispatch(
          fetchProperties({
            page: currentPage,
            limit: itemsPerPage,
            search: searchTerm,
          })
        ).unwrap();
      } catch (error) {
        console.error(error.message || 'Failed to fetch properties');
      }
    };

    const timeoutId = setTimeout(() => {
      loadProperties();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [dispatch, currentPage, itemsPerPage, searchTerm]);

  const handleAddProperty = () => {
    setEditingProperty(null); // Clear editing state for adding a new property
    setPropertyModalVisible(true);
  };

  const handleEdit = (property) => {
    const propertyToEdit = {
      ...property,
      existingPhotos: property.photos || [],
      photos: [], // Clear current photos in the form
    };
    setEditingProperty(propertyToEdit);
    setPropertyModalVisible(true);
  };

  const openDeleteModal = (property) => {
    setPropertyToDelete(property);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!propertyToDelete?._id) {
      console.error('Invalid property ID');
      return;
    }

    try {
      await dispatch(deleteProperty(propertyToDelete._id)).unwrap();
      dispatch(fetchProperties({ page: currentPage, limit: itemsPerPage, search: searchTerm }));
      setDeleteModalVisible(false);
      console.log('Property deleted successfully');
    } catch (error) {
      console.error(error.message || 'Failed to delete property');
    }
  };

  const handleView = (property) => {
    setViewingProperty(property);
    setViewModal(true);
  };

  // Handlers for photo update/delete
  const handlePhotoDelete = async (photo) => {
    try {
      await dispatch(deletePropertyPhoto(viewingProperty._id, photo)); // Replace with actual action
      setViewingProperty((prev) => ({
        ...prev,
        photos: prev.photos.filter((p) => p !== photo),
      }));
    } catch (error) {
      console.error("Error deleting photo", error);
    }
  };
  
  const handlePhotoUpdate = async (photoToUpdate, newPhoto) => {
    const formData = new FormData();
    formData.append("photo", newPhoto); // Append new photo to FormData
  
    try {
      await dispatch(updatePropertyPhoto(viewingProperty._id, formData)); // Replace with actual action
      setViewingProperty((prev) => ({
        ...prev,
        photos: prev.photos.map((photo) =>
          photo === photoToUpdate ? newPhoto.name : photo // Replace old photo with new photo name
        ),
      }));
    } catch (error) {
      console.error("Error updating photo", error);
    }
  };

  const filteredProperties = Array.isArray(properties) ? properties : [];
  const currentProperties = filteredProperties;

  // Handle the full-screen modal for image
  const handleExpandImage = (photo) => {
    setExpandedImage(photo);
    setFullscreenModalVisible(true); // Show the full-screen modal
  };

  const handleCloseFullscreen = () => {
    setFullscreenModalVisible(false);
    setExpandedImage(null); // Reset the expanded image
  };

  return (
    <CRow>
    <CCol xs={12}>
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <strong>Properties</strong>
          <button className="learn-more" onClick={handleAddProperty}>
                <span className="circle" aria-hidden="true">
                  <span className="icon arrow"></span>
                </span>
                <span className="button-text">Add Property</span>
              </button>
        </CCardHeader>
        <CCardBody>
          <CFormInput
            type="text"
            placeholder="Search by title or property type"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-3"
          />
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>Error: {error}</div>
          ) : currentProperties.length > 0 ? (
            <PropertyTable
              properties={currentProperties}
              onEdit={handleEdit}
              onDelete={openDeleteModal}
              onView={handleView}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
            />
          ) : (
            <div>No properties found</div>
          )}
        </CCardBody>
      </CCard>
    </CCol>


 {/* Insert PropertyDetails Component */}
 <PropertyDetails
        visible={viewModal}
        setVisible={setViewModal}
        viewingProperty={viewingProperty}
        handlePhotoDelete={handlePhotoDelete}
        handlePhotoUpdate={handlePhotoUpdate}
      />

      {/* Add Property Modal */}
      {propertyModalVisible && (
        <AddProperty
          visible={propertyModalVisible}
          setVisible={setPropertyModalVisible}
          editingProperty={editingProperty}
        />
      )}
      {/* Viewing Property Details Modal */}
      {/* {viewingProperty && (
        <CModal visible={viewModal} onClose={() => setViewModal(false)}>
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
            <div>
              {viewingProperty.photos && viewingProperty.photos.length > 0 ? (
                viewingProperty.photos.map((photo, index) => (
                  <div key={index} className="photo-container" style={{ marginBottom: '10px' }}>
                    <img
                      src={`http://localhost:4000/api/v1/properties/${viewingProperty._id}/photos/${photo}`}
                      alt={`Property Photo ${index + 1}`}
                      style={{ width: '100%', maxWidth: '200px', margin: '5px' }}
                        className="me-2"
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
                          className="me-2"
                        onClick={() => {
                          setPhotoToUpdate(photo);
                          setNewPhoto(null);
                        }}
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
            </div>
          </CModalBody>
        </CModal>
      )} */}

      {/* Full-Screen Image Modal */}
      <CModal visible={isFullscreenModalVisible} onClose={handleCloseFullscreen} size="lg">
        <CModalHeader>
          <CModalTitle>Full-Screen Image</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {expandedImage && (
            <img
              src={`http://localhost:4000/api/v1/properties/${viewingProperty._id}/photos/${expandedImage}`}
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
            onChange={(e) => setNewPhoto(e.target.files[0])}
            accept="image/*"
          />
          <CButton color="primary" onClick={handlePhotoUpdate}>
            Update Photo
          </CButton>
        </CModalBody>
      </CModal>

      {/* Add Property Modal */}
      {/* {propertyModalVisible && (
        <AddProperty
          visible={propertyModalVisible}
          setVisible={setPropertyModalVisible}
          editingProperty={editingProperty}
        />
      )} */}

     {/* Delete Property Modal */}
     <PropertyDeleteModal
        visible={deleteModalVisible}
        setDeleteModalVisible={setDeleteModalVisible}
        propertyToDelete={propertyToDelete}
        confirmDelete={confirmDelete}
      />
    </CRow>
  );
};

export default ViewProperty;