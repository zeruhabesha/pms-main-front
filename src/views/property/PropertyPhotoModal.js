/* eslint-disable react/prop-types */
import React from 'react'
import { CModal, CModalBody, CModalHeader, CModalTitle, CButton } from '@coreui/react'
import { cilX } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const PropertyPhotoModal = ({ visible, photo, onClose }) => {
  return (
    <CModal size="xl" visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>Photo View</CModalTitle>
        <CButton onClick={onClose} color="light">
          <CIcon icon={cilX} />
        </CButton>
      </CModalHeader>
      <CModalBody style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {photo && (
          <img
            src={photo}
            alt="Full Size"
            style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }}
          />
        )}
      </CModalBody>
    </CModal>
  )
}

export default PropertyPhotoModal
