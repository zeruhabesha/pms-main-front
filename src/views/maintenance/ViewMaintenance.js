import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchMaintenances,
    deleteMaintenance,
} from '../../api/actions/MaintenanceActions';
import { CRow, CCol, CCard, CCardBody, CCardHeader, CFormInput, CSpinner, CButton } from '@coreui/react';
import MaintenanceTable from './MaintenanceTable';
import '../Super.scss';
import { decryptData } from '../../api/utils/crypto';
import { CIcon } from '@coreui/icons-react';
import {
    cilFile,
    cilClipboard,
    cilCloudDownload,
} from '@coreui/icons';
import { CSVLink } from 'react-csv';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';
import MaintenanceDetailsModal from './MaintenanceDetailsModal';


const ViewMaintenance = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        maintenances = [],
        loading = false,
        error = null,
        totalPages = 0,
        totalMaintenanceRequests = 0,
        currentPage = 1,
    } = useSelector((state) => state.maintenance);

    const [searchState, setSearchState] = useState({
        term: '',
        debouncedTerm: '',
    });
    
     const [modalStates, setModalStates] = useState({
        details: { visible: false, maintenance: null },
    });

    const [userPermissions, setUserPermissions] = useState(null);
    const [role, setRole] = useState(null);



    const ITEMS_PER_PAGE = 10;

    const fetchMaintenanceRequests = useCallback(() => {
        dispatch(
            fetchMaintenances({
                page: currentPage,
                limit: ITEMS_PER_PAGE,
                search: searchState.debouncedTerm,
            }),
        );
    }, [dispatch, currentPage, searchState.debouncedTerm]);

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

    useEffect(() => {
        fetchMaintenanceRequests();
    }, [fetchMaintenanceRequests]);


    useEffect(() => {
        const timerId = setTimeout(() => {
            setSearchState((prev) => ({
                ...prev,
                debouncedTerm: prev.term,
            }));
        }, 500);

        return () => clearTimeout(timerId);
    }, [searchState.term]);


    const handlePageChange = (page) => {
        if (page !== currentPage) {
            dispatch(
                fetchMaintenances({
                    page,
                    limit: ITEMS_PER_PAGE,
                    search: searchState.debouncedTerm,
                }),
            );
        }
    };


    const handleDelete = async (maintenanceToDelete) => {
         if (maintenanceToDelete?._id) {
            try {
                await dispatch(deleteMaintenance(maintenanceToDelete._id));
                fetchMaintenanceRequests();
            } catch (error) {
                console.error('Delete error', error);
            }
        }
    };

    const handleSearchChange = (value) => {
        setSearchState((prev) => ({ ...prev, term: value }));
    };

    const csvData = useMemo(
        () =>
            maintenances.map((maintenance, index) => ({
                index: (currentPage - 1) * 10 + index + 1,
                tenantName: maintenance.tenant?.tenantName || 'N/A',
                email: maintenance.tenant?.contactInformation?.email || 'N/A',
                phone: maintenance.tenant?.contactInformation?.phoneNumber || 'N/A',
                status: maintenance.status || 'N/A',
            })),
        [maintenances, currentPage]
    );

    // Data for clipboard
    const clipboardData = useMemo(
        () =>
            maintenances
                .map(
                    (maintenance, index) =>
                        `${(currentPage - 1) * 10 + index + 1}. ${maintenance.tenant?.tenantName || 'N/A'} - ${
                            maintenance.tenant?.contactInformation?.email || 'N/A'
                        } - ${maintenance.status || 'N/A'}`
                )
                .join('\n'),
        [maintenances, currentPage]
    );

    // Export to PDF
    const exportToPDF = useCallback(() => {
        try {
            const doc = new jsPDF();
            doc.text('Maintenance Requests', 14, 10);

            const tableData = maintenances.map((maintenance, index) => [
                (currentPage - 1) * 10 + index + 1,
                maintenance.tenant?.tenantName || 'N/A',
                maintenance.tenant?.contactInformation?.email || 'N/A',
                maintenance.tenant?.contactInformation?.phoneNumber || 'N/A',
                maintenance.status || 'N/A',
            ]);

            doc.autoTable({
                head: [['#', 'Tenant Name', 'Email', 'Phone', 'Status']],
                body: tableData,
                startY: 20,
            });

            doc.save('maintenance_requests.pdf');
        } catch (error) {
            console.error('PDF export error:', error);
        }
    }, [maintenances, currentPage]);

    const handleAddRequest = () => {
          navigate('/maintenance/add');
    };
   
    const handleEdit = (maintenance) => {
          navigate(`/maintenance/edit/${maintenance._id}`);
      };
      const handleEdit1 = (maintenance) => {

    };
    const handleViewDetails = (maintenance) => {
           handleOpenModal('details', maintenance);
    };

    const handleAssign = (maintenance) => {
        navigate(`/maintenance/assign/${maintenance._id}`)
    }

     const handleOpenModal = (type, maintenance = null) => {
        setModalStates((prev) => ({
            ...prev,
            [type]: {
                ...prev[type],
                visible: true,
                maintenance,
            },
        }));
    };

    const handleCloseModal = (type) => {
        setModalStates((prev) => ({
            ...prev,
            [type]: {
                ...prev[type],
                visible: false,
                maintenance: null,
            },
        }));
    };
    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader className="d-flex justify-content-between align-items-center">
                        <strong>Maintenance Records</strong>
                        {/* {userPermissions?.addMaintenanceRecord && ( */}
                        {role === 'Tenant' && (
                              <div id="container">
                                <button className="learn-more" onClick={handleAddRequest}>
                                    <span className="circle" aria-hidden="true">
                                        <span className="icon arrow"></span>
                                    </span>
                                    <span className="button-text">Add Request</span>
                                </button>
                            </div>
                         )} 
                    </CCardHeader>
                    <CCardBody>
                        <div className="d-flex mb-3 gap-2">
                            
                            <div className="d-flex gap-2">
                                <CSVLink
                                    data={csvData}
                                    headers={[
                                        { label: '#', key: 'index' },
                                        { label: 'Tenant Name', key: 'tenantName' },
                                        { label: 'Email', key: 'email' },
                                        { label: 'Phone', key: 'phone' },
                                        { label: 'Status', key: 'status' },
                                    ]}
                                    filename="maintenance_requests.csv"
                                    className="btn btn-dark"
                                    title="Export CSV"
                                >
                                    <CIcon icon={cilFile} size="lg" />
                                </CSVLink>
                                <CopyToClipboard text={clipboardData}>
                                    <CButton color="dark" title="Copy to Clipboard">
                                        <CIcon icon={cilClipboard} size="lg" />
                                    </CButton>
                                </CopyToClipboard>
                                <CButton color="dark" onClick={exportToPDF} title="Export PDF">
                                    <CIcon icon={cilCloudDownload} size="lg" />
                                </CButton>
                            </div>
                            <CFormInput
                                type="text"
                                placeholder="Search by tenant name or maintenance type"
                                value={searchState.term}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="me-2"
                            />
                        </div>
                        {loading ? (
                            <CSpinner />
                        ) : error ? (
                            <div className="text-danger">{error}</div>
                        ) : maintenances && maintenances.length > 0 ? (
                            <MaintenanceTable
                                maintenanceList={maintenances}
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalRequests={totalMaintenanceRequests}
                                searchTerm={searchState.term}
                                setSearchTerm={handleSearchChange}
                                handleDelete={handleDelete}
                                handleEdit={handleEdit}
                                handleEdit1={handleEdit1}
                                handleViewDetails={handleViewDetails}
                                handleAssign={handleAssign}
                                handlePageChange={handlePageChange}
                            />
                        ) : (
                            <div className="text-center text-muted">No maintenance records found.</div>
                        )}
                    </CCardBody>
                </CCard>
            </CCol>
            {/* Modals */}
                <MaintenanceDetailsModal
                visible={modalStates.details.visible}
                setVisible={() => handleCloseModal('details')}
                maintenance={modalStates.details.maintenance}
            />
        </CRow>
    );
};

export default ViewMaintenance;