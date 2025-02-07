import React, { useState, useEffect } from 'react';
import { 
  CModalBody, 
  CModalHeader, 
  CModalTitle, 
  CModalFooter, 
  CButton, 
  CForm, 
  CFormInput, 
  CRow, 
  CCol,
  CCard,
  CCardBody,
  CInputGroup,
  CFormSelect,
  CAlert,
  CSpinner
} from '@coreui/react';

const AddAdmin = ({ visible, setVisible, editingAdmin, onSave }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [adminData, setAdminData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Admin',
    phoneNumber: '',
    address: '',
    status: true,
    photo: '',
    activeStart: '',
    activeEnd: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (editingAdmin) {
      setAdminData({
        name: editingAdmin.name || '',
        email: editingAdmin.email || '',
        password: '',
        role: editingAdmin.role || 'Admin',
        phoneNumber: editingAdmin.phoneNumber || '',
        address: editingAdmin.address || '',
        status: editingAdmin.status === 'active',
        photo: editingAdmin.photo || '',
        activeStart: editingAdmin.activeStart ? editingAdmin.activeStart.split('T')[0] : '',
        activeEnd: editingAdmin.activeEnd ? editingAdmin.activeEnd.split('T')[0] : '',
      });
    }
  }, [editingAdmin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminData(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (checked) => {
    setAdminData(prev => ({ ...prev, status: checked }));
  };

  const handleSubmit = async () => {
    if (!adminData.name || !adminData.email || (!editingAdmin && !adminData.password)) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    try {
      setIsLoading(true);
      const submissionData = {
        ...adminData,
        status: adminData.status ? 'active' : 'inactive',
        phoneNumber: adminData.phoneNumber || '',
        address: adminData.address || '',
        activeStart: adminData.activeStart || null,
        activeEnd: adminData.activeEnd || null,
      };

      console.log("AddAdmin - handleSubmit - submissionData:", submissionData); // ADD THIS LINE
      await onSave(submissionData);

    } catch (error) {
      setErrorMessage(error.message || 'Operation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setVisible(false);
  };

  return (
    <>
      <CModalHeader className="bg-dark text-white">
        <CModalTitle>{editingAdmin ? 'Edit Admin' : 'Add Admin'}</CModalTitle>
      </CModalHeader>
      
      <CModalBody>
        <CCard className="border-0 shadow-sm">
          <CCardBody>
            {errorMessage && (
              <CAlert color="danger" className="mb-4">
                {errorMessage}
              </CAlert>
            )}
            <CForm>
              <CRow className="g-4">
                <CCol xs={12}>
                  <CInputGroup>
                    <CFormInput
                      type="text"
                      name="name"
                      value={adminData.name}
                      onChange={handleChange}
                      placeholder="Enter Admin Name"
                      required
                    />
                  </CInputGroup>
                </CCol>
                
                <CCol xs={12}>
                  <CInputGroup>
                    <CFormInput
                      type="email"
                      name="email"
                      value={adminData.email}
                      onChange={handleChange}
                      placeholder="Enter Admin Email"
                      required
                    />
                  </CInputGroup>
                </CCol>

                {!editingAdmin && (
                  <CCol xs={12}>
                    <CInputGroup>
                      <CFormInput
                        type="password"
                        name="password"
                        value={adminData.password}
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
                      value={adminData.phoneNumber}
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
                      value={adminData.address}
                      onChange={handleChange}
                      placeholder="Enter Address"
                    />
                  </CInputGroup>
                </CCol>

                <CCol xs={12}>
                  <CFormSelect 
                    name="role" 
                    value={adminData.role} 
                    onChange={handleChange}
                  >
                    <option value="Admin">Admin</option>
                  </CFormSelect>
                </CCol>

                <CCol xs={12}>
                  <CInputGroup>
                    <CFormInput
                      type="date"
                      name="activeStart"
                      value={adminData.activeStart}
                      onChange={handleChange}
                      placeholder="Active Start Date"
                    />
                  </CInputGroup>
                </CCol>

                <CCol xs={12}>
                  <CInputGroup>
                    <CFormInput
                      type="date"
                      name="activeEnd"
                      value={adminData.activeEnd}
                      onChange={handleChange}
                      placeholder="Active End Date"
                    />
                  </CInputGroup>
                </CCol>

                <CCol xs={12}>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={adminData.status}
                      onChange={(e) => handleStatusChange(e.target.checked)}
                      id="statusSwitch"
                    />
                    <label className="form-check-label" htmlFor="statusSwitch">
                      Active Status
                    </label>
                  </div>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      </CModalBody>

      <CModalFooter className="border-top-0">
        <CButton color="secondary" variant="ghost" onClick={handleClose} disabled={isLoading}>
          Cancel
        </CButton>
        <CButton color="dark" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? (
            <>
              <CSpinner size="sm" className="me-2" />
              {editingAdmin ? 'Updating...' : 'Adding...'}
            </>
          ) : (
            editingAdmin ? 'Update Admin' : 'Add Admin'
          )}
        </CButton>
      </CModalFooter>
    </>
  );
};

export default AddAdmin;