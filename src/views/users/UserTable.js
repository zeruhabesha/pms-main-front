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
} from '@coreui/react';
import { CIcon } from '@coreui/icons-react';
import {
  cilPencil,
  cilTrash,
  cilCheckCircle,
  cilXCircle,
  cilFile,
  cilClipboard,
  cilCloudDownload,
  cilFullscreen,
  cilUser,
  cilSettings,
  cilSearch
} from '@coreui/icons';
import placeholder from '../image/placeholder.png';
import PermissionsModal from './PermissionsModal';
import { ToastContainer, toast } from 'react-toastify';
import { CSVLink } from 'react-csv';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import 'react-toastify/dist/ReactToastify.css';
import UserDetailsModal from './UserDetailsModal';

const UserTable = ({
  users,
  currentPage,
  totalPages,
  searchTerm,
  setSearchTerm,
  handleEdit,
  handleDelete,
  handleEditPhoto,
  handlePageChange,
  itemsPerPage = 5,
}) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [permissionsModalVisible, setPermissionsModalVisible] = useState(false);
  const [userDetailsModalVisible, setUserDetailsModalVisible] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const handleSort = (key) => {
    setSortConfig((prevConfig) => {
      const direction =
        prevConfig.key === key && prevConfig.direction === 'ascending' ? 'descending' : 'ascending';
      return { key, direction };
    });
  };

  const sortedUsers = React.useMemo(() => {
    if (!sortConfig.key) return users;

    return [...users].sort((a, b) => {
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
  }, [users, sortConfig]);

  const getRoleIcon = (role) => {
    switch (role?.toLowerCase()) {
      case 'user':
        return <CIcon icon={cilUser} className="text-primary" title="User" />;
      case 'maintenance':
        return <CIcon icon={cilSettings} className="text-warning" title="Maintenance" />;
      case 'inspector':
        return <CIcon icon={cilSearch} className="text-success" title="Inspector" />;
      default:
        return null;
    }
  };

  const csvData = users.map((user, index) => ({
    index: (currentPage - 1) * itemsPerPage + index + 1,
    name: user?.name || 'N/A',
    email: user?.email || 'N/A',
    role: user?.role || 'N/A',
    status: user?.status || 'N/A',
  }));

  const clipboardData = users
    .map(
      (user, index) =>
        `${(currentPage - 1) * itemsPerPage + index + 1}. ${user?.name || 'N/A'} - ${user?.email || 'N/A'} - ${
          user?.role || 'N/A'
        } - ${user?.status || 'N/A'}`
    )
    .join('\n');

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('User Data', 14, 10);

    const tableData = users.map((user, index) => [
      (currentPage - 1) * itemsPerPage + index + 1,
      user?.name || 'N/A',
      user?.email || 'N/A',
      user?.role || 'N/A',
      user?.status || 'N/A',
    ]);

    doc.autoTable({
      head: [['#', 'Name', 'Email', 'Role', 'Status']],
      body: tableData,
      startY: 20,
    });

    doc.save('user_data.pdf');
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <CPaginationItem
            key={i}
            active={i === currentPage}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </CPaginationItem>
        );
      }
      return items;
    }

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage === totalPages) {
      startPage = Math.max(1, totalPages - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      items.push(
        <CPaginationItem
          key={1}
          active={1 === currentPage}
          onClick={() => handlePageChange(1)}
        >
          1
        </CPaginationItem>
      );
      if (startPage > 2) {
        items.push(
          <CPaginationItem key="start-ellipsis" disabled>
            ...
          </CPaginationItem>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <CPaginationItem
          key={i}
          active={i === currentPage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </CPaginationItem>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <CPaginationItem key="end-ellipsis" disabled>
            ...
          </CPaginationItem>
        );
      }
      items.push(
        <CPaginationItem
          key={totalPages}
          active={totalPages === currentPage}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </CPaginationItem>
      );
    }

    return items;
  };

  const handleUserDetailsClick = (user) => {
    setSelectedUser(user);
    setUserDetailsModalVisible(true);
  };

  const handleUserDetailsClose = () => {
    setSelectedUser(null);
    setUserDetailsModalVisible(false);
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
            filename="user_data.csv"
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
          placeholder="Search by name, email, role, or status"
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
              <CTableHeaderCell>Role</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
              <CTableHeaderCell>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {sortedUsers.map((user, index) => (
              <CTableRow key={user._id || `row-${index}`}>
                <CTableDataCell>{(currentPage - 1) * itemsPerPage + index + 1}</CTableDataCell>
                <CTableDataCell>
                  <img
                    src={user?.photo ? `http://localhost:4000/api/v1/users/${user._id}/photo` : placeholder}
                    alt="User"
                    style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                    className="me-2"
                  />
                  <CButton color="light" size="sm" onClick={() => handleEditPhoto(user)} title="Edit photo">
                    <CIcon icon={cilPencil} />
                  </CButton>
                </CTableDataCell>
                <CTableDataCell>{user?.name || 'N/A'}</CTableDataCell>
                <CTableDataCell>{user?.email || 'N/A'}</CTableDataCell>
                <CTableDataCell>
                  {getRoleIcon(user?.role)} {user?.role || 'N/A'}
                </CTableDataCell>
                <CTableDataCell>
                  {user?.status?.toLowerCase() === 'active' ? (
                    <CIcon icon={cilCheckCircle} className="text-success" title="Active" />
                  ) : (
                    <CIcon icon={cilXCircle} className="text-danger" title="Inactive" />
                  )}
                </CTableDataCell>
                <CTableDataCell>
                  <CButton
                    color="light"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(user)}
                    title="Edit"
                  >
                    <CIcon icon={cilPencil} />
                  </CButton>
                  <CButton
                    color="light"
                    style={{ color: 'red' }}
                    size="sm"
                    className="me-2"
                    onClick={() => handleDelete(user)}
                    title="Delete"
                  >
                    <CIcon icon={cilTrash} />
                  </CButton>
                  <CButton
                    color="light"
                    size="sm"
                    onClick={() => handleUserDetailsClick(user)}
                    title="Details"
                  >
                    <CIcon icon={cilFullscreen} />
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <span>Total Users: {users.length}</span>
        <CPagination className="d-inline-flex">
          <CPaginationItem
            aria-label="Previous"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(1)}
          >
            &laquo;
          </CPaginationItem>
          <CPaginationItem
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            &lsaquo;
          </CPaginationItem>
          {renderPaginationItems()}
          <CPaginationItem
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            &rsaquo;
          </CPaginationItem>
          <CPaginationItem
            aria-label="Next"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(totalPages)}
          >
            &raquo;
          </CPaginationItem>
        </CPagination>
      </div>

      <UserDetailsModal
        visible={userDetailsModalVisible}
        user={selectedUser}
        onClose={handleUserDetailsClose}
      />

      <PermissionsModal
        visible={permissionsModalVisible}
        user={selectedUser}
        onClose={() => setPermissionsModalVisible(false)}
        handleSavePermissions={(updatedUser) => {
          setPermissionsModalVisible(false);
          setSelectedUser(null);
          toast.success('Permissions updated successfully!');
        }}
      />

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default UserTable;
