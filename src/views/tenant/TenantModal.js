import React from 'react';
import { CModal, CModalBody, CModalHeader, CModalTitle, CModalFooter, CButton } from '@coreui/react';
import AddTenant from './AddTenant';

const TenantModal = ({ visible, setVisible, editingTenant, handleSave, handleAddTenant }) => {
  return (
    <CModal visible={visible} onClose={() => setVisible(false)} alignment="center">
      <CModalHeader onClose={() => setVisible(false)}>
        <CModalTitle>{editingTenant ? 'Edit Tenant' : 'Add Tenant'}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <AddTenant
          visible={visible}
          setVisible={setVisible}
          editingTenant={editingTenant}
          onSave={editingTenant ? handleSave : handleAddTenant}
        />
      </CModalBody>
    </CModal>
  );
};

export default TenantModal;
