import React from 'react';
import {
    CTableRow,
    CTableDataCell,
    CButton,
    CBadge,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilZoom, cilPencil, cilTrash } from '@coreui/icons';

const MaintenanceTableRow = ({ maintenance, index, onEdit, onDelete, onViewDetails }) => {


    const getStatusColor = (status) => {
        const statusLower = status?.toLowerCase();
        switch (statusLower) {
            case 'pending':
                return 'warning';
            case 'in progress':
                return 'info';
            case 'completed':
                return 'success';
              case 'approved':
                return 'primary';
             case 'cancelled':
                    return 'danger';
            case 'inspected':
                return 'info';
            case 'incomplete':
                  return 'dark';
            default:
                return 'secondary';
        }
    };

    return (
        <CTableRow>
            <CTableDataCell>{index + 1}</CTableDataCell>
            <CTableDataCell>{maintenance.tenant?.name || 'N/A'}</CTableDataCell>
            <CTableDataCell>{maintenance.tenant?.email || 'N/A'}</CTableDataCell>
            <CTableDataCell>{maintenance.tenant?.phoneNumber || 'N/A'}</CTableDataCell>
            <CTableDataCell>
                <CBadge color={getStatusColor(maintenance.status)}>{maintenance.status || 'N/A'}</CBadge>
            </CTableDataCell>
            <CTableDataCell>
                <CButton
                    color="light"
                    size="sm"
                    onClick={() => onViewDetails(maintenance)}
                    className="me-1"
                    title="View Details"
                >
                    <CIcon icon={cilZoom} />
                </CButton>
                <CButton
                    color="light"
                    size="sm"
                    onClick={() => onEdit(maintenance)}
                    className="me-1"
                    title="Edit"
                >
                    <CIcon icon={cilPencil} />
                </CButton>
                <CButton
                    color="light"
                    size="sm"
                    style={{ color: 'red' }}
                    onClick={() => onDelete(maintenance)}
                    title="Delete"
                >
                    <CIcon icon={cilTrash} />
                </CButton>
            </CTableDataCell>
        </CTableRow>
    );
};

export default MaintenanceTableRow;