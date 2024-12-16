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
  CFormInput,
  CBadge,
  CAlert,
} from '@coreui/react';
import { CIcon } from '@coreui/icons-react';
import {
  cilPencil,
  cilTrash,
  cilZoom,
  cilArrowTop,
  cilArrowBottom,
  cilFile,
  cilClipboard,
  cilCloudDownload,
} from '@coreui/icons';
import { CSVLink } from 'react-csv';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { decryptData } from '../../api/utils/crypto';

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

  // Status color mapping
  const getStatusColor = useCallback((status) => {
    const statusColorMap = {
      pending: 'warning',
      'in progress': 'info',
      completed: 'success',
    };
    return statusColorMap[status?.toLowerCase()] || 'secondary';
  }, []);

  // Sorted maintenance list
  const sortedMaintenance = useMemo(() => {
    if (!sortConfig.key) return maintenanceList;

    return [...maintenanceList].sort((a, b) => {
      const aValue = a[sortConfig.key]?.toString() || '';
      const bValue = b[sortConfig.key]?.toString() || '';

      return sortConfig.direction === 'ascending'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
  }, [maintenanceList, sortConfig]);

  // Data for CSV export
  const csvData = useMemo(
    () =>
      maintenanceList.map((maintenance, index) => ({
        index: (currentPage - 1) * 5 + index + 1,
        tenantName: maintenance.tenant?.tenantName || 'N/A',
        email: maintenance.tenant?.contactInformation?.email || 'N/A',
        phone: maintenance.tenant?.contactInformation?.phoneNumber || 'N/A',
        status: maintenance.status || 'N/A',
      })),
    [maintenanceList, currentPage]
  );

  // Data for clipboard
  const clipboardData = useMemo(
    () =>
      maintenanceList
        .map(
          (maintenance, index) =>
            `${(currentPage - 1) * 5 + index + 1}. ${maintenance.tenant?.tenantName || 'N/A'} - ${
              maintenance.tenant?.contactInformation?.email || 'N/A'
            } - ${maintenance.status || 'N/A'}`
        )
        .join('\n'),
    [maintenanceList, currentPage]
  );

  // Export to PDF
  const exportToPDF = useCallback(() => {
    try {
      const doc = new jsPDF();
      doc.text('Maintenance Requests', 14, 10);

      const tableData = maintenanceList.map((maintenance, index) => [
        (currentPage - 1) * 5 + index + 1,
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
    } catch (err) {
      setError('Failed to export PDF');
      console.error('PDF export error:', err);
    }
  }, [maintenanceList, currentPage]);

  return (
    <div>
      {error && (
        <CAlert color="danger" dismissible onClose={() => setError(null)}>
          {error}
        </CAlert>
      )}
      {/* Export and Search */}
      <div className="d-flex mb-3 gap-2">
        <CFormInput
          type="text"
          placeholder="Search by tenant name or status"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="me-2"
        />
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
      </div>

      {/* Maintenance Table */}
      <CTable striped hover bordered>
        <CTableHead className="table-light">
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>Tenant Name</CTableHeaderCell>
            <CTableHeaderCell>Email</CTableHeaderCell>
            <CTableHeaderCell>Phone</CTableHeaderCell>
            <CTableHeaderCell onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
              Status
              {sortConfig.key === 'status' && (
                <CIcon
                  icon={sortConfig.direction === 'ascending' ? cilArrowTop : cilArrowBottom}
                />
              )}
            </CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {sortedMaintenance.map((maintenance, index) => (
            <CTableRow key={maintenance._id || index}>
              <CTableDataCell>{(currentPage - 1) * 5 + index + 1}</CTableDataCell>
              <CTableDataCell>{maintenance.tenant?.tenantName || 'N/A'}</CTableDataCell>
              <CTableDataCell>{maintenance.tenant?.contactInformation?.email || 'N/A'}</CTableDataCell>
              <CTableDataCell>{maintenance.tenant?.contactInformation?.phoneNumber || 'N/A'}</CTableDataCell>
              <CTableDataCell>
                <CBadge color={getStatusColor(maintenance.status)}>
                  {maintenance.status || 'N/A'}
                </CBadge>
              </CTableDataCell>
              <CTableDataCell>
                <CButton
                  color="light"
                  size="sm"
                  className="me-2"
                  onClick={() => handleViewDetails(maintenance)}
                  title="View Details"
                >
                  <CIcon icon={cilZoom} />
                </CButton>
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
                    style={{ color: `red` }}
                    size="sm"
                    onClick={() => handleDelete(maintenance)}
                    title="Delete"
                  >
                    <CIcon icon={cilTrash} />
                  </CButton>
                )}
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <span>Total Requests: {totalRequests}</span>
        <CPagination className="d-inline-flex">
          <CPaginationItem disabled={currentPage === 1} onClick={() => handlePageChange(1)}>
            &laquo;
          </CPaginationItem>
          <CPaginationItem
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            &lsaquo;
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
            &rsaquo;
          </CPaginationItem>
          <CPaginationItem disabled={currentPage === totalPages} onClick={() => handlePageChange(totalPages)}>
            &raquo;
          </CPaginationItem>
        </CPagination>
      </div>
    </div>
  );
};

export default React.memo(MaintenanceTable);
