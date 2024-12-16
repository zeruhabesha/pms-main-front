import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProperties,
  deleteProperty,
  updateProperty,
  addProperty,
  updatePropertyPhoto,
} from '../../api/actions/PropertyAction';
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CFormInput,
  CAlert,
} from '@coreui/react';
import PropertyTable from './PropertyTable';
import PropertyDeleteModal from './PropertyDeleteModal';
import AddProperty from './AddProperty';
import EditPhotoModal from '../EditPhotoModal';
import PropertyDetails from './PropertyDetails';
import { decryptData } from '../../api/utils/crypto';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './property.scss';
import '../Super.scss';

const ViewProperty = () => {
  const dispatch = useDispatch();

  // Redux state
  const { properties, loading, error, pagination } = useSelector((state) => state.property);

  // Local state
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
  const [userPermissions, setUserPermissions] = useState(null);

  const itemsPerPage = pagination.limit || 5;

  // Fetch user data from localStorage
  useEffect(() => {
    const encryptedUser = localStorage.getItem('user');
    if (encryptedUser) {
      const decryptedUser = decryptData(encryptedUser);
      setUserPermissions(decryptedUser.permissions);
    }
  }, []);

  // Fetch properties
  useEffect(() => {
    dispatch(fetchProperties({ page: currentPage, limit: itemsPerPage, search: searchTerm }));
  }, [dispatch, currentPage, itemsPerPage, searchTerm]);

  // Handle pagination
  const handlePageChange = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  // Handle add property modal
  const handleAddProperty = () => {
    setEditingProperty(null); // Reset editing state
    setPropertyModalVisible(true);
  };

  // Handle edit property modal
  const handleEdit = (property) => {
    if (!property) {
      toast.error('Invalid property selected for editing.');
      return;
    }
    setEditingProperty(property);
    setPropertyModalVisible(true);
  };

  // Handle delete modal
  const handleDelete = (property) => {
    if (!property) {
      toast.error('Invalid property selected for deletion.');
      return;
    }
    setPropertyToDelete(property);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!propertyToDelete) {
      toast.error('Invalid property selected for deletion.');
      return;
    }

    try {
      await dispatch(deleteProperty(propertyToDelete._id || propertyToDelete.id)).unwrap();
      toast.success('Property deleted successfully');
      dispatch(fetchProperties({ page: currentPage, limit: itemsPerPage, search: searchTerm }));
      setDeleteModalVisible(false);
    } catch (error) {
      toast.error(error.message || 'Failed to delete property');
    }
  };

  // Handle edit photo modal
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
        toast.error(error.message || 'Failed to update photo');
      }
    }
  };

  // Handle add/update property
  const handleSaveProperty = async (propertyData) => {
    try {
      if (editingProperty) {
        await dispatch(updateProperty({ id: editingProperty._id, propertyData })).unwrap();
        toast.success('Property updated successfully');
      } else {
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
    setViewingProperty(property);
    setDetailsModalVisible(true);
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>Properties</strong>
            {userPermissions?.addProperty && (
              <button className="learn-more" onClick={handleAddProperty}>
                <span className="circle" aria-hidden="true">
                  <span className="icon arrow"></span>
                </span>
                <span className="button-text">Add Property</span>
              </button>
            )}
          </CCardHeader>
          <CCardBody>
            {error && <CAlert color="danger">{error}</CAlert>}
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
  totalProperties={pagination.totalItems}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onView={handleView}
  currentPage={currentPage}
  handlePageChange={handlePageChange}
  totalPages={pagination.totalPages}
  itemsPerPage={itemsPerPage}
/>
            ) : (
              <div>No properties found</div>
            )}
          </CCardBody>
        </CCard>
      </CCol>

      <PropertyDetails
        visible={detailsModalVisible}
        setVisible={setDetailsModalVisible}
        viewingProperty={viewingProperty}
      />

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
        property={propertyToEdit}
        onSavePhoto={handleSavePhoto}
      />

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </CRow>
  );
};

export default ViewProperty;
