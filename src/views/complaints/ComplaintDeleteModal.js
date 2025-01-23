// src/components/complaints/ComplaintDeleteModal.js
import React from 'react';
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';

const ComplaintDeleteModal = ({ visible, setDeleteModalVisible, complaintToDelete, confirmDelete }) => {
  const handleClose = () => {
    setDeleteModalVisible(false);
  };

  return (
    <CModal visible={visible} onClose={handleClose} alignment="center" backdrop="static">
      <CModalHeader className="bg-dark text-white">
        <CModalTitle>Confirm Delete</CModalTitle>
      </CModalHeader>
      <CModalBody>
        Are you sure you want to delete the complaint?
      </CModalBody>
      <CModalFooter className="border-top-0">
        <CButton color="secondary" variant="ghost" onClick={handleClose}>
          Cancel
        </CButton>
        <CButton color="danger" onClick={confirmDelete}>
          Delete
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default ComplaintDeleteModal;