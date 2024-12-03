import React, { useState } from 'react';
import { CModal, CModalBody, CModalHeader, CModalTitle, CModalFooter, CButton } from '@coreui/react';

const AdminDeleteModal = ({
  visible,
  setDeleteModalVisible,
  adminToDelete,
  confirmDelete,
}) => {
  const [step, setStep] = useState(1);

  // Static associated data
  const associatedData = {
    properties: 10,
    tenants: 20,
    maintenance: 5,
    agreements: 15,
    reports: 8,
  };

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleClose = () => {
    setStep(1);
    setDeleteModalVisible(false);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <CModalBody>
              <p>
                Deleting Admin <strong>{adminToDelete?.name}</strong> will also delete the following associated data:
              </p>
              <ul>
                {associatedData.properties > 0 && (
                  <li>
                    <strong>Properties:</strong> {associatedData.properties}
                  </li>
                )}
                {associatedData.tenants > 0 && (
                  <li>
                    <strong>Tenants:</strong> {associatedData.tenants}
                  </li>
                )}
                {associatedData.maintenance > 0 && (
                  <li>
                    <strong>Maintenance Records:</strong> {associatedData.maintenance}
                  </li>
                )}
                {associatedData.agreements > 0 && (
                  <li>
                    <strong>Agreements:</strong> {associatedData.agreements}
                  </li>
                )}
                {associatedData.reports > 0 && (
                  <li>
                    <strong>Reports:</strong> {associatedData.reports}
                  </li>
                )}
              </ul>
              <p>Are you sure you want to proceed?</p>
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={handleClose}>
                Cancel
              </CButton>
              <CButton color="danger" onClick={handleNext}>
                Next
              </CButton>
            </CModalFooter>
          </>
        );
      case 2:
        return (
          <>
            <CModalBody>
              <p>
                Deleting the admin will cascade delete all related properties, tenants, and agreements. 
                This action is irreversible. Do you want to proceed?
              </p>
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={handleBack}>
                Back
              </CButton>
              <CButton color="danger" onClick={handleNext}>
                Next
              </CButton>
            </CModalFooter>
          </>
        );
      case 3:
        return (
          <>
            <CModalBody>
              <p>
                Deleting Admin <strong>{adminToDelete?.name}</strong> will permanently remove all associated data
                including reports and maintenance records. Do you wish to confirm this action?
              </p>
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={handleBack}>
                Back
              </CButton>
              <CButton color="danger" onClick={confirmDelete}>
                Confirm Delete
              </CButton>
            </CModalFooter>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <CModal visible={visible} onClose={handleClose}>
      <CModalHeader onClose={handleClose}>
        <CModalTitle>Confirm Deletion</CModalTitle>
      </CModalHeader>
      {renderStepContent()}
    </CModal>
  );
};

export default AdminDeleteModal;
