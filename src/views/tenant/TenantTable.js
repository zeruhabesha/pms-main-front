// TenantTable.js
import React, { useState, useMemo, useEffect } from 'react';
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
} from '@coreui/react';
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
} from '@coreui/icons';
import { CSVLink } from 'react-csv';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import placeholder from '../image/placeholder.png';
import { decryptData } from '../../api/utils/crypto';
import  TenantDetailsModal from './TenantDetailsModal'
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
  itemsPerPage = 5,
}) => {
    const dispatch = useDispatch();
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [userPermissions, setUserPermissions] = useState(null);
      const [isModalVisible, setIsModalVisible] = useState(false);
    const selectedTenant = useSelector(state => state.tenant.selectedTenant);
      const tenantDetails = useSelector(state => state.tenant.tenantDetails)

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


  const csvData = tenants.map((tenant, index) => ({
    index: (currentPage - 1) * itemsPerPage + index + 1,
    name: tenant?.tenantName || 'N/A',
    email: tenant.contactInformation?.email || 'N/A',
    startDate: formatDate(tenant.leaseAgreement?.startDate) ,
    endDate: formatDate(tenant.leaseAgreement?.endDate) ,
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
        ]);

        doc.autoTable({
        head: [['#', 'Name', 'Email', 'Start Date', 'End Date']],
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


  const generateClearancePDF = (tenant) => {
        const doc = new jsPDF();
        const pageHeight = doc.internal.pageSize.getHeight()

        // Header
        doc.setFontSize(20);
        doc.text('Tenant Clearance Document', 105, 20, { align: 'center' });

        doc.setFontSize(12);
        const startY = 40;
        let currentY = startY;
        const lineHeight = 10;
        // Function to add text with line wrapping and page break handling
        const addWrappedText = (text, x, y, maxWidth, lineHeight) => {
            const textLines = doc.splitTextToSize(text, maxWidth);
            textLines.forEach((line) => {
                if(currentY + lineHeight > pageHeight) {
                    doc.addPage();
                    currentY = startY
                }
                    doc.text(x, currentY, line);
                    currentY += lineHeight;
            });
        };
    const maxWidth = 180
    addWrappedText(`Tenant Name: ${tenant?.tenantName || 'N/A'}`,14, currentY, maxWidth, lineHeight);
    addWrappedText(`Email: ${tenant.contactInformation?.email || 'N/A'}`, 14, currentY, maxWidth, lineHeight);
   addWrappedText(`Start Date: ${formatDate(tenant.leaseAgreement?.startDate) || 'N/A'}`, 14, currentY, maxWidth, lineHeight);
    addWrappedText(`End Date: ${formatDate(tenant.leaseAgreement?.endDate) || 'N/A'}`, 14, currentY, maxWidth, lineHeight);
    addWrappedText(`Address: ${tenant.contactInformation?.address || 'N/A'}`, 14, currentY, maxWidth, lineHeight)
    addWrappedText(`Phone Number: ${tenant.contactInformation?.phoneNumber || 'N/A'}`,14, currentY, maxWidth, lineHeight)
       // Add more information about the tenant here
       addWrappedText("Lease Information", 14, currentY, maxWidth, lineHeight);
       addWrappedText(`Security Deposit: ${tenant.leaseAgreement?.securityDeposit || 'N/A'}`, 14, currentY, maxWidth, lineHeight)
       addWrappedText(`Rent Amount: ${tenant.leaseAgreement?.rentAmount || 'N/A'}`, 14, currentY, maxWidth, lineHeight)
       addWrappedText(`Payment Frequency: ${tenant.leaseAgreement?.paymentFrequency || 'N/A'}`, 14, currentY, maxWidth, lineHeight)


    doc.text("Clearance Status:", 14, currentY + 15);
    doc.setFontSize(14);

    doc.text("Cleared", 14, currentY + 20);

    doc.save(`tenant_clearance_${tenant?.tenantName?.replace(/ /g, "_") || 'unknown'}.pdf`);
  };
    const handleViewDetails = (id) => {
      dispatch(setSelectedTenant(id));
      setIsModalVisible(true);
      dispatch(clearError())
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
              <CTableHeaderCell className="bg-body-tertiary" >Photo</CTableHeaderCell>
              <CTableHeaderCell className="bg-body-tertiary" onClick={() => handleSort('tenantName')} style={{ cursor: 'pointer' }}>
                Tenant
                {sortConfig.key === 'tenantName' && (
                  <CIcon icon={sortConfig.direction === 'ascending' ? cilArrowTop : cilArrowBottom} />
                )}
              </CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary">Contact</CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary">Lease</CTableHeaderCell>
              <CTableHeaderCell className="bg-body-tertiary">Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {sortedTenants.map((tenant, index) => (
              <CTableRow key={tenant._id}>
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
                    {/* <div className="small text-body-secondary text-nowrap">
                                        <span>ID: {tenant?._id}</span>
                                </div> */}
                </CTableDataCell>
                  <CTableDataCell>
                       <div className="small text-body-secondary text-nowrap">
                           <CIcon icon={cilEnvelopeOpen} size="sm" className="me-1" />
                            {tenant.contactInformation?.email || 'N/A'}
                        </div>
                           <div className="small text-body-secondary text-nowrap">
                                <CIcon icon={cilUser} size="sm" className="me-1"/>
                            {tenant.contactInformation?.phoneNumber || 'N/A'}
                           </div>
                  </CTableDataCell>
                   <CTableDataCell>
                    <div className="small text-body-secondary text-nowrap">
                      <CIcon icon={cilCalendar} size="sm" className="me-1" />
                        Start: {formatDate(tenant.leaseAgreement?.startDate) || 'N/A'}
                     </div>
                      <div className="small text-body-secondary text-nowrap">
                         <CIcon icon={cilCalendar} size="sm" className="me-1"/>
                         End:{formatDate(tenant.leaseAgreement?.endDate) || 'N/A'}
                     </div>
                  </CTableDataCell>
               <CTableDataCell>
                   <div className="d-flex align-items-center">
                   {userPermissions?.editTenant && (
                      <CButton
                          color="light"
                          size="sm"
                          onClick={() => handleEdit(tenant._id)}  // Pass tenant._id here
                          title="Edit"
                          className="ms-2"
                      >
                        <CIcon icon={cilPencil} />
                      </CButton>
                  )}
                   {userPermissions?.deleteTenant && (
                      <CButton
                         color="light"
                         size="sm"
                          className="ms-2"
                         onClick={() => handleDelete(tenant._id)}
                          title="Delete"
                        style={{ color: 'red' }}
                      >
                         <CIcon icon={cilTrash} />
                      </CButton>
                  )}
                   <CButton
                    color="light"
                    size="sm"
                    className="ms-2"
                    title="View Details"
                    onClick={() => handleViewDetails(tenant._id)}
                  >
                       <CIcon icon={cilFullscreen} />
                  </CButton>
                 <ClearancePDFButton tenant={tenant} />
                 </div>
             </CTableDataCell>
           </CTableRow>
        ))}
    </CTableBody>
 </CTable>
      <div className="d-flex justify-content-between align-items-center mt-3">
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
        className="page-item"
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
    </div>   </div>
  );
};

export default TenantTable;