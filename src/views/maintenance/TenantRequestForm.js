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
  CSpinner,
} from '@coreui/react';

const TenantRequestForm = ({ visible, setVisible, onSubmit, editingRequest = null }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    tenant: '',
    typeOfRequest: '',
    description: '',
    preferredAccessTimes: '',
    photosOrVideos: [],
  });

  useEffect(() => {
    console.log('Editing Request:', editingRequest); // Debugging log
    if (editingRequest) {
      setFormData({
        tenant: editingRequest?.tenant || '',
        typeOfRequest: editingRequest?.typeOfRequest || '',
        description: editingRequest?.description || '',
        preferredAccessTimes: editingRequest?.preferredAccessTimes || '',
        photosOrVideos: editingRequest?.photosOrVideos || [],
      });
    } else {
      resetForm();
    }
  }, [editingRequest]);
  

  const resetForm = () => {
    setFormData({
      tenant: '',
      typeOfRequest: '',
      description: '',
      preferredAccessTimes: '',
      photosOrVideos: [],
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, photosOrVideos: files }));
  };

  const validateForm = () => {
    const requiredFields = ['tenant', 'typeOfRequest', 'description'];
    for (let field of requiredFields) {
      if (!formData[field]) {
        return `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`;
      }
    }
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      console.error(validationError);
      return;
    }

    setIsLoading(true);
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
      resetForm();
      setVisible(false);
    } catch (error) {
      console.error('Failed to submit the request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CModal visible={visible} onClose={() => setVisible(false)} alignment="center" size="lg">
      <CModalHeader className="bg-dark text-white">
        <CModalTitle>{editingRequest ? 'Edit Tenant Request' : 'Add Tenant Request'}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CCard className="border-0 shadow-sm">
          <CCardBody>
            <CRow className="g-4">
              <CCol xs={12}>
                <CFormLabel htmlFor="tenant">Tenant Name</CFormLabel>
                <CFormInput
                  id="tenant"
                  name="tenant"
                  type="text"
                  placeholder="Enter tenant name"
                  value={formData.tenant}
                  onChange={handleChange}
                  required
                />
              </CCol>
              <CCol xs={12}>
                <CFormLabel htmlFor="typeOfRequest">Type of Request</CFormLabel>
                <CFormInput
                  id="typeOfRequest"
                  name="typeOfRequest"
                  type="text"
                  placeholder="Enter type of request"
                  value={formData.typeOfRequest}
                  onChange={handleChange}
                  required
                />
              </CCol>
              <CCol xs={12}>
                <CFormLabel htmlFor="description">Description</CFormLabel>
                <CFormInput
                  id="description"
                  name="description"
                  type="text"
                  placeholder="Enter description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </CCol>
              <CCol xs={12}>
                <CFormLabel htmlFor="preferredAccessTimes">Preferred Access Times</CFormLabel>
                <CFormInput
                  id="preferredAccessTimes"
                  name="preferredAccessTimes"
                  type="text"
                  placeholder="Enter preferred access times"
                  value={formData.preferredAccessTimes}
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
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisible(false)} disabled={isLoading}>
          Cancel
        </CButton>
        <CButton color="dark" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? <CSpinner size="sm" /> : editingRequest ? 'Update Request' : 'Add Request'}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default TenantRequestForm;
