import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
    cilPrint,
    cilPeople,
    cilUser,
    cilEnvelopeOpen,
    cilCalendar,
    cilOptions,
    cilCheckCircle,
    cilWarning,
    cilXCircle,
} from '@coreui/icons';
import { CSVLink } from 'react-csv';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import placeholder from '../image/placeholder.png';
import { decryptData } from '../../api/utils/crypto';
import TenantDetailsModal from './TenantDetailsModal'
import { setSelectedTenant, clearError } from '../../api/slice/TenantSlice';
import ClearancePDFButton from './ClearancePDFButton';

const TenantTable = ({
    tenants = [],
    currentPage,
    totalPages,
    searchTerm,
    setSearchTerm,
    handleEditPhoto,
    handleEdit,
    handleDelete,
    handlePageChange,
    handleFetchTenants,
    itemsPerPage = 10,
}) => {
    const dispatch = useDispatch();
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [userPermissions, setUserPermissions] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const selectedTenant = useSelector(state => state.tenant.selectedTenant);
    const tenantDetails = useSelector(state => state.tenant.tenantDetails)
      const [dropdownOpen, setDropdownOpen] = useState(null);
      const dropdownRefs = useRef({});

    useEffect(() => {
        const encryptedUser = localStorage.getItem('user');
        if (encryptedUser) {
            const decryptedUser = decryptData(encryptedUser);
            if (decryptedUser && decryptedUser.permissions) {
                setUserPermissions(decryptedUser.permissions);
            }
        }
    }, []);

    const handleSort = (key) => {
        setSortConfig((prevConfig) => {
            const direction =
                prevConfig.key === key && prevConfig.direction === 'ascending' ? 'descending' : 'ascending';
            return { key, direction };
        });
    };

    const sortedTenants = useMemo(() => {
        if (!sortConfig.key) return tenants;

        return [...tenants].sort((a, b) => {
            const aKey = a[sortConfig.key] || '';
            const bKey = b[sortConfig.key] || '';

            if (aKey < bKey) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (aKey > bKey) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
    }, [tenants, sortConfig]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        } catch (e) {
            return "N/A";
        }
    };

    const calculateDaysUntilEnd = (endDate) => {
      if (!endDate) return null;
      try {
        const end = new Date(endDate).getTime();
          const now = new Date().getTime();
          const diffInTime = end - now;
          const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));
        return diffInDays;
      } catch (e) {
          return null
      }
    };

  const getStatusDetails = (endDate) => {
        const days = calculateDaysUntilEnd(endDate);
        if (days === null) {
          return {
            text: "N/A",
            color: "text-secondary",
            icon: null
          };
        } else if (days > 30) {
            return {
                text: `${days} days`,
                color: 'text-success',
                icon: cilCheckCircle
            };
        } else if (days < 30 && days >= 0) {
            return {
                text: `${days} days`,
                color: 'text-warning',
                icon: cilWarning
            };
        } else if (days < 0) {
             return {
                text: `${days} days`,
                color: 'text-danger',
                icon: cilXCircle
            };
        }
       return {
            text: `${days} days`,
            color: 'text-secondary',
            icon: null
        };
    };

    const csvData = tenants.map((tenant, index) => ({
        index: (currentPage - 1) * itemsPerPage + index + 1,
        name: tenant?.tenantName || 'N/A',
        email: tenant.contactInformation?.email || 'N/A',
        startDate: formatDate(tenant.leaseAgreement?.startDate),
        endDate: formatDate(tenant.leaseAgreement?.endDate),
         status: getStatusDetails(tenant.leaseAgreement?.endDate)?.text || 'N/A'
    }));

    const clipboardData = tenants
        .map(
            (tenant, index) =>
                `${(currentPage - 1) * itemsPerPage + index + 1}. ${tenant?.tenantName || 'N/A'} - ${
                    tenant.contactInformation?.email || 'N/A'
                }`
        )
        .join('\n');

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text('Tenant Data', 14, 10);

        const tableData = tenants.map((tenant, index) => [
            (currentPage - 1) * itemsPerPage + index + 1,
            tenant?.tenantName || 'N/A',
            tenant.contactInformation?.email || 'N/A',
            formatDate(tenant.leaseAgreement?.startDate) || 'N/A',
            formatDate(tenant.leaseAgreement?.endDate) || 'N/A',
             getStatusDetails(tenant.leaseAgreement?.endDate)?.text || 'N/A',
        ]);

        doc.autoTable({
            head: [['#', 'Name', 'Email', 'Start Date', 'End Date', 'Status']],
            body: tableData,
            startY: 20,
        });

        doc.save('tenant_data.pdf');
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (typeof handleFetchTenants === 'function') {
                handleFetchTenants({ search: searchTerm });
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, handleFetchTenants]);

    const toggleDropdown = (tenantId) => {
        setDropdownOpen(prevState => prevState === tenantId ? null : tenantId);
    };

    const closeDropdown = () => {
        setDropdownOpen(null);
    };

    const handleViewDetails = (id) => {
        if (id) {
            dispatch(setSelectedTenant(id));
            setIsModalVisible(true);
            dispatch(clearError());
        }
    };


    return (
        <div>
            <div className="d-flex mb-3 gap-2">

                <div className="d-flex gap-2">
                    <CSVLink
                        data={csvData}
                        headers={[
                            { label: '#', key: 'index' },
                            { label: 'Name', key: 'name' },
                            { label: 'Email', key: 'email' },
                            { label: 'Start Date', key: 'startDate' },
                            { label: 'End Date', key: 'endDate' },
                                { label: 'Status', key: 'status' },
                        ]}
                        filename="tenant_data.csv"
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
                    placeholder="Search by name or email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                    <CTableRow>
                        <CTableHeaderCell className="bg-body-tertiary text-center">
                            <CIcon icon={cilPeople} />
                        </CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary">Photo</CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary" onClick={() => handleSort('tenantName')} style={{ cursor: 'pointer' }}>
                            Tenant
                            {sortConfig.key === 'tenantName' && (
                                <CIcon icon={sortConfig.direction === 'ascending' ? cilArrowTop : cilArrowBottom} />
                            )}
                        </CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary">Contact</CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary">Lease</CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary">Status</CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary">Actions</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {sortedTenants?.map((tenant, index) => (
                        <CTableRow key={tenant?._id || index}>
                            <CTableDataCell className="text-center">
                                {(currentPage - 1) * itemsPerPage + index + 1}
                            </CTableDataCell>
                            <CTableDataCell>
                                <img
                                    src={placeholder}
                                    alt="Tenant"
                                    style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                                />
                                 
                                {userPermissions?.editTenantPhotos && (
                                    <CButton
                                        color="light"
                                        size="sm"
                                        onClick={() => handleEditPhoto(tenant)}
                                        title="Edit photo"
                                        className="ms-2"
                                    >
                                        <CIcon icon={cilPencil} />
                                    </CButton>
                                )}
                            </CTableDataCell>
                            <CTableDataCell>
                                <div>{tenant?.tenantName || 'N/A'}</div>
                            </CTableDataCell>
                            <CTableDataCell>
                                <div className="small text-body-secondary text-nowrap">
                                    <CIcon icon={cilEnvelopeOpen} size="sm" className="me-1" />
                                    {tenant.contactInformation?.email || 'N/A'}
                                </div>
                                <div className="small text-body-secondary text-nowrap">
                                    <CIcon icon={cilUser} size="sm" className="me-1" />
                                    {tenant.contactInformation?.phoneNumber || 'N/A'}
                                </div>
                            </CTableDataCell>
                            <CTableDataCell>
                                <div className="small text-body-secondary text-nowrap">
                                    <CIcon icon={cilCalendar} size="sm" className="me-1" />
                                    Start: {formatDate(tenant.leaseAgreement?.startDate) || 'N/A'}
                                </div>
                                <div className="small text-body-secondary text-nowrap">
                                    <CIcon icon={cilCalendar} size="sm" className="me-1" />
                                    End:{formatDate(tenant.leaseAgreement?.endDate) || 'N/A'}
                                </div>
                            </CTableDataCell>
                            <CTableDataCell>
                                <div className={`d-flex align-items-center ${getStatusDetails(tenant.leaseAgreement?.endDate)?.color || ''}`}>
                                     {getStatusDetails(tenant.leaseAgreement?.endDate)?.text}
                                    {
                                    getStatusDetails(tenant.leaseAgreement?.endDate)?.icon && (
                                            <CIcon
                                                icon={getStatusDetails(tenant.leaseAgreement?.endDate)?.icon}
                                                 className="ms-1"
                                             />
                                        )}
                                </div>
                            </CTableDataCell>
                            <CTableDataCell>
                                 <CDropdown
                                          variant="btn-group"
                                          isOpen={dropdownOpen === tenant?._id}
                                          onToggle={() => toggleDropdown(tenant?._id)}
                                          onMouseLeave={closeDropdown}
                                          innerRef={ref => (dropdownRefs.current[tenant?._id] = ref)}
                                        >
                                    <CDropdownToggle color="light" caret={false} size="sm" title="Actions">
                                        <CIcon icon={cilOptions} />
                                    </CDropdownToggle>
                                        <CDropdownMenu>
                                             {userPermissions?.editTenant && (
                                                    <CDropdownItem
                                                        onClick={() => handleEdit(tenant?._id)}
                                                        title="Edit"
                                                    >
                                                       <CIcon icon={cilPencil} className="me-2"/>
                                                        Edit
                                                    </CDropdownItem>
                                                )}
                                                {userPermissions?.deleteTenant && (
                                                    <CDropdownItem
                                                        onClick={() => handleDelete(tenant?._id)}
                                                        title="Delete"
                                                         style={{ color: 'red' }}
                                                    >
                                                      <CIcon icon={cilTrash} className="me-2"/>
                                                      Delete
                                                    </CDropdownItem>
                                                )}
                                                  <CDropdownItem  onClick={() => handleViewDetails(tenant?._id)}
                                                      title="View Details"
                                                >
                                                    <CIcon icon={cilFullscreen} className="me-2"/>
                                                         Details
                                                </CDropdownItem>
                                                   <CDropdownItem>
                                                          <ClearancePDFButton tenant={tenant} />
                                                    </CDropdownItem>
                                        </CDropdownMenu>
                                </CDropdown>
                            </CTableDataCell>
                        </CTableRow>
                    ))}
                </CTableBody>
            </CTable>
            <div className="pagination-container d-flex justify-content-between align-items-center mt-3">
                <span>Total Tenants: {tenants.length}</span>
                <CPagination className="mt-3">
                    <CPaginationItem disabled={currentPage === 1} onClick={() => handlePageChange(1)}>
                        «
                    </CPaginationItem>
                    <CPaginationItem
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                    >
                        ‹
                    </CPaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <CPaginationItem
                            key={page}
                            active={page === currentPage}
                            className=""
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </CPaginationItem>

                    ))}
                    <CPaginationItem
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                    >
                        ›
                    </CPaginationItem>
                    <CPaginationItem
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(totalPages)}
                    >
                        »
                    </CPaginationItem>
                </CPagination>
                <TenantDetailsModal
                    visible={isModalVisible}
                    setVisible={setIsModalVisible}
                    tenantDetails={tenantDetails}
                />
            </div>
        </div>
    );
};

export default TenantTable;