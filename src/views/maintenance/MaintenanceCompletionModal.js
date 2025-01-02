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
  CFormTextarea,
  CAlert,
} from '@coreui/react';

const MaintenanceCompletionModal = ({
  visible,
  setCompletionModalVisible,
  maintenanceToComplete,
    confirmCompletion,
}) => {
  const [notes, setNotes] = useState('');
    const [error, setError] = useState(null);


    useEffect(() => {
       if(maintenanceToComplete){
          setNotes(maintenanceToComplete.notes || '')
      }
    }, [maintenanceToComplete]);

  const handleNotesChange = (event) => {
    setNotes(event.target.value);
  };


   const handleIncomplete = async () => {
        if(!notes){
           setError('Please add a note for the Incomplete status')
          return;
        }
      setError(null)
       await confirmCompletion('Incomplete', notes)
  };

    const handleComplete = async () => {
      setError(null)
      await confirmCompletion('Completed');
  };



  const handleClose = () => {
    setCompletionModalVisible(false);
      setError(null)
  };

  return (
    <CModal visible={visible} onClose={handleClose}>
      <CModalHeader onClose={handleClose}>
        <CModalTitle>Update Status and Add Notes</CModalTitle>
      </CModalHeader>
      <CModalBody>
          {error && <CAlert color="danger">{error}</CAlert>}
        <CForm>
          <div className="mb-3">
            <CFormLabel>Notes (Optional for Complete)</CFormLabel>
            <CFormTextarea
              rows="3"
              value={notes}
              onChange={handleNotesChange}
              placeholder="Add notes about the inspection"
            />
          </div>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={handleClose}>
          Cancel
        </CButton>
        <CButton color="dark" onClick={handleIncomplete}>
          Set to Incomplete
        </CButton>
        <CButton color="success" onClick={handleComplete}>
          Set to Complete
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default MaintenanceCompletionModal;