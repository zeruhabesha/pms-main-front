import React, { useState, useEffect, useCallback } from 'react';
import { CRow, CCol, CCard, CCardHeader, CCardBody, CAlert } from '@coreui/react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTenants, addTenant, updateTenant, deleteTenant } from '../../api/actions/TenantActions';
import TenantTable from './TenantTable';
import TenantModal from './TenantModal';
import TenantDeleteModal from './TenantDeleteModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Super.scss';
import TenantPhotoModal from './TenantPhotoModal';
import debounce from 'lodash/debounce';
import { uploadUserPhoto } from '../../api/actions/userActions';
import { decryptData } from '../../api/utils/crypto';
import TenantDetailsModal from "./TenantDetailsModal"; // Import the modal component
import { createSelector } from '@reduxjs/toolkit';

const selectTenantState = createSelector(
  (state) => state.tenant,
  (tenant) => ({
    tenants: tenant.tenants || [],
    loading: tenant.loading,
    error: tenant.error,
    totalPages: tenant.pagination?.totalPages || 1,
    currentPage: tenant.pagination?.currentPage || 1,
  })
);

const ViewTenant = () => {
  const dispatch = useDispatch();
  const { tenants, loading, error, totalPages, currentPage } = useSelector(selectTenantState);

  const [editPhotoVisible, setEditPhotoVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [tenantModalVisible, setTenantModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [tenantToDelete, setTenantToDelete] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);
  const itemsPerPage = 5;
  const [userPermissions, setUserPermissions] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [tenantDetails, setTenantDetails] = useState(null);

  const handleFetchTenants = ({ search }) => {
    dispatch(fetchTenants({ page: 1, limit: itemsPerPage, search }));
  };

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
    setEditingTenant(null);
    setTenantModalVisible(true);
  };

  const handleEdit = (tenant) => {
    if (tenant) {
      setEditingTenant(tenant);
      setTenantModalVisible(true);
    }
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

  const handleSave = async (updatedData) => {
    try {
      if (editingTenant && editingTenant.id) {
        await dispatch(updateTenant({ id: editingTenant.id, tenantData: updatedData })).unwrap();
        toast.success('Tenant updated successfully');
      } else {
        await dispatch(addTenant(updatedData)).unwrap();
        toast.success('Tenant added successfully');
      }
      dispatch(fetchTenants({ page: currentPage, limit: itemsPerPage, search: searchTerm }));
      setTenantModalVisible(false);
    } catch (error) {
      toast.error(error.message || 'Failed to save tenant');
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
      const response = await dispatch(getTenantById(id)).unwrap();
      
      if (!response) {
        throw new Error("Tenant details not found");
      }
  
      setTenantDetails(response);
      setDetailsModalVisible(true);
    } catch (error) {
      console.error("Error fetching tenant details:", error);
      toast.error(error.message || "Failed to fetch tenant details");
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
  handleViewDetails={handleViewDetails}
  handleFetchTenants={handleFetchTenants} // Pass here
/>



          </CCardBody>
        </CCard>
      </CCol>

      <TenantModal
        visible={tenantModalVisible}
        setVisible={setTenantModalVisible}
        editingTenant={editingTenant}
        handleSave={handleSave}
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
