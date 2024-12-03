import React, { useEffect, useState } from 'react';
import { CRow, CCol, CCard, CCardHeader, CCardBody, CAlert } from '@coreui/react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchSuperAdmins,
  deleteSuperAdmin,
  addSuperAdmin,
  updateSuperAdmin,
  uploadSuperAdminPhoto,
} from '../../api/actions/superAdminActions';
import SuperAdminTable from './SuperAdminTable';
import SuperAdminModal from './SuperAdminModal';
import SuperAdminDeleteModal from './SuperAdminDeleteModal';
import EditPhotoModal from '../EditPhotoModal';
import { ToastContainer, toast } from 'react-toastify';
import '../Super.scss';
import 'react-toastify/dist/ReactToastify.css';

const ViewSuperAdmin = () => {
  const dispatch = useDispatch();
  const { superAdmins, loading, totalPages, currentPage, error } = useSelector((state) => state.superAdmin);

  const [searchTerm, setSearchTerm] = useState('');
  const [superAdminModalVisible, setSuperAdminModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editPhotoVisible, setEditPhotoVisible] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [editingSuperAdmin, setEditingSuperAdmin] = useState(null);
  const [adminToEdit, setAdminToEdit] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(fetchSuperAdmins({ page: currentPage || 1, limit: itemsPerPage, search: searchTerm }));
  }, [dispatch, currentPage, searchTerm]);

  const handlePageChange = (page) => {
    dispatch(fetchSuperAdmins({ page, limit: itemsPerPage, search: searchTerm }));
  };

  const handleDelete = (admin) => {
    setAdminToDelete(admin);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteSuperAdmin(adminToDelete._id)).unwrap();
      dispatch(fetchSuperAdmins({ page: currentPage, limit: itemsPerPage, search: searchTerm }));
      setDeleteModalVisible(false);
      toast.success('Super Admin deleted successfully');
    } catch (error) {
      toast.error('Failed to delete Super Admin');
      console.error('Failed to delete Super Admin:', error);
    }
  };

  const handleEditPhoto = (admin) => {
    setAdminToEdit(admin);
    setEditPhotoVisible(true);
  };

  const handleSavePhoto = async (photoFile) => {
    if (adminToEdit) {
      dispatch(uploadSuperAdminPhoto({ id: adminToEdit._id, photo: photoFile }));
      dispatch(fetchSuperAdmins({ page: currentPage, limit: itemsPerPage, search: searchTerm }));
      setEditPhotoVisible(false);
      toast.success('Photo updated successfully');
    }
  };

  const handleSave = async (updatedData) => {
    try {
      await dispatch(updateSuperAdmin({ id: editingSuperAdmin._id, superAdminData: updatedData })).unwrap();
      dispatch(fetchSuperAdmins({ page: currentPage, limit: itemsPerPage, search: searchTerm }));
      setSuperAdminModalVisible(false);
      toast.success('Super Admin updated successfully');
    } catch (error) {
      setErrorMessage(error.message);
      toast.error('Failed to update Super Admin');
      console.error('Failed to update Super Admin:', error);
    }
  };

  const handleAddSuperAdmin = async (superAdminData) => {
    try {
      await dispatch(addSuperAdmin(superAdminData)).unwrap();
      dispatch(fetchSuperAdmins({ page: currentPage, limit: itemsPerPage, search: searchTerm }));
      toast.success('Super Admin added successfully');
      setSuperAdminModalVisible(false);
    } catch (error) {
      toast.error(error?.message || 'Failed to add Super Admin');
      console.error('Failed to add Super Admin:', error);
    }
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>Super Admin</strong>
            <div id="container">
              <button
                className="learn-more"
                onClick={() => {
                  setEditingSuperAdmin(null);
                  setSuperAdminModalVisible(true);
                }}
              >
                <span className="circle" aria-hidden="true">
                  <span className="icon arrow"></span>
                </span>
                <span className="button-text">Add Super-Admin</span>
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
            <SuperAdminTable
              superAdmins={superAdmins}
              currentPage={currentPage || 1}
              totalPages={totalPages}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              handleEdit={(admin) => {
                setEditingSuperAdmin(admin);
                setSuperAdminModalVisible(true);
              }}
              handleDelete={handleDelete}
              handleEditPhoto={handleEditPhoto}
              handlePageChange={handlePageChange}
            />
          </CCardBody>
        </CCard>
      </CCol>

      {/* Modals */}
      {superAdminModalVisible && (
        <SuperAdminModal
          visible={superAdminModalVisible}
          setVisible={setSuperAdminModalVisible}
          editingSuperAdmin={editingSuperAdmin}
          handleSave={handleSave}
          handleAddSuperAdmin={handleAddSuperAdmin}
        />
      )}
      <SuperAdminDeleteModal
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

export default ViewSuperAdmin;
