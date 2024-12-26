import React from 'react';
import PropTypes from 'prop-types';
import { CModal, CModalBody, CModalHeader, CModalTitle, CModalFooter, CButton } from '@coreui/react';

const DeleteConfirmationModal = ({ 
  visible, 
  onClose, 
  onConfirm, 
  itemName 
}) => {
  return (
    <CModal
      visible={visible}
      onClose={onClose}
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-description"
    >
      <CModalHeader closeButton>
        <CModalTitle id="delete-modal-title">Confirm Delete</CModalTitle>
      </CModalHeader>
      <CModalBody id="delete-modal-description">
        Are you sure you want to delete <strong>{itemName || "this item"}</strong>? This action cannot be undone.
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Cancel
        </CButton>
        <CButton color="danger" onClick={onConfirm}>
          Delete
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

DeleteConfirmationModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  itemName: PropTypes.string,
};

export default DeleteConfirmationModal;
