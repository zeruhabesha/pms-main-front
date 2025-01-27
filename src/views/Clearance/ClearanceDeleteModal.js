import React from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
} from '@coreui/react';

const ClearanceDeleteModal = ({
  visible,
  setDeleteModalVisible,
  clearanceToDelete,
  confirmDelete,
}) => {
  const handleClose = () => {
    setDeleteModalVisible(false);
  };

  return (
    <CModal visible={visible} onClose={handleClose}>
      <CModalHeader onClose={handleClose}>
        <CModalTitle>Confirm Delete</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {clearanceToDelete ? (
          <p>
            Are you sure you want to delete this clearance request?
          </p>
        ) : (
            <p>
                No Clearance Selected
            </p>
        )}
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={handleClose}>
          Cancel
        </CButton>
        {clearanceToDelete ? (
              <CButton color="danger" onClick={confirmDelete}>
                Confirm Delete
              </CButton>
        ) : null}
      </CModalFooter>
    </CModal>
  );
};

export default ClearanceDeleteModal;