import React from 'react';
import PropTypes from 'prop-types';
import {
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CButton,
} from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const MaintenanceTableRow = ({ maintenance, index, onEdit, onDelete, onViewDetails }) => {
  const {
    tenant = 'N/A',
    property = 'N/A',
    typeOfRequest = 'N/A',
    urgencyLevel = 'N/A',
    status = 'Unknown',
  } = maintenance || {};

  // Dynamic style for status
  const statusStyles = {
    Pending: { backgroundColor: 'orange', color: 'white' },
    'In Progress': { backgroundColor: '#212121', color: 'white' },
    Completed: { backgroundColor: 'green', color: 'white' },
    default: { backgroundColor: 'gray', color: 'white' },
  };

  const statusStyle = statusStyles[status] || statusStyles.default;

  return (
    <CTableRow>
      <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
      <CTableDataCell>{tenant}</CTableDataCell>
      <CTableDataCell>{property}</CTableDataCell>
      <CTableDataCell>{typeOfRequest}</CTableDataCell>
      <CTableDataCell>{urgencyLevel}</CTableDataCell>
      <CTableDataCell>
        <span
          style={{
            ...statusStyle,
            padding: '5px 10px',
            borderRadius: '5px',
            fontSize: '12px',
          }}
        >
          {status}
        </span>
      </CTableDataCell>
      <CTableDataCell>
        <CButton
          color="light"
          size="sm"
          onClick={() => onViewDetails(maintenance)}
          className="me-2"
        >
          <FontAwesomeIcon icon={faEye} />
        </CButton>
        <CButton
          color="light"
          size="sm"
          onClick={() => onEdit(maintenance)}
          className="me-2"
        >
          <FontAwesomeIcon icon={faEdit} />
        </CButton>
        <CButton
          color="light"
          style={{color:`red`}}
          size="sm"
          onClick={() => onDelete(maintenance)}
        >
          <FontAwesomeIcon icon={faTrash} />
        </CButton>
      </CTableDataCell>
    </CTableRow>
  );
};

MaintenanceTableRow.propTypes = {
  maintenance: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func.isRequired,
};

export default MaintenanceTableRow;
