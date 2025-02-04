/* eslint-disable react/prop-types */
import React, { useState, useEffect, useCallback } from 'react'
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
} from '@coreui/react'

const MaintenanceEditForm = ({ visible, setVisible, maintenance, onSubmit }) => {
  const [formData, setFormData] = useState({
    typeOfRequest: '',
    urgencyLevel: '',
    notes: '',
    status: '',
    property: null,
    photosOrVideos: [],
  })
  const [filePreviews, setFilePreviews] = useState([])
  const [validationErrors, setValidationErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    if (maintenance) {
      setFormData({
        typeOfRequest: maintenance?.typeOfRequest || '',
        urgencyLevel: maintenance?.urgencyLevel || '',
        notes: maintenance?.notes || '',
        status: maintenance?.status || 'Pending',
        property: maintenance?.property || null,
        photosOrVideos: [],
      })

      // Ensure filePreviews are set to the existing URLs or object URLs
      setFilePreviews(
        (maintenance?.requestedFiles || []).map((file) =>
          typeof file === 'string' ? file : URL.createObjectURL(file),
        ),
      )
      setValidationErrors({})
      setErrorMessage(null)
    }
  }, [maintenance, visible])

  const validateForm = useCallback(() => {
    const errors = {}

    if (!formData.urgencyLevel) errors.urgencyLevel = 'Urgency level is required.'
    if (!formData.status) errors.status = 'Status is required.'
    if (formData.notes?.length > 500) errors.notes = 'Notes cannot exceed 500 characters.'

    if (formData.photosOrVideos.length > 0) {
      const invalidFiles = formData.photosOrVideos.filter((file) => {
        const isValidSize = file.size <= 10 * 1024 * 1024
        const isValidType = /^(image|video)\//i.test(file.type)
        return !(isValidSize && isValidType)
      })

      if (invalidFiles.length > 0) {
        errors.photosOrVideos =
          'Some files are invalid. Max size is 10MB, and only images/videos are allowed.'
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }, [formData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }
  // Updated handleFileChange to append new file previews
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    setFormData((prev) => ({ ...prev, photosOrVideos: files }))

    // Create URLs for new files and append them to the previews
    const newPreviews = files.map((file) => URL.createObjectURL(file))
    setFilePreviews((prevPreviews) => [...prevPreviews, ...newPreviews])

    if (validationErrors.photosOrVideos) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.photosOrVideos
        return newErrors
      })
    }
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    setErrorMessage(null)

    try {
      const data = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'photosOrVideos' && value.length) {
          value.forEach((file) => data.append('photosOrVideos', file))
        } else if (key === 'property' && value?._id) {
          data.append(key, value._id)
        } else if (value !== null && value !== undefined) {
          data.append(key, value)
        }
      })
      // Clear the previews after submit
      await onSubmit(data)
      setFilePreviews([])
      setVisible(false)
    } catch (error) {
      console.error('Maintenance Update Error:', error)
      setErrorMessage(
        error.response?.data?.message || error.message || 'Failed to update maintenance request',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <CModal visible={visible} onClose={() => setVisible(false)} alignment="center" size="lg">
      <CModalHeader className="bg-dark text-white">
        <CModalTitle>Edit Maintenance Request</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {errorMessage && <CAlert color="danger">{errorMessage}</CAlert>}

        <CRow className="g-3">
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
              <CFormFeedback invalid>{validationErrors.urgencyLevel}</CFormFeedback>
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
        {/* Image/Video previews below the form fields */}
        {filePreviews.length > 0 && (
          <CCol xs={12} className="d-flex flex-wrap gap-2 mt-3">
            {filePreviews.map((file, index) => (
              <div key={index} className="image-preview">
                {/\.(jpg|jpeg|png|gif)$/i.test(file) ? (
                  <img
                    src={file}
                    alt={`Preview ${index + 1}`}
                    style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }}
                  />
                ) : /\.(mp4|mov|avi)$/i.test(file) ? (
                  <video src={file} controls style={{ maxWidth: '100px', maxHeight: '100px' }} />
                ) : null}
              </div>
            ))}
          </CCol>
        )}
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
  )
}

export default React.memo(MaintenanceEditForm)
