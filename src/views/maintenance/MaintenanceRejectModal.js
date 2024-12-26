import React from 'react';
import PropTypes from 'prop-types';
import { CModal, CModalBody, CModalHeader, CModalTitle, CModalFooter, CButton } from '@coreui/react';

const MaintenanceRejectModal = ({
  visible,
  setRejectModalVisible,
  maintenanceToReject,
  confirmReject,
}) => {
  const maintenanceTitle =
    maintenanceToReject?.title || maintenanceToReject?.property?.title || 'Untitled Maintenance';

  return (
    <CModal
      visible={visible}
      onClose={() => setRejectModalVisible(false)}
      aria-labelledby="reject-modal-title"
      aria-describedby="reject-modal-description"
    >
      <CModalHeader closeButton>
        <CModalTitle id="reject-modal-title">Confirm Reject</CModalTitle>
      </CModalHeader>
      <CModalBody id="reject-modal-description">
        Are you sure you want to reject the maintenance record titled:{' '}
        <strong>{maintenanceTitle}</strong>?
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setRejectModalVisible(false)}>
          Cancel
        </CButton>
        <CButton
          color="danger"
          onClick={async () => {
            await confirmReject(); // Confirm reject logic here
            setRejectModalVisible(false); // Close modal on success
          }}
        >
          Reject
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

MaintenanceRejectModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setRejectModalVisible: PropTypes.func.isRequired,
  maintenanceToReject: PropTypes.shape({
    title: PropTypes.string,
    property: PropTypes.shape({
      title: PropTypes.string,
    }),
  }),
  confirmReject: PropTypes.func.isRequired,
};

export default MaintenanceRejectModal;
