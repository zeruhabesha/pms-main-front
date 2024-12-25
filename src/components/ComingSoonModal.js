import React from 'react';
import { CModal, CModalHeader, CModalBody, CModalFooter, CButton } from '@coreui/react';

const ComingSoonModal = ({ visible, setVisible }) => {
  return (
    <CModal
      className="coming-soon-modal"
      visible={visible}
      onClose={() => setVisible(false)}
      backdrop={true}
      scrollable={false}
    >
      <CModalHeader className="modal-header" onClose={() => setVisible(false)}>
        <h5>Coming Soon</h5>
      </CModalHeader>
      <CModalBody className="modal-body">
        <p>
          This feature is currently under development. Please check back later for updates!
        </p>
      </CModalBody>
      <CModalFooter className="modal-footer">
        <CButton color="dark" onClick={() => setVisible(false)}>
          Got It
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default ComingSoonModal;