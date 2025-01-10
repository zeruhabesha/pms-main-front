// components/guests/AddGuest.js
import React, { useState } from 'react';
import {
  CButton,
  CForm,
  CFormInput,
  CRow,
  CCol,
  CAlert,
  CSpinner,
  CCard,
  CCardHeader,
  CCardBody,
} from '@coreui/react';
import { useDispatch, useSelector } from 'react-redux';
import { createGuest } from '../../api/actions/guestActions';
import { useNavigate } from 'react-router-dom';
import { reset } from '../../api/slice/guestSlice';
import { toast } from 'react-toastify';


const AddGuest = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isLoading, isSuccess, isError, message } = useSelector(
        (state) => state.guest
    );
    const [guestData, setGuestData] = useState({
        user: "66092f0a18c25a177c011766",
        property: "660a0a4d7376a0365538c115",
        name: "",
        email: "",
        phoneNumber: "",
        arrivalDate: "",
        departureDate: "",
        reason: "",
        qrCode: "",
        accessCode: "",
        notes: "",
        status: "pending",
    });

    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        setGuestData({ ...guestData, [e.target.name]: e.target.value });
    };

     const validateForm = () => {
        const errors = [];

        if (!guestData.name.trim()) {
          errors.push('Guest name is required');
      }
      if (!guestData.arrivalDate) {
        errors.push('Arrival date is required');
    }

     if (!guestData.departureDate) {
      errors.push('Departure date is required');
  }
      if (errors.length > 0) {
            setErrorMessage(errors.join(', '));
            return false;
        }

        return true;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        try {
           await dispatch(createGuest(guestData)).unwrap();
           toast.success('Guest added successfully');
           dispatch(reset());
           navigate("/");
       } catch (error) {
            toast.error(error.message || "Failed to add guest");
            setErrorMessage(error.message || 'Failed to add guest')

       }
    };
    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Add Guest</strong>
                    </CCardHeader>
                    <CCardBody>
                        {errorMessage && <CAlert color="danger">{errorMessage}</CAlert>}
                        <CForm onSubmit={handleSubmit}>
                            <CRow className="g-3">
                                <CCol md={6}>
                                    <CFormInput
                                        label="Name"
                                        type="text"
                                        name="name"
                                        value={guestData.name}
                                        onChange={handleChange}
                                        required
                                          invalid={!guestData.name.trim()}
                                          style={{ backgroundColor: 'aliceblue' }}
                                    />
                                </CCol>
                                <CCol md={6}>
                                    <CFormInput
                                        label="Email"
                                        type="email"
                                        name="email"
                                        value={guestData.email}
                                        onChange={handleChange}
                                           style={{ backgroundColor: 'aliceblue' }}
                                    />
                                </CCol>
                                <CCol md={6}>
                                    <CFormInput
                                        label="Phone Number"
                                        type="text"
                                        name="phoneNumber"
                                        value={guestData.phoneNumber}
                                        onChange={handleChange}
                                           style={{ backgroundColor: 'aliceblue' }}
                                    />
                                </CCol>
                                <CCol md={6}>
                                    <CFormInput
                                        label="Arrival Date"
                                        type="date"
                                        name="arrivalDate"
                                        value={guestData.arrivalDate}
                                        onChange={handleChange}
                                        required
                                          invalid={!guestData.arrivalDate}
                                           style={{ backgroundColor: 'aliceblue' }}
                                    />
                                </CCol>
                                <CCol md={6}>
                                    <CFormInput
                                        label="Departure Date"
                                        type="date"
                                        name="departureDate"
                                        value={guestData.departureDate}
                                        onChange={handleChange}
                                        required
                                        invalid={!guestData.departureDate}
                                        style={{ backgroundColor: 'aliceblue' }}
                                    />
                                </CCol>
                                <CCol md={6}>
                                    <CFormInput
                                        label="Reason"
                                        type="text"
                                        name="reason"
                                        value={guestData.reason}
                                        onChange={handleChange}
                                           style={{ backgroundColor: 'aliceblue' }}
                                    />
                                </CCol>
                                <CCol md={6}>
                                    <CFormInput
                                        label="QR Code"
                                        type="text"
                                        name="qrCode"
                                        value={guestData.qrCode}
                                        onChange={handleChange}
                                           style={{ backgroundColor: 'aliceblue' }}
                                    />
                                </CCol>
                                <CCol md={6}>
                                    <CFormInput
                                        label="Access Code"
                                        type="text"
                                        name="accessCode"
                                        value={guestData.accessCode}
                                        onChange={handleChange}
                                           style={{ backgroundColor: 'aliceblue' }}
                                    />
                                </CCol>
                                <CCol md={12}>
                                    <CFormInput
                                        label="Notes"
                                        type="textarea"
                                        name="notes"
                                        value={guestData.notes}
                                        onChange={handleChange}
                                           style={{ backgroundColor: 'aliceblue' }}
                                    />
                                </CCol>
                            </CRow>
                            <div className="d-flex justify-content-end mt-3">
                                <CButton
                                    color="secondary"
                                    onClick={() => navigate('/')}
                                    disabled={isLoading}>
                                    Cancel
                                </CButton>
                                <CButton
                                    color="dark"
                                    type="submit"
                                    disabled={isLoading}
                                    className="ms-2"
                                >
                                    {isLoading ? <CSpinner size="sm" /> : 'Add Guest'}
                                </CButton>
                            </div>
                        </CForm>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default AddGuest;