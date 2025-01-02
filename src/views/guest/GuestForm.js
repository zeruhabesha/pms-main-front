import React, { useState } from 'react';
import QRCode from 'qrcode';
import {
  CForm,
  CFormInput,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CAlert,
} from '@coreui/react';

const GuestForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    purpose: '',
    date: '',
  });

  const [qrCode, setQrCode] = useState('');
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.purpose || !formData.date) {
      setFormError('Please fill in all fields.');
      return;
    } else {
      setFormError('');
    }

    try {
      const qrData = JSON.stringify(formData);
      const qrCodeImage = await QRCode.toDataURL(qrData);
      setQrCode(qrCodeImage);
    } catch (error) {
      console.error('Failed to generate QR Code', error);
    }
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Guest Registration Form</strong>
          </CCardHeader>
          <CCardBody>
            {formError && (
              <CAlert color="danger" className="mb-4">
                {formError}
              </CAlert>
            )}
            <CForm onSubmit={handleSubmit}>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    type="email"
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormInput
                    type="tel"
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    label="Purpose of visit"
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    required
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormInput
                    type="date"
                    label="Date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </CCol>
              </CRow>
              <CButton type="submit" color="dark">
                Generate QR Code
              </CButton>
            </CForm>
            {qrCode && (
              <div className="mt-4 text-center">
                <img src={qrCode} alt="QR Code" />
                <p className="mt-2">Scan this QR code for guest details</p>
              </div>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default GuestForm;
