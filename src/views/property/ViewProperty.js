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
  CButton,
  CAlert,
} from '@coreui/react';
import PropertyTable from './PropertyTable';
import PropertyDeleteModal from './PropertyDeleteModal';
import AddProperty from './AddProperty';
import EditPhotoModal from '../EditPhotoModal';
import '../Super.scss';
import './property.scss';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Super.scss';
import PropertyDetails from './PropertyDetails';

const ViewProperty = () => {
  const dispatch = useDispatch();
  const { properties, loading, error, totalPages, totalCount } = useSelector((state) => state.property);
  const [viewingProperty, setViewingProperty] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [propertyModalVisible, setPropertyModalVisible] = useState(false);
  const [editPhotoVisible, setEditPhotoVisible] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [editingProperty, setEditingProperty] = useState(null);
  const [propertyToEdit, setPropertyToEdit] = useState(null);
  const itemsPerPage = 5;

  // Fetch properties
  useEffect(() => {
    dispatch(fetchProperties({ page: currentPage, limit: itemsPerPage, search: searchTerm }));
  }, [dispatch, currentPage, itemsPerPage, searchTerm]);

  // Functions
  const handlePageChange = (page) => {
    if (page !== currentPage) {
      dispatch(fetchProperties({ page, limit: itemsPerPage, search: searchTerm }));
      setCurrentPage(page);
    }
  };

  const handleAddProperty = () => {
    setEditingProperty(null); // Clear editing state for adding new property
    setPropertyModalVisible(true);
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
    setPropertyModalVisible(true);
  };

  const handleDelete = (property) => {
    setPropertyToDelete(property);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!propertyToDelete?._id) {
      toast.error('Invalid property selected for deletion');
      return;
    }

    try {
      await dispatch(deleteProperty(propertyToDelete._id)).unwrap();
      toast.success('Property deleted successfully');
      dispatch(fetchProperties({ page: currentPage, limit: itemsPerPage, search: searchTerm }));
      setDeleteModalVisible(false);
    } catch (error) {
      toast.error(error.message || 'Failed to delete property');
    }
  };

  const handleEditPhoto = (property) => {
    setPropertyToEdit(property);
    setEditPhotoVisible(true);
  };

  const handleSavePhoto = async (photoFile) => {
    if (propertyToEdit && photoFile) {
      try {
        await dispatch(updatePropertyPhoto({ id: propertyToEdit._id, photo: photoFile })).unwrap();
        toast.success('Photo updated successfully');
        dispatch(fetchProperties({ page: currentPage, limit: itemsPerPage, search: searchTerm }));
        setEditPhotoVisible(false);
      } catch (error) {
        toast.error('Failed to update photo');
      }
    }
  };

  const handleSaveProperty = async (propertyData) => {
    try {
      if (editingProperty) {
        // Update existing property
        await dispatch(updatePropertyPhoto({ id: editingProperty._id, propertyData })).unwrap();
        toast.success('Property updated successfully');
      } else {
        // Add new property
        await dispatch(addProperty(propertyData)).unwrap();
        toast.success('Property added successfully');
      }
      dispatch(fetchProperties({ page: currentPage, limit: itemsPerPage, search: searchTerm }));
      setPropertyModalVisible(false);
    } catch (error) {
      toast.error(error.message || 'Failed to save property');
    }
  };

  const handleView = (property) => {
    setViewingProperty(property); // Set the property to be viewed
    setDetailsModalVisible(true); // Open the PropertyDetails modal
  };
  
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>Properties</strong>
          
            <div id="container">
              <button
                className="learn-more"
                onClick={handleAddProperty}>
                <span className="circle" aria-hidden="true">
                  <span className="icon arrow"></span>
                </span>
                <span className="button-text">Add Properties</span>
              </button>
            </div>
          </CCardHeader>
          <CCardBody>
            {error && <CAlert color="danger">{error.message}</CAlert>}
            <CFormInput
              type="text"
              placeholder="Search by title or property type"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-3"
            />
            {loading ? (
              <div>Loading...</div>
            ) : properties.length > 0 ? (
              <PropertyTable
  properties={properties}
  totalProperties={totalCount}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onView={handleView} // Pass the onView handler
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

      <PropertyDetails
  visible={detailsModalVisible} // Modal visibility controlled by state
  setVisible={setDetailsModalVisible} // Function to close the modal
  viewingProperty={viewingProperty} // Pass the selected property to view
  handlePhotoDelete={(photoId) => console.log(`Delete photo: ${photoId}`)} // Stub or actual implementation
  handlePhotoUpdate={(photo) => console.log(`Update photo: ${photo}`)} // Stub or actual implementation
/>


      {/* Modals */}
      <AddProperty
        visible={propertyModalVisible}
        setVisible={setPropertyModalVisible}
        editingProperty={editingProperty}
        onSave={handleSaveProperty}
      />

      <PropertyDeleteModal
        visible={deleteModalVisible}
        setDeleteModalVisible={setDeleteModalVisible}
        propertyToDelete={propertyToDelete}
        confirmDelete={confirmDelete}
      />

      <EditPhotoModal
        visible={editPhotoVisible}
        setVisible={setEditPhotoVisible}
        admin={propertyToEdit}
        onSavePhoto={handleSavePhoto}
      />

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </CRow>
  );
};

export default ViewProperty;
