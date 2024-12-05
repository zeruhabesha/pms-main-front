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
  CCard,
  CCardBody,
  CSpinner,
} from '@coreui/react';
import Select from 'react-select';
import axios from 'axios';
import { decryptData } from '../../api/utils/crypto';

const TenantRequestForm = ({ visible, setVisible, onSubmit, editingRequest = null }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [properties, setProperties] = useState([]);
  const [formData, setFormData] = useState({
    tenant: '',
    property: '',
    typeOfRequest: '',
    description: '',
    urgencyLevel: '',
    preferredAccessTimes: '',
    photosOrVideos: [],
    notes: '',
  });

  useEffect(() => {
    const encryptedUser = localStorage.getItem('user');
    const decryptedUser = decryptData(encryptedUser);
    const tenantId = decryptedUser?._id || '';

    if (editingRequest) {
      setFormData({
        tenant: editingRequest?.tenant || tenantId,
        property: editingRequest?.property || '',
        typeOfRequest: editingRequest?.typeOfRequest || '',
        description: editingRequest?.description || '',
        urgencyLevel: editingRequest?.urgencyLevel || '',
        preferredAccessTimes: editingRequest?.preferredAccessTimes || '',
        photosOrVideos: editingRequest?.photosOrVideos || [],
        notes: editingRequest?.notes || '',
      });
    } else {
      resetForm(tenantId);
    }

    fetchProperties();
  }, [editingRequest]);

  const fetchProperties = async () => {
    try {
      const response = await axios.get('https://pms-backend-sncw.onrender.com/api/v1//properties');
      console.log('Raw Property Response:', response.data); // Debugging
  
      // Access the properties array correctly
      const propertiesData = response.data?.data?.properties;
      if (Array.isArray(propertiesData)) {
        setProperties(
          propertiesData.map((property) => ({
            value: property._id,
            label: property.title,
          }))
        );
      } else {
        console.error('Unexpected response structure:', response.data);
        setProperties([]);
      }
    } catch (error) {
      console.error('Failed to fetch properties:', error.message);
    }
  };
  

  const resetForm = (tenantId) => {
    setFormData({
      tenant: tenantId,
      property: '',
      typeOfRequest: '',
      description: '',
      urgencyLevel: '',
      preferredAccessTimes: '',
      photosOrVideos: [],
      notes: '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePropertyChange = (selectedOption) => {
    setFormData((prev) => ({ ...prev, property: selectedOption?.value || '' }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, photosOrVideos: files }));
  };

  const validateForm = () => {
    console.log('Current FormData:', formData); // Debugging
    const requiredFields = ['tenant', 'property', 'typeOfRequest', 'description', 'urgencyLevel'];
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
      resetForm(formData.tenant);
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
                <CFormLabel htmlFor="tenant">Tenant</CFormLabel>
                <CFormInput
                  id="tenant"
                  name="tenant"
                  type="text"
                  placeholder="Tenant ID"
                  value={formData.tenant}
                  readOnly
                />
              </CCol>
              <CCol xs={12}>
                <CFormLabel htmlFor="property">Property</CFormLabel>
                <Select
                  id="property"
                  name="property"
                  options={properties}
                  onChange={handlePropertyChange}
                  value={properties.find((p) => p.value === formData.property) || null}
                  placeholder="Select a property"
                  isClearable
                  isSearchable
                />
              </CCol>
              <CCol xs={12}>
                <CFormLabel htmlFor="typeOfRequest">Type of Request</CFormLabel>
                <CFormSelect
                  id="typeOfRequest"
                  name="typeOfRequest"
                  value={formData.typeOfRequest}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Request Type</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Electrical">Electrical</option>
                  <option value="HVAC">HVAC</option>
                  <option value="Appliance Repair">Appliance Repair</option>
                  <option value="Other">Other</option>
                </CFormSelect>
              </CCol>
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
