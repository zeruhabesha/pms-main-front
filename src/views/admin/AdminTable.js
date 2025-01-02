import React, { useState } from 'react';
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
  CCollapse,
} from '@coreui/react';
import "../paggination.scss";
import { CIcon } from '@coreui/icons-react';
import { cilPencil, cilTrash, cilCheckCircle, cilXCircle, cilPlus, cilMinus, cilArrowTop, cilArrowBottom } from '@coreui/icons';
import placeholder from '../image/placeholder.png';
import { CSVLink } from 'react-csv'; // For CSV Export
import { CopyToClipboard } from 'react-copy-to-clipboard'; // For Clipboard Copy
import jsPDF from 'jspdf'; // For PDF Export
import 'jspdf-autotable'; // For table styling in jsPDF
import { cilFile, cilClipboard, cilCloudDownload } from '@coreui/icons';

const AdminTable = ({
  admins = [],
  currentPage,
  totalPages,
  searchTerm,
  setSearchTerm,
  handleDelete,
  handleEdit,
  handleEditPhoto,
  handlePageChange,
}) => {
  const [expandedRows, setExpandedRows] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const toggleRow = (id) => {
    if (!id) return;
    setExpandedRows((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleDateString();
    } catch (error) {
      return 'N/A';
    }
  };

  const calculateRemainingDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 'N/A';
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const now = new Date();

      if (isNaN(start.getTime()) || isNaN(end.getTime())) return 'N/A';

      if (end < now) return 'Expired';
      if (start > now) {
        const daysUntilStart = Math.ceil((start - now) / (1000 * 60 * 60 * 24));
        return `Starts in ${daysUntilStart} days`;
      }

      const remainingDays = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
      return remainingDays > 0 ? `${remainingDays} days remaining` : 'Expired';
    } catch (error) {
      return 'N/A';
    }
  };

  const sortedAdmins = React.useMemo(() => {
    if (!sortConfig.key) return admins;

    return [...admins].sort((a, b) => {
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
  }, [admins, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prevConfig) => {
      const direction =
        prevConfig.key === key && prevConfig.direction === 'ascending' ? 'descending' : 'ascending';
      return { key, direction };
    });
  };

  const csvData = admins.map((admin, index) => ({
    index: (currentPage - 1) * 10 + index + 1,
    name: admin?.name || 'N/A',
    email: admin?.email || 'N/A',
    role: admin?.role || 'N/A',
    status: admin?.status || 'N/A',
  }));
  
  const clipboardData = admins
    .map(
      (admin, index) =>
        `${(currentPage - 1) * 10 + index + 1}. ${admin?.name || 'N/A'} - ${admin?.email || 'N/A'} - ${admin?.role || 'N/A'} - ${
          admin?.status || 'N/A'
        }`
    )
    .join('\n');
  
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Admin Data', 14, 10);
  
    const tableData = admins.map((admin, index) => [
      (currentPage - 1) * 10 + index + 1,
      admin?.name || 'N/A',
      admin?.email || 'N/A',
      admin?.role || 'N/A',
      admin?.status || 'N/A',
    ]);
  
    doc.autoTable({
      head: [['#', 'Name', 'Email', 'Role', 'Status']],
      body: tableData,
      startY: 20,
    });
  
    doc.save('admin_data.pdf');
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
              { label: 'Role', key: 'role' },
              { label: 'Status', key: 'status' },
            ]}
            filename="admin_data.csv"
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
          placeholder="Search by name, email, or role"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-100%"
        />
      </div>
  
      <div className="table-responsive">
        <CTable>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell onClick={() => handleSort('index')} style={{ cursor: 'pointer' }}>
                #
                {sortConfig.key === 'index' && (
                  <CIcon icon={sortConfig.direction === 'ascending' ? cilArrowTop : cilArrowBottom} />
                )}
              </CTableHeaderCell>
              <CTableHeaderCell>Photo</CTableHeaderCell>
              <CTableHeaderCell onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                Name
                {sortConfig.key === 'name' && (
                  <CIcon icon={sortConfig.direction === 'ascending' ? cilArrowTop : cilArrowBottom} />
                )}
              </CTableHeaderCell>
              <CTableHeaderCell onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>
                Email
                {sortConfig.key === 'email' && (
                  <CIcon icon={sortConfig.direction === 'ascending' ? cilArrowTop : cilArrowBottom} />
                )}
              </CTableHeaderCell>
              <CTableHeaderCell onClick={() => handleSort('role')} style={{ cursor: 'pointer' }}>
                Role
                {sortConfig.key === 'role' && (
                  <CIcon icon={sortConfig.direction === 'ascending' ? cilArrowTop : cilArrowBottom} />
                )}
              </CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
              <CTableHeaderCell>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {sortedAdmins.map((admin, index) => (
              <React.Fragment key={admin._id || `row-${index}`}>
                <CTableRow>
                  <CTableDataCell>{(currentPage - 1) * 10 + index + 1}</CTableDataCell>
                  <CTableDataCell>
                    <img
                      src={admin?.photo ? `http://localhost:4000/api/v1/users/${admin._id}/photo` : placeholder}
                      alt="User"
                      style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                      className="me-2"
                    />
                    <CButton color="light" size="sm" onClick={() => handleEditPhoto(admin)} title="Edit photo">
                      <CIcon icon={cilPencil} />
                    </CButton>
                  </CTableDataCell>
                  <CTableDataCell>{admin?.name || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{admin?.email || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{admin?.role || 'N/A'}</CTableDataCell>
                  <CTableDataCell>
                    {admin?.status?.toLowerCase() === 'active' ? (
                      <CIcon icon={cilCheckCircle} className="text-success" title="Active" />
                    ) : (
                      <CIcon icon={cilXCircle} className="text-danger" title="Inactive" />
                    )}
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton color="light" size="sm" className="me-2" onClick={() => handleEdit(admin)} title="Edit">
                      <CIcon icon={cilPencil} />
                    </CButton>
                    <CButton
                      color="light"
                      style={{ color: `red` }}
                      size="sm"
                      className="me-2"
                      onClick={() => handleDelete(admin)}
                      title="Delete"
                    >
                      <CIcon icon={cilTrash} />
                    </CButton>
                    <CButton color="light" size="sm" onClick={() => toggleRow(admin._id)} title="Expand">
                      <CIcon icon={expandedRows[admin._id] ? cilMinus : cilPlus} />
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableDataCell colSpan="8" className="p-0 border-0">
                    <CCollapse visible={expandedRows[admin?._id]}>
                      <div className="p-3">
                        <strong>Phone Number:</strong> {admin?.phoneNumber || 'N/A'}
                        <br />
                        <strong>Address:</strong> {admin?.address || 'N/A'}
                        <br />
                        <strong>Active Start Date:</strong> {formatDate(admin?.activeStart)}
                        <br />
                        <strong>Active End Date:</strong> {formatDate(admin?.activeEnd)}
                        <br />
                        <strong>Status:</strong>{' '}
                        <span className={calculateRemainingDays(admin?.activeStart, admin?.activeEnd) === 'Expired' ? 'text-danger' : 'text-success'}>
                          {calculateRemainingDays(admin?.activeStart, admin?.activeEnd)}
                        </span>
                      </div>
                    </CCollapse>
                  </CTableDataCell>
                </CTableRow>
              </React.Fragment>
            ))}
          </CTableBody>
        </CTable>
      </div>
  
      <div className="pagination-container d-flex justify-content-between align-items-center mt-3">
        <span>Total Admins: {admins.length}</span>
  <CPagination className="d-inline-flex" >
    <CPaginationItem disabled={currentPage === 1} onClick={() => handlePageChange(1)}>
      &laquo;
    </CPaginationItem>
    <CPaginationItem disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
      &lsaquo;
    </CPaginationItem>
    {[...Array(totalPages)].map((_, index) => (
      <CPaginationItem
      style={{background:`black`}}
        key={index + 1}
        active={index + 1 === currentPage}
        onClick={() => handlePageChange(index + 1)}
       >
        {index + 1}
      </CPaginationItem>
    ))}
    <CPaginationItem disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
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

export default AdminTable;
