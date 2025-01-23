import React, { useEffect, useState } from 'react';
import {
    CRow, CCol, CCard, CCardHeader, CCardBody, CAlert,
} from '@coreui/react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchUsers, fetchInspectors, fetchMaintainers, deleteUser, addUser, updateUser, uploadUserPhoto,
} from '../../api/actions/userActions';
import UserTable from './UserTable';
import UserModal from './UserModal';
import UserDeleteModal from './UserDeleteModal';
import EditPhotoModal from '../EditPhotoModal';
import { ToastContainer, toast } from 'react-toastify';
import './User.scss';
import '../Super.scss';
import 'react-toastify/dist/ReactToastify.css';
import { clearError } from "../../api/slice/userSlice";

const ViewUser = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [userModalVisible, setUserModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [editPhotoVisible, setEditPhotoVisible] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [userToEdit, setUserToEdit] = useState(null);
    const [activeTab, setActiveTab] = useState(0);

    const itemsPerPage = 10;
    const [localCurrentPage, setLocalCurrentPage] = useState(1);
    const dispatch = useDispatch();
    const { users, inspectors, maintainers, loading, error } = useSelector((state) => state.user);
     const [role, setRole] = useState('user');

    useEffect(() => {
        //Set role based on active tab
        switch (activeTab) {
            case 0:
                setRole('user');
                break;
            case 1:
                setRole('maintainer');
                break;
            case 2:
                setRole('inspector');
                break;
            default:
                setRole('user');
        }
    }, [activeTab]);


    const fetchData = async () => {
        try {
            // Fetches users, maintainers, or inspectors based on the current role
            switch (role) {
                case 'maintainer':
                    await dispatch(fetchMaintainers({
                        page: localCurrentPage,
                        limit: itemsPerPage,
                        searchTerm: searchTerm.trim(),
                    }));
                    break;
                case 'inspector':
                    await dispatch(fetchInspectors({
                        page: localCurrentPage,
                        limit: itemsPerPage,
                        searchTerm: searchTerm.trim(),
                    }));
                    break;
                default:
                    await dispatch(fetchUsers({
                        page: localCurrentPage,
                        limit: itemsPerPage,
                        searchTerm: searchTerm.trim(),
                    }));
            }
        } catch (err) {
            const detailedError = err?.response?.data?.message || err?.message || 'Failed to fetch data';
             toast.error(detailedError); // Keep the toast error
        }
    };

    // Fetch users, inspectors, or maintainers based on role and localCurrentPage or when the search term changes
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchData();
        }, 300); // Add debounce for search
        return () => clearTimeout(timeoutId);
    }, [dispatch, localCurrentPage, searchTerm, itemsPerPage, role]);

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
             toast.success(`${role.charAt(0).toUpperCase() + role.slice(1)} deleted successfully`);
            fetchData();
            setDeleteModalVisible(false);
        } catch (error) {
            const detailedError = error.response?.data?.message || error.message || `Failed to delete ${role}`;
              toast.error(detailedError);
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
                fetchData(); // Refresh data after photo update
                setEditPhotoVisible(false);
                toast.success('Photo updated successfully');
            } catch (error) {
                const detailedError = error.response?.data?.message || error.message || "Failed to update Photo";
                  toast.error(detailedError);
            }

        }
    };


    const handleSave = async (updatedData) => {
        try {
            await dispatch(updateUser({ id: editingUser._id, userData: updatedData })).unwrap();
            toast.success('User updated successfully');
            fetchData(); // Refresh data after update
            setUserModalVisible(false);
        } catch (error) {
            const detailedError = error.response?.data?.message || error.message || 'Failed to update user';
             toast.error(detailedError);
        }
    };


    const handleAddUser = async (userData) => {
        try {
            await dispatch(addUser(userData)).unwrap();
            toast.success(`${role.charAt(0).toUpperCase() + role.slice(1)} added successfully`);
            fetchData(); // Refresh data after add
            setUserModalVisible(false);
        } catch (error) {
            const detailedError = error.response?.data?.message || error.message || 'An unexpected error occurred';
           toast.error(detailedError);
        }
    };

  const handlePageChange = (page) => {
    if (page < 1) return;
    setLocalCurrentPage(page);
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader className="d-flex justify-content-between align-items-center">
                        <strong>{role.charAt(0).toUpperCase() + role.slice(1)} Management</strong>
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
                            <span className="button-text">Add Employee</span>
                        </button>
                    </CCardHeader>
                    <CCardBody>
                      <UserTable
                          users={role === 'maintainer' ? maintainers : role === 'inspector' ? inspectors : users || []}
                          currentPage={localCurrentPage}
                          searchTerm={searchTerm}
                          setSearchTerm={handleSearch}
                          handleEdit={handleEdit}
                          handleDelete={handleDelete}
                          handleEditPhoto={handleEditPhoto}
                          handlePageChange={handlePageChange}
                          loading={loading}
                          itemsPerPage={itemsPerPage}
                          activeTab={activeTab}
                          setActiveTab={setActiveTab}
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