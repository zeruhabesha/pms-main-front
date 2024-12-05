import React, { useState, useMemo,useEffect  } from 'react';
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
  cilZoom,
} from '@coreui/icons';
import { CSVLink } from 'react-csv';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import placeholder from '../image/placeholder.png';

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
  itemsPerPage = 5,
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

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

  const csvData = tenants.map((tenant, index) => ({
    index: (currentPage - 1) * itemsPerPage + index + 1,
    name: tenant?.tenantName || 'N/A',
    email: tenant.contactInformation?.email || 'N/A',
    startDate: tenant.leaseAgreement?.startDate || 'N/A',
    endDate: tenant.leaseAgreement?.endDate || 'N/A',
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
      tenant.leaseAgreement?.startDate || 'N/A',
      tenant.leaseAgreement?.endDate || 'N/A',
    ]);

    doc.autoTable({
      head: [['#', 'Name', 'Email', 'Start Date', 'End Date']],
      body: tableData,
      startY: 20,
    });

    doc.save('tenant_data.pdf');
  };

  const filteredTenants = useMemo(() => {
    if (!searchTerm) return tenants;
  
    return tenants.filter((tenant) =>
      `${tenant?.tenantName || ''} ${tenant?.contactInformation?.email || ''}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [tenants, searchTerm]);
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleFetchTenants({ searchTerm });
    }, 500); // Debounce time
  
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);
  
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

      <div className="table-responsive">
        <CTable>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>#</CTableHeaderCell>
              <CTableHeaderCell>Photo</CTableHeaderCell>
              <CTableHeaderCell onClick={() => handleSort('tenantName')} style={{ cursor: 'pointer' }}>
                Name
                {sortConfig.key === 'tenantName' && (
                  <CIcon icon={sortConfig.direction === 'ascending' ? cilArrowTop : cilArrowBottom} />
                )}
              </CTableHeaderCell>
              <CTableHeaderCell>Email</CTableHeaderCell>
              <CTableHeaderCell>Start Date</CTableHeaderCell>
              <CTableHeaderCell>End Date</CTableHeaderCell>
              <CTableHeaderCell>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
          {filteredTenants.map((tenant, index) => (
  <CTableRow key={tenant._id}>
                <CTableDataCell>{(currentPage - 1) * itemsPerPage + index + 1}</CTableDataCell>
                <CTableDataCell>
                  <img
                    src={placeholder}
                    alt="Tenant"
                    style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                  />
                  <CButton
                    color="light"
                    size="sm"
                    onClick={() => handleEditPhoto(tenant)}
                    title="Edit photo"
                    className="ms-2"
                  >
                    <CIcon icon={cilPencil} />
                  </CButton>
                </CTableDataCell>
                <CTableDataCell>{tenant?.tenantName || 'N/A'}</CTableDataCell>
                <CTableDataCell>{tenant.contactInformation?.email || 'N/A'}</CTableDataCell>
                <CTableDataCell>{tenant.leaseAgreement?.startDate || 'N/A'}</CTableDataCell>
                <CTableDataCell>{tenant.leaseAgreement?.endDate || 'N/A'}</CTableDataCell>
                <CTableDataCell>
                  <CButton
                    color="light"
                    size="sm"
                    onClick={() => handleEdit(tenant)}
                    title="Edit"
                    className="ms-2"
                  >
                    <CIcon icon={cilPencil} />
                  </CButton>
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
                  <CButton
                    color="light"
                    size="sm"
                    className="ms-2"
                    title="View Details"
                  >
                    <CIcon icon={cilZoom} />
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </div>

      <CPagination className="mt-3">
        <CPaginationItem disabled={currentPage === 1} onClick={() => handlePageChange(1)}>
          &laquo;
        </CPaginationItem>
        <CPaginationItem
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          &lsaquo;
        </CPaginationItem>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <CPaginationItem
            key={page}
            active={page === currentPage}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </CPaginationItem>
        ))}
        <CPaginationItem
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          &rsaquo;
        </CPaginationItem>
        <CPaginationItem
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(totalPages)}
        >
          &raquo;
        </CPaginationItem>
      </CPagination>
    </div>
  );
};

export default TenantTable;
