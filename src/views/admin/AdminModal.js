import React from 'react';
import { CModal } from '@coreui/react';
import AddAdmin from './AddAdmin';

const AdminModal = ({ visible, setVisible, editingAdmin, handleSave, handleAddAdmin }) => { // handleSave and handleAddAdmin props are now correctly expected
  const handleClose = () => {
    setVisible(false);
  };

  const handleSaveAction = async (adminData) => {
    console.log("AdminModal - handleSaveAction received adminData:", adminData); // ADD THIS LINE
    try {
      if (editingAdmin && handleSave) {
        await handleSave(editingAdmin._id, adminData);
      } else if (handleAddAdmin) {
        await handleAddAdmin(adminData);
      }
      handleClose();
    } catch (error) {
      console.error('Error saving admin:', error);
    }
  };

  return (
    <CModal
      visible={visible}
      onClose={handleClose}
      backdrop="static"
      keyboard={false}
      alignment="center"
    >
      <AddAdmin
        visible={visible}
        setVisible={setVisible}
        editingAdmin={editingAdmin}
        onSave={handleSaveAction} // Pass handleSaveAction as onSave to AddAdmin
      />
    </CModal>
  );
};

export default AdminModal;