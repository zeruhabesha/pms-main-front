import React, { useEffect, useState } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormSelect,
  CFormInput,
  CButton,
  CSpinner,
} from '@coreui/react';

const MaintenanceProfessionalForm = ({
  visible,
  setVisible,
  onSubmit,
  editingMaintenance = null, // Default to null
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    property: '',
    tenant: '',
    description: '',
    urgencyLevel: 'Routine',
    photos: [],
  });

  useEffect(() => {
    console.log('Editing Maintenance:', editingMaintenance); // Debugging log
    if (editingMaintenance) {
      setFormData({
        property: editingMaintenance?.property || '',
        tenant: editingMaintenance?.tenant || '',
        description: editingMaintenance?.description || '',
        urgencyLevel: editingMaintenance?.urgencyLevel || 'Routine',
        photos: editingMaintenance?.photos || [],
      });
    } else {
      setFormData({
        property: '',
        tenant: '',
        description: '',
        urgencyLevel: 'Routine',
        photos: [],
      });
    }
  }, [editingMaintenance]);  
  
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await onSubmit(formData);
      setVisible(false);
    } catch (error) {
      console.error('Error submitting form:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CModal visible={visible} onClose={() => setVisible(false)}>
      <CModalHeader>
        <CModalTitle>
          {editingMaintenance ? 'Edit Maintenance Task' : 'Add Maintenance Task'}
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CFormInput
          label="Property"
          name="property"
          value={formData.property}
          onChange={handleChange}
        />
        <CFormInput
          label="Tenant"
          name="tenant"
          value={formData.tenant}
          onChange={handleChange}
        />
        <CFormInput
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
        <CFormSelect
          name="urgencyLevel"
          value={formData.urgencyLevel}
          onChange={handleChange}
        >
          <option value="Routine">Routine</option>
          <option value="Urgent">Urgent</option>
        </CFormSelect>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisible(false)}>
          Cancel
        </CButton>
        <CButton color="dark" onClick={handleSubmit}>
          {isLoading ? <CSpinner size="sm" /> : 'Submit'}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default MaintenanceProfessionalForm;
