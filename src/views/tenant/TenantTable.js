import React, { useState, useEffect } from 'react';
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
  CCollapse,
} from '@coreui/react';
import { CIcon } from '@coreui/icons-react';
import { cilPencil, cilTrash, cilPlus, cilMinus } from '@coreui/icons';
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
  itemsPerPage = 5  // Add this prop with a default value
}) => {
  const [expandedRows, setExpandedRows] = useState({});
  const [tenantPhotos, setTenantPhotos] = useState({});
  const [photoErrors, setPhotoErrors] = useState({});

  useEffect(() => {
    // Clear previous photos when tenants change
    setTenantPhotos({});
    setPhotoErrors({});
    
    // Fetch photos for all tenants
    const fetchPhotos = async () => {
      const validTenants = tenants.filter((tenant) => tenant && tenant._id);
      for (const tenant of validTenants) {
        try {
          await fetchTenantPhoto(tenant._id);
        } catch (error) {
          console.error(`Failed to fetch photo for tenant ID: ${tenant._id}`, error);
        }
      }
    };
    

    fetchPhotos();
  }, [tenants]);


  const fetchTenantPhoto = async (tenantId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Unauthorized');
  
      const response = await fetch(`http://localhost:4000/api/v1/tenants/${tenantId}/photo`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch photo: ${response.status}`);
      }
  
      const blob = await response.blob();
      if (blob.size > 0) {
        const url = URL.createObjectURL(blob);
        setTenantPhotos((prev) => ({ ...prev, [tenantId]: url }));
      } else {
        throw new Error('Empty photo response');
      }
    } catch (error) {
      console.error('Error fetching tenant photo:', error);
      setPhotoErrors((prev) => ({ ...prev, [tenantId]: true }));
    }
  };  
  

  useEffect(() => {
    return () => {
      Object.values(tenantPhotos).forEach(url => {
        URL.revokeObjectURL(url);
      });
    };
  }, [tenantPhotos]);

  const toggleRow = (tenantId) => {
    setExpandedRows((prevState) => ({
      ...prevState,
      [tenantId]: !prevState[tenantId],
    }));
  };


  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getPageNumbers = () => {
    const maxVisiblePages = 5; // Number of visible pagination buttons
    const pages = [];
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
    // Add the first page and ellipsis if necessary
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push('...');
    }
  
    // Add pages in the visible range
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
  
    // Add the last page and ellipsis if necessary
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }
  
    return pages;
  };
  

return (
    <div className="table-responsive">
      <CTable>
        <CTableBody>
          {tenants.map((tenant, index) => {
            const tenantId = tenant?._id;
            if (!tenantId) return null;
            
            // Calculate using itemsPerPage prop
            const itemNumber = (currentPage - 1) * itemsPerPage + index + 1;

            return (
    <React.Fragment key={tenantId}>
      <CTableRow>
        <CTableDataCell>{itemNumber}</CTableDataCell>
                  {/* <CTableDataCell>{(currentPage - 1) * 5 + index + 1}</CTableDataCell> */}
                  <CTableDataCell>
                  <img
  src={tenantPhotos[tenantId] || placeholder}
  alt={tenant.tenantName || 'Tenant'}
  style={{
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #ddd',
  }}
  className="me-2"
  onError={(e) => {
    e.target.src = placeholder; // Fallback to placeholder if the photo is missing
  }}
/>

                    <CButton 
                      color="light" 
                      size="sm" 
                      onClick={() => handleEditPhoto(tenant)} 
                      title="Edit photo"
                      className="mt-1"
                    >
                      <CIcon icon={cilPencil} />
                    </CButton>
                  </CTableDataCell>
                  <CTableDataCell>{tenant.tenantName}</CTableDataCell>
                  <CTableDataCell>{tenant.contactInformation?.email}</CTableDataCell>
                  <CTableDataCell>{formatDate(tenant.leaseAgreement?.startDate)}</CTableDataCell>
                  <CTableDataCell>{formatDate(tenant.leaseAgreement?.endDate)}</CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      color="dark"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(tenant)}
                      title="Edit"
                    >
                      <CIcon icon={cilPencil} />
                    </CButton>
                    <CButton
                      color="danger"
                      size="sm"
                      className="me-2"
                      onClick={() => handleDelete(tenantId, tenant)}
                      title="Delete"
                    >
                      <CIcon icon={cilTrash} />
                    </CButton>
                    <CButton
                      color="light"
                      size="sm"
                      onClick={() => toggleRow(tenantId)}
                      title={expandedRows[tenantId] ? 'Collapse' : 'Expand'}
                    >
                      <CIcon icon={expandedRows[tenantId] ? cilMinus : cilPlus} />
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableDataCell colSpan="7" className="p-0">
                    <CCollapse visible={expandedRows[tenantId]}>
                      <div className="p-3 bg-light">
                        <div className="row">
                          <div className="col-md-6">
                            <p><strong>Phone Number:</strong> {tenant.contactInformation?.phoneNumber || 'N/A'}</p>
                            <p><strong>Unit:</strong> {tenant.propertyInformation?.unit || 'N/A'}</p>
                            <p><strong>Rent Amount:</strong> ${tenant.leaseAgreement?.rentAmount || 'N/A'}</p>
                          </div>
                          <div className="col-md-6">
                            <p><strong>Security Deposit:</strong> ${tenant.leaseAgreement?.securityDeposit || 'N/A'}</p>
                            <p><strong>Special Terms:</strong> {tenant.leaseAgreement?.specialTerms || 'N/A'}</p>
                            <p><strong>Move-In Date:</strong> {formatDate(tenant.moveInDate)}</p>
                          </div>
                        </div>
                      </div>
                    </CCollapse>
                  </CTableDataCell>
                </CTableRow>
              </React.Fragment>
            );
          })}
        </CTableBody>
      </CTable>

      <CPagination className="mt-3" aria-label="Page navigation">
  <CPaginationItem
    onClick={() => handlePageChange(1)}
    disabled={currentPage === 1}
  >
    &laquo;
  </CPaginationItem>

  <CPaginationItem
    onClick={() => handlePageChange(currentPage - 1)}
    disabled={currentPage === 1}
  >
    &lsaquo;
  </CPaginationItem>

  {getPageNumbers().map((page, index) => (
    <CPaginationItem
      key={index}
      active={page === currentPage}
      onClick={() => typeof page === 'number' && handlePageChange(page)}
      disabled={page === '...'}
    >
      {page}
    </CPaginationItem>
  ))}

  <CPaginationItem
    onClick={() => handlePageChange(currentPage + 1)}
    disabled={currentPage === totalPages}
  >
    &rsaquo;
  </CPaginationItem>

  <CPaginationItem
    onClick={() => handlePageChange(totalPages)}
    disabled={currentPage === totalPages}
  >
    &raquo;
  </CPaginationItem>
</CPagination>
    </div>
  );
};

export default TenantTable;
