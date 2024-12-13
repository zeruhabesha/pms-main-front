import React from 'react';
import { CModal, CModalBody, CModalHeader, CModalTitle, CModalFooter } from '@coreui/react';
import AddTenant from './AddTenant';

const TenantModal = ({ visible, setVisible, editingTenant, handleSave }) => {
  const handleClose = () => setVisible(false);

  return (
    <CModal visible={visible} onClose={handleClose} alignment="center" size="lg">
      <CModalHeader>
        <CModalTitle>{editingTenant ? 'Edit Tenant' : 'Add Tenant'}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <AddTenant
          visible={visible}
          setVisible={setVisible}
          editingTenant={editingTenant || null} // Ensure a valid fallback for `editingTenant`
          handleSave={handleSave}
        />
      </CModalBody>
    </CModal>
  );
};

export default TenantModal;
