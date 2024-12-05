import React, { useState } from 'react';
import { CTableRow, CTableDataCell, CButton, CBadge, CModal, CModalHeader, CModalBody, CModalFooter } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilZoom, cilPencil, cilTrash, cilInfo } from '@coreui/icons';

const MaintenanceTableRow = ({ maintenance, index, onEdit, onDelete, onViewDetails }) => {
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'in progress':
        return 'info';
      case 'completed':
        return 'success';
      default:
        return 'secondary';
    }
  };

  const toggleModal = () => setDetailsModalVisible(!detailsModalVisible);

  return (
    <>
      <CTableRow>
        <CTableDataCell>{index + 1}</CTableDataCell>
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

 
    </>
  );
};

export default MaintenanceTableRow;
