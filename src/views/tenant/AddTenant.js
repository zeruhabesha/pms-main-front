import React, { useState, useEffect } from 'react';
import {
    CButton,
    CForm,
    CFormInput,
    CRow,
    CCol,
    CInputGroup,
    CFormSelect,
    CAlert,
    CSpinner,
    CCard,
    CCardHeader,
    CCardBody,
    
} from '@coreui/react';
import { cilTrash, cilPlus } from '@coreui/icons';
import { CIcon } from '@coreui/icons-react';
import { useDispatch } from 'react-redux';
import { addTenant, updateTenant } from '../../api/actions/TenantActions';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';


const AddTenant = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [tenantData, setTenantData] = useState({
      tenantName: '',
      contactInformation: {
          email: '',
          phoneNumber: '',
          emergencyContact: '',
      },
      leaseAgreement: {
          startDate: '',
          endDate: '',
          rentAmount: '',
          securityDeposit: '',
          specialTerms: '',
      },
      propertyInformation: {
          unit: '',
          propertyId: '',
      },
      password: '',
      idProof: [],
      paymentMethod: '',
      moveInDate: '',
      emergencyContacts: [''],
    });
    
    const isEditing = !!id;


    useEffect(() => {
        if (isEditing) {
          // Fetch tenant data for editing here, using the ID from URL
          // Example:
          const fetchTenantData = async () => {
              setIsLoading(true);
              try {
                  // Replace getTenantById with your actual fetch function
                  //  const tenant = await dispatch(getTenantById(id)).unwrap();

                   const tenant = {
                    tenantName: 'Updated Tenant Name',
                    contactInformation: {
                        email: 'updated.tenant@example.com',
                        phoneNumber: '999-888-7777',
                        emergencyContact: 'Emergency Contact Updated',
                    },
                    leaseAgreement: {
                        startDate: '2024-07-01',
                        endDate: '2025-06-30',
                        rentAmount: '1500',
                        securityDeposit: '1500',
                        specialTerms: 'No Smoking',
                    },
                    propertyInformation: {
                        unit: 'A101',
                        propertyId: '12345',
                    },
                    password: 'password',
                    idProof: [],
                    paymentMethod: 'Credit Card',
                    moveInDate: '2024-07-15',
                    emergencyContacts: ['Emergency 1 updated', 'Emergency 2 updated'],
                };


                  if (tenant) {
                      setTenantData({
                          tenantName: tenant.tenantName || '',
                        contactInformation: {
                            email: tenant.contactInformation?.email || '',
                            phoneNumber: tenant.contactInformation?.phoneNumber || '',
                            emergencyContact: tenant.contactInformation?.emergencyContact || '',
                        },
                        leaseAgreement: {
                            startDate: tenant.leaseAgreement?.startDate?.split('T')[0] || '',
                            endDate: tenant.leaseAgreement?.endDate?.split('T')[0] || '',
                            rentAmount: tenant.leaseAgreement?.rentAmount || '',
                            securityDeposit: tenant.leaseAgreement?.securityDeposit || '',
                            specialTerms: tenant.leaseAgreement?.specialTerms || '',
                        },
                        propertyInformation: {
                            unit: tenant.propertyInformation?.unit || '',
                            propertyId: tenant.propertyInformation?.propertyId || '',
                        },
                        password: '',
                        idProof: tenant.idProof || [],
                        paymentMethod: tenant.paymentMethod || '',
                        moveInDate: tenant.moveInDate?.split('T')[0] || '',
                        emergencyContacts: tenant.emergencyContacts || [''],
                      });
                  } else {
                      toast.error('Tenant not found');
                      navigate('/tenants'); // Redirect if tenant not found
                  }
              } catch (error) {
                  console.error('Error fetching tenant:', error);
                  toast.error(error.message || 'Failed to fetch tenant');
                  navigate('/tenants'); // Redirect on error
              } finally {
                  setIsLoading(false);
              }
          };

          fetchTenantData();
       } else {
            resetForm();
        }
    }, [dispatch, navigate, id, isEditing]);
    
    const resetForm = () => {
      setTenantData({
        tenantName: '',
        contactInformation: {
            email: '',
            phoneNumber: '',
            emergencyContact: '',
        },
        leaseAgreement: {
            startDate: '',
            endDate: '',
            rentAmount: '',
            securityDeposit: '',
            specialTerms: '',
        },
        propertyInformation: {
            unit: '',
            propertyId: '',
        },
        password: '',
        idProof: [],
        paymentMethod: '',
        moveInDate: '',
        emergencyContacts: [''],
      });
        setErrorMessage('');
    };


    // Submit form data
const handleSubmit = async (e) => {
    e.preventDefault();

      if (!tenantData.tenantName.trim()) {
      setErrorMessage('Tenant name is required');
      return;
    }

    if (!tenantData.contactInformation.email.trim()) {
      setErrorMessage('Email is required');
      return;
    }
    setIsLoading(true);

    try {
        const formData = new FormData();
          for (const key in tenantData) {
               if (tenantData.hasOwnProperty(key)) {
              const value = tenantData[key];
                   if(value != null) {
                      if(Array.isArray(value)){
                         value.forEach((file, index) => {
                            if(file instanceof File){
                                formData.append(`${key}[${index}]`, file);
                            } else {
                              formData.append(`${key}[${index}]`, file);
                          }
                        })
                     } else if(value instanceof File) {
                       formData.append(key, value)
                     } else {
                        formData.append(key,  typeof value === 'object' ? JSON.stringify(value) : value)
                     }
                   }
                  }
          }


        if (isEditing) {
           await dispatch(updateTenant({ id, tenantData:formData })).unwrap();
            toast.success('Tenant updated successfully');
        } else {

           await dispatch(addTenant(formData)).unwrap();
            toast.success('Tenant added successfully');
        }
       navigate('/tenant')
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to save tenant');
      setErrorMessage(error.message || 'Failed to save tenant');
    } finally {
      setIsLoading(false);
    }
  };


    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setTenantData((prev) => ({
            ...prev,
            idProof: [...prev.idProof, ...files].slice(0, 3),
        }));
    };

    const handleRemoveFile = (index) => {
        const updatedFiles = tenantData.idProof.filter((_, i) => i !== index);
        setTenantData((prev) => ({ ...prev, idProof: updatedFiles }));
    };
     const handleArrayChange = (index, value, arrayName) => {
        setTenantData(prevState => {
            const updatedArray = [...prevState[arrayName]];
            updatedArray[index] = value;
            return { ...prevState, [arrayName]: updatedArray };
        });
    };

    const handleAddArrayItem = (arrayName) => {
        setTenantData(prevState => {
            return { ...prevState, [arrayName]: [...prevState[arrayName], ''] };
        });
    };

    const handleRemoveArrayItem = (index, arrayName) => {
        setTenantData(prevState => {
            const updatedArray = [...prevState[arrayName]];
            updatedArray.splice(index, 1);
            return { ...prevState, [arrayName]: updatedArray };
        });
    };

    return (
        <CRow>
          <CCol xs={12}>
            <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between align-items-center">
                  <strong>{isEditing ? 'Edit Tenant' : 'Add Tenant'}</strong>
               </CCardHeader>
              <CCardBody>
                {errorMessage && <CAlert color="danger">{errorMessage}</CAlert>}
                  <CForm onSubmit={handleSubmit}>
                      <CRow className="g-3">
                      <CFormInput
                            label="Tenant Name"
                            name="tenantName"
                            value={tenantData.tenantName}
                            onChange={(e) => setTenantData({ ...tenantData, tenantName: e.target.value })}
                            required
                            invalid={!tenantData.tenantName.trim()}
                        />
                           <CFormInput
                                label="Email"
                                type="email"
                                name="email"
                                value={tenantData.contactInformation.email}
                                onChange={(e) =>
                                    setTenantData({
                                        ...tenantData,
                                        contactInformation: {
                                            ...tenantData.contactInformation,
                                            email: e.target.value,
                                        },
                                    })
                                }
                                required
                                invalid={!tenantData.contactInformation.email.trim()}
                            />
                            <CCol md={6}>
                                <CFormInput
                                    label="Phone Number"
                                    name="phoneNumber"
                                    value={tenantData.contactInformation.phoneNumber}
                                    onChange={(e) =>
                                        setTenantData({
                                            ...tenantData,
                                            contactInformation: { ...tenantData.contactInformation, phoneNumber: e.target.value },
                                        })
                                    }
                                    required
                                />
                            </CCol>

                            <CCol md={6}>
                                <CFormInput
                                    label="Emergency Contact"
                                    name="emergencyContact"
                                    value={tenantData.contactInformation.emergencyContact}
                                    onChange={(e) =>
                                        setTenantData({
                                            ...tenantData,
                                            contactInformation: { ...tenantData.contactInformation, emergencyContact: e.target.value },
                                        })
                                    }
                                />
                            </CCol>

                            <CCol md={6}>
                                <CFormInput
                                    label="Lease Start Date"
                                    type="date"
                                    name="leaseStartDate"
                                    value={tenantData.leaseAgreement.startDate}
                                    onChange={(e) =>
                                        setTenantData({
                                            ...tenantData,
                                            leaseAgreement: { ...tenantData.leaseAgreement, startDate: e.target.value },
                                        })
                                    }
                                    required
                                />
                            </CCol>

                            <CCol md={6}>
                                <CFormInput
                                    label="Lease End Date"
                                    type="date"
                                    name="leaseEndDate"
                                    value={tenantData.leaseAgreement.endDate}
                                    onChange={(e) =>
                                        setTenantData({
                                            ...tenantData,
                                            leaseAgreement: { ...tenantData.leaseAgreement, endDate: e.target.value },
                                        })
                                    }
                                    required
                                />
                            </CCol>

                            <CCol md={6}>
                                <CFormInput
                                    label="Rent Amount"
                                    type="number"
                                    name="rentAmount"
                                    value={tenantData.leaseAgreement.rentAmount}
                                    onChange={(e) =>
                                        setTenantData({
                                            ...tenantData,
                                            leaseAgreement: { ...tenantData.leaseAgreement, rentAmount: e.target.value },
                                        })
                                    }
                                    required
                                />
                            </CCol>

                            <CCol md={6}>
                                <CFormInput
                                    label="Security Deposit"
                                    type="number"
                                    name="securityDeposit"
                                    value={tenantData.leaseAgreement.securityDeposit}
                                    onChange={(e) =>
                                        setTenantData({
                                            ...tenantData,
                                            leaseAgreement: { ...tenantData.leaseAgreement, securityDeposit: e.target.value },
                                        })
                                    }
                                    required
                                />
                            </CCol>

                            <CCol md={12}>
                                <CFormInput
                                    label="Special Terms"
                                    name="specialTerms"
                                    value={tenantData.leaseAgreement.specialTerms}
                                    onChange={(e) =>
                                        setTenantData({
                                            ...tenantData,
                                            leaseAgreement: { ...tenantData.leaseAgreement, specialTerms: e.target.value },
                                        })
                                    }
                                />
                            </CCol>
                            <CCol md={6}>
                                <CFormInput
                                    label="Unit"
                                    name="unit"
                                    value={tenantData.propertyInformation.unit}
                                    onChange={(e) =>
                                        setTenantData({
                                            ...tenantData,
                                            propertyInformation: { ...tenantData.propertyInformation, unit: e.target.value },
                                        })
                                    }
                                    required
                                />
                            </CCol>

                            <CCol md={6}>
                                <CFormInput
                                    label="Property ID"
                                    name="propertyId"
                                    value={tenantData.propertyInformation.propertyId}
                                    onChange={(e) =>
                                        setTenantData({
                                            ...tenantData,
                                            propertyInformation: { ...tenantData.propertyInformation, propertyId: e.target.value },
                                        })
                                    }
                                    required
                                />
                            </CCol>

                            <CCol md={6}>
                                <CFormInput
                                    label="Password"
                                    type="password"
                                    name="password"
                                    value={tenantData.password}
                                    onChange={(e) => setTenantData({ ...tenantData, password: e.target.value })}
                                    required
                                />
                            </CCol>

                            <CCol md={6}>
                                <CFormSelect
                                    label="Payment Method"
                                    name="paymentMethod"
                                    value={tenantData.paymentMethod}
                                    onChange={(e) => setTenantData({ ...tenantData, paymentMethod: e.target.value })}
                                    required
                                >
                                    <option value="">Select Payment Method</option>
                                    <option value="Credit Card">Credit Card</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                    <option value="Cash">Cash</option>
                                </CFormSelect>
                            </CCol>

                            <CCol md={6}>
                                <CFormInput
                                    label="Move-in Date"
                                    type="date"
                                    name="moveInDate"
                                    value={tenantData.moveInDate}
                                    onChange={(e) => setTenantData({ ...tenantData, moveInDate: e.target.value })}
                                    required
                                />
                            </CCol>

                            <CCol md={12}>
                                <label>Emergency Contacts</label>
                                {tenantData.emergencyContacts.map((contact, index) => (
                                    <CRow key={index} className="align-items-center mb-2">
                                        <CCol xs={10}>
                                            <CFormInput
                                                value={contact}
                                                placeholder={`Emergency Contact ${index + 1}`}
                                                onChange={(e) => handleArrayChange(index, e.target.value, 'emergencyContacts')}
                                            />
                                        </CCol>
                                        <CCol xs={2}>
                                            <CButton
                                                size="sm"
                                                color="light"
                                                style={{ color: 'red' }}
                                                onClick={() => handleRemoveArrayItem(index, 'emergencyContacts')}
                                            >
                                                <CIcon icon={cilTrash} />
                                            </CButton>
                                        </CCol>
                                    </CRow>
                                ))}
                                <CButton size="sm" color="dark" onClick={() => handleAddArrayItem('emergencyContacts')}>
                                    <CIcon icon={cilPlus} className="" />
                                </CButton>
                            </CCol>
                            <CCol md={6}>
                                <label>ID Proof (Max: 3)</label>
                                <CInputGroup>
                                    <CFormInput
                                        type="file"
                                        name="idProof"
                                        multiple
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        onChange={handleFileChange} // Correctly referencing the function
                                    />
                                </CInputGroup>
                                <CRow className="mt-2">
                                    {tenantData.idProof.map((file, idx) => (
                                        <CCol key={idx} xs={12} className="d-flex align-items-center justify-content-between">
                                            <span>{file.name}</span>
                                            <CButton size="sm" color="light" onClick={() => handleRemoveFile(idx)}>
                                                <CIcon icon={cilTrash} />
                                            </CButton>
                                        </CCol>
                                    ))}
                                </CRow>
                             </CCol>
                      </CRow>
                    <div className="d-flex justify-content-end mt-3">
                        <CButton
                            color="secondary"
                            onClick={() => navigate('/tenant')}
                             disabled={isLoading}>
                           Cancel
                        </CButton>
                        <CButton color="dark" type="submit" disabled={isLoading} className="ms-2">
                            {isLoading ? <CSpinner size="sm" /> : isEditing ? 'Update Tenant' : 'Add Tenant'}
                        </CButton>
                     </div>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
    );
};

export default AddTenant;