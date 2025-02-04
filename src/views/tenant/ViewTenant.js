// ViewTenant.js
import React, { useState, useEffect, useCallback } from 'react';
import { CRow, CCol, CCard, CCardHeader, CCardBody, CAlert } from '@coreui/react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchTenants, 
  deleteTenant, 
  fetchTenantById  
} from '../../api/actions/TenantActions';
import TenantTable from './TenantTable';
import TenantDeleteModal from './TenantDeleteModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Super.scss';
import TenantPhotoModal from './TenantPhotoModal';
import debounce from 'lodash/debounce';
import { uploadUserPhoto } from '../../api/actions/userActions';
import { decryptData } from '../../api/utils/crypto';
import TenantDetailsModal from "./TenantDetailsModal";
import { createSelector } from '@reduxjs/toolkit';
import { Link } from 'react-router-dom'; // Import Link
import { useNavigate } from 'react-router-dom';
import ClearanceDetailsModal from '../Clearance/ClearanceDetailsModal'; // Import the modal


const selectTenantState = createSelector(
  (state) => state.tenant,
  (tenant) => ({
    tenants: tenant.tenants || [],
    loading: tenant.loading,
    error: tenant.error,
    totalPages: tenant.totalPages || 1, // Remove pagination nesting
    currentPage: tenant.currentPage || 1, // Remove pagination nesting
  })
);

const ViewTenant = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tenants, loading, error, totalPages, currentPage } = useSelector(selectTenantState);

  const [editPhotoVisible, setEditPhotoVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [tenantToDelete, setTenantToDelete] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);
  const itemsPerPage = 10;
  const [userPermissions, setUserPermissions] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [tenantDetails, setTenantDetails] = useState(null);

  const [clearanceModalVisible, setClearanceModalVisible] = useState(false);
  const [selectedTenantForClearance, setSelectedTenantForClearance] = useState(null);
  
  const handleClearance = (tenantId) => {
    setSelectedTenantForClearance(tenantId);
    setClearanceModalVisible(true);
  };

  const handleFetchTenants = ({ search }) => {
    dispatch(fetchTenants({ page: 1, limit: itemsPerPage, search }));
  };

// In ViewTenant.js
useEffect(() => {
  const fetchData = async () => {
    try {
      await dispatch(fetchTenants({ 
        page: currentPage, 
        limit: itemsPerPage, 
        search: searchTerm 
      })).unwrap();
    } catch (error) {
      toast.error(error.message || 'Failed to fetch tenants');
    }
  };
  
  fetchData();
}, [dispatch, currentPage, searchTerm, itemsPerPage]);

  useEffect(() => {
    const encryptedUser = localStorage.getItem('user');
    if (encryptedUser) {
      const decryptedUser = decryptData(encryptedUser);
      if (decryptedUser && decryptedUser.permissions) {
        setUserPermissions(decryptedUser.permissions);
      }
    }
  }, []);

  const debouncedSearch = useCallback(
    debounce((term) => {
      dispatch(fetchTenants({ page: 1, limit: itemsPerPage, search: term }));
    }, 500),
    [dispatch, itemsPerPage]
  );

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    debouncedSearch(term);
  };
  
  useEffect(() => {
    dispatch(fetchTenants({ page: currentPage, limit: itemsPerPage, search: searchTerm }));
  }, [dispatch, currentPage, searchTerm]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      dispatch(fetchTenants({ page, limit: itemsPerPage, search: searchTerm }));
    }
  };


  const handleAddTenant = () => {
     navigate('/tenant/add')
   };
  const handleEdit = (id) => {
     navigate(`/tenant/edit/${id}`);
   };
  const handleDelete = (id, tenant) => {
    setTenantToDelete({ id, ...tenant });
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (tenantToDelete?.id) {
      try {
        await dispatch(deleteTenant(tenantToDelete.id)).unwrap();
        toast.success('Tenant deleted successfully');
        setDeleteModalVisible(false);
        setTenantToDelete(null);
        dispatch(fetchTenants({ page: currentPage, limit: itemsPerPage, search: searchTerm }));
      } catch (error) {
        toast.error(error.message || 'Failed to delete tenant');
      }
    }
  };


  const handleEditPhoto = (user) => {
    setUserToEdit(user);
    setEditPhotoVisible(true);
  };

  const handleSavePhoto = async (photoFile) => {
    if (userToEdit) {
      try {
        await dispatch(uploadUserPhoto({ id: userToEdit._id, photo: photoFile })).unwrap();
        toast.success('Photo updated successfully');
        setEditPhotoVisible(false);
        setUserToEdit(null);
        dispatch(fetchTenants({ page: currentPage, limit: itemsPerPage, search: searchTerm }));
      } catch (error) {
        toast.error(error.message || 'Failed to update photo');
      }
    }
  };

  const handleViewDetails = async (id) => {
    try {
      const response = await dispatch(fetchTenantById(id)).unwrap(); // Changed from getTenantById to fetchTenantById
  
      if (!response) {
        throw new Error('Tenant details not found');
      }
  
      setTenantDetails(response);
      setDetailsModalVisible(true);
    } catch (error) {
      console.error('Error fetching tenant details:', error);
      toast.error(error.message || 'Failed to fetch tenant details');
    }
};
  
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>Tenant List</strong>
            {userPermissions?.addTenant && (
              <div id="container">
                <button className="learn-more" onClick={handleAddTenant}>
                  <span className="circle" aria-hidden="true">
                    <span className="icon arrow"></span>
                  </span>
                  <span className="button-text">Add Tenant</span>
                </button>
              </div>
            )}
          </CCardHeader>
          <CCardBody>
            {error && (
              <CAlert color="danger" className="mb-4">
                {error.message || 'Failed to fetch tenants'}
              </CAlert>
            )}
            <TenantTable
  tenants={tenants}
  currentPage={currentPage}
  totalPages={totalPages}
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
  handleEdit={handleEdit}
  handleEditPhoto={handleEditPhoto}
  handleDelete={handleDelete}
  handlePageChange={handlePageChange}
  handleFetchTenants={handleFetchTenants}
  handleClearance={handleClearance} // Pass the handler
/>

          </CCardBody>
        </CCard>
      </CCol>

      <ClearanceDetailsModal
        visible={clearanceModalVisible}
        setVisible={setClearanceModalVisible}
        tenantId={selectedTenantForClearance} // Pass the tenant ID to the modal
      />

      <TenantDeleteModal
        visible={deleteModalVisible}
        setDeleteModalVisible={setDeleteModalVisible}
        tenantToDelete={tenantToDelete}
        confirmDelete={confirmDelete}
      />
      <TenantPhotoModal
        visible={editPhotoVisible}
        setVisible={setEditPhotoVisible}
        admin={userToEdit}
        onSavePhoto={handleSavePhoto}
      />
      <TenantDetailsModal
        visible={detailsModalVisible}
        setVisible={setDetailsModalVisible}
        tenantDetails={tenantDetails}
      />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </CRow>
  );
};

export default ViewTenant;