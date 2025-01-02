import React from 'react'
import { CModal, CModalBody, CModalHeader, CModalTitle, CModalFooter, CButton } from '@coreui/react'
import PropTypes from 'prop-types'

const PhotoDeleteModal = ({ visible, onClose, photoToDelete, confirmDelete }) => {
  return (
    <CModal visible={visible} onClose={onClose} aria-labelledby="delete-photo-modal-title">
      <CModalHeader onClose={onClose}>
        <CModalTitle id="delete-photo-modal-title">Confirm Delete Photo</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {photoToDelete ? (
          <>
            Are you sure you want to delete this photo?
            {photoToDelete.id && (
              <>
                {' '}
                with ID: <strong>{photoToDelete.id}</strong>?
              </>
            )}
          </>
        ) : (
          <p>No photo selected for deletion.</p>
        )}
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose} aria-label="Cancel photo deletion">
          Cancel
        </CButton>
        <CButton
          color="danger"
          onClick={() => {
            confirmDelete(photoToDelete)
            onClose()
          }}
          aria-label="Confirm photo deletion"
        >
          Delete
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

PhotoDeleteModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  photoToDelete: PropTypes.shape({
    id: PropTypes.string,
  }),
  confirmDelete: PropTypes.func.isRequired,
}
export default PhotoDeleteModal