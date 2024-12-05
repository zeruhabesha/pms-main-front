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

const AddTenant = ({ visible, setVisible, editingTenant = null }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [tenantData, setTenantData] = useState({
    tenantName: '',
    contactInformation: {
      email: '',
      phoneNumber: '',
      emergencyContact: '',
    },
    leaseAgreement: {
      startDate: '',
      endDate: '',
      rentAmount: '',
      securityDeposit: '',
      specialTerms: '',
    },
    propertyInformation: {
      unit: '',
      propertyId: '',
    },
    idProof: [],
    password: '',
    paymentMethod: '',
    moveInDate: '',
    emergencyContacts: [],
  });

  useEffect(() => {
    if (editingTenant) {
      setTenantData(editingTenant);
    } else {
      resetForm();
    }
    setErrorMessage('');
  }, [editingTenant]);

  const resetForm = () => {
    setTenantData({
      tenantName: '',
      contactInformation: {
        email: '',
        phoneNumber: '',
        emergencyContact: '',
      },
      leaseAgreement: {
        startDate: '',
        endDate: '',
        rentAmount: '',
        securityDeposit: '',
        specialTerms: '',
      },
      propertyInformation: {
        unit: '',
        propertyId: '',
      },
      idProof: [],
      password: '',
      paymentMethod: '',
      moveInDate: '',
      emergencyContacts: [],
    });
    setErrorMessage('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTenantData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (section, field, value) => {
    setTenantData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setTenantData((prev) => ({ ...prev, idProof: files }));
  };

  const validateForm = () => {
    const requiredFields = ['tenantName', 'password', 'paymentMethod', 'moveInDate'];
    for (let field of requiredFields) {
      if (!tenantData[field]) {
        return `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`;
      }
    }
    if (!tenantData.contactInformation.email || !tenantData.contactInformation.phoneNumber) {
      return 'Email and Phone Number are required.';
    }
    if (!tenantData.leaseAgreement.startDate || !tenantData.leaseAgreement.endDate) {
      return 'Lease start and end dates are required.';
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
      Object.entries(tenantData).forEach(([key, value]) => {
        if (key === 'idProof' && value.length) {
          value.forEach((file) => formData.append('idProof', file));
        } else {
          formData.append(key, JSON.stringify(value));
        }
      });

      const url = editingTenant
        ? `http://localhost:4000/api/v1/tenants/${editingTenant._id}`
        : 'http://localhost:4000/api/v1/tenants';

      const method = editingTenant ? 'put' : 'post';

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
        <CModalTitle>{editingTenant ? 'Edit Tenant' : 'Add Tenant'}</CModalTitle>
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
              <CCol xs={12}>
                <CFormLabel htmlFor="tenantName">Tenant Name</CFormLabel>
                <CFormInput
                  id="tenantName"
                  name="tenantName"
                  type="text"
                  placeholder="Enter tenant name"
                  value={tenantData.tenantName}
                  onChange={handleChange}
                  required
                />
              </CCol>

              <CCol xs={12}>
                <CFormLabel htmlFor="email">Email</CFormLabel>
                <CFormInput
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  value={tenantData.contactInformation.email}
                  onChange={(e) => handleNestedChange('contactInformation', 'email', e.target.value)}
                  required
                />
              </CCol>

              <CCol xs={12}>
                <CFormLabel htmlFor="phoneNumber">Phone Number</CFormLabel>
                <CFormInput
                  id="phoneNumber"
                  type="text"
                  placeholder="Enter phone number"
                  value={tenantData.contactInformation.phoneNumber}
                  onChange={(e) => handleNestedChange('contactInformation', 'phoneNumber', e.target.value)}
                  required
                />
              </CCol>

              <CCol xs={12}>
                <CFormLabel htmlFor="startDate">Lease Start Date</CFormLabel>
                <CFormInput
                  id="startDate"
                  type="date"
                  value={tenantData.leaseAgreement.startDate}
                  onChange={(e) => handleNestedChange('leaseAgreement', 'startDate', e.target.value)}
                  required
                />
              </CCol>

              <CCol xs={12}>
                <CFormLabel htmlFor="idProof">Upload ID Proofs</CFormLabel>
                <CFormInput
                  id="idProof"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                />
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" variant="ghost" onClick={handleClose} disabled={isLoading}>
          Cancel
        </CButton>
        <CButton color="dark" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? (
            <>
              <CSpinner size="sm" className="me-2" />
              {editingTenant ? 'Updating...' : 'Adding...'}
            </>
          ) : (
            editingTenant ? 'Update Tenant' : 'Add Tenant'
          )}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default AddTenant;
