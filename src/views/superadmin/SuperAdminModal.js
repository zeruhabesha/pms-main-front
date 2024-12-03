import React from 'react';
import { CModal, CModalBody, CModalHeader, CModalTitle, CModalFooter, CButton } from '@coreui/react';
import AddSuperAdmin from './AddSuperAdmin';

const SuperAdminModal = ({ visible, setVisible, editingSuperAdmin, handleSave, handleAddSuperAdmin }) => {
  return (
    <CModal visible={visible} onClose={() => setVisible(false)}>
      {/* <CModalHeader>
        <CModalTitle>{editingSuperAdmin ? 'Edit Super Admin' : 'Add Super Admin'}</CModalTitle>
      </CModalHeader> */}
      <CModalBody>
        <AddSuperAdmin
          visible={visible}
          setVisible={setVisible}
          editingSuperAdmin={editingSuperAdmin}
          onSave={editingSuperAdmin ? handleSave : handleAddSuperAdmin}
        />
      </CModalBody>
    </CModal>
  );
};

export default SuperAdminModal;
