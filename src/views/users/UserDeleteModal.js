import React from 'react';
import { CModal, CModalBody, CModalHeader, CModalTitle, CModalFooter, CButton } from '@coreui/react';

const UserDeleteModal = ({ visible, setDeleteModalVisible, adminToDelete, confirmDelete }) => {
  return (
    <CModal visible={visible} onClose={() => setDeleteModalVisible(false)}>
      <CModalHeader onClose={() => setDeleteModalVisible(false)}>
        <CModalTitle>Confirm Delete</CModalTitle>
      </CModalHeader>
      <CModalBody>
        Are you sure you want to delete Super Admin: {adminToDelete?.name}?
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setDeleteModalVisible(false)}>
          Cancel
        </CButton>
        <CButton color="danger" onClick={confirmDelete}>
          Delete
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default UserDeleteModal;