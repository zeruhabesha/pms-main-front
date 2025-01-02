import React from 'react'
import { CModal, CModalBody, CModalHeader, CModalTitle, CModalFooter, CButton } from '@coreui/react'
import PropTypes from 'prop-types'

const PropertyDeleteModal = ({ visible, onClose, propertyToDelete, confirmDelete }) => {
  return (
    <CModal visible={visible} onClose={onClose} aria-labelledby="delete-modal-title">
      <CModalHeader onClose={onClose}>
        <CModalTitle id="delete-modal-title">Confirm Delete</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {propertyToDelete ? (
          <>
            Are you sure you want to delete the property titled:{' '}
            <strong>{propertyToDelete.title || 'N/A'}</strong>
            {propertyToDelete.id && (
              <>
                {' '}
                with ID: <strong>{propertyToDelete.id}</strong>?
              </>
            )}
          </>
        ) : (
          <p>No property selected for deletion.</p>
        )}
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose} aria-label="Cancel deletion">
          Cancel
        </CButton>
        <CButton
          color="danger"
          onClick={() => {
            confirmDelete(propertyToDelete.id)
            onClose()
          }}
          aria-label="Confirm deletion"
        >
          Delete
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

PropertyDeleteModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  propertyToDelete: PropTypes.shape({
    title: PropTypes.string,
    id: PropTypes.string,
  }),
  confirmDelete: PropTypes.func.isRequired,
}
export default PropertyDeleteModal