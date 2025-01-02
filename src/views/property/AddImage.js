import React, { useState } from 'react'
import {
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CButton,
  CForm,
  CFormLabel,
  CFormInput,
} from '@coreui/react'
import PropTypes from 'prop-types'

const AddImage = ({
  visible,
  onClose,
  propertyId,
  propertyTitle,
  confirmAddPhoto,
  confirmUpdatePhoto,
  photoId,
  isEdit,
}) => {
  const [photo, setPhoto] = useState(null)
  const [error, setError] = useState('')

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (!file) {
      setError('Please select a valid photo.')
      return
    }
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.')
      setPhoto(null)
      return
    }
    setError('')
    setPhoto(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!photo) {
      setError('Please select a photo.')
      return
    }

    try {
      if (isEdit) {
        if (confirmUpdatePhoto) {
          await confirmUpdatePhoto(photo)
        }
      } else if (confirmAddPhoto) {
        await confirmAddPhoto(photo)
      }
      onClose()
    } catch (error) {
      setError(error.message || 'Failed to add the photo.')
    }
  }

  const handleClose = () => {
    onClose()
  }
  return (
    <CModal visible={visible} onClose={handleClose} alignment="center">
      <CModalHeader>
        <CModalTitle>{isEdit ? 'Edit Photo' : 'Add Photo'}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm onSubmit={handleSubmit}>
          {error && <div className="text-danger mb-2">{error}</div>}
          <CFormLabel htmlFor="photo">Select Photo</CFormLabel>
          <CFormInput type="file" id="photo" accept="image/*" onChange={handleFileChange} />
          <div className="d-flex justify-content-end mt-3">
            <CButton color="secondary" onClick={handleClose}>
              Cancel
            </CButton>
            <CButton color="dark" type="submit" className="ms-2">
              {isEdit ? 'Update Photo' : 'Add Photo'}
            </CButton>
          </div>
        </CForm>
      </CModalBody>
    </CModal>
  )
}

AddImage.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  propertyId: PropTypes.string,
  propertyTitle: PropTypes.string,
  confirmAddPhoto: PropTypes.func,
  confirmUpdatePhoto: PropTypes.func,
  photoId: PropTypes.string,
  isEdit: PropTypes.bool,
}

export default AddImage