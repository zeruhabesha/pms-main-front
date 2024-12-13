import React, { useState, useEffect } from 'react';
import {
  CButton,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CModalFooter,
  CForm,
  CFormInput,
  CRow,
  CCol,
  CInputGroup,
  CFormSelect,
  CAlert,
  CSpinner,
  CToaster,
} from '@coreui/react';
import { cilTrash, cilPlus } from '@coreui/icons';
import { CIcon } from '@coreui/icons-react';
import axios from 'axios';

const AddTenant = ({ visible, setVisible, editingTenant = null }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState('success');
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
    password: '',
    idProof: [],
    paymentMethod: '',
    moveInDate: '',
    emergencyContacts: [''],
  });

  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (editingTenant) {
      setTenantData({
        tenantName: editingTenant.tenantName || '',
        contactInformation: {
          email: editingTenant.contactInformation?.email || '',
          phoneNumber: editingTenant.contactInformation?.phoneNumber || '',
          emergencyContact: editingTenant.contactInformation?.emergencyContact || '',
        },
        leaseAgreement: {
          startDate: editingTenant.leaseAgreement?.startDate?.split('T')[0] || '',
          endDate: editingTenant.leaseAgreement?.endDate?.split('T')[0] || '',
          rentAmount: editingTenant.leaseAgreement?.rentAmount || '',
          securityDeposit: editingTenant.leaseAgreement?.securityDeposit || '',
          specialTerms: editingTenant.leaseAgreement?.specialTerms || '',
        },
        propertyInformation: {
          unit: editingTenant.propertyInformation?.unit || '',
          propertyId: editingTenant.propertyInformation?.propertyId || '',
        },
        password: '',
        idProof: editingTenant.idProof || [],
        paymentMethod: editingTenant.paymentMethod || '',
        moveInDate: editingTenant.moveInDate?.split('T')[0] || '',
        emergencyContacts: editingTenant.emergencyContacts || [''],
      });
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
      password: '',
      idProof: [],
      paymentMethod: '',
      moveInDate: '',
      emergencyContacts: [''],
    });
    setErrorMessage('');
  };

  const handleArrayChange = (index, value, field) => {
    const updatedArray = [...tenantData[field]];
    updatedArray[index] = value;
    setTenantData((prev) => ({ ...prev, [field]: updatedArray }));
  };

  const handleAddArrayItem = (field) => {
    setTenantData((prev) => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const handleRemoveArrayItem = (index, field) => {
    const updatedArray = tenantData[field].filter((_, i) => i !== index);
    setTenantData((prev) => ({ ...prev, [field]: updatedArray }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setTenantData((prev) => ({
      ...prev,
      idProof: [...prev.idProof, ...files].slice(0, 3), // Limit to 3 files
    }));
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = tenantData.idProof.filter((_, i) => i !== index);
    setTenantData((prev) => ({ ...prev, idProof: updatedFiles }));
  };

  const validateTenantData = () => {
    if (!tenantData.tenantName.trim()) return 'Tenant name is required';
    if (
      !tenantData.contactInformation.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tenantData.contactInformation.email)
    )
      return 'A valid email is required';
    if (!tenantData.contactInformation.phoneNumber.trim()) return 'Phone number is required';
    if (!tenantData.paymentMethod) return 'Payment method is required';
    if (!tenantData.moveInDate) return 'Move-in date is required';
    if (!tenantData.leaseAgreement.startDate) return 'Lease start date is required';
    if (!tenantData.leaseAgreement.endDate) return 'Lease end date is required';
    if (tenantData.idProof.length > 3) return 'No more than 3 ID proofs can be uploaded';
    return ''; // No validation errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateTenantData();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      Object.entries(tenantData).forEach(([key, value]) => {
        if (key === 'idProof') {
          value.forEach((file) => formData.append('idProof', file));
        } else if (typeof value === 'object' && value !== null) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });

      const response = editingTenant
        ? await axios.put(`http://localhost:4000/api/v1/tenants/${editingTenant.id}`, formData)
        : await axios.post('http://localhost:4000/api/v1/tenants', formData);

      if (response.status === 201 || response.status === 200) {
        setToastMessage('Tenant saved successfully');
        setToastColor('success');
        handleClose();
      } else {
        setToastMessage(response.data.message || 'Failed to save tenant');
        setToastColor('danger');
      }
    } catch (error) {
      console.error('Error saving tenant:', error);
      setToastMessage('Failed to save tenant');
      setToastColor('danger');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    setVisible(false);
  };

  return (
    <>
      <CModal visible={visible} onClose={handleClose} alignment="center" backdrop="static" size="lg">
        <CModalHeader className="bg-dark text-white">
          <CModalTitle>{editingTenant ? 'Edit Tenant' : 'Add Tenant'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {errorMessage && <CAlert color="danger">{errorMessage}</CAlert>}
          <CForm onSubmit={handleSubmit}>
          <CRow className="g-3">
  {/* Tenant Name */}
  <CCol md={6}>
    <CFormInput
      label="Tenant Name"
      name="tenantName"
      value={tenantData.tenantName}
      onChange={(e) => setTenantData({ ...tenantData, tenantName: e.target.value })}
      required
    />
  </CCol>

  {/* Email */}
  <CCol md={6}>
    <CFormInput
      label="Email"
      type="email"
      name="email"
      value={tenantData.contactInformation.email}
      onChange={(e) =>
        setTenantData({
          ...tenantData,
          contactInformation: { ...tenantData.contactInformation, email: e.target.value },
        })
      }
      required
    />
  </CCol>

  {/* Phone Number */}
  <CCol md={6}>
    <CFormInput
      label="Phone Number"
      name="phoneNumber"
      value={tenantData.contactInformation.phoneNumber}
      onChange={(e) =>
        setTenantData({
          ...tenantData,
          contactInformation: { ...tenantData.contactInformation, phoneNumber: e.target.value },
        })
      }
      required
    />
  </CCol>

  {/* Emergency Contact */}
  <CCol md={6}>
    <CFormInput
      label="Emergency Contact"
      name="emergencyContact"
      value={tenantData.contactInformation.emergencyContact}
      onChange={(e) =>
        setTenantData({
          ...tenantData,
          contactInformation: { ...tenantData.contactInformation, emergencyContact: e.target.value },
        })
      }
    />
  </CCol>

  {/* Lease Start Date */}
  <CCol md={6}>
    <CFormInput
      label="Lease Start Date"
      type="date"
      name="leaseStartDate"
      value={tenantData.leaseAgreement.startDate}
      onChange={(e) =>
        setTenantData({
          ...tenantData,
          leaseAgreement: { ...tenantData.leaseAgreement, startDate: e.target.value },
        })
      }
      required
    />
  </CCol>

  {/* Lease End Date */}
  <CCol md={6}>
    <CFormInput
      label="Lease End Date"
      type="date"
      name="leaseEndDate"
      value={tenantData.leaseAgreement.endDate}
      onChange={(e) =>
        setTenantData({
          ...tenantData,
          leaseAgreement: { ...tenantData.leaseAgreement, endDate: e.target.value },
        })
      }
      required
    />
  </CCol>

  {/* Rent Amount */}
  <CCol md={6}>
    <CFormInput
      label="Rent Amount"
      type="number"
      name="rentAmount"
      value={tenantData.leaseAgreement.rentAmount}
      onChange={(e) =>
        setTenantData({
          ...tenantData,
          leaseAgreement: { ...tenantData.leaseAgreement, rentAmount: e.target.value },
        })
      }
      required
    />
  </CCol>

  {/* Security Deposit */}
  <CCol md={6}>
    <CFormInput
      label="Security Deposit"
      type="number"
      name="securityDeposit"
      value={tenantData.leaseAgreement.securityDeposit}
      onChange={(e) =>
        setTenantData({
          ...tenantData,
          leaseAgreement: { ...tenantData.leaseAgreement, securityDeposit: e.target.value },
        })
      }
      required
    />
  </CCol>

  {/* Special Terms */}
  <CCol md={12}>
    <CFormInput
      label="Special Terms"
      name="specialTerms"
      value={tenantData.leaseAgreement.specialTerms}
      onChange={(e) =>
        setTenantData({
          ...tenantData,
          leaseAgreement: { ...tenantData.leaseAgreement, specialTerms: e.target.value },
        })
      }
    />
  </CCol>

  {/* Unit */}
  <CCol md={6}>
    <CFormInput
      label="Unit"
      name="unit"
      value={tenantData.propertyInformation.unit}
      onChange={(e) =>
        setTenantData({
          ...tenantData,
          propertyInformation: { ...tenantData.propertyInformation, unit: e.target.value },
        })
      }
      required
    />
  </CCol>

  {/* Property ID */}
  <CCol md={6}>
    <CFormInput
      label="Property ID"
      name="propertyId"
      value={tenantData.propertyInformation.propertyId}
      onChange={(e) =>
        setTenantData({
          ...tenantData,
          propertyInformation: { ...tenantData.propertyInformation, propertyId: e.target.value },
        })
      }
      required
    />
  </CCol>

  {/* Password */}
  <CCol md={6}>
    <CFormInput
      label="Password"
      type="password"
      name="password"
      value={tenantData.password}
      onChange={(e) => setTenantData({ ...tenantData, password: e.target.value })}
      required
    />
  </CCol>

  {/* Payment Method */}
  <CCol md={6}>
    <CFormSelect
      label="Payment Method"
      name="paymentMethod"
      value={tenantData.paymentMethod}
      onChange={(e) => setTenantData({ ...tenantData, paymentMethod: e.target.value })}
      required
    >
      <option value="">Select Payment Method</option>
      <option value="Credit Card">Credit Card</option>
      <option value="Bank Transfer">Bank Transfer</option>
      <option value="Cash">Cash</option>
    </CFormSelect>
  </CCol>

  {/* Move-in Date */}
  <CCol md={6}>
    <CFormInput
      label="Move-in Date"
      type="date"
      name="moveInDate"
      value={tenantData.moveInDate}
      onChange={(e) => setTenantData({ ...tenantData, moveInDate: e.target.value })}
      required
    />
  </CCol>

  {/* Emergency Contacts */}
  <CCol md={12}>
    <label>Emergency Contacts</label>
    {tenantData.emergencyContacts.map((contact, index) => (
      <CRow key={index} className="align-items-center mb-2">
        <CCol xs={10}>
          <CFormInput
            value={contact}
            placeholder={`Emergency Contact ${index + 1}`}
            onChange={(e) => handleArrayChange(index, e.target.value, 'emergencyContacts')}
          />
        </CCol>
        <CCol xs={2}>
          <CButton
            size="sm"
            color="light"
            onClick={() => handleRemoveArrayItem(index, 'emergencyContacts')}
          >
            <CIcon icon={cilTrash} />
          </CButton>
        </CCol>
      </CRow>
    ))}
    <CButton size="sm" color="dark" onClick={() => handleAddArrayItem('emergencyContacts')}>
      <CIcon icon={cilPlus} className="me-1" />
      Add Contact
    </CButton>
  </CCol>

  {/* ID Proof */}
  <CCol md={6}>
    <label>ID Proof (Max: 3)</label>
    <CInputGroup>
      <CFormInput
        type="file"
        name="idProof"
        multiple
        accept=".jpg,.jpeg,.png,.pdf"
        onChange={handleFileChange}
      />
    </CInputGroup>
    <CRow className="mt-2">
      {tenantData.idProof.map((file, idx) => (
        <CCol key={idx} xs={12} className="d-flex align-items-center justify-content-between">
          <span>{file.name}</span>
          <CButton size="sm" color="light" onClick={() => handleRemoveFile(idx)}>
            <CIcon icon={cilTrash} />
          </CButton>
        </CCol>
      ))}
    </CRow>
  </CCol>
</CRow>

</CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleClose} disabled={isLoading}>
            Cancel
          </CButton>
          <CButton color="dark" type="submit" disabled={isLoading}>
            {isLoading ? <CSpinner size="sm" /> : editingTenant ? 'Update Tenant' : 'Add Tenant'}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default AddTenant;