/* eslint-disable react/prop-types */
// AddClearance.js

import React, { useEffect, useState, useCallback } from 'react'
import {
  CFormInput,
  CFormLabel,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CSpinner,
  CAlert,
  CButton,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CModalFooter,
  CForm,
  CFormSelect,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { decryptData } from '../../api/utils/crypto'
import { addClearance } from '../../api/actions/ClearanceAction'
import PropertySelect from '../complaints/PropertySelect'
import { reset } from '../../api/slice/ClearanceSlice.js'
import { toast } from 'react-toastify'
import { cilUser, cilHome, cilInfo, cilDescription, cilCalendar, cilWarning } from '@coreui/icons'
import { CIcon } from '@coreui/icons-react'
import { getPropertiesByUser } from '../../api/actions/PropertyAction'

const AddClearance = ({ visible, setVisible, tenantId: propTenantId, selectedClearance }) => {
  const dispatch = useDispatch()
  const { isLoading } = useSelector((state) => state.clearance)
  const [noPropertiesMessage, setNoPropertiesMessage] = useState(null)
  const [localError, setError] = useState(null)
  const [formData, setFormData] = useState({
    tenant: '',
    property: '',
    moveOutDate: '',
    inspectionDate: '',
    reason: '',
    notes: '',
  })
  const [userId, setUserId] = useState(null)
  const [userName, setUserName] = useState(null)
  const [isTenantUser, setIsTenantUser] = useState(false)
  const [tenantProperties, setTenantProperties] = useState([])
  const { tenants } = useSelector((state) => state.tenant)

  useEffect(() => {
    const fetchUser = async () => {
      const encryptedUser = localStorage.getItem('user')
      if (encryptedUser) {
        try {
          const decryptedUser = decryptData(encryptedUser)
          if (decryptedUser && decryptedUser._id) {
            const userIdString = String(decryptedUser._id)
            setUserId(userIdString)
            setUserName(decryptedUser.name)
            setIsTenantUser(decryptedUser.role === 'Tenant')

            if (decryptedUser.role === 'Tenant') {
              // Logged in tenant user
              setFormData((prev) => ({ ...prev, tenant: userIdString }))

              const response = await dispatch(getPropertiesByUser(userIdString)).unwrap()
              setTenantProperties(response)
            } else {
              // Logged in Admin/Agent user
              // Load the tenant ID from localStorage, if available.
              const storedTenantId = localStorage.getItem('selectedTenantId') // get from localstorage
              if (storedTenantId) {
                setFormData((prev) => ({ ...prev, tenant: storedTenantId }))
              }
            }
          }
        } catch (error) {
          console.error('Decryption error:', error)
          setError('Error decoding user data')
        }
      }
    }

    fetchUser()
  }, [dispatch])

  useEffect(() => {
    if (selectedClearance) {
      setFormData({
        tenant: selectedClearance.tenant || '',
        property: selectedClearance.property || '',
        moveOutDate: selectedClearance.moveOutDate
          ? new Date(selectedClearance.moveOutDate).toISOString().split('T')[0]
          : '',
        inspectionDate: selectedClearance.inspectionDate
          ? new Date(selectedClearance.inspectionDate).toISOString().split('T')[0]
          : '',
        reason: selectedClearance.reason || '',
        notes: selectedClearance.notes || '',
      })
    } else {
      const storedTenantId = localStorage.getItem('selectedTenantId')
      setFormData({
        tenant: isTenantUser ? userId || '' : storedTenantId || '', //Load from LS or default
        property: null,
        moveOutDate: '',
        inspectionDate: '',
        reason: '',
        notes: '',
      })
    }
  }, [selectedClearance, userId, isTenantUser])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    if (!formData.property) return 'Please select a property.'
    if (!formData.tenant) return 'Tenant ID is required.'
    if (!formData.inspectionDate) return 'Please select the inspection date.'
    if (!formData.moveOutDate) return 'Please select the move out date.'
    if (!formData.reason) return 'Please enter the reason for clearance.'
    return null
  }

  const onSubmit = async () => {
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      const payload = {
        tenant: formData.tenant, // Send as ObjectId
        property: formData.property, // Send as ObjectId
        moveOutDate: new Date(formData.moveOutDate).toISOString(),
        inspectionDate: new Date(formData.inspectionDate).toISOString(),
        reason: formData.reason,
        notes: formData.notes,
        status: 'Pending',
        inspectionStatus: 'Pending',
      }

      await dispatch(addClearance(payload)).unwrap()
      toast.success('Clearance request submitted successfully!')
      dispatch(reset())
      handleClose()
    } catch (error) {
      console.error('Submission error:', error)
      setError(error.message || 'Failed to create clearance request.')
    }
  }

  const handleClose = () => {
    setVisible(false)
    setFormData({
      tenant: '',
      property: null,
      moveOutDate: '',
      inspectionDate: '',
      reason: '',
      notes: '',
    })
    setError(null)
  }

  const handlePropertyChange = useCallback((e) => {
    const propertyId = e.target.value
    setFormData((prev) => ({ ...prev, property: propertyId }))
  }, [])

  // HANDLE TENANT CHANGE (if you need an admin to select the tenant)
  const handleTenantChange = useCallback((e) => {
    const tenantId = e.target.value
    setFormData((prev) => ({ ...prev, tenant: tenantId }))
    localStorage.setItem('selectedTenantId', tenantId) // STORE IN LOCAL STORAGE
  }, [])

  return (
    <CModal visible={visible} onClose={handleClose} alignment="center" backdrop="static" size="lg">
      <CModalHeader>
        <CModalTitle>
          {selectedClearance ? 'Edit Clearance Request' : 'Request Clearance'}
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CCard className="border-0 shadow-sm">
          <CCardBody>
            {localError && (
              <CAlert color="danger" className="mb-3">
                {localError}
              </CAlert>
            )}
            {noPropertiesMessage && (
              <CAlert color="info" className="mb-3">
                {noPropertiesMessage}
              </CAlert>
            )}
            <CForm>
              <CRow className="g-3">
                <CCol md={6}>
                  <CFormLabel htmlFor="property">
                    <CIcon icon={cilHome} className="me-1" />
                    Property
                  </CFormLabel>
                  <PropertySelect
                    id="property"
                    value={formData.property}
                    onChange={handlePropertyChange}
                    required
                    properties={tenantProperties}
                    name="property"
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="tenant">
                    <CIcon icon={cilUser} className="me-1" />
                    Tenant
                  </CFormLabel>
                  {isTenantUser ? (
                    <CFormInput type="text" value={userName || ''} readOnly disabled />
                  ) : (
                    <CFormSelect
                      id="tenant"
                      name="tenant"
                      value={formData.tenant}
                      onChange={handleTenantChange}
                    >
                      <option value="">Select Tenant</option>
                      <option key={userId} value={userId}>
                        {userName}
                      </option>
                    </CFormSelect>
                  )}
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    label={
                      <span>
                        <CIcon icon={cilCalendar} className="me-1" />
                        Move Out Date
                      </span>
                    }
                    type="date"
                    name="moveOutDate"
                    value={formData.moveOutDate}
                    onChange={handleChange}
                    className="bg-light"
                    required
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    label={
                      <span>
                        <CIcon icon={cilCalendar} className="me-1" />
                        Inspection Date
                      </span>
                    }
                    type="date"
                    name="inspectionDate"
                    value={formData.inspectionDate}
                    onChange={handleChange}
                    className="bg-light"
                    required
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    label={
                      <span>
                        <CIcon icon={cilInfo} className="me-1" />
                        Reason
                      </span>
                    }
                    type="text"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    className="bg-light"
                    required
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    label={
                      <span>
                        <CIcon icon={cilDescription} className="me-1" />
                        Notes
                      </span>
                    }
                    type="textarea"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    className="bg-light"
                  />
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" variant="ghost" onClick={handleClose} disabled={isLoading}>
          Cancel
        </CButton>
        <CButton color="dark" onClick={onSubmit} disabled={isLoading}>
          {isLoading ? (
            <>
              <CSpinner size="sm" className="me-2" />
              Requesting...
            </>
          ) : selectedClearance ? (
            'Update Request'
          ) : (
            'Submit Request'
          )}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default AddClearance
