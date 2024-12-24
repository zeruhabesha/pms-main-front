import React from 'react';
import { CButton } from '@coreui/react';
import { CIcon } from '@coreui/icons-react';
import { cilPencil, cilTrash, cilFullscreen } from '@coreui/icons';

const UserActions = ({ user, handleEdit, handleDelete, handleEditPhoto, handleUserDetailsClick }) => {
  return (
    <>
      <CButton color="light" size="sm" className="me-2" onClick={() => handleEdit(user)} title="Edit">
        <CIcon icon={cilPencil} />
      </CButton>
      <CButton color="light" style={{ color: 'red' }} size="sm" className="me-2" onClick={() => handleDelete(user)} title="Delete">
        <CIcon icon={cilTrash} />
      </CButton>
      <CButton color="light" size="sm" onClick={() => handleUserDetailsClick(user)} title="Details">
        <CIcon icon={cilFullscreen} />
      </CButton>
    </>
  );
};

export default UserActions;