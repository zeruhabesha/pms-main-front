import React from 'react';
import { CModal, CModalBody, CModalHeader, CModalTitle, CModalFooter, CButton } from '@coreui/react';
import AddAdmin from './AddAdmin';

const AdminModal = ({ visible, setVisible, editingAdmin, handleSave, handleAddAdmin }) => {
  return (
    <CModal visible={visible} onClose={() => setVisible(false)}>
      {/* <CModalHeader>
        <CModalTitle>{editingAdmin ? 'Edit  Admin' : 'Add  Admin'}</CModalTitle>
      </CModalHeader> */}
      <CModalBody>
        <AddAdmin
          visible={visible}
          setVisible={setVisible}
          editingAdmin={editingAdmin}
          onSave={editingAdmin ? handleSave : handleAddAdmin}
        />
      </CModalBody>
    </CModal>
  );
};

export default AdminModal;
