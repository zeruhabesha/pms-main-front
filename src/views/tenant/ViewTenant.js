import React, { useState, useEffect, useCallback } from 'react';
import { CRow, CCol, CCard, CCardHeader, CCardBody, CAlert, CButton, CFormInput } from '@coreui/react';
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
import {
 uploadUserPhoto,
} from '../../api/actions/userActions';

const selectTenantState = (state) => state.tenant || {
  tenants: [],
  loading: false,
  error: null,
  totalPages: 0,
  currentPage: 1,
};

const ViewTenant = () => {
  const dispatch = useDispatch();
  const { tenants, loading, error, totalPages, currentPage } = useSelector(selectTenantState);
  const [editPhotoVisible, setEditPhotoVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [tenantModalVisible, setTenantModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [tenantToDelete, setTenantToDelete] = useState(null);
  const itemsPerPage = 5;
  const [userToEdit, setUserToEdit] = useState(null);
  // Debounced search to avoid firing on every keystroke
  const debouncedSearch = useCallback(
    debounce((term) => {
      dispatch(fetchTenants({ page: 1, limit: itemsPerPage, searchTerm: term }));
    }, 500),
    [dispatch, itemsPerPage]
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term); // Update the local searchTerm
    debouncedSearch(term); // Trigger the debounced search
  };

  useEffect(() => {
    dispatch(fetchTenants({ page: currentPage, limit: itemsPerPage, searchTerm }));
  }, [dispatch, currentPage, searchTerm]); // Trigger fetch when page or searchTerm changes

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      dispatch(fetchTenants({ page, limit: itemsPerPage, searchTerm }));
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
        dispatch(fetchTenants({ page: currentPage, limit: itemsPerPage, searchTerm }));
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
      dispatch(fetchTenants({ page: currentPage, limit: itemsPerPage, searchTerm }));
      setTenantModalVisible(false);
    } catch (error) {
      toast.error(error.message || 'Failed to save tenant');
    }
  }

  // const handleEditPhoto = (tenant) => {
  //   setEditingTenant(tenant); // Set the tenant whose photo needs to be edited
  //   setEditPhotoVisible(true); // Show the photo modal
  // };
  const handleEditPhoto = (user) => {
    setUserToEdit(user);
    setEditPhotoVisible(true);
  };

  const handleSavePhoto = async (photoFile) => {
    if (userToEdit) {
      await dispatch(uploadUserPhoto({ id: userToEdit._id, photo: photoFile }));
      // dispatch(fetchUsers({ page: localCurrentPage, limit: itemsPerPage, search: searchTerm }));
      setEditPhotoVisible(false);
      toast.success('Photo updated successfully');
    }
  };
// In ViewTenant.js, update the handleSavePhoto function:
// const handleSavePhoto = async (photoFile) => {
//   if (userToEdit) {
//     // if (editingTenant && photoFile) {
//     await dispatch(uploadUserPhoto({ id: userToEdit._id, photo: photoFile }));
//     dispatch(fetchUsers({ page: localCurrentPage, limit: itemsPerPage, search: searchTerm }));
//     setEditPhotoVisible(false);
//     toast.success('Photo updated successfully');
//   }
// };
// const handleSavePhoto = async (photoFile) => {
//   if (editingTenant && photoFile) {
//     try {
//       const result = await tenantService.uploadPhoto(editingTenant.id, photoFile);
      
//       if (result.success) {
//         // Refresh the tenants list
//         dispatch(fetchTenants({ page: currentPage, limit: itemsPerPage, searchTerm }));
//         setEditPhotoVisible(false);
//         setEditingTenant(null);
//         toast.success('Photo updated successfully');
//       } else {
//         throw new Error(result.message || 'Failed to update photo');
//       }
//     } catch (error) {
//       toast.error(error.message || 'Failed to update photo');
//     }
//   }
// };
  
  

  return (
    <CRow>
    <CCol xs={12}>
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <strong>Tenant List</strong>
          <div id="container">
            <button className="learn-more" onClick={handleAddTenant}>
              <span className="circle" aria-hidden="true">
                <span className="icon arrow"></span>
              </span>
              <span className="button-text">Add Tenant</span>
            </button>
          </div>
        </CCardHeader>
        <CCardBody>
          {error && (
            <CAlert color="danger" className="mb-4">
              {error.message}
            </CAlert>
          )}
          <CFormInput
            type="text"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={handleSearchChange}
            className="mb-3"
          />
          <TenantTable
  tenants={tenants}
  currentPage={currentPage}
  totalPages={totalPages}
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
  handleEdit={handleEdit}
  handleEditPhoto={handleEditPhoto}  // Pass the handleEditPhoto function here
  handleDelete={handleDelete}
  handlePageChange={handlePageChange}
/>

        </CCardBody>
      </CCard>
    </CCol>

    {/* Modals */}
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
    {/* <TenantPhotoModal
      visible={editPhotoVisible}
      setVisible={setEditPhotoVisible}
      // tenant={editingTenant}
      handleSave={handleSavePhoto}
      admin={userToEdit}
    /> */}
    <TenantPhotoModal
  visible={editPhotoVisible}
  setVisible={setEditPhotoVisible}
  admin={userToEdit}
  onSavePhoto={handleSavePhoto} // Correctly pass the handler here
/>


    <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
  </CRow>
);
};

export default ViewTenant;