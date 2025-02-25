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
    role,
    dropdownOpen,
    toggleDropdown,
    closeDropdown,
    dropdownRefs,
    handleViewDetails, // Add this prop
    handleApprove,
    handlePass,
    getStatusStyle,
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
                     {/* NEW COLUMN HERE */}
                     <CTableHeaderCell className="bg-body-tertiary" onClick={() => handleSort('inspectionStatus')} style={{ cursor: 'pointer' }}>
                        Inspected
                        {sortConfig.key === 'inspectionStatus' && (
                            <CIcon icon={sortConfig.direction === 'ascending' ? cilArrowTop : cilArrowBottom} />
                        )}
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary" onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                        Admin
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
                           {clearance?.tenant?.name || 'N/A'}
                        </CTableDataCell>
                        <CTableDataCell>
                            {clearance?.notes || 'N/A'}
                        </CTableDataCell>
                         <CTableDataCell>
                            {formatDate(clearance?.moveOutDate) || 'N/A'}
                        </CTableDataCell>
                         {/* NEW COLUMN HERE */}
                         <CTableDataCell>
                            {clearance.inspectionStatus === 'Pending' ? (
                                <CBadge color="warning">Pending</CBadge>
                            ) : clearance.inspectionStatus === 'Passed' ? (
                                <CBadge color="success">Passed</CBadge>
                            ) : clearance.inspectionStatus === 'Failed' ? (
                                <CBadge color="danger">Failed</CBadge>
                            ) : (
                                <CBadge color="info">Inspected</CBadge>
                            )}
                        </CTableDataCell>
                        <CTableDataCell>
                            {clearance.status === 'Pending' ? (
                                <CBadge color="warning">Pending</CBadge>
                            ) : clearance.status === 'Approved' ? (
                                <CBadge color="success">Approved</CBadge>
                            ) : clearance.status === 'Rejected' ? (
                                <CBadge color="danger">Rejected</CBadge>
                            ) : (
                                <CBadge color="info">Inspected</CBadge>
                            )}
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
                                {role === 'Tenant' && (
                                    <CDropdownItem onClick={() => handleEdit(clearance?._id)} title="Edit">
                                        <CIcon icon={cilPencil} className="me-2" />
                                        Edit
                                    </CDropdownItem>
                                    )}
                                     {role === 'Tenant' && (
                                       <CDropdownItem onClick={() => handleDelete(clearance)} title="Delete" style={{ color: 'red' }}>
                                       <CIcon icon={cilTrash} className="me-2" />
                                       Delete
                                   </CDropdownItem>

                                    )}
                                   
                                    <CDropdownItem onClick={() => handleViewDetails(clearance)} title="View Details">
                    <CIcon icon={cilFullscreen} className="me-2" />
                    Details
                </CDropdownItem>
                {role === 'Admin' && (
                <CDropdownItem onClick={() => handleApprove(clearance)} title="Approve">
                <CIcon icon={cilFullscreen} className="me-2" />
                Approve/Reject
                </CDropdownItem>
                )}
                {role === 'Inspector' && (
                <CDropdownItem onClick={() => handlePass(clearance)} title="Pass">
                <CIcon icon={cilFullscreen} className="me-2" />
                Passed / Failed
                </CDropdownItem>
                )}
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