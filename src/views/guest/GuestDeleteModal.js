import React from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
} from '@coreui/react';

const GuestDeleteModal = ({
  visible,
  setDeleteModalVisible,
  guestToDelete,
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
        {guestToDelete ? (
          <p>
            Are you sure you want to delete <strong>{guestToDelete.name}</strong>?
          </p>
        ) : (
            <p>
                No Guest Selected
            </p>
        )}
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={handleClose}>
          Cancel
        </CButton>
          {guestToDelete ? (
              <CButton color="danger" onClick={confirmDelete}>
                Confirm Delete
              </CButton>
          ) : null
          }

      </CModalFooter>
    </CModal>
  );
};

export default GuestDeleteModal;