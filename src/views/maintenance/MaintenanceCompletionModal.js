import React, { useEffect, useState } from 'react';
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
  CFormInput,
} from '@coreui/react';
import { useDispatch, useSelector } from 'react-redux';
import { updateMaintenance, fetchMaintenances } from '../../api/actions/MaintenanceActions'

const MaintenanceCompletionModal = ({
  visible,
  setCompletionModalVisible, // Now a function from ViewMaintenance
  maintenanceToComplete,
}) => {
  const [notes, setNotes] = useState('');
  const [error, setError] = useState(null);
  const [inspectedFiles, setInspectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const dispatch = useDispatch()
  const {
    searchTerm,
    currentPage,
  } = useSelector((state) => state.maintenance)

  useEffect(() => {
    if (maintenanceToComplete) {
      setNotes(maintenanceToComplete.notes || '');
    }
  }, [maintenanceToComplete]);

  const handleNotesChange = (event) => {
    setNotes(event.target.value);
  };

  const handleInspectedFilesChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setInspectedFiles(selectedFiles);
    setFilePreviews(selectedFiles.map(file => URL.createObjectURL(file)));
  };

  const handleSubmit = async (status) => {
    if (status === 'Incomplete' && !notes) {
      setError('Please add a note for the Incomplete status');
      return;
    }
    setError(null);

    const formData = new FormData();
    formData.append('status', status);
    formData.append('notes', notes); // Backend expects notes as "feedback"

    // Append each selected file to FormData
    // inspectedFiles.forEach(file => {
    //   formData.append('inspectedFiles', file);
    // });

    try {
      await dispatch(
        updateMaintenance({
          id: maintenanceToComplete._id,
          maintenanceData: formData,
        }),
      ).unwrap()

      // Refresh the maintenance list after successful update
      dispatch(
        fetchMaintenances({
          page: currentPage,
          search: searchTerm,
        }),
      )
      handleClose();

    } catch (apiError) {
      setError(`Failed to submit: ${apiError.message || 'An error occurred'}`);
      console.error("Submit error:", apiError);
    }
  };

  const handleClose = () => {
    setCompletionModalVisible(false); // Call the prop function
    setError(null);
    setInspectedFiles([]);
    setFilePreviews([]);
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
            <CFormLabel>Notes (Optional)</CFormLabel>
            <CFormTextarea
              rows="3"
              value={notes}
              onChange={handleNotesChange}
              placeholder="Add notes about the completion"
            />
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="inspectedFiles">Upload Inspected Files</CFormLabel>
            <CFormInput
              type="file"
              id="inspectedFiles"
              multiple
              onChange={handleInspectedFilesChange}
            />
          </div>
          {filePreviews.length > 0 && (
            <div>
              <CFormLabel>File Previews:</CFormLabel>
              <div className="d-flex flex-wrap">
                {filePreviews.map((previewUrl, index) => (
                  <img
                    key={index}
                    src={previewUrl}
                    alt={`Preview ${index + 1}`}
                    style={{ width: '100px', height: '100px', marginRight: '10px', marginBottom: '10px', objectFit: 'cover' }}
                  />
                ))}
              </div>
            </div>
          )}
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={handleClose}>
          Cancel
        </CButton>
        <CButton color="dark" onClick={() => handleSubmit('Incomplete')}>
          Set to Incomplete
        </CButton>
        <CButton color="success" onClick={() => handleSubmit('Completed')}>
          Set to Complete
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default MaintenanceCompletionModal;