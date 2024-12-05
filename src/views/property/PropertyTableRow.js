import React from 'react';
import { CTableRow, CTableDataCell, CButton } from '@coreui/react';
import { CIcon } from '@coreui/icons-react';
import { cilPencil, cilTrash, cilFullscreen } from '@coreui/icons';

const PropertyTableRow = ({ index, property, onEdit, onDelete, onView }) => {
  return (
    <CTableRow>
      <CTableDataCell>{index}</CTableDataCell>
      <CTableDataCell>{property?.title || 'N/A'}</CTableDataCell>
      <CTableDataCell>${property?.price || 'N/A'}</CTableDataCell>
      <CTableDataCell>{property?.address || 'N/A'}</CTableDataCell>
      <CTableDataCell>{property?.propertyType || 'N/A'}</CTableDataCell>
      <CTableDataCell>
      <CButton
  color="light"
  size="sm"
  className="me-2"
  onClick={() => onView(property)} // Ensure this calls the parent onView handler
  title="View Property"
>
  <CIcon icon={cilFullscreen} />
</CButton>

        <CButton
          color="light"
          size="sm"
          className="me-2"
          onClick={() => onEdit(property)}
          title="Edit Property"
        >
          <CIcon icon={cilPencil} />
        </CButton>
        <CButton
          color="light"
          size="sm"
          style={{ color: 'red' }}
          onClick={() => onDelete(property)}
          title="Delete Property"
        >
          <CIcon icon={cilTrash} />
        </CButton>
      </CTableDataCell>
    </CTableRow>
  );
};

export default PropertyTableRow;
