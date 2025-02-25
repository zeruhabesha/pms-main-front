import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    CRow, CCol, CCard, CCardHeader, CCardBody,
    CAlert, CFormSelect, CPagination, CPaginationItem, CModal // ADD THIS LINE
} from '@coreui/react';
import {
    fetchClearances, deleteClearance,
} from '../../api/actions/ClearanceAction';
import ClearanceTable from './ClearanceTable';
import ClearanceDeleteModal from './ClearanceDeleteModal';
import { ToastContainer, toast } from 'react-toastify';
import '../Super.scss';
import 'react-toastify/dist/ReactToastify.css';
import { decryptData } from '../../api/utils/crypto';
import AddClearance from './AddClearance';
import ClearanceDetailsModal from './ClearanceDetailsModal';
const ViewClearance = () => {
    const dispatch = useDispatch();
    const {
        clearances,
        loading,
        error,
        totalPages,
        currentPage,
        totalClearances
    } = useSelector(state => state.clearance);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [addClearanceModalVisible, setAddClearanceModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [clearanceToDelete, setClearanceToDelete] = useState(null);
    const [userPermissions, setUserPermissions] = useState(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [selectedTenantId, setSelectedTenantId] = useState(null);
    const [isTenantUser, setIsTenantUser] = useState(false);
    const [selectedClearance, setSelectedClearance] = useState(null);
    const itemsPerPage = 10;
    const [role, setRole] = useState(null)
    useEffect(() => {
        try {
            const encryptedUser = localStorage.getItem('user')
            if (encryptedUser) {
                const decryptedUser = decryptData(encryptedUser)
                setUserPermissions(decryptedUser?.permissions || null)
                setRole(decryptedUser?.role || null)
            }
        } catch (err) {
            console.error('Permission loading error:', err)
        }
    }, [])
    useEffect(() => {
        dispatch(fetchClearances({ page: currentPage, limit: itemsPerPage, search: searchTerm, status: statusFilter }));
    }, [dispatch, currentPage, searchTerm, statusFilter]);
    const handlePageChange = (page) => {
        if (page !== currentPage) {
            dispatch(fetchClearances({ page, limit: itemsPerPage, search: searchTerm, status: statusFilter }));
        }
    };
    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
        dispatch(fetchClearances({ page: 1, limit: itemsPerPage, search: searchTerm, status: e.target.value }));
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
        setSelectedClearance(null);
        setAddClearanceModalVisible(true);
    };
    const handleClearanceUpdated = () => {
        dispatch(fetchClearances({ page: currentPage, limit: itemsPerPage, search: searchTerm, status: statusFilter }));
    };
    const handleViewDetails = (clearance) => {
        setSelectedClearance(clearance);
        setDetailModalVisible(true);
    };
    const handleEditClearance = (clearance) => {
        setSelectedClearance(clearance);
        setAddClearanceModalVisible(true);
    };
    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader className="d-flex justify-content-between align-items-center">
                        <strong>Clearances</strong>
                        {role === 'Tenant' && (
                            <button className="learn-more" onClick={handleAddClearanceClick}>
                                <span className="circle" aria-hidden="true">
                                    <span className="icon arrow"></span>
                                </span>
                                <span className="button-text">Request</span>
                            </button>
                        )}
                    </CCardHeader>
                    <CCardBody>
                        {error && <CAlert color="danger" className="mb-4">{error}</CAlert>}
                        <CFormSelect style={{ width: '200px' }} value={statusFilter} onChange={handleStatusFilterChange}>
                            <option value="">All Statuses</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                            <option value="inspected">Inspected</option>
                        </CFormSelect>
                        <ClearanceTable
                            clearances={clearances}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            handleDelete={handleDelete}
                            handlePageChange={handlePageChange}
                            totalClearances={totalClearances}
                            itemsPerPage={itemsPerPage}
                            handleViewDetails={handleViewDetails}
                            handleEditClearance={handleEditClearance}
                        />
                    </CCardBody>
                </CCard>
            </CCol>
            <AddClearance visible={addClearanceModalVisible} setVisible={setAddClearanceModalVisible} selectedClearance={selectedClearance} onClearanceAdded={handleClearanceUpdated} />
              <CModal
                visible={detailModalVisible}
                onClose={() => setDetailModalVisible(false)}
                size="lg"
            >
                <ClearanceDetailsModal
                    visible={detailModalVisible}
                    setVisible={setDetailModalVisible}
                    selectedClearanceData={selectedClearance} // Now you are passing selectedClearanceData
                />
            </CModal>
            <ClearanceDeleteModal visible={deleteModalVisible} setDeleteModalVisible={setDeleteModalVisible} clearanceToDelete={clearanceToDelete} confirmDelete={confirmDelete} />
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        </CRow>
    );
};
export default ViewClearance;