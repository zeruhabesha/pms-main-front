// src/components/guests/AddGuest.js

import React, { useEffect, useState } from "react";
import {
    CFormInput,
    CFormLabel,
    CRow,
    CCol,
    CCard,
    CCardBody,
    CSpinner,
    CAlert,
    CButton,
    CModal,
    CModalBody,
    CModalHeader,
    CModalTitle,
    CModalFooter,
    CForm, //Import CForm here
    CFormSelect,
} from "@coreui/react";
import { useDispatch } from "react-redux";
import { decryptData } from "../../api/utils/crypto";
import { createGuest, updateGuest } from '../../api/actions/guestActions';
import PropertySelect from "./PropertySelect";
import { reset } from "../../api/slice/guestSlice";
import { toast } from "react-toastify";
import {
    cilUser,
    cilHome,
    cilInfo,
    cilEnvelopeClosed,
    cilPhone,
    cilCalendar,
    cilDescription,
} from '@coreui/icons';
import { CIcon } from '@coreui/icons-react';

const AddGuest = ({ visible, setVisible, editingGuest, setEditingGuest }) => {
    const dispatch = useDispatch();

    const [localError, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        arrivalDate: '',
        departureDate: '',
        reason: '',
        accessCode: '',
        notes: '',
        status: 'active',
        property: '',
        user: ''  // Initialize user field
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchUserData = () => {
            try {
                const encryptedUser = localStorage.getItem('user');
                if (encryptedUser) {
                    const decryptedUser = decryptData(encryptedUser);
                    const user = typeof decryptedUser === 'string' ? JSON.parse(decryptedUser) : decryptedUser;

                    if (user && user._id) {
                        setFormData(prev => ({ ...prev, user: user._id }));
                    } else {
                        console.warn('User data or _id not found in local storage');
                        setError('Unable to retrieve user information.');
                    }
                } else {
                    console.warn('No user found in local storage');
                    setError('No user logged in.');
                }
            } catch (error) {
                console.error('Error fetching or parsing user data:', error);
                setError('Failed to retrieve user information.');
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        if (editingGuest) {
            setFormData({
                name: editingGuest.name || '',
                email: editingGuest.email || '',
                phoneNumber: editingGuest.phoneNumber || '',
                arrivalDate: editingGuest.arrivalDate || '',
                departureDate: editingGuest.departureDate || '',
                reason: editingGuest.reason || '',
                accessCode: editingGuest.accessCode || '',
                notes: editingGuest.notes || '',
                status: editingGuest.status || 'active',
                property: editingGuest.property?._id || '',
                user: editingGuest.user?._id || formData.user // Use existing user ID or fallback to the one from localStorage
            });
        } else {
            setFormData(prev => ({
                ...prev,
                name: '',
                email: '',
                phoneNumber: '',
                arrivalDate: '',
                departureDate: '',
                reason: '',
                accessCode: '',
                notes: '',
                status: 'active',
                property: '',
            }));
        }
    }, [editingGuest, formData.user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        if (!formData.property) return "Please select a property.";
        if (!formData.name) return "Please enter the guest name.";
        if (!formData.phoneNumber) return "Please enter the guest phone number.";
        if (!formData.arrivalDate) return "Please select the arrival date.";
        if (!formData.departureDate) return "Please select the departure date.";
        if (!formData.reason) return "Please enter the reason for visit.";

        return null;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsLoading(true);

        try {
            if (editingGuest) {
                await dispatch(updateGuest({ id: editingGuest._id, guestData: formData })).unwrap();
                toast.success('Guest updated successfully!');
            } else {
                await dispatch(createGuest(formData)).unwrap();
                toast.success('Guest added successfully!');
            }

            dispatch(reset());
            handleClose();
        } catch (error) {
            setError(error?.message || 'Failed to save guest');
            toast.error(error?.message || 'Failed to save guest');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setVisible(false);
        setEditingGuest(null);
        setFormData(prev => ({
            ...prev,
            name: '',
            email: '',
            phoneNumber: '',
            arrivalDate: '',
            departureDate: '',
            reason: '',
            accessCode: '',
            notes: '',
            status: 'active',
            property: '',
        }));
        setError(null);
    };

    const handlePropertyChange = (e) => {
        setFormData(prev => ({ ...prev, property: e.target.value }));
    };

    return (
        <CModal visible={visible} onClose={handleClose} alignment="center" backdrop="static" size="lg">
            <CModalHeader>
                <CModalTitle>{editingGuest ? 'Edit Guest' : 'Add Guest'}</CModalTitle>
            </CModalHeader>

            <CModalBody>
                <div className="maintenance-form">
                    <CCard className="border-0 shadow-sm">
                        <CCardBody>
                            {localError && (
                                <CAlert color="danger" className="mb-3">
                                    {localError}
                                </CAlert>
                            )}

                            <CForm onSubmit={onSubmit}>
                                <CRow className="g-3">
                                    <CCol md={6}>
                                        <CFormLabel htmlFor="user"><CIcon icon={cilUser} className="me-1" />User ID</CFormLabel>
                                        <CFormInput
                                            id="user"
                                            type="text"
                                            value={formData.user}
                                            readOnly
                                            style={{ backgroundColor: 'aliceblue' }}
                                        />
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormLabel htmlFor="property"><CIcon icon={cilHome} className="me-1" />Property</CFormLabel>
                                        <PropertySelect
                                            name="property"
                                            value={formData.property}
                                            onChange={handlePropertyChange}
                                            required
                                            label="Select a Property"
                                        />
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormInput
                                            label={<span><CIcon icon={cilUser} className="me-1" />Name</span>}
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            style={{ backgroundColor: 'aliceblue' }}
                                        />
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormInput
                                            label={<span><CIcon icon={cilEnvelopeClosed} className="me-1" />Email</span>}
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            style={{ backgroundColor: 'aliceblue' }}
                                        />
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormInput
                                            label={<span><CIcon icon={cilPhone} className="me-1" />Phone Number</span>}
                                            type="tel"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                            style={{ backgroundColor: 'aliceblue' }}
                                        />
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormInput
                                            label={<span><CIcon icon={cilCalendar} className="me-1" />Arrival Date</span>}
                                            type="date"
                                            name="arrivalDate"
                                            value={formData.arrivalDate}
                                            onChange={handleChange}
                                            style={{ backgroundColor: 'aliceblue' }}
                                        />
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormInput
                                            label={<span><CIcon icon={cilCalendar} className="me-1" />Departure Date</span>}
                                            type="date"
                                            name="departureDate"
                                            value={formData.departureDate}
                                            onChange={handleChange}
                                            style={{ backgroundColor: 'aliceblue' }}
                                        />
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormInput
                                            label={<span><CIcon icon={cilInfo} className="me-1" />Reason for Visit</span>}
                                            type="text"
                                            name="reason"
                                            value={formData.reason}
                                            onChange={handleChange}
                                            style={{ backgroundColor: 'aliceblue' }}
                                        />
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormInput
                                            label={<span><CIcon icon={cilInfo} className="me-1" />Access Code</span>}
                                            type="text"
                                            name="accessCode"
                                            value={formData.accessCode}
                                            onChange={handleChange}
                                            style={{ backgroundColor: 'aliceblue' }}
                                        />
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormInput
                                            label={<span><CIcon icon={cilDescription} className="me-1" />Notes</span>}
                                            type="textarea"
                                            name="notes"
                                            value={formData.notes}
                                            onChange={handleChange}
                                            style={{ backgroundColor: 'aliceblue' }}
                                        />
                                    </CCol>
                                </CRow>
                            </CForm>
                        </CCardBody>
                    </CCard>
                </div>
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" variant="ghost" onClick={handleClose} disabled={isLoading}>
                    Cancel
                </CButton>
                <CButton color="dark" onClick={onSubmit} disabled={isLoading}>
                    {isLoading ? "Saving..." : editingGuest ? "Update Guest" : "Add Guest"}
                </CButton>
            </CModalFooter>
        </CModal>
    );
};

export default AddGuest;