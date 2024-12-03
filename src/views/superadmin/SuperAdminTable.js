import React from 'react';
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
import { cilPencil, cilTrash, cilCheckCircle, cilXCircle } from '@coreui/icons';
import placeholder from '../image/placeholder.png';

const SuperAdminTable = ({
  superAdmins = [],
  currentPage,
  totalPages,
  searchTerm,
  setSearchTerm,
  handleEdit,
  handleDelete,
  handleEditPhoto,
  handlePageChange,
}) => {
  return (
    <div>
      <CFormInput
        type="text"
        placeholder="Search by name, email, or phone number"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-3"
      />
      <div className="table-responsive">
        <CTable hover>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>#</CTableHeaderCell>
              <CTableHeaderCell>Photo</CTableHeaderCell>
              <CTableHeaderCell>Name</CTableHeaderCell>
              <CTableHeaderCell>Email</CTableHeaderCell>
              <CTableHeaderCell>Phone Number</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
              <CTableHeaderCell>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {superAdmins.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan="7" className="text-center">
                  No data available
                </CTableDataCell>
              </CTableRow>
            ) : (
              superAdmins.map((admin, index) => (
                <CTableRow key={admin?._id || index}>
                  <CTableDataCell>{(currentPage - 1) * 5 + index + 1}</CTableDataCell>
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
                  <CTableDataCell>{admin?.phoneNumber || 'N/A'}</CTableDataCell>
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
                    <CButton color="light" style={{color:`red`}} size="sm" onClick={() => handleDelete(admin)} title="Delete">
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))
            )}
          </CTableBody>
        </CTable>
      </div>

      <CPagination className="mt-3">
        <CPaginationItem disabled={currentPage === 1} onClick={() => handlePageChange(1)}>
          &laquo;
        </CPaginationItem>
        <CPaginationItem disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
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
        <CPaginationItem disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
          &rsaquo;
        </CPaginationItem>
        <CPaginationItem disabled={currentPage === totalPages} onClick={() => handlePageChange(totalPages)}>
          &raquo;
        </CPaginationItem>
      </CPagination>
    </div>
  );
};

export default SuperAdminTable;