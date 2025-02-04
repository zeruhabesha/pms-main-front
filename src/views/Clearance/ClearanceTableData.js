import React from 'react';
import {
    CTable,
    CTableBody,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CTableDataCell,
    CBadge,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
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

const ClearanceTableData = ({
    clearances = [],
    currentPage,
    sortConfig,
    handleSort,
    handleEdit,
    handleDelete,
    userPermissions,
    dropdownOpen,
    toggleDropdown,
    closeDropdown,
    dropdownRefs,
    handleViewDetails, // Add this prop
}) => {
    return (
        <CTable align="middle" className="mb-0 border" hover responsive>
            <CTableHead className="text-nowrap">
                <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                        #
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary" onClick={() => handleSort('tenant')} style={{ cursor: 'pointer' }}>
                        Tenant Name
                        {sortConfig.key === 'tenant' && (
                            <CIcon icon={sortConfig.direction === 'ascending' ? cilArrowTop : cilArrowBottom} />
                        )}
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary" onClick={() => handleSort('notes')} style={{ cursor: 'pointer' }}>
                        Notes
                        {sortConfig.key === 'notes' && (
                            <CIcon icon={sortConfig.direction === 'ascending' ? cilArrowTop : cilArrowBottom} />
                        )}
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary" onClick={() => handleSort('moveOutDate')} style={{ cursor: 'pointer' }}>
                        Move Out Date
                        {sortConfig.key === 'moveOutDate' && (
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
                {clearances?.map((clearance, index) => (
                    <CTableRow key={clearance?._id || index}>
                        <CTableDataCell className="text-center">
                            {(currentPage - 1) * 10 + index + 1}
                        </CTableDataCell>
                        <CTableDataCell>
                            {clearance?.tenant?.tenantName || 'N/A'}
                        </CTableDataCell>
                        <CTableDataCell>
                            {clearance?.notes || 'N/A'}
                        </CTableDataCell>
                         <CTableDataCell>
                            {formatDate(clearance?.moveOutDate) || 'N/A'}
                        </CTableDataCell>
                        <CTableDataCell>
                            {clearance.status === 'pending' ? (
                                <CBadge color="warning">Pending</CBadge>
                            ) : clearance.status === 'approved' ? (
                                <CBadge color="success">Approved</CBadge>
                            ) : clearance.status === 'rejected' ? (
                                <CBadge color="danger">Rejected</CBadge>
                            ) : clearance.status === 'inspected' ? (
                                <CBadge color="info">Inspected</CBadge>
                            ) : null
                            }
                        </CTableDataCell>
                         <CTableDataCell>
                            <CDropdown
                                variant="btn-group"
                                isOpen={dropdownOpen === clearance?._id}
                                onToggle={() => toggleDropdown(clearance?._id)}
                                onMouseLeave={closeDropdown}
                                innerRef={ref => (dropdownRefs.current[clearance?._id] = ref)}
                            >
                                <CDropdownToggle color="light" size="sm" title="Actions">
                                    <CIcon icon={cilOptions} />
                                </CDropdownToggle>
                                <CDropdownMenu>
                                    {/* {userPermissions?.editClearance && ( */}
                                    <CDropdownItem onClick={() => handleEdit(clearance?._id)} title="Edit">
                                        <CIcon icon={cilPencil} className="me-2" />
                                        Edit
                                    </CDropdownItem>
                                    {/* )} */}
                                    {/* {userPermissions?.deleteClearance && ( */}
                                    <CDropdownItem onClick={() => handleDelete(clearance?._id)} title="Delete" style={{ color: 'red' }}>
                                        <CIcon icon={cilTrash} className="me-2" />
                                        Delete
                                    </CDropdownItem>
                                    {/* )} */}
                                    <CDropdownItem onClick={() => handleViewDetails(clearance?.tenant?._id)} title="View Details">
                                        <CIcon icon={cilFullscreen} className="me-2" />
                                        Details
                                    </CDropdownItem>
                                    <CDropdownItem onClick={() => handleApprove(clearance?.tenant?._id)} title="View Details">
                                        <CIcon icon={cilFullscreen} className="me-2" />
                                        Details
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

export default ClearanceTableData;