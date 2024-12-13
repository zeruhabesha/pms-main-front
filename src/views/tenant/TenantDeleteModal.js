import React from 'react';
import { CModal, CModalBody, CModalHeader, CModalTitle, CModalFooter, CButton } from '@coreui/react';

const TenantDeleteModal = ({ visible, setDeleteModalVisible, tenantToDelete, confirmDelete }) => {
  return (
    <CModal visible={visible} onClose={() => setDeleteModalVisible(false)} alignment="center">
      <CModalHeader>
        <CModalTitle>Confirm Delete</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {tenantToDelete ? (
          <p>
            Are you sure you want to delete Tenant: <strong>{tenantToDelete.tenantName}</strong>?
          </p>
        ) : (
          <p>No valid tenant selected for deletion.</p>
        )}
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setDeleteModalVisible(false)}>
          Cancel
        </CButton>
        <CButton
          color="danger"
          onClick={confirmDelete}
          disabled={!tenantToDelete?.id}
        >
          Delete
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default TenantDeleteModal;
