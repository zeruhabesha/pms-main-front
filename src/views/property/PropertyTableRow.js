import React from 'react';
import { CTableRow, CTableHeaderCell, CTableDataCell, CButton } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilTrash, cilSearch } from '@coreui/icons';

const PropertyTableRow = ({ index, property, onEdit, onDelete, onView }) => {
  const isEditable = !!(property && onEdit); // Ensure `property` and `onEdit` are valid

  return (
    <CTableRow>
      <CTableHeaderCell scope="row">{index}</CTableHeaderCell>
      <CTableDataCell>{property?.title || 'N/A'}</CTableDataCell>
      <CTableDataCell>{property?.price || 'N/A'}</CTableDataCell>
      <CTableDataCell>{property?.address || 'N/A'}</CTableDataCell>
      <CTableDataCell>{property?.propertyType || 'N/A'}</CTableDataCell>
      <CTableDataCell>
        <CButton
          color="light"
          size="sm"
          className="me-2"
          onClick={() => onView(property)}
          title="View Property"
        >
          <CIcon icon={cilSearch} />
        </CButton>
        <CButton
          color="light"
          size="sm"
          className="me-2"
          onClick={() => onEdit(property)}
          title="Edit Property"
          disabled={!isEditable} // Button disabled if `property` or `onEdit` is invalid
        >
          <CIcon icon={cilPencil} />
        </CButton>
        <CButton
          color="light"
          style={{color:`red`}}
          size="sm"
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
