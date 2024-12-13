import React from 'react';
import { CModal, CModalBody, CModalHeader, CModalTitle, CModalFooter, CButton } from '@coreui/react';

const PropertyDeleteModal = ({ visible, setDeleteModalVisible, propertyToDelete, confirmDelete }) => {
  const closeModal = () => setDeleteModalVisible(false);

  return (
    <CModal visible={visible} onClose={closeModal} aria-labelledby="delete-modal-title">
      <CModalHeader onClose={closeModal}>
        <CModalTitle id="delete-modal-title">Confirm Delete</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {propertyToDelete ? (
          <>
            Are you sure you want to delete the property titled: <strong>{propertyToDelete.title || 'N/A'}</strong>
            {propertyToDelete._id && (
              <>
                {' '}with ID: <strong>{propertyToDelete._id}</strong>?
              </>
            )}
          </>
        ) : (
          <p>No property selected for deletion.</p>
        )}
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={closeModal} aria-label="Cancel deletion">
          Cancel
        </CButton>
        <CButton
          color="danger"
          onClick={() => {
            confirmDelete();
            closeModal();
          }}
          aria-label="Confirm deletion"
        >
          Delete
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default PropertyDeleteModal;
