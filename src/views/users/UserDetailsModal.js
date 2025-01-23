import React from 'react';
import {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CButton,
} from '@coreui/react';

const UserDetailsModal = ({ visible, user, onClose }) => {
    if (!user) return null; // Ensure user data exists

    return (
        <CModal visible={visible} onClose={onClose}>
            <CModalHeader closeButton>
                <CModalTitle>User Details</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <div className="row">
                    <div className="col-md-6">
                        <p><strong>Name:</strong> {user.name || 'N/A'}</p>
                        <p><strong>Email:</strong> {user.email || 'N/A'}</p>
                        <p><strong>Phone:</strong> {user.phoneNumber || 'N/A'}</p>
                    </div>
                    <div className="col-md-6">
                        <p><strong>Address:</strong> {user.address || 'N/A'}</p>
                        <p><strong>Status:</strong> {user.status || 'N/A'}</p>
                       <p><strong>Role:</strong> {user.role || 'N/A'}</p>
                    </div>
                </div>
                <div>
                    <p><strong>Created At:</strong> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                    <p><strong>Last Updated:</strong> {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString(): 'N/A'}</p>
                </div>
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={onClose}>
                    Close
                </CButton>
            </CModalFooter>
        </CModal>
    );
};

export default UserDetailsModal;