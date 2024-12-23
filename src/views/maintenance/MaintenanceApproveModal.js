import React from 'react';
import PropTypes from 'prop-types';
import { CModal, CModalBody, CModalHeader, CModalTitle, CModalFooter, CButton } from '@coreui/react';

const MaintenanceApproveModal = ({
  visible,
  setApproveModalVisible,
  maintenanceToApprove,
  confirmApprove,
}) => {
    const maintenanceTitle = maintenanceToApprove?.title || maintenanceToApprove?.property?.title || "Untitled Maintenance";

  return (
    <CModal
      visible={visible}
      onClose={() => setApproveModalVisible(false)}
      aria-labelledby="approve-modal-title"
      aria-describedby="approve-modal-description"
    >
      <CModalHeader closeButton>
        <CModalTitle id="approve-modal-title">Confirm Approve</CModalTitle>
      </CModalHeader>
      <CModalBody id="approve-modal-description">
        Are you sure you want to approve the maintenance record titled: <strong>{maintenanceTitle}</strong>?
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setApproveModalVisible(false)}>
          Cancel
        </CButton>
        <CButton color="success" onClick={confirmApprove}>
          Approve
        </CButton>
      </CModalFooter>
    </CModal>
  );
};


MaintenanceApproveModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setApproveModalVisible: PropTypes.func.isRequired,
  maintenanceToApprove: PropTypes.shape({
    title: PropTypes.string,
      property: PropTypes.shape({
          title: PropTypes.string,
      }),
  }),
  confirmApprove: PropTypes.func.isRequired,
};

export default MaintenanceApproveModal;