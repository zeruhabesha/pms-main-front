import React, { useState, useEffect } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CFormLabel,
  CFormInput,
    CAlert,
} from '@coreui/react';

const MaintenanceInspectionModal = ({
  visible,
  setInspectionModalVisible,
  maintenanceToInspect,
    confirmInspection,
}) => {
  const [expense, setExpense] = useState('');
    const [estimatedCompletionTime, setEstimatedCompletionTime] = useState('');
    const [error, setError] = useState(null);

  useEffect(() => {
    if (maintenanceToInspect) {
      setExpense(maintenanceToInspect.expense || '');
      setEstimatedCompletionTime(
        maintenanceToInspect.estimatedCompletionTime
          ? new Date(maintenanceToInspect.estimatedCompletionTime)
              .toISOString()
              .split('T')[0]
          : ''
      );
    }
  }, [maintenanceToInspect]);

  const handleExpenseChange = (event) => {
    setExpense(event.target.value);
  };

  const handleEstimatedCompletionTimeChange = (event) => {
    setEstimatedCompletionTime(event.target.value);
  };

  const handleSubmit = async () => {
      if (!expense) {
          setError('Please provide an expense value.');
          return;
      }
      if (isNaN(Number(expense))) {
          setError('Please enter a valid expense number.');
          return;
      }
      if (!estimatedCompletionTime) {
        setError('Please provide a estimated completion time.');
        return;
      }

    setError(null);
    await confirmInspection(expense, estimatedCompletionTime);
  };

  const handleClose = () => {
    setInspectionModalVisible(false);
      setError(null)
  };

  return (
    <CModal visible={visible} onClose={handleClose}>
      <CModalHeader onClose={handleClose}>
        <CModalTitle>Update Expense and Set to Inspected</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {error && <CAlert color="danger">{error}</CAlert>}
        <CForm>
            <div className="mb-3">
              <CFormLabel>Estimated Completion Time</CFormLabel>
              <CFormInput
                type="date"
                value={estimatedCompletionTime}
                onChange={handleEstimatedCompletionTimeChange}
                placeholder="Select estimated completion date"
              />
          </div>
          <div className="mb-3">
            <CFormLabel>Expense</CFormLabel>
            <CFormInput
              type="number"
              value={expense}
              onChange={handleExpenseChange}
              placeholder="Enter expense amount"
            />
          </div>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={handleClose}>
          Cancel
        </CButton>
        <CButton color="dark" onClick={handleSubmit}>
          Done
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default MaintenanceInspectionModal;