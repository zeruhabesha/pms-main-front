import React, { useState, useEffect } from 'react';
import {
    CButton,
    CModal,
    CModalBody,
    CModalHeader,
    CModalTitle,
    CModalFooter,
    CFormLabel,
    CFormSwitch
} from '@coreui/react';

import { useDispatch } from 'react-redux';
import { updateUser } from '../../api/actions/userActions';

const ManageStatusModal = ({ visible, setVisible, user, fetchData }) => {
    const dispatch = useDispatch();
    const [status, setStatus] = useState(false); // ✅ Define setStatus properly

    useEffect(() => {
        if (user) {
            setStatus(user.status === 'active'); // ✅ Correct usage of setStatus
        }
    }, [user]);

    const handleStatusChange = () => {
        setStatus((prevStatus) => !prevStatus);
    };

    const handleSave = async () => {
        try {
            const newStatus = status ? 'active' : 'inactive';
            await dispatch(updateUser({ id: user._id, userData: { status: newStatus } })).unwrap();
            fetchData();
            setVisible(false);
        } catch (error) {
            console.error('Failed to update user status:', error);
        }
    };

    const handleClose = () => {
        setVisible(false);
    };

    return (
        <CModal visible={visible} onClose={handleClose} alignment="center">
            <CModalHeader>
                <CModalTitle>Manage User Status</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CFormLabel htmlFor="statusSwitch">Status:</CFormLabel>
                <CFormSwitch
                    id="statusSwitch"
                    label={status ? "Active" : "Inactive"}
                    checked={status}
                    onChange={handleStatusChange}
                />
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={handleClose}>
                    Cancel
                </CButton>
                <CButton color="primary" onClick={handleSave}>
                    Save
                </CButton>
            </CModalFooter>
        </CModal>
    );
};

export default ManageStatusModal;
