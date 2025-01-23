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
import CustomSwitch from './CustomSwitch';

const AddUser = ({ visible, setVisible, editingUser }) => {
    const dispatch = useDispatch();

    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user', // Set a valid default role according to your schema
        phoneNumber: '',
        address: '',
        status: true,
        photo: '',
        activeStart: '',
        activeEnd: '',
    });

    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (editingUser) {
            setUserData({
                name: editingUser.name || '',
                email: editingUser.email || '',
                password: '', // Clear password field for editing
                role: editingUser.role || 'user',
                phoneNumber: editingUser.phoneNumber || '',
                address: editingUser.address || '',
                status: editingUser.status === 'active',
                photo: editingUser.photo || '',
                activeStart: editingUser.activeStart ? editingUser.activeStart.split('T')[0] : '',
                activeEnd: editingUser.activeEnd ? editingUser.activeEnd.split('T')[0] : '',
            });
        } else {
            setUserData({
                name: '',
                email: '',
                password: '',
                role: 'user',
                phoneNumber: '',
                address: '',
                status: true,
                photo: '',
                activeStart: '',
                activeEnd: '',
            });
        }
        setErrorMessage('');
    }, [editingUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({ ...prev, [name]: value }));
    };

    const handleStatusChange = (checked) => {
        setUserData((prev) => ({ ...prev, status: checked }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (!userData.name || !userData.email || (!editingUser && !userData.password) || !userData.phoneNumber) {
            setErrorMessage('Please fill in all required fields.');
            return;
        }

        const submissionData = {
            ...userData,
            status: userData.status ? 'active' : 'inactive',
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
            password: '',
            role: 'user',
            phoneNumber: '',
            address: '',
            status: true,
            photo: '',
            activeStart: '',
            activeEnd: '',
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
                                {!editingUser && (
                                    <CCol xs={12}>
                                        <CInputGroup>
                                            <CFormInput
                                                type="password"
                                                name="password"
                                                value={userData.password}
                                                onChange={handleChange}
                                                placeholder="Enter Password"
                                                required
                                            />
                                        </CInputGroup>
                                    </CCol>
                                )}
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
                                <CCol xs={12}>
                                    <CustomSwitch
                                        label="Active Status"
                                        name="status"
                                        checked={userData.status}
                                        onChange={handleStatusChange}
                                    />
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