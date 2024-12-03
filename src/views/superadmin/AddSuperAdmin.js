import React, { useState, useEffect } from 'react';
import { 
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
  CButton,
  CAlert
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilUser, cilEnvelopeClosed, cilLockLocked, cilPhone, cilLocationPin } from '@coreui/icons';
import CustomSwitch from './CustomSwitch';

const AddSuperAdmin = ({ visible, setVisible, editingSuperAdmin = null, onSave }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState(true); // true for 'active', false for 'inactive'
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (editingSuperAdmin) {
      setName(editingSuperAdmin.name || '');
      setEmail(editingSuperAdmin.email || '');
      setPassword(editingSuperAdmin.password || '');
      setPhoneNumber(editingSuperAdmin.phoneNumber || '');
      setAddress(editingSuperAdmin.address || '');
      setStatus(editingSuperAdmin.status !== 'inactive'); // true if active
    } else {
      setName('');
      setEmail('');
      setPassword('');
      setPhoneNumber('');
      setAddress('');
      setStatus(true); // default to active
    }
    setErrorMessage('');
  }, [editingSuperAdmin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name || !email || (!editingSuperAdmin && !password) || !phoneNumber) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    const formData = {
      name,
      email,
      password: password || undefined,
      phoneNumber,
      address,
      photo: '',
      status: status ? 'active' : 'inactive',
      ...(editingSuperAdmin ? { id: editingSuperAdmin.id } : {}),
    };

    try {
      await onSave(formData);
      handleClose();
    } catch (error) {
      setErrorMessage(error.message || 'An error occurred while saving');
    }
  };

  const handleClose = () => {
    setName('');
    setEmail('');
    setPassword('');
    setPhoneNumber('');
    setAddress('');
    setStatus(true);
    setErrorMessage('');
    setVisible(false);
  };

  return (
    <CModal
      visible={visible}
      onClose={handleClose}
      alignment="center"
      backdrop="static"
      size="lg"
    >
      <CModalHeader className="bg-dark text-white">
        <CModalTitle>
          {editingSuperAdmin ? 'Edit Super Admin' : 'Add Super Admin'}
        </CModalTitle>
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
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      autoComplete="name"
                    />
                  </CInputGroup>
                </CCol>

                <CCol xs={12}>
                  <CInputGroup>
                    <CFormInput
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </CInputGroup>
                </CCol>

                {!editingSuperAdmin && (
                  <CCol xs={12}>
                    <CInputGroup>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                      />
                    </CInputGroup>
                  </CCol>
                )}

                <CCol xs={12}>
                  <CInputGroup>
                    <CFormInput
                      placeholder="Phone Number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                  </CInputGroup>
                </CCol>

                <CCol xs={12}>
                  <CInputGroup>
                    <CFormInput
                      placeholder="Address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </CInputGroup>
                </CCol>

                <CCol xs={12}>
                  <CInputGroup>
                    <CustomSwitch
                      label="Active Status"
                      checked={status}
                      onChange={(e) => setStatus(e.target.checked)}
                    />
                  </CInputGroup>
                </CCol>
              </CRow>

              <CModalFooter className="border-top-0">
                <CButton color="secondary" variant="ghost" onClick={handleClose}>
                  Cancel
                </CButton>
                <CButton color="dark" type="submit">
                  {editingSuperAdmin ? 'Update Super Admin' : 'Add Super Admin'}
                </CButton>
              </CModalFooter>
            </CForm>
          </CCardBody>
        </CCard>
      </CModalBody>
    </CModal>
  );
};

export default AddSuperAdmin;
