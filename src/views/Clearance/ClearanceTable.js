import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
    CTable,
    CTableBody,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CTableDataCell,
    CButton,
    CPagination,
    CPaginationItem,
    CFormInput,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
    CBadge,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
} from '@coreui/react';
import "../paggination.scss";
import { CIcon } from '@coreui/icons-react';
import {
    cilPencil,
    cilTrash,
    cilArrowTop,
    cilArrowBottom,
    cilFile,
    cilClipboard,
    cilCloudDownload,
    cilFullscreen,
    cilOptions,
    cilInfo,
    cilCalendar,
    cilDescription,
} from '@coreui/icons';
import { CSVLink } from 'react-csv';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { decryptData } from '../../api/utils/crypto';
import { formatDate } from "../../api/utils/dateFormatter";
import { setSelectedClearance } from '../../api/slice/clearanceSlice';
// import { deleteClearance, updateClearance, fetchClearances } from '../../api/actions/ClearanceAction';
import { deleteClearance, updateClearance, fetchClearances, fetchClearanceById } from '../../api/actions/ClearanceAction';
import debounce from 'lodash/debounce';
import ClearanceTableData from "./ClearanceTableData";

const ClearanceTable = ({
    clearances,
    currentPage,
    totalPages,
    searchTerm,
    setSearchTerm,
    itemsPerPage = 10,
    handleViewDetails,
    handleEditClearance,
    handleDelete,
    setAddClearanceModalVisible,
    handlePageChange
}) => {
    const dispatch = useDispatch();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedClearance, setSelectedClearanceData] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [userPermissions, setUserPermissions] = useState(null);
    const dropdownRefs = useRef({});
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [approveModalVisible, setApproveModalVisible] = useState(false);
    const [clearanceToApprove, setClearanceToApprove] = useState(null);
    const [statusFilter, setStatusFilter] = useState('');
    const [role, setRole] = useState(null)

    const handleClickOutside = useCallback((event) => {
        if (dropdownOpen) {
            const ref = dropdownRefs.current[dropdownOpen];
            if (ref && !ref.contains(event.target)) {
                setDropdownOpen(null)
            }
        }
    }, [dropdownOpen]);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);


    useEffect(() => {
        try {
          const encryptedUser = localStorage.getItem('user')
          if (encryptedUser) {
            const decryptedUser = decryptData(encryptedUser)
            setUserPermissions(decryptedUser?.permissions || null)
            setRole(decryptedUser?.role || null)
          }
        } catch (err) {
          setError('Failed to load user permissions')
          console.error('Permission loading error:', err)
        }
      }, [])


    const handleSort = (key) => {
        setSortConfig((prevConfig) => {
            const direction =
                prevConfig.key === key && prevConfig.direction === 'ascending' ? 'descending' : 'ascending';
            return { key, direction };
        });
    };

    const sortedClearances = useMemo(() => {
        if (!sortConfig.key) return clearances;

        return [...clearances].sort((a, b) => {
            const aKey = (a[sortConfig.key] && typeof a[sortConfig.key] === 'object') ? (a[sortConfig.key]?.tenantName || a[sortConfig.key]?.name || '') : (a[sortConfig.key] || '');
            const bKey = (b[sortConfig.key] && typeof b[sortConfig.key] === 'object') ? (b[sortConfig.key]?.tenantName || b[sortConfig.key]?.name || '') : (b[sortConfig.key] || '');

            if (aKey < bKey) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (aKey > bKey) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
    }, [clearances, sortConfig]);



    const csvData = clearances.map((clearance, index) => ({
        index: (currentPage - 1) * itemsPerPage + index + 1,
        tenantName: clearance?.tenant?.tenantName || 'N/A',
        notes: clearance?.notes || 'N/A',
        moveOutDate: formatDate(clearance?.moveOutDate) || 'N/A',
        status: clearance?.status || 'N/A',
    }));

    const clipboardData = clearances
        .map(
            (clearance, index) =>
                `${(currentPage - 1) * itemsPerPage + index + 1}.  Tenant Name: ${clearance?.tenant?.tenantName || 'N/A'}, Notes: ${
                    clearance?.notes || 'N/A'
                }, Move Out Date: ${formatDate(clearance?.moveOutDate) || 'N/A'}, Status: ${clearance?.status || 'N/A'}`
        )
        .join('\n');

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text('Clearance Data', 14, 10);

        const tableData = clearances.map((clearance, index) => [
            (currentPage - 1) * itemsPerPage + index + 1,
            clearance?.tenant?.tenantName || 'N/A',
            clearance?.notes || 'N/A',
            formatDate(clearance?.moveOutDate) || 'N/A',
            clearance?.status || 'N/A',
        ]);

        doc.autoTable({
            head: [['#', 'Tenant Name', 'Notes', 'Move Out Date', 'Status']],
            body: tableData,
            startY: 20,
        });

        doc.save('clearance_data.pdf');
    };

    const debouncedSearch = useCallback(
        debounce((term) => {
            dispatch(fetchClearances({ page: 1, limit: itemsPerPage, search: term, status: statusFilter }));
        }, 500),
        [dispatch, itemsPerPage, statusFilter]
    );

    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        debouncedSearch(term);
    };
    const handleEdit = async (clearanceId) => {
        try {
            const response = await dispatch(fetchClearanceById(clearanceId)).unwrap()

            if (response) {
                 setSelectedClearanceData(response);
                 handleEditClearance(response)
            } else {
                 console.error('No data returned for the selected clearance.')
                 alert('No data returned for the selected clearance.')
            }
       } catch (error) {
            console.error('Failed to fetch clearance details for editing:', error)
            alert('Failed to fetch clearance details for editing. Please try again.')
       }
    }
    const handleApprove = (clearance) => {
        setClearanceToApprove(clearance);
        setApproveModalVisible(true);
    };
    const handleDeleteItem = (id) => {
        handleDelete(id)
    };
    const toggleDropdown = (clearanceId) => {
        setDropdownOpen(prevState => prevState === clearanceId ? null : clearanceId);
    };
    const closeDropdown = () => {
        setDropdownOpen(null);
    };
    const handleModalOpen = (clearance) => {
        setSelectedClearanceData(clearance);
        setModalVisible(true);
         handleViewDetails(clearance?.tenant?._id);
    };

    const handleModalClose = () => {
        setModalVisible(false);
        setSelectedClearanceData(null);
    };
    const baseURL = "http://localhost:4000/api/v1/";

    const getStatusStyle = (status) => {
        switch (status) {
            case 'rejected':
                return { fontWeight: 'bold', color: 'red' };
            case 'pending':
                return { fontWeight: 'bold', color: 'orange' };
            case 'approved':
                return { fontWeight: 'bold', color: 'green' };
            case 'inspected':
                return { fontWeight: 'bold', color: 'blue' };
            default:
                return {};
        }
    };
    const confirmApprove = async () => {
        if (!clearanceToApprove?._id) {
            toast.error('No clearance request selected for approval');
            return;
        }
        try {
            await dispatch(updateClearance({id: clearanceToApprove._id, clearanceData: { ...clearanceToApprove, status: "Approved" }})).unwrap();
            toast.success('Clearance approved successfully');
            dispatch(fetchClearances({ page: currentPage, limit: itemsPerPage, search: searchTerm, status: statusFilter }));
            setApproveModalVisible(false);
        } catch (error) {
            toast.error(error?.message || 'Failed to approve clearance request');
        }
    }
    const confirmReject = async () => {
         if (!clearanceToApprove?._id) {
             toast.error('No clearance request selected for rejection');
             return;
         }
        try {
             await dispatch(updateClearance({id: clearanceToApprove._id, clearanceData: { ...clearanceToApprove, status: "Rejected" }})).unwrap();
            toast.success('Clearance rejected successfully');
            dispatch(fetchClearances({ page: currentPage, limit: itemsPerPage, search: searchTerm, status: statusFilter }));
            setApproveModalVisible(false);
        } catch (error) {
             toast.error(error?.message || 'Failed to reject clearance request');
        }
     }

    const handleCloseApproveModal = () => {
        setApproveModalVisible(false);
        setClearanceToApprove(null);
    };

    return (
        <div>
            <div className="d-flex mb-3 gap-2">
                <div className="d-flex gap-2">
                    <CSVLink
                        data={csvData}
                        headers={[
                            { label: '#', key: 'index' },
                            { label: 'Tenant Name', key: 'tenantName' },
                            { label: 'Notes', key: 'notes' },
                            { label: 'Move Out Date', key: 'moveOutDate' },
                            { label: 'Status', key: 'status' },
                        ]}
                        filename="clearance_data.csv"
                        className="btn btn-dark"
                    >
                        <CIcon icon={cilFile} title="Export CSV" />
                    </CSVLink>
                    <CopyToClipboard text={clipboardData}>
                        <CButton color="dark" title="Copy to Clipboard">
                            <CIcon icon={cilClipboard} />
                        </CButton>
                    </CopyToClipboard>
                    <CButton color="dark" onClick={exportToPDF} title="Export PDF">
                        <CIcon icon={cilCloudDownload} />
                    </CButton>
                </div>
                <CFormInput
                    type="text"
                    placeholder="Search by tenant name or reason"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>
           <ClearanceTableData
                    clearances={sortedClearances}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    sortConfig={sortConfig}
                    handleSort={handleSort}
                    handleEdit={handleEdit}
                    handleDelete={handleDeleteItem}
                    userPermissions={userPermissions}
                    role={role}
                    dropdownOpen={dropdownOpen}
                    toggleDropdown={toggleDropdown}
                    closeDropdown={closeDropdown}
                    dropdownRefs={dropdownRefs}
                    handleViewDetails={handleViewDetails}
                    handleApprove={handleApprove}
                    getStatusStyle={getStatusStyle}
                />
             <CModal
                visible={approveModalVisible}
                onClose={handleCloseApproveModal}
                size="sm"
            >
                <CModalHeader onClose={handleCloseApproveModal}>
                    <CModalTitle>Approve or Reject Clearance Request</CModalTitle>
                </CModalHeader>
                 <CModalBody>
                    Are you sure you want to proceed with this request?
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={handleCloseApproveModal}>
                        Cancel
                    </CButton>
                      <CButton color="danger" onClick={confirmReject}>
                        Reject
                    </CButton>
                    <CButton color="primary" onClick={confirmApprove}>
                        Approve
                    </CButton>
                </CModalFooter>
            </CModal>
        </div>
    );
};

export default ClearanceTable