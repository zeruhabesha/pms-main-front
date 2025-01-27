import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    CRow,
    CCol,
    CCard,
    CCardHeader,
    CCardBody,
    CAlert,
    CFormSelect,
} from '@coreui/react';
import {
    fetchClearances,
    deleteClearance,
} from '../../api/actions/ClearanceAction';
import ClearanceTable from './ClearanceTable';
import ClearanceDeleteModal from './ClearanceDeleteModal';
import { ToastContainer, toast } from 'react-toastify';
import '../Super.scss';
import 'react-toastify/dist/ReactToastify.css';
import { createSelector } from 'reselect';
import { decryptData } from '../../api/utils/crypto';
import AddClearance from './AddClearance';


const selectClearanceState = (state) => state.clearance || {
    clearances: [],
    loading: false,
    error: null,
    totalPages: 0,
    currentPage: 1,
    totalClearances: 0,
};

const ViewClearance = () => {
    const dispatch = useDispatch();
     const clearanceSelector = useMemo(() => createSelector(
         selectClearanceState,
         (clearance) => ({
              clearances: clearance.clearances || [],
              loading: clearance.loading || false,
              error: clearance.error || null,
             totalPages: clearance.totalPages || 0,
             currentPage: clearance.currentPage || 1,
            totalClearances: clearance.totalClearances || 0,
         })
    ), []);
    const { clearances, loading, error, totalPages, currentPage, totalClearances } = useSelector(clearanceSelector);

     const [searchTerm, setSearchTerm] = useState('');
     const [statusFilter, setStatusFilter] = useState('');
    const [addClearanceModalVisible, setAddClearanceModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
     const [clearanceToDelete, setClearanceToDelete] = useState(null);
      const [errorMessage, setErrorMessage] = useState('');
    const [userPermissions, setUserPermissions] = useState(null);

     const itemsPerPage = 10;

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
      dispatch(fetchClearances({ page: currentPage, limit: itemsPerPage, search: searchTerm, status: statusFilter }));
  }, [dispatch, currentPage, searchTerm, statusFilter]);


   const handlePageChange = (page) => {
       if(page !== currentPage){
           dispatch(fetchClearances({ page, limit: itemsPerPage, search: searchTerm, status: statusFilter }));
      }
  };
    const handleStatusFilterChange = (e) => {
      setStatusFilter(e.target.value);
    };

    const handleDelete = (clearance) => {
        setClearanceToDelete(clearance);
        setDeleteModalVisible(true);
    };


  const confirmDelete = async () => {
        if (!clearanceToDelete?._id) {
            toast.error('No clearance request selected for deletion');
            return;
        }
      try {
            await dispatch(deleteClearance(clearanceToDelete._id)).unwrap();
            dispatch(fetchClearances({ page: currentPage, limit: itemsPerPage, search: searchTerm, status: statusFilter }));
            setDeleteModalVisible(false);
             toast.success('Clearance deleted successfully');

      } catch (error) {
          toast.error(error?.message || 'Failed to delete clearance request');
      }
  };
     const handleAddClearanceClick = () => {
        setAddClearanceModalVisible(true)
    }
      const handleCancelAddClearance = () => {
        setAddClearanceModalVisible(false);
    };

  return (
      <CRow>
          <CCol xs={12}>
              <CCard className="mb-4">
                  <CCardHeader className="d-flex justify-content-between align-items-center">
                      <strong>Clearances</strong>
                        <div id="container">
                             {/* {userPermissions?.addClearance && ( */}
                                 <button
                                     className="learn-more"
                                     onClick={handleAddClearanceClick}
                                 >
                                   <span className="circle" aria-hidden="true">
                                        <span className="icon arrow"></span>
                                   </span>
                                     <span className="button-text">Request Clearance</span>
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
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                      <option value="inspected">Inspected</option>
                            </CFormSelect>
                          
                        </div>
                       <ClearanceTable
                           clearances={clearances}
                          currentPage={currentPage}
                          totalPages={totalPages}
                          searchTerm={searchTerm}
                         setSearchTerm={setSearchTerm}
                          handleDelete={handleDelete}
                          handlePageChange={handlePageChange}
                         totalClearances={totalClearances}
                        />
                  </CCardBody>
              </CCard>
          </CCol>
          <AddClearance
                 visible={addClearanceModalVisible}
                setVisible={setAddClearanceModalVisible}
               />
             <ClearanceDeleteModal
                visible={deleteModalVisible}
                setDeleteModalVisible={setDeleteModalVisible}
                clearanceToDelete={clearanceToDelete}
               confirmDelete={confirmDelete}
             />
           <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </CRow>
  );
};

export default ViewClearance;