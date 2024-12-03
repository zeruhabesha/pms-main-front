import React, { useEffect, useState } from 'react';
import {
  CRow, CCol, CCard, CCardHeader, CCardBody, CAlert,
} from '@coreui/react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchUsers, deleteUser, addUser, updateUser, uploadUserPhoto,
} from '../../api/actions/userActions';
import UserTable from './UserTable';
import UserModal from './UserModal';
import UserDeleteModal from './UserDeleteModal';
import EditPhotoModal from '../EditPhotoModal';
import { ToastContainer, toast } from 'react-toastify';
import './User.scss';
import '../Super.scss';
import 'react-toastify/dist/ReactToastify.css';

const ViewUser = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editPhotoVisible, setEditPhotoVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const itemsPerPage = 5;
  const [localCurrentPage, setLocalCurrentPage] = useState(1);

  const dispatch = useDispatch();
  const { users, loading, totalUsers, totalPages, error } = useSelector((state) => state.user);

  // // Handle page change
  // const handlePageChange = (page) => {
  //   if (page < 1 || page > totalPages) return;
  //   setLocalCurrentPage(page);
  // };

  // Fetch users based on page and search term
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchUsers({ 
          page: localCurrentPage, 
          limit: itemsPerPage, 
          search: searchTerm.trim() 
        }));
      } catch (err) {
        setErrorMessage(err?.message || 'Failed to fetch users');
      }
    };

    const timeoutId = setTimeout(() => {
      fetchData();
    }, 300); // Add debounce for search

    return () => clearTimeout(timeoutId);
  }, [dispatch, localCurrentPage, searchTerm, itemsPerPage]);
  const handleSearch = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    setLocalCurrentPage(1); // Reset to the first page on search
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setUserModalVisible(true);
  };

  const handleDelete = (user) => {
    setUserToDelete(user);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteUser(userToDelete._id)).unwrap();
      toast.success('User deleted successfully');
      handlePageChange(localCurrentPage); // Refetch users after deletion
      setDeleteModalVisible(false);
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleEditPhoto = (user) => {
    setUserToEdit(user);
    setEditPhotoVisible(true);
  };

  const handleSavePhoto = async (photoFile) => {
    if (userToEdit) {
      await dispatch(uploadUserPhoto({ id: userToEdit._id, photo: photoFile }));
      await dispatch(fetchUsers({ page: localCurrentPage, limit: itemsPerPage, search: searchTerm }));
      setEditPhotoVisible(false);
      toast.success('Photo updated successfully');
    }
  };

  const handleSave = async (updatedData) => {
    try {
      await dispatch(updateUser({ id: editingUser._id, userData: updatedData })).unwrap();
      dispatch(fetchUsers({ page: localCurrentPage, limit: itemsPerPage, search: searchTerm }));
      setUserModalVisible(false);
      toast.success('User updated successfully');
    } catch (error) {
      setErrorMessage(error.message);
      toast.error('Failed to update user');
      console.error('Failed to update user:', error);
    }
  };

  const handleAddUser = async (userData) => {
    try {
      await dispatch(addUser(userData)).unwrap();
      dispatch(fetchUsers({ page: localCurrentPage, limit: itemsPerPage, search: searchTerm }));
      toast.success('User added successfully');
      setUserModalVisible(false);
    } catch (error) {
      console.error('Full error details:', error);
      const detailedError = error.response?.data?.message || error.message || 'An unexpected error occurred';
      setErrorMessage(detailedError);
      toast.error(detailedError);
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setLocalCurrentPage(page);
  };

  const handleSavePermissions = async (updatedUser) => {
    try {
      // Dispatching action to update user with updated permissions
      await dispatch(updateUser(updatedUser)).unwrap();
  
      // Fetch users again after updating the permissions
      dispatch(fetchUsers({
        page: localCurrentPage,
        limit: itemsPerPage,
        search: searchTerm
      }));
  
      // Close the permissions modal and show a success message
      setPermissionsModalVisible(false);
      toast.success('Permissions updated successfully');
    } catch (error) {
      toast.error('Failed to update permissions');
      console.error('Failed to update permissions:', error);
    }
  };
  
  
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>User Management</strong>
            <button
              className="learn-more"
              onClick={() => {
                setEditingUser(null);
                setUserModalVisible(true);
              }}
            >
              <span className="circle" aria-hidden="true">
                <span className="icon arrow"></span>
              </span>
              <span className="button-text">Add User</span>
            </button>
          </CCardHeader>
          <CCardBody>
            {error && (
              <CAlert color="danger" className="mb-4">
                {error.message || 'An error occurred'}
              </CAlert>
            )}
            {errorMessage && (
              <CAlert color="danger" className="mb-4">
                {errorMessage}
              </CAlert>
            )}
           <UserTable
  users={users || []}
  currentPage={localCurrentPage}
  totalPages={totalPages}
  searchTerm={searchTerm}
  setSearchTerm={handleSearch}
  handleEdit={handleEdit}
  handleDelete={handleDelete}
  handleEditPhoto={handleEditPhoto}
  handlePageChange={handlePageChange}
  loading={loading}
  itemsPerPage={itemsPerPage}
  handleSavePermissions={handleSavePermissions}  // Pass this function
/>

          </CCardBody>
        </CCard>
      </CCol>

      {/* Modals */}
      {userModalVisible && (
        <UserModal
          visible={userModalVisible}
          setVisible={setUserModalVisible}
          editingUser={editingUser}
          handleSave={handleSave}
          handleAddUser={handleAddUser}
        />
      )}
      <UserDeleteModal
        visible={deleteModalVisible}
        setDeleteModalVisible={setDeleteModalVisible}
        userToDelete={userToDelete}
        confirmDelete={confirmDelete}
      />
      <EditPhotoModal
        visible={editPhotoVisible}
        setVisible={setEditPhotoVisible}
        admin={userToEdit}
        onSavePhoto={handleSavePhoto}
      />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </CRow>
  );
};

export default ViewUser;
