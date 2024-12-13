import React from 'react';
import PropTypes from 'prop-types';
import { CModal, CModalBody, CModalHeader, CModalTitle, CModalFooter, CButton } from '@coreui/react';

const MaintenanceDeleteModal = ({
  visible,
  setDeleteModalVisible,
  maintenanceToDelete,
  confirmDelete,
}) => {
  const maintenanceTitle = maintenanceToDelete?.title || maintenanceToDelete?.property?.title || "Untitled Maintenance";

  return (
    <CModal
      visible={visible}
      onClose={() => setDeleteModalVisible(false)}
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-description"
    >
      <CModalHeader closeButton>
        <CModalTitle id="delete-modal-title">Confirm Delete</CModalTitle>
      </CModalHeader>
      <CModalBody id="delete-modal-description">
        Are you sure you want to delete the maintenance record titled: <strong>{maintenanceTitle}</strong>?<br />
        <small className="text-danger">This action cannot be undone.</small>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setDeleteModalVisible(false)}>
          Cancel
        </CButton>
        <CButton color="danger" onClick={confirmDelete}>
          Delete
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

// PropTypes for validation
MaintenanceDeleteModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setDeleteModalVisible: PropTypes.func.isRequired,
  maintenanceToDelete: PropTypes.shape({
    title: PropTypes.string,
    property: PropTypes.shape({
      title: PropTypes.string,
    }),
  }),
  confirmDelete: PropTypes.func.isRequired,
};

export default MaintenanceDeleteModal;
