import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    CTable,
    CTableHead,
    CTableBody,
    CTableHeaderCell,
    CTableRow,
    CTableDataCell,
    CButton,
    CPagination,
    CPaginationItem,
    CBadge,
    CAlert,
    CProgress,
} from '@coreui/react';
import {
    cilCheckCircle,
    cilXCircle,
    cilThumbUp,
    cilThumbDown,
    cilCheck,
    cilX,
    cilTransfer,
    cilUserPlus,
    cilTask,
    cilShare,
    cilPhone,
    cilEnvelopeOpen,
} from '@coreui/icons';
import { CIcon } from '@coreui/icons-react';
import {
    cilPencil,
    cilTrash,
    cilFullscreen,
    cilArrowTop,
    cilArrowBottom,
    cilPeople,
} from '@coreui/icons';
import { decryptData } from '../../api/utils/crypto';
import { useNavigate } from 'react-router-dom';
import MaintenanceApproveModal from './MaintenanceApproveModal';
import MaintenanceRejectModal from './MaintenanceRejectModal';
import { updateMaintenance } from '../../api/actions/MaintenanceActions';
import { useDispatch } from 'react-redux';



const MaintenanceTable = ({
    maintenanceList = [],
    currentPage,
    totalPages,
    totalRequests,
    searchTerm,
    setSearchTerm,
    handleDelete,
    handleEdit,
    handleViewDetails,
    handlePageChange,
}) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [userPermissions, setUserPermissions] = useState(null);
    const [role, setRole] = useState(null);
    const [error, setError] = useState(null);
    const [approveModalVisible, setApproveModalVisible] = useState(false);
    const [rejectModalVisible, setRejectModalVisible] = useState(false);
    const [maintenanceToApprove, setMaintenanceToApprove] = useState(null);
    const [maintenanceToReject, setMaintenanceToReject] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();


    // Fetch user permissions and role on component mount
    useEffect(() => {
        try {
            const encryptedUser = localStorage.getItem('user');
            if (encryptedUser) {
                const decryptedUser = decryptData(encryptedUser);
                setUserPermissions(decryptedUser?.permissions || null);
                setRole(decryptedUser?.role || null);
            }
        } catch (err) {
            setError('Failed to load user permissions');
            console.error('Permission loading error:', err);
        }
    }, []);

    // Sorting handler
    const handleSort = useCallback((key) => {
        setSortConfig((prevConfig) => ({
            key,
            direction:
                prevConfig.key === key && prevConfig.direction === 'ascending'
                    ? 'descending'
                    : 'ascending',
        }));
    }, []);

    // Approve handler
    const handleApprove = useCallback((maintenance) => {
        setMaintenanceToApprove(maintenance);
        setApproveModalVisible(true);
    }, []);

   const confirmApprove = useCallback(async () => {
        if (maintenanceToApprove) {
            try {
                await dispatch(
                    updateMaintenance({
                        id: maintenanceToApprove._id,
                        maintenanceData: { status: 'in progress' },
                    })
                );
                 //Update the maintenanceList ( status )
                 setApproveModalVisible(false);
            } catch (error) {
                console.error('Failed to approve maintenance:', error);
            }
        }
    }, [dispatch, maintenanceToApprove]);


    // Reject handler
    const handleReject = useCallback((maintenance) => {
        setMaintenanceToReject(maintenance);
        setRejectModalVisible(true);
      }, []);


    const confirmReject = useCallback(async () => {
       if(maintenanceToReject){
            try {
                await dispatch(
                    updateMaintenance({
                        id: maintenanceToReject._id,
                        maintenanceData: { status: 'cancelled' },
                    })
                );
                 //Update the maintenanceList ( status )
                setRejectModalVisible(false);

            } catch (error) {
                console.error('Failed to reject maintenance:', error);
            }
       }
    }, [dispatch, maintenanceToReject]);



    //assign handler
    const handleAssign = useCallback((maintenance) => {
         navigate(`/maintenance/assign/${maintenance._id}`);
    }, [navigate]);


     const generateUsage = (status) => {
           const statusValues = {
             pending: 25,
             'in progress': 50,
             completed: 100,
            };

            const value = status ?  statusValues[status?.toLowerCase()] || 0 : 0;
            let color = 'success';
            if (value < 25) {
                color = 'danger';
            } else if (value < 50) {
                color = 'warning';
            } else if (value < 75) {
                color = 'info';
            }
           return {
                value,
                 period: 'status',
                  color,
           };
       };


    // Status color mapping
    const getStatusColor = useCallback((status) => {
         const statusColorMap = {
             pending: 'warning',
             'in progress': 'info',
             completed: 'success',
              cancelled: 'danger',
        };
        return statusColorMap[status?.toLowerCase()] || 'secondary';
   }, []);

    // Sorted maintenance list
    const sortedMaintenance = useMemo(() => {
        if (!sortConfig.key) return maintenanceList;

        return [...maintenanceList].sort((a, b) => {
            const aValue = (a[sortConfig.key]?.toString() || '').toLowerCase();
            const bValue = (b[sortConfig.key]?.toString() || '').toLowerCase();

            return sortConfig.direction === 'ascending'
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        });
    }, [maintenanceList, sortConfig]);

    // Filtered maintenance list
    const filteredMaintenance = useMemo(() => {
        if (!searchTerm) return sortedMaintenance;

        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        return sortedMaintenance.filter((maintenance) => {
            const tenantName = maintenance.tenant?.tenantName || '';
            const status = maintenance.status || '';

            return (
                tenantName.toLowerCase().includes(lowerCaseSearchTerm) ||
                status.toLowerCase().includes(lowerCaseSearchTerm)
            );
        });
    }, [sortedMaintenance, searchTerm]);


    return (
        <div>
            {error && (
                <CAlert color="danger" dismissible onClose={() => setError(null)}>
                    {error}
                </CAlert>
            )}
             <MaintenanceApproveModal
                visible={approveModalVisible}
                setApproveModalVisible={setApproveModalVisible}
                maintenanceToApprove={maintenanceToApprove}
                 confirmApprove={confirmApprove}
             />
             <MaintenanceRejectModal
                visible={rejectModalVisible}
                setRejectModalVisible={setRejectModalVisible}
                maintenanceToReject={maintenanceToReject}
                confirmReject={confirmReject}
             />

            {/* Maintenance Table */}
            <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                    <CTableRow>
                        <CTableHeaderCell className="bg-body-tertiary text-center">
                            <CIcon icon={cilPeople} />
                        </CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary" onClick={() => handleSort('tenant.tenantName')} style={{ cursor: 'pointer' }}>
                            Tenant
                            {sortConfig.key === 'tenant.tenantName' && (
                                <CIcon
                                    icon={sortConfig.direction === 'ascending' ? cilArrowTop : cilArrowBottom}
                                />
                            )}
                        </CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary" >
                            Contact
                        </CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary">
                            Status
                        </CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary">
                            Usage
                        </CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary">Actions</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {filteredMaintenance.map((maintenance, index) => {
                        const rowNumber = (currentPage - 1) * 10 + index + 1;
                        const usage = generateUsage(maintenance.status);
                        return (
                            <CTableRow key={maintenance._id || index}>
                                 <CTableDataCell className="text-center">
                                        {rowNumber}
                                    </CTableDataCell>
                                <CTableDataCell>
                                    <div>{maintenance.tenant?.tenantName || 'N/A'}</div>
                                    {/* <div className="small text-body-secondary text-nowrap">
                                         <span>ID: {maintenance.tenant?._id}</span>
                                  </div> */}
                                </CTableDataCell>
                                <CTableDataCell>
                                    <div className="small text-body-secondary text-nowrap">
                                        <CIcon icon={cilEnvelopeOpen} size="sm" className="me-1" />
                                        {maintenance.tenant?.contactInformation?.email || 'N/A'}
                                    </div>
                                    <div className="small text-body-secondary text-nowrap">
                                        <CIcon icon={cilPhone} size="sm" className="me-1" />
                                        {maintenance.tenant?.contactInformation?.phoneNumber || 'N/A'}
                                    </div>
                                </CTableDataCell>
                                <CTableDataCell>
                                    <CBadge color={getStatusColor(maintenance.status)}>
                                        {maintenance.status || 'N/A'}
                                    </CBadge>
                                </CTableDataCell>
                                <CTableDataCell>
                                    <div className="d-flex justify-content-between text-nowrap">
                                        <div className="fw-semibold">{usage.value}%</div>
                                        <div className="ms-3">
                                            <small className="text-body-secondary">{usage.period}</small>
                                        </div>
                                    </div>
                                    <CProgress thin color={usage.color} value={usage.value} />
                                </CTableDataCell>
                                <CTableDataCell>
                                    <div className="d-flex align-items-center">
                                        {role === 'User' && userPermissions?.editMaintenance && (
                                            <CButton
                                                color="light"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => handleEdit(maintenance)}
                                                title="Edit"
                                            >
                                                <CIcon icon={cilPencil} />
                                            </CButton>
                                        )}
                                        {role === 'User' && userPermissions?.deleteMaintenance && (
                                            <CButton
                                                color="light"
                                                className="me-2"
                                                style={{ color: `red` }}
                                                size="sm"
                                                onClick={() => handleDelete(maintenance)}
                                                title="Delete"
                                            >
                                                <CIcon icon={cilTrash} />
                                            </CButton>
                                        )}
                                        <CButton
                                            color="light"
                                            style={{ color: `green` }}
                                            size="sm"
                                            className="me-2"
                                            onClick={() => handleApprove(maintenance)}
                                            title="Approve"
                                        > <CIcon icon={cilCheck} /></CButton>
                                          <CButton
                                            color="light"
                                            style={{ color: `red` }}
                                            size="sm"
                                            className="me-2"
                                            onClick={() => handleReject(maintenance)}
                                            title="Reject"
                                          > <CIcon icon={cilX} /></CButton>
                                        <CButton
                                            color="light"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => handleAssign(maintenance)}
                                            title="Assign"
                                        > <CIcon icon={cilShare} /></CButton>
                                        <CButton
                                            color="light"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => handleViewDetails(maintenance)}
                                            title="View Details"
                                        >
                                            <CIcon icon={cilFullscreen} />
                                        </CButton>
                                    </div>
                                </CTableDataCell>
                            </CTableRow>
                        );
                    })}
                </CTableBody>
            </CTable>

            {/* Pagination */}
            <div className="d-flex justify-content-between align-items-center mt-3">
                <span>Total Requests: {totalRequests}</span>
                <CPagination className="d-inline-flex">
                    <CPaginationItem disabled={currentPage === 1} onClick={() => handlePageChange(1)}>
                        «
                    </CPaginationItem>
                    <CPaginationItem
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                    >
                        ‹
                    </CPaginationItem>
                    {[...Array(totalPages)].map((_, index) => (
                        <CPaginationItem
                            key={index + 1}
                            active={index + 1 === currentPage}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </CPaginationItem>
                    ))}
                    <CPaginationItem
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                    >
                        ›
                    </CPaginationItem>
                    <CPaginationItem disabled={currentPage === totalPages} onClick={() => handlePageChange(totalPages)}>
                        »
                    </CPaginationItem>
                </CPagination>
            </div>
        </div>
    );
};

export default React.memo(MaintenanceTable);