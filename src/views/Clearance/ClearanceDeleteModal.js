import React from 'react';
import {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CButton,
} from '@coreui/react';
const ClearanceDeleteModal = ({
    visible,
    setDeleteModalVisible,
    clearanceToDelete,
    confirmDelete,
}) => {
    const handleClose = () => {
        setDeleteModalVisible(false);
    };
    return (
        <CModal visible={visible} onClose={handleClose} alignment="center">
            <CModalHeader>
                <CModalTitle>Confirm Delete</CModalTitle>
            </CModalHeader>
            <CModalBody>
                {clearanceToDelete ? (
                    <p>
                        Are you sure you want to delete this clearance request
                        {clearanceToDelete.reason && (
                            <>
                                for <strong>{clearanceToDelete.reason}</strong>?
                            </>
                        )}
                    </p>
                ) : (
                    <p>No clearance selected to delete.</p>
                )}
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={handleClose}>
                    Cancel
                </CButton>
                <CButton color="danger" onClick={confirmDelete} disabled={!clearanceToDelete}>
                    Delete
                </CButton>
            </CModalFooter>
        </CModal>
    );
};
export default ClearanceDeleteModal;