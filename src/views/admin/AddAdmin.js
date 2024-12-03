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
  CSpinner,
} from '@coreui/react';
import { useDispatch } from 'react-redux';
import { addAdmin, updateAdmin } from '../../api/actions/AdminActions';
import CustomSwitch from './CustomSwitch';

const AddAdmin = ({ visible, setVisible, editingAdmin = null }) => {
  const dispatch = useDispatch();
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
    console.log('Editing Admin:', editingAdmin); // Log for debugging
    if (editingAdmin) {
      setAdminData({
        name: editingAdmin?.name || '',
        email: editingAdmin?.email || '',
        password: '',
        role: editingAdmin?.role || 'Admin',
        phoneNumber: editingAdmin?.phoneNumber || '',
        address: editingAdmin?.address || '',
        status: editingAdmin?.status === 'active',
        photo: editingAdmin?.photo || '',
        activeStart: editingAdmin?.activeStart ? editingAdmin.activeStart.split('T')[0] : '',
        activeEnd: editingAdmin?.activeEnd ? editingAdmin.activeEnd.split('T')[0] : '',
      });
    } else {
      setAdminData({
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
    }
    setErrorMessage('');
  }, [editingAdmin]);
  
  
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (checked) => {
    setAdminData((prev) => ({ ...prev, status: checked }));
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
  
      if (editingAdmin && editingAdmin._id) {
        // Update admin
        await dispatch(updateAdmin({ id: editingAdmin._id, adminData: submissionData })).unwrap();
      } else if (!editingAdmin) {
        // Add new admin
        await dispatch(addAdmin(submissionData)).unwrap();
      } else {
        throw new Error('Invalid editing admin object.');
      }
  
      handleClose();
      toast.success(editingAdmin ? 'Admin updated successfully' : 'Admin added successfully');
    } catch (error) {
      setErrorMessage(error.message || 'Operation failed');
    } finally {
      setIsLoading(false);
    }
  };
  
  
  
  
  
  const handleClose = () => {
    setAdminData({
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
    setErrorMessage('');
    setVisible(false);
  };
  

  // const handleClose = () => {
  //   setAdminData({
  //     name: '',
  //     email: '',
  //     password: '',
  //     role: 'Admin',
  //     phoneNumber: '',
  //     address: '',
  //     status: true,
  //     photo: '',
  //     activeStart: '',
  //     activeEnd: '',
  //   });
  //   setErrorMessage('');
  //   setVisible(false);
  // };

  return (
    <CModal visible={visible} onClose={handleClose} alignment="center" backdrop="static" size="lg">
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
                  <CFormSelect name="role" value={adminData.role} onChange={handleChange}>
                    <option value="Admin">Admin</option>
                    {/* Other options here if needed */}
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
                  <CustomSwitch
                    label="Active Status"
                    name="status"
                    checked={adminData.status}
                    onChange={handleStatusChange}
                  />
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
    </CModal>
  );
};

export default AddAdmin;