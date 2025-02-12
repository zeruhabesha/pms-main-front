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
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [tenantToDelete, setTenantToDelete] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);
  const itemsPerPage = 10;
  const [userPermissions, setUserPermissions] = useState(null);
  const [shouldFetch, setShouldFetch] = useState(true); // New state to control fetching

  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [tenantDetails, setTenantDetails] = useState(null);

  const [clearanceModalVisible, setClearanceModalVisible] = useState(false);
  const [selectedTenantForClearance, setSelectedTenantForClearance] = useState(null);
  const [editPhotoVisible, setEditPhotoVisible] = useState(false);

  const handleClearance = (tenantId) => {
    setSelectedTenantForClearance(tenantId);
    setClearanceModalVisible(true);
  };

  const handleFetchTenants = ({ search }) => {
    dispatch(fetchTenants({ page: 1, limit: itemsPerPage, search }));
  };

  const fetchTenantsData = useCallback(async (page, search) => {
    if (!loading && shouldFetch) {
      setShouldFetch(false); // Reset the fetch flag
      try {
        await dispatch(fetchTenants({
          page,
          limit: itemsPerPage,
          search
        })).unwrap();
      } catch (error) {
        toast.error(error.message || 'Failed to fetch tenants');
      }
    }
  }, [dispatch, loading, itemsPerPage]);

  // useEffect(() => {
  //   setShouldFetch(true);
  //   const timer = setTimeout(() => {
  //     fetchTenantsData(1, searchTerm);
  //   }, 500); // Debounce search

  //   return () => clearTimeout(timer);
  // }, [searchTerm]);

  // useEffect(() => {
  //   if (currentPage > 0) {
  //     setShouldFetch(true);
  //     fetchTenantsData(currentPage, searchTerm);
  //   }
  // }, [currentPage]);

  // In ViewTenant.js
  useEffect(() => {
    const fetchData = async () => {
      if (!loading) { // Add loading check to prevent duplicate fetches
        try {
          await dispatch(fetchTenants({
            page: currentPage,
            limit: itemsPerPage,
            search: searchTerm
          })).unwrap();
        } catch (error) {
          toast.error(error.message || 'Failed to fetch tenants');
        }
      }
    };

    fetchData();
  }, [dispatch, currentPage, searchTerm]); // Remove itemsPerPage if it's constant

  useEffect(() => {
    const encryptedUser = localStorage.getItem('user');



    if (encryptedUser) {
      const decryptedUser = decryptData(encryptedUser);
      if (decryptedUser && decryptedUser.permissions) {
        setUserPermissions(decryptedUser.permissions);
      }
    }
  }, []);

  // const debouncedSearch = useCallback(
  //   debounce((term) => {
  //     dispatch(fetchTenants({ page: 1, limit: itemsPerPage, search: term }));
  //   }, 500),
  //   [dispatch]
  // );

  // Handle search change
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  useEffect(() => {
    dispatch(fetchTenants({ page: currentPage, limit: itemsPerPage, search: searchTerm }));
  }, [dispatch, currentPage, searchTerm]);

  // const handlePageChange = (page) => {
  //   if (page >= 1 && page <= totalPages && page !== currentPage) {
  //     dispatch(fetchTenants({ page, limit: itemsPerPage, search: searchTerm }));
  //   }
  // };
  const handlePageChange = useCallback(
    (newPage) => {
      if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;

      dispatch(fetchTenants({ page: newPage, limit: itemsPerPage, search: searchTerm }))
        .unwrap()
        .catch(error => {
          console.log(error)
          toast.error(error.message || 'Failed to fetch tenants');
        });
    },
    [dispatch, currentPage, totalPages, searchTerm, itemsPerPage]
  );

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
          const response = await dispatch(fetchTenantById(id)).unwrap();

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

  const handleSearchTermChange = (term) => {
    setSearchTerm(term); // Update parent's searchTerm state if needed
    dispatch(fetchTenants({search: term, page: 1 })); // Fetch with new search term and reset page
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
              // setSearchTerm={handleSearchChange}
              setSearchTerm={handleSearchTermChange}
              handleEdit={handleEdit}
              handleEditPhoto={handleEditPhoto}
              handleDelete={handleDelete}
              handlePageChange={handlePageChange}
              loading={loading}
              itemsPerPage={itemsPerPage}

               handleViewDetails={handleViewDetails}
               handleClearance={handleClearance}
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