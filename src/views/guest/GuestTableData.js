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
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
    CBadge,
} from '@coreui/react';
import { CIcon } from '@coreui/icons-react';
import {
    cilPencil,
    cilTrash,
    cilArrowTop,
    cilArrowBottom,
    cilFullscreen,
    cilOptions,
} from '@coreui/icons';
import { formatDate } from "../../api/utils/dateFormatter";
const GuestTableData = ({
    guests = [],
    currentPage,
    searchTerm,
     sortConfig,
    handleSort,
    handleEdit,
    handleDelete,
      userPermissions,
       dropdownOpen,
                  toggleDropdown,
                  closeDropdown,
                   dropdownRefs,
      handleModalOpen
}) => {
    return (
         <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                    <CTableRow>
                        <CTableHeaderCell className="bg-body-tertiary text-center">
                            #
                        </CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary" onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                            Name
                            {sortConfig.key === 'name' && (
                                <CIcon icon={sortConfig.direction === 'ascending' ? cilArrowTop : cilArrowBottom} />
                            )}
                        </CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary" onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>
                            Email
                            {sortConfig.key === 'email' && (
                                <CIcon icon={sortConfig.direction === 'ascending' ? cilArrowTop : cilArrowBottom} />
                            )}
                        </CTableHeaderCell>
                         <CTableHeaderCell className="bg-body-tertiary" onClick={() => handleSort('phoneNumber')} style={{ cursor: 'pointer' }}>
                            Phone
                            {sortConfig.key === 'phoneNumber' && (
                                <CIcon icon={sortConfig.direction === 'ascending' ? cilArrowTop : cilArrowBottom} />
                            )}
                        </CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary" onClick={() => handleSort('arrivalDate')} style={{ cursor: 'pointer' }}>
                            Arrival Date
                            {sortConfig.key === 'arrivalDate' && (
                                <CIcon icon={sortConfig.direction === 'ascending' ? cilArrowTop : cilArrowBottom} />
                            )}
                        </CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary" onClick={() => handleSort('departureDate')} style={{ cursor: 'pointer' }}>
                            Departure Date
                            {sortConfig.key === 'departureDate' && (
                                <CIcon icon={sortConfig.direction === 'ascending' ? cilArrowTop : cilArrowBottom} />
                            )}
                        </CTableHeaderCell>
                           <CTableHeaderCell className="bg-body-tertiary" onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                            Status
                            {sortConfig.key === 'status' && (
                                <CIcon icon={sortConfig.direction === 'ascending' ? cilArrowTop : cilArrowBottom} />
                            )}
                        </CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary">Actions</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {guests?.map((guest, index) => (
                        <CTableRow key={guest?._id || index}>
                            <CTableDataCell className="text-center">
                                {(currentPage - 1) * 10 + index + 1}
                            </CTableDataCell>
                            <CTableDataCell>
                                {guest?.name || 'N/A'}
                            </CTableDataCell>
                            <CTableDataCell>
                                {guest?.email || 'N/A'}
                            </CTableDataCell>
                            <CTableDataCell>
                                {guest?.phoneNumber || 'N/A'}
                            </CTableDataCell>
                             <CTableDataCell>
                                {formatDate(guest?.arrivalDate) || 'N/A'}
                            </CTableDataCell>
                            <CTableDataCell>
                                {formatDate(guest?.departureDate) || 'N/A'}
                            </CTableDataCell>
                            <CTableDataCell>
                                {guest.status === 'pending' ? (
                                        <CBadge color="warning">Pending</CBadge>
                                    ) : guest.status === 'active' ? (
                                        <CBadge color="success">Active</CBadge>
                                    ) : guest.status === 'expired' ? (
                                        <CBadge color="danger">Expired</CBadge>
                                    ) : (
                                      <CBadge color="secondary">Cancelled</CBadge>
                                    )}
                            </CTableDataCell>
                            <CTableDataCell>
                                <CDropdown
                                        variant="btn-group"
                                        isOpen={dropdownOpen === guest?._id}
                                        onToggle={() => toggleDropdown(guest?._id)}
                                         onMouseLeave={closeDropdown}
                                        innerRef={ref => (dropdownRefs.current[guest?._id] = ref)}
                                    >
                                        <CDropdownToggle color="light" size="sm" title="Actions">
                                            <CIcon icon={cilOptions} />
                                        </CDropdownToggle>
                                        <CDropdownMenu>
                                             {userPermissions?.editGuest && (
                                                <CDropdownItem  onClick={() => handleEdit(guest?._id)} title="Edit">
                                                    <CIcon icon={cilPencil} className="me-2"/>
                                                    Edit
                                                </CDropdownItem>
                                            )}
                                             {userPermissions?.deleteGuest && (
                                                <CDropdownItem  onClick={() => handleDelete(guest?._id)} title="Delete"  style={{ color: 'red' }}>
                                                    <CIcon icon={cilTrash} className="me-2"/>
                                                    Delete
                                                </CDropdownItem>
                                            )}
                                            <CDropdownItem onClick={() => handleModalOpen(guest)} title="View Details">
                                                 <CIcon icon={cilFullscreen} className="me-2"/>
                                                View Details
                                            </CDropdownItem>
                                        </CDropdownMenu>
                                </CDropdown>
                            </CTableDataCell>
                        </CTableRow>
                    ))}
                </CTableBody>
            </CTable>
    );
};

export default GuestTableData;