import React, { useEffect, useState } from 'react';
import { CRow, CCol, CCard, CCardHeader, CCardBody, CAlert } from '@coreui/react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAdmins,
  deleteAdmin,
  addAdmin,
  updateAdmin,
  uploadAdminPhoto, 
} from '../../api/actions/AdminActions';
import AdminTable from './AdminTable';
import AdminModal from './AdminModal';
import AdminDeleteModal from './AdminDeleteModal';
import EditPhotoModal from '../EditPhotoModal';
import { ToastContainer, toast } from 'react-toastify';
import '../Super.scss';
import 'react-toastify/dist/ReactToastify.css';
import { createSelector } from 'reselect';

const selectAdminState = (state) => state.Admin || { // Changed from state.admin to state.Admin
  admins: [],
  loading: false,
  error: null,
  totalPages: 0,
  currentPage: 1
};

const adminSelector = createSelector(
  selectAdminState,
  (admin) => ({
    admins: admin.admins || [],
    loading: admin.loading || false,
    error: admin.error || null,
    totalPages: admin.totalPages || 0,
    currentPage: admin.currentPage || 1,
  })
);

const ViewAdmin = () => {
  const dispatch = useDispatch();
  const { admins, loading, error, totalPages, currentPage } = useSelector(adminSelector);

  // Rest of your component code remains the same
  const [searchTerm, setSearchTerm] = useState('');
  const [AdminModalVisible, setAdminModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editPhotoVisible, setEditPhotoVisible] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [adminToEdit, setAdminToEdit] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const itemsPerPage = 10;

  useEffect(() => {
    console.log('Fetching admins with dispatch');
    dispatch(fetchAdmins({ page: currentPage, limit: itemsPerPage, search: searchTerm }));
  }, [dispatch, currentPage, searchTerm]);
  

  const handlePageChange = (page) => {
    if (page !== currentPage) {
      dispatch(fetchAdmins({ page, limit: itemsPerPage, search: searchTerm }));
    }
  };

  const handleDelete = (admin) => {
    setAdminToDelete(admin);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!adminToDelete?._id) {
      toast.error('No admin selected for deletion');
      return;
    }
  
    try {
      await dispatch(deleteAdmin(adminToDelete._id)).unwrap();
      dispatch(fetchAdmins({ page: currentPage, limit: itemsPerPage, search: searchTerm }));
      setDeleteModalVisible(false);
      toast.success('Admin deleted successfully');
    } catch (error) {
      toast.error('Failed to delete Admin');
    }
  };
  
  const handleEdit = (admin) => {
    setEditingAdmin(admin);
    setAdminModalVisible(true);
  };

  const handleEditPhoto = (admin) => {
    setAdminToEdit(admin);
    setEditPhotoVisible(true);
  };

  const handleSavePhoto = async (photoFile) => {
    if (adminToEdit) {
      dispatch(uploadAdminPhoto({ id: adminToEdit._id, photo: photoFile }));
      dispatch(fetchAdmins({ page: currentPage, limit: itemsPerPage, search: searchTerm }));
      setEditPhotoVisible(false);
      toast.success('Photo updated successfully');
    }
  };

  const handleSave = async (updatedData) => {
    if (!editingAdmin?._id) {
      toast.error('No admin selected for editing');
      return;
    }
  
    try {
      const formattedData = {
        ...updatedData,
        status: updatedData.status ? 'active' : 'inactive',
        activeStart: updatedData.activeStart || null,
        activeEnd: updatedData.activeEnd || null,
      };
  
      await dispatch(updateAdmin({ id: editingAdmin._id, adminData: formattedData })).unwrap();
      dispatch(fetchAdmins({ page: currentPage, limit: itemsPerPage, search: searchTerm }));
      setAdminModalVisible(false);
      toast.success('Admin updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update Admin');
    }
  };
  


  const handleAddAdmin = async (AdminData) => {
    try {
      await dispatch(addAdmin(AdminData)).unwrap();
      dispatch(fetchAdmins({ page: currentPage, limit: itemsPerPage, search: searchTerm }));
      toast.success('Admin added successfully');
      setAdminModalVisible(false);
    } catch (error) {
      toast.error(error?.message || 'Failed to add Admin');
    }
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>Admin</strong>
            <div id="container">
              <button
                className="learn-more"
                onClick={() => {
                  setEditingAdmin(null);
                  setAdminModalVisible(true);
                }}
              >
                <span className="circle" aria-hidden="true">
                  <span className="icon arrow"></span>
                </span>
                <span className="button-text">Add Admin</span>
              </button>
            </div>
          </CCardHeader>
          <CCardBody>
            {error && (
              <CAlert color="danger" className="mb-4">
                {error.message}
              </CAlert>
            )}
            {errorMessage && (
              <CAlert color="danger" className="mb-4">
                {errorMessage}
              </CAlert>
            )}
            <AdminTable
              admins={admins}
              currentPage={currentPage || 1}
              totalPages={totalPages}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              handleEdit={(admin) => {
                setEditingAdmin(admin);
                setAdminModalVisible(true);
              }}
              handleDelete={handleDelete}
              handleEditPhoto={handleEditPhoto}
              handlePageChange={handlePageChange}
            />
          </CCardBody>
        </CCard>
      </CCol>

      {/* Modals */}
      {AdminModalVisible && (
        <AdminModal
  visible={AdminModalVisible}
  setVisible={setAdminModalVisible}
  editingAdmin={editingAdmin} // Pass the correct object here
  handleSave={handleSave}
  handleAddAdmin={handleAddAdmin}
/>

      )}
      <AdminDeleteModal
        visible={deleteModalVisible}
        setDeleteModalVisible={setDeleteModalVisible}
        adminToDelete={adminToDelete}
        confirmDelete={confirmDelete}
      />
      <EditPhotoModal
        visible={editPhotoVisible}
        setVisible={setEditPhotoVisible}
        admin={adminToEdit}
        onSavePhoto={handleSavePhoto}
      />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </CRow>
  );
};

export default ViewAdmin;
