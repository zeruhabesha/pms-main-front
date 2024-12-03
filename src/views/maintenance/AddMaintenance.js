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
  CRow,
  CCol,
  CCard,
  CCardBody,
  CAlert,
  CSpinner,
} from '@coreui/react';
import axios from 'axios';

const AddMaintenance = ({ visible, setVisible, editingMaintenance = null }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [maintenanceData, setMaintenanceData] = useState({
    tenant: '',
    property: '',
    typeOfRequest: '',
    description: '',
    urgencyLevel: '',
    preferredAccessTimes: '',
    photosOrVideos: [],
  });

  useEffect(() => {
    if (editingMaintenance) {
      setMaintenanceData({
        tenant: editingMaintenance.tenant || '',
        property: editingMaintenance.property || '',
        typeOfRequest: editingMaintenance.typeOfRequest || '',
        description: editingMaintenance.description || '',
        urgencyLevel: editingMaintenance.urgencyLevel || '',
        preferredAccessTimes: editingMaintenance.preferredAccessTimes || '',
        photosOrVideos: editingMaintenance.photosOrVideos || [],
      });
    } else {
      resetForm();
    }
    setErrorMessage('');
  }, [editingMaintenance]);

  const resetForm = () => {
    setMaintenanceData({
      tenant: '',
      property: '',
      typeOfRequest: '',
      description: '',
      urgencyLevel: '',
      preferredAccessTimes: '',
      photosOrVideos: [],
    });
    setErrorMessage('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMaintenanceData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setMaintenanceData((prev) => ({ ...prev, photosOrVideos: files }));
  };

  const validateForm = () => {
    const requiredFields = ['tenant', 'property', 'typeOfRequest', 'description', 'urgencyLevel'];
    for (let field of requiredFields) {
      if (!maintenanceData[field]) {
        return `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`;
      }
    }
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();
      Object.entries(maintenanceData).forEach(([key, value]) => {
        if (key === 'photosOrVideos' && value.length) {
          value.forEach((file) => formData.append('photosOrVideos', file));
        } else {
          formData.append(key, value);
        }
      });

      const url = editingMaintenance
        ? `http://localhost:4000/api/v1/maintenances/${editingMaintenance._id}`
        : 'http://localhost:4000/api/v1/maintenances';

      const method = editingMaintenance ? 'put' : 'post';

      await axios({
        method,
        url,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      handleClose();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message || 'Operation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    setVisible(false);
  };

  return (
    <CModal
      visible={visible}
      onClose={handleClose}
      alignment="center"
      backdrop="static"
      size="lg"
    >
      <CModalHeader className="bg-dark text-white">
        <CModalTitle>{editingMaintenance ? 'Edit Maintenance' : 'Add Maintenance'}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CCard className="border-0 shadow-sm">
          <CCardBody>
            {errorMessage && (
              <CAlert color="danger" className="mb-4">
                {errorMessage}
              </CAlert>
            )}
            <CRow className="g-4">
              {['tenant', 'property', 'typeOfRequest', 'description', 'urgencyLevel'].map((field) => (
                <CCol xs={12} key={field}>
                  <CFormLabel htmlFor={field}>
                    {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                  </CFormLabel>
                  <CFormInput
                    id={field}
                    name={field}
                    type="text"
                    placeholder={`Enter ${field}`}
                    value={maintenanceData[field]}
                    onChange={handleChange}
                    required
                  />
                </CCol>
              ))}
              <CCol xs={12}>
                <CFormLabel htmlFor="preferredAccessTimes">Preferred Access Times</CFormLabel>
                <CFormInput
                  id="preferredAccessTimes"
                  name="preferredAccessTimes"
                  type="text"
                  placeholder="Enter preferred access times (optional)"
                  value={maintenanceData.preferredAccessTimes}
                  onChange={handleChange}
                />
              </CCol>
              <CCol xs={12}>
                <CFormLabel htmlFor="photosOrVideos">Upload Photos/Videos</CFormLabel>
                <CFormInput
                  id="photosOrVideos"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  accept="image/*,video/*"
                />
                {maintenanceData.photosOrVideos.length > 0 && (
                  <div className="mt-2">
                    <strong>Selected Files:</strong>
                    <ul>
                      {maintenanceData.photosOrVideos.map((file, index) => (
                        <li key={index}>{file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CModalBody>
      <CModalFooter className="border-top-0">
        <CButton color="secondary" variant="ghost" onClick={handleClose} disabled={isLoading}>
          Cancel
        </CButton>
        <CButton color="dark" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? (
            <>
              <CSpinner size="sm" className="me-2" />
              {editingMaintenance ? 'Updating...' : 'Adding...'}
            </>
          ) : (
            editingMaintenance ? 'Update Maintenance' : 'Add Maintenance'
          )}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default AddMaintenance;
