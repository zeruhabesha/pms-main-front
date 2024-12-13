import React, { useState, useEffect } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CCol,
  CSpinner,
  CAlert,
} from '@coreui/react';

const MaintenanceEditForm = ({ visible, setVisible, maintenance, onSubmit }) => {
  const [formData, setFormData] = useState({
    typeOfRequest: '',
    urgencyLevel: '',
    notes: '',
    status: '',
    photosOrVideos: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (maintenance) {
      setFormData({
        typeOfRequest: maintenance?.typeOfRequest || '',
        urgencyLevel: maintenance?.urgencyLevel || '',
        notes: maintenance?.notes || '',
        status: maintenance?.status || 'Pending',
        photosOrVideos: [],
      });
    }
  }, [maintenance]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, photosOrVideos: files }));
  };

  const validateForm = () => {
    if (!formData.urgencyLevel) {
      setErrorMessage('Urgency level is required.');
      return false;
    }
    if (!formData.status) {
      setErrorMessage('Status is required.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'photosOrVideos' && value.length) {
          value.forEach((file) => data.append('photosOrVideos', file));
        } else {
          data.append(key, value);
        }
      });

      await onSubmit(data);
      setVisible(false);
    } catch (error) {
      console.error('Failed to update maintenance:', error);
      setErrorMessage('Failed to update maintenance. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CModal visible={visible} onClose={() => setVisible(false)} alignment="center" size="lg">
      <CModalHeader className="bg-dark text-white">
        <CModalTitle>Edit Maintenance Request</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {errorMessage && <CAlert color="danger">{errorMessage}</CAlert>}
        <CRow className="g-4">
          <CCol xs={12}>
            <CFormLabel htmlFor="urgencyLevel">Urgency Level</CFormLabel>
            <CFormSelect
              id="urgencyLevel"
              name="urgencyLevel"
              value={formData.urgencyLevel}
              onChange={handleChange}
              required
            >
              <option value="">Select Urgency Level</option>
              <option value="Urgent">Urgent</option>
              <option value="Routine">Routine</option>
              <option value="Non-Urgent">Non-Urgent</option>
            </CFormSelect>
          </CCol>
          <CCol xs={12}>
            <CFormLabel htmlFor="notes">Notes</CFormLabel>
            <CFormInput
              id="notes"
              name="notes"
              type="text"
              placeholder="Enter additional notes"
              value={formData.notes}
              onChange={handleChange}
            />
          </CCol>
          <CCol xs={12}>
            <CFormLabel htmlFor="status">Status</CFormLabel>
            <CFormSelect
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </CFormSelect>
          </CCol>
          <CCol xs={12}>
            <CFormLabel htmlFor="photosOrVideos">Add Photos/Videos</CFormLabel>
            <CFormInput
              id="photosOrVideos"
              type="file"
              multiple
              onChange={handleFileChange}
              accept="image/*,video/*"
            />
          </CCol>
        </CRow>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisible(false)} disabled={isLoading}>
          Cancel
        </CButton>
        <CButton color="dark" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? <CSpinner size="sm" /> : 'Save Changes'}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default MaintenanceEditForm;
