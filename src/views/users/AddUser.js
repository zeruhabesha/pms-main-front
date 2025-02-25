import React, { useState, useEffect } from 'react';
import {
    CButton,
    CModal,
    CModalBody,
    CModalHeader,
    CModalTitle,
    CModalFooter,
    CForm,
    CFormInput,
    CRow,
    CCol,
    CCard,
    CCardBody,
    CInputGroup,
    CFormSelect,
    CAlert,
} from '@coreui/react';
import { useDispatch } from 'react-redux';
import { addUser, updateUser } from '../../api/actions/userActions';

const AddUser = ({ visible, setVisible, editingUser }) => {
    const dispatch = useDispatch();

    const [userData, setUserData] = useState({
        name: '',
        email: '',
        role: 'user',
        phoneNumber: '',
        address: '',
        photo: '',
    });

    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (editingUser) {
            setUserData({
                name: editingUser.name || '',
                email: editingUser.email || '',
                role: editingUser.role || 'User',
                phoneNumber: editingUser.phoneNumber || '',
                address: editingUser.address || '',
                photo: editingUser.photo || '',
            });
        } else {
            setUserData({
                name: '',
                email: '',
                role: 'user',
                phoneNumber: '',
                address: '',
                photo: '',
            });
        }
        setErrorMessage('');
    }, [editingUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (!userData.name || !userData.email || !userData.phoneNumber) {
            setErrorMessage('Please fill in all required fields.');
            return;
        }

        const submissionData = {
            ...userData,
            status: 'pending', // Set initial status to "pending"
        };

        try {
            if (editingUser) {
                await dispatch(updateUser({ id: editingUser._id, userData: submissionData })).unwrap();
            } else {
                await dispatch(addUser(submissionData)).unwrap();
            }
            handleClose();
        } catch (error) {
            setErrorMessage(error.message || 'Operation failed');
        }
    };

    const handleClose = () => {
        setUserData({
            name: '',
            email: '',
            role: 'user',
            phoneNumber: '',
            address: '',
            photo: '',
        });
        setErrorMessage('');
        setVisible(false);
    };

    return (
        <CModal visible={visible} onClose={handleClose} alignment="center" backdrop="static" size="lg">
            <CModalHeader color="dark">
                <CModalTitle>{editingUser ? 'Edit User' : 'Add User'}</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CCard className="border-0 shadow-sm">
                    <CCardBody>
                        {errorMessage && (
                            <CAlert color="danger" className="mb-4">
                                {errorMessage}
                            </CAlert>
                        )}
                        <CForm onSubmit={handleSubmit}>
                            <CRow className="g-4">
                                <CCol xs={12}>
                                    <CInputGroup>
                                        <CFormInput
                                            type="text"
                                            name="name"
                                            value={userData.name}
                                            onChange={handleChange}
                                            placeholder="Enter user Name"
                                            required
                                        />
                                    </CInputGroup>
                                </CCol>
                                <CCol xs={12}>
                                    <CInputGroup>
                                        <CFormInput
                                            type="email"
                                            name="email"
                                            value={userData.email}
                                            onChange={handleChange}
                                            placeholder="Enter user Email"
                                            required
                                        />
                                    </CInputGroup>
                                </CCol>
                                <CCol xs={12}>
                                    <CInputGroup>
                                        <CFormInput
                                            type="text"
                                            name="phoneNumber"
                                            value={userData.phoneNumber}
                                            onChange={handleChange}
                                            placeholder="Enter Phone Number"
                                        />
                                    </CInputGroup>
                                </CCol>
                                <CCol xs={12}>
                                    <CInputGroup>
                                        <CFormInput
                                            type="text"
                                            name="address"
                                            value={userData.address}
                                            onChange={handleChange}
                                            placeholder="Enter Address"
                                        />
                                    </CInputGroup>
                                </CCol>
                                <CCol xs={12}>
                                    <CFormSelect name="role" value={userData.role} onChange={handleChange}>
                                        <option value="user">Employee</option>
                                        <option value="maintainer">Maintainer</option>
                                        <option value="inspector">Inspector</option>
                                    </CFormSelect>
                                </CCol>
                            </CRow>

                            <CModalFooter className="border-top-0">
                                <CButton color="secondary" variant="ghost" onClick={handleClose}>
                                    Cancel
                                </CButton>
                                <CButton color="dark" type="submit">
                                    {editingUser ? 'Update User' : 'Add User'}
                                </CButton>
                            </CModalFooter>
                        </CForm>
                    </CCardBody>
                </CCard>
            </CModalBody>
        </CModal>
    );
};

export default AddUser;