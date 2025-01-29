import React from 'react';
import {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CButton,
} from '@coreui/react';

const MaintenanceDeleteModal = ({ visible, setDeleteModalVisible, maintenanceToDelete, confirmDelete }) => {
    return (
        <CModal visible={visible} onClose={() => setDeleteModalVisible(false)}>
            <CModalHeader>
                <CModalTitle>Confirm Delete</CModalTitle>
            </CModalHeader>
            <CModalBody>
                Are you sure you want to delete this maintenance request?
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={() => setDeleteModalVisible(false)}>
                    Cancel
                </CButton>
                <CButton color="danger" onClick={confirmDelete}>
                    Delete
                </CButton>
            </CModalFooter>
        </CModal>
    );
};

export default MaintenanceDeleteModal;