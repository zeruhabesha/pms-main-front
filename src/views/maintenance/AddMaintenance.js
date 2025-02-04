/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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
  CAlert,
  CSpinner,
} from '@coreui/react'
import { addTenant, updateTenant } from '../../api/actions/TenantActions'
import { getProperty } from '../../api/actions/PropertyAction' // Add this import

const AddTenant = ({ visible, setVisible, editingTenant = null }) => {
  const dispatch = useDispatch()
  const { loading, error } = useSelector((state) => state.tenant)
  const {
    properties,
    loading: propertiesLoading,
    error: propertiesError,
  } = useSelector((state) => state.property)

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
  })

  // Fetch properties when component mounts
  useEffect(() => {
    dispatch(getProperty())
  }, [dispatch])

  useEffect(() => {
    if (editingTenant) {
      setTenantData(editingTenant)
    } else {
      resetForm()
    }
  }, [editingTenant])

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
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setTenantData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNestedChange = (section, field, value) => {
    setTenantData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    setTenantData((prev) => ({ ...prev, idProof: files }))
  }

  const validateForm = () => {
    const requiredFields = ['tenantName', 'password', 'paymentMethod', 'moveInDate']
    for (let field of requiredFields) {
      if (!tenantData[field]) {
        return `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`
      }
    }
    if (!tenantData.contactInformation.email || !tenantData.contactInformation.phoneNumber) {
      return 'Email and Phone Number are required.'
    }
    if (!tenantData.leaseAgreement.startDate || !tenantData.leaseAgreement.endDate) {
      return 'Lease start and end dates are required.'
    }
    return null
  }

  const handleSubmit = () => {
    const validationError = validateForm()
    if (validationError) {
      setErrorMessage(validationError)
      return
    }

    if (editingTenant) {
      dispatch(updateTenant(editingTenant._id, tenantData))
    } else {
      dispatch(addTenant(tenantData))
    }

    handleClose()
  }

  const handleClose = () => {
    resetForm()
    setVisible(false)
  }

  return (
    <CModal visible={visible} onClose={handleClose} alignment="center" backdrop="static" size="lg">
      <CModalHeader className="bg-dark text-white">
        <CModalTitle>{editingTenant ? 'Edit Tenant' : 'Add Tenant'}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CCard className="border-0 shadow-sm">
          <CCardBody>
            {(error || propertiesError) && (
              <CAlert color="danger" className="mb-4">
                {error || propertiesError}
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
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="propertyId">Property</CFormLabel>
                {propertiesLoading ? (
                  <CSpinner size="sm" />
                ) : (
                  <CFormSelect
                    id="propertyId"
                    value={tenantData.propertyInformation.propertyId}
                    onChange={(e) =>
                      handleNestedChange('propertyInformation', 'propertyId', e.target.value)
                    }
                    disabled={propertiesLoading}
                  >
                    <option value="">Select Property</option>
                    {properties?.map((property) => (
                      <option key={property._id} value={property._id}>
                        {property.name}
                      </option>
                    ))}
                  </CFormSelect>
                )}
              </CCol>
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="unit">Unit Number</CFormLabel>
                <CFormInput
                  id="unit"
                  type="text"
                  placeholder="Enter unit number"
                  value={tenantData.propertyInformation.unit}
                  onChange={(e) =>
                    handleNestedChange('propertyInformation', 'unit', e.target.value)
                  }
                />
              </CCol>
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="email">Email</CFormLabel>
                <CFormInput
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  value={tenantData.contactInformation.email}
                  onChange={(e) =>
                    handleNestedChange('contactInformation', 'email', e.target.value)
                  }
                  required
                />
              </CCol>
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="phoneNumber">Phone Number</CFormLabel>
                <CFormInput
                  id="phoneNumber"
                  type="text"
                  placeholder="Enter phone number"
                  value={tenantData.contactInformation.phoneNumber}
                  onChange={(e) =>
                    handleNestedChange('contactInformation', 'phoneNumber', e.target.value)
                  }
                  required
                />
              </CCol>
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="startDate">Lease Start Date</CFormLabel>
                <CFormInput
                  id="startDate"
                  type="date"
                  value={tenantData.leaseAgreement.startDate}
                  onChange={(e) =>
                    handleNestedChange('leaseAgreement', 'startDate', e.target.value)
                  }
                  required
                />
              </CCol>
              <CCol xs={12} md={6}>
                <CFormLabel htmlFor="endDate">Lease End Date</CFormLabel>
                <CFormInput
                  id="endDate"
                  type="date"
                  value={tenantData.leaseAgreement.endDate}
                  onChange={(e) => handleNestedChange('leaseAgreement', 'endDate', e.target.value)}
                  required
                />
              </CCol>
              <CCol xs={12}>
                <CFormLabel htmlFor="idProof">Upload ID Proofs</CFormLabel>
                <CFormInput id="idProof" type="file" multiple onChange={handleFileChange} />
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" variant="ghost" onClick={handleClose} disabled={loading}>
          Cancel
        </CButton>
        <CButton color="dark" onClick={handleSubmit} disabled={loading || propertiesLoading}>
          {loading ? (
            <>
              <CSpinner size="sm" className="me-2" />
              {editingTenant ? 'Updating...' : 'Adding...'}
            </>
          ) : editingTenant ? (
            'Update Tenant'
          ) : (
            'Add Tenant'
          )}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default AddTenant
