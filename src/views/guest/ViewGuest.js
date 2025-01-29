import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    CRow,
    CCol,
    CCard,
    CCardHeader,
    CCardBody,
    CAlert,
    CSpinner,
    CFormSelect,
    CFormInput
} from '@coreui/react';
import {
    fetchGuests,
    deleteGuest,
    addGuest,
    updateGuest,
    fetchGuestById,
} from '../../api/actions/guestActions';
import GuestTable from './GuestTable';
import GuestDeleteModal from './GuestDeleteModal';
import { ToastContainer, toast } from 'react-toastify';
import '../Super.scss';
import 'react-toastify/dist/ReactToastify.css';
import { createSelector } from 'reselect';
import { Link } from 'react-router-dom';
import AddGuest from './AddGuest';


import { GuestError } from "../../api/utils/guestError";
import { decryptData } from '../../api/utils/crypto';


const selectGuestState = (state) => state.guest || {
    guests: [],
    loading: false,
    error: null,
    totalPages: 0,
    currentPage: 1,
     totalGuests: 0,
};

const ViewGuest = () => {
  const dispatch = useDispatch();
    const guestSelector = useMemo(() => createSelector(
        selectGuestState,
      (guest) => ({
          guests: guest.guests || [],
          loading: guest.loading || false,
          error: guest.error || null,
          totalPages: guest.totalPages || 0,
          currentPage: guest.currentPage || 1,
        totalGuests: guest.totalGuests || 0,
        })
    ), []);
    const { guests, loading, error, totalPages, currentPage, totalGuests } = useSelector(guestSelector);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
   const [addGuestModalVisible, setAddGuestModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [guestToDelete, setGuestToDelete] = useState(null);
  const [editingGuest, setEditingGuest] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

  const itemsPerPage = 10;
   const [userPermissions, setUserPermissions] = useState(null);

    useEffect(() => {
        const encryptedUser = localStorage.getItem('user');
        if (encryptedUser) {
            const decryptedUser = decryptData(encryptedUser);
            if (decryptedUser && decryptedUser.permissions) {
                setUserPermissions(decryptedUser.permissions);
            }
        }
    }, []);


  useEffect(() => {
        dispatch(fetchGuests({ page: currentPage, limit: itemsPerPage, search: searchTerm, status: statusFilter }));
  }, [dispatch, currentPage, searchTerm, statusFilter]);


  const handlePageChange = (page) => {
      if(page !== currentPage){
       dispatch(fetchGuests({ page, limit: itemsPerPage, search: searchTerm, status: statusFilter }));
      }

  };
    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
    };


  const handleDelete = (guest) => {
    setGuestToDelete(guest);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
        if (!guestToDelete?._id) {
            toast.error('No guest selected for deletion');
            return;
        }
       try {
           await dispatch(deleteGuest(guestToDelete._id)).unwrap();
           dispatch(fetchGuests({ page: currentPage, limit: itemsPerPage, search: searchTerm, status: statusFilter }));
           setDeleteModalVisible(false);
            toast.success('Guest deleted successfully');

       }catch (error) {
            toast.error(error?.message || 'Failed to delete guest');
       }
  };

  const handleEdit = (guest) => {
    setEditingGuest(guest); // Set the guest to be edited
    setAddGuestModalVisible(true); // Open the AddGuest modal
  };


  // const handleSave = async (updatedData) => {
  //       if (!editingGuest?._id) {
  //           toast.error('No guest selected for editing');
  //           return;
  //       }
  //     try {
  //         await dispatch(updateGuest({ id: editingGuest._id, guestData: updatedData })).unwrap();
  //         dispatch(fetchGuests({ page: currentPage, limit: itemsPerPage, search: searchTerm, status: statusFilter }));
  //         setGuestModalVisible(false);
  //         setEditingGuest(null);
  //       toast.success('Guest updated successfully');

  //     } catch (error) {
  //         toast.error(error?.message || 'Failed to update guest');
  //     }
  // };

    // const handleAddGuest = async (guestData) => {
    // try {
    //   await dispatch(addGuest(guestData)).unwrap();
    //   dispatch(fetchGuests({ page: currentPage, limit: itemsPerPage, search: searchTerm, status: statusFilter }));
    //   setGuestModalVisible(false);
    //   toast.success('Guest added successfully');
    // } catch (error) {
    //     toast.error(error?.message || 'Failed to add guest');
    // }
  // };
    const handleAddGuestClick = () => {
        setAddGuestModalVisible(true)
    }
     const handleCancelAddGuest = () => {
        setAddGuestModalVisible(false);
    };

  return (
      <CRow>
          <CCol xs={12}>
              <CCard className="mb-4">
                  <CCardHeader className="d-flex justify-content-between align-items-center">
                      <strong>Guests</strong>
                      <div id="container">
                           {/* {userPermissions?.addGuest && ( */}
                          <button
                              className="learn-more"
                              onClick={handleAddGuestClick}
                          >
                            <span className="circle" aria-hidden="true">
                                <span className="icon arrow"></span>
                            </span>
                            <span className="button-text">Add Guest</span>
                          </button>
                            {/* )} */}
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
                        <div className="d-flex justify-content-between mb-3">
                                  <CFormSelect
                                        style={{ width: '200px' }}
                                        value={statusFilter}
                                        onChange={handleStatusFilterChange}
                                  >
                                    <option value="">All Statuses</option>
                                    <option value="pending">Pending</option>
                                      <option value="active">Active</option>
                                    <option value="expired">Expired</option>
                                    <option value="cancelled">Cancelled</option>

                                  </CFormSelect>
                          
                            <div  style={{ width: '100%',  marginLeft: '20px'}} >
                                 {/* <CFormInput
                                    type="text"
                                    placeholder="Search by name or email or phone"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                /> */}
                                 </div>
                                 </div>

                                 <GuestTable
                                    guests={guests}
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    searchTerm={searchTerm}
                                    setSearchTerm={setSearchTerm}
                                    handleEdit={handleEdit} // Pass handleEdit to GuestTable
                                    handleDelete={handleDelete}
                                    handlePageChange={handlePageChange}
                                    totalGuests={totalGuests}
                                  />

                  </CCardBody>
              </CCard>
          </CCol>

          {/* Modals */}
{/* AddGuest Modal */}
<AddGuest
    visible={addGuestModalVisible}
    setVisible={setAddGuestModalVisible}
    editingGuest={editingGuest}
    setEditingGuest={setEditingGuest}
  />
          <GuestDeleteModal
            visible={deleteModalVisible}
            setDeleteModalVisible={setDeleteModalVisible}
            guestToDelete={guestToDelete}
            confirmDelete={confirmDelete}
          />
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </CRow>
  );
};

export default ViewGuest;