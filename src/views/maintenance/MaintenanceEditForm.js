import React, { useState, useEffect, useCallback } from 'react';
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
  CFormFeedback,
} from '@coreui/react';

const MaintenanceEditForm = ({ 
  visible, 
  setVisible, 
  maintenance, 
  onSubmit 
}) => {
  // Initial form state with comprehensive validation
  const [formData, setFormData] = useState({
    typeOfRequest: '',
    urgencyLevel: '',
    notes: '',
    status: '',
    photosOrVideos: [],
  });

  // Validation state
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Reset form when maintenance prop changes
  useEffect(() => {
    if (maintenance) {
      setFormData({
        typeOfRequest: maintenance?.typeOfRequest || '',
        urgencyLevel: maintenance?.urgencyLevel || '',
        notes: maintenance?.notes || '',
        status: maintenance?.status || 'Pending',
        photosOrVideos: [],
      });
      // Clear previous validation errors
      setValidationErrors({});
      setErrorMessage(null);
    }
  }, [maintenance, visible]);

  // Comprehensive form validation
  const validateForm = useCallback(() => {
    const errors = {};

    // Urgency Level Validation
    if (!formData.urgencyLevel) {
      errors.urgencyLevel = 'Urgency level is required.';
    }

    // Status Validation
    if (!formData.status) {
      errors.status = 'Status is required.';
    }

    // Notes Length Validation (optional)
    if (formData.notes && formData.notes.length > 500) {
      errors.notes = 'Notes cannot exceed 500 characters.';
    }

    // File Size and Type Validation
    if (formData.photosOrVideos.length > 0) {
      const invalidFiles = formData.photosOrVideos.filter(file => {
        // Max file size: 10MB
        const isValidSize = file.size <= 10 * 1024 * 1024;
        // Allowed file types
        const isValidType = /^(image|video)\//i.test(file.type);
        return !(isValidSize && isValidType);
      });

      if (invalidFiles.length > 0) {
        errors.photosOrVideos = 'Some files are invalid. Max size is 10MB, and only images/videos are allowed.';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  // Input change handler with immediate validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear specific field error on change
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // File change handler with validation
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, photosOrVideos: files }));
    
    // Clear file validation error
    if (validationErrors.photosOrVideos) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.photosOrVideos;
        return newErrors;
      });
    }
  };

  // Submit handler with comprehensive error management
  const handleSubmit = async () => {
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'photosOrVideos' && value.length) {
          value.forEach((file) => data.append('photosOrVideos', file));
        } else if (value !== null && value !== undefined) {
          data.append(key, value);
        }
      });

      await onSubmit(data);
      setVisible(false);
    } catch (error) {
      console.error('Maintenance Update Error:', error);
      
      // Detailed error handling
      const errorMsg = error.response?.data?.message || 
                       error.message || 
                       'Failed to update maintenance request';
      
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CModal 
      visible={visible} 
      onClose={() => setVisible(false)} 
      alignment="center" 
      size="lg"
    >
      <CModalHeader className="bg-dark text-white">
        <CModalTitle>Edit Maintenance Request</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {/* Global Error Alert */}
        {errorMessage && (
          <CAlert color="danger" dismissible>
            {errorMessage}
          </CAlert>
        )}

        <CRow className="g-3">
          {/* Urgency Level with Validation */}
          <CCol xs={12}>
            <CFormLabel htmlFor="urgencyLevel">Urgency Level</CFormLabel>
            <CFormSelect
              id="urgencyLevel"
              name="urgencyLevel"
              value={formData.urgencyLevel}
              onChange={handleChange}
              invalid={!!validationErrors.urgencyLevel}
              required
            >
              <option value="">Select Urgency Level</option>
              <option value="Urgent">Urgent</option>
              <option value="Routine">Routine</option>
              <option value="Non-Urgent">Non-Urgent</option>
            </CFormSelect>
            {validationErrors.urgencyLevel && (
              <CFormFeedback invalid>
                {validationErrors.urgencyLevel}
              </CFormFeedback>
            )}
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
        <CButton 
          color="secondary" 
          onClick={() => setVisible(false)} 
          disabled={isLoading}
        >
          Cancel
        </CButton>
        <CButton 
          color="dark" 
          onClick={handleSubmit} 
          disabled={isLoading}
        >
          {isLoading ? <CSpinner size="sm" /> : 'Save Changes'}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default React.memo(MaintenanceEditForm);
