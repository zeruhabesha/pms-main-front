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
import {
  cilTrash,
  cilPlus,
  cilUser,
  cilEnvelopeOpen,
  cilPhone,
    cilMoney,
    cilCreditCard,
    cilDescription,
    cilContact,
  cilCalendar
} from '@coreui/icons';
import { CIcon } from '@coreui/icons-react';
import { useDispatch } from 'react-redux';
import {
  addTenant,
  updateTenant,
  fetchTenantById,
  uploadTenantPhoto,
    fetchTenants,
} from '../../api/actions/TenantActions';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import './TenantTable.scss'; // Import the dedicated CSS file

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
        startDate: '',
        endDate: '',
        rentAmount: '',
        securityDeposit: '',
        specialTerms: '',
        paymentMethod: '',
        moveInDate: '',
        emergencyContacts: [''],
    });

    const [idProofFiles, setIdProofFiles] = useState([]);
    const isEditing = !!id;

      const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        } catch (error) {
            console.error("Error formatting date:", error);
            return '';
        }
    };


    useEffect(() => {
        const controller = new AbortController();

        if (isEditing) {
            const fetchTenantData = async () => {
                setIsLoading(true);
                try {
                    const tenant = await dispatch(fetchTenantById(id)).unwrap();
                    if (tenant) {
                        setTenantData({
                            tenantName: tenant.tenantName || '',
                            contactInformation: {
                                email: tenant.contactInformation?.email || '',
                                phoneNumber: tenant.contactInformation?.phoneNumber || '',
                                emergencyContact: tenant.contactInformation?.emergencyContact || '',
                            },
                            startDate: formatDateForInput(tenant.startDate),
                            endDate: formatDateForInput(tenant.endDate),
                            rentAmount: tenant.rentAmount || '',
                            securityDeposit: tenant.securityDeposit || '',
                            specialTerms: tenant.specialTerms || '',
                            paymentMethod: tenant.paymentMethod || '',
                            moveInDate: formatDateForInput(tenant.moveInDate),
                            emergencyContacts: tenant.emergencyContacts || [''],
                        });
                    }
                } catch (error) {
                    if (!controller.signal.aborted) {
                        toast.error(error.message || 'Failed to fetch tenant');
                        navigate('/tenants');
                    }
                } finally {
                    if (!controller.signal.aborted) {
                        setIsLoading(false);
                    }
                }
            };

            fetchTenantData();
        }

        return () => {
            controller.abort();
        };
    }, [dispatch, navigate, id, isEditing]);


    const resetForm = () => {
        setTenantData({
            tenantName: '',
            contactInformation: {
                email: '',
                phoneNumber: '',
                emergencyContact: '',
            },
            startDate: '',
            endDate: '',
            rentAmount: '',
            securityDeposit: '',
            specialTerms: '',
            paymentMethod: '',
            moveInDate: '',
            emergencyContacts: [''],
        });
        setIdProofFiles([]);
        setErrorMessage('');
    };

    const validateForm = () => {
      const errors = [];

        if (!tenantData.tenantName.trim()) {
            errors.push('Tenant name is required');
        }

        if (!tenantData.contactInformation.email.trim()) {
            errors.push('Email is required');
        }

        if (!tenantData.startDate) {
            errors.push('Lease start date is required');
        }

        if (!tenantData.endDate) {
            errors.push('Lease end date is required');
        }
        if (!tenantData.moveInDate) {
          errors.push('Move In Date is required');
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

        setIsLoading(true);
        try {
            console.log("Sending tenant data:", tenantData);
            const { idProof, ...jsonTenantData } = tenantData;
            if (isEditing) {
                await dispatch(updateTenant({ id, tenantData: jsonTenantData })).unwrap();
                toast.success("Tenant updated successfully");
            } else {
                 await dispatch(addTenant(jsonTenantData)).unwrap();
                toast.success("Tenant added successfully");
            }
               if (idProofFiles.length > 0) {
                   const formData = new FormData();
                   idProofFiles.forEach((file, index) => {
                       formData.append('idProof', file);
                   });
                 await dispatch(uploadTenantPhoto({
                     id: isEditing ? id : (await dispatch(fetchTenants()).unwrap()).tenants[(await dispatch(fetchTenants()).unwrap()).tenants.length - 1]?._id,
                       photo: formData
                 })).unwrap()
                }
            navigate("/tenant");
        } catch (error) {
            console.error("Error:", error);
            toast.error(error.message || "Failed to save tenant");
            setErrorMessage(error.message || "Failed to save tenant");
        } finally {
            setIsLoading(false);
        }
    };

      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const handleFileChange = (e) => {
        const files = Array.from(e.target.files);

        if (files.length > 3) {
            toast.warning('Maximum 3 files allowed');
            return;
        }

        const oversizedFiles = files.filter(file => file.size > MAX_FILE_SIZE);
        if (oversizedFiles.length > 0) {
            toast.warning('Some files exceed the maximum size limit of 5MB');
            return;
        }

        setIdProofFiles(files);
    };

    const handleRemoveFile = (index) => {
        const updatedFiles = [...idProofFiles];
        updatedFiles.splice(index, 1);
        setIdProofFiles(updatedFiles);
      setTenantData((prev) => ({...prev, idProof: updatedFiles.map(f => f.name)}));
    };

    const handleArrayChange = (index, value, arrayName) => {
      setTenantData(prevState => {
            const updatedArray = [...prevState[arrayName]];
        updatedArray[index] = value;
        return {...prevState, [arrayName]: updatedArray};
      });
    };

    const handleAddArrayItem = (arrayName) => {
        setTenantData(prevState => {
            return {...prevState, [arrayName]: [...prevState[arrayName], '']};
        });
    };

    const handleRemoveArrayItem = (index, arrayName) => {
          setTenantData(prevState => {
            const updatedArray = [...prevState[arrayName]];
        updatedArray.splice(index, 1);
        return {...prevState, [arrayName]: updatedArray};
        });
    };
  return (
    <div className="add-tenant-container">
          <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between align-items-center">
                <strong>{isEditing ? 'Edit Tenant' : 'Add Tenant'}</strong>
            </CCardHeader>
        <CCardBody>
        {errorMessage && <CAlert color="danger">{errorMessage}</CAlert>}
        <CForm onSubmit={handleSubmit}>
          <CRow className="mb-3">
            <CCol md={6} className="mb-3">
              <CFormInput
                label={<><CIcon icon={cilUser} className="me-1" /> Tenant Name</>}
                name="tenantName"
                  style={{backgroundColor: 'aliceblue'}}
                value={tenantData.tenantName}
                onChange={(e) => setTenantData({...tenantData, tenantName: e.target.value})}
                required
              />
            </CCol>
            <CCol md={6} className="mb-3">
              <CFormInput
                   label={<><CIcon icon={cilEnvelopeOpen} className="me-1" />Email</>}
                type="email"
                name="email"
                  style={{backgroundColor: 'aliceblue'}}
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
              />
            </CCol>
          </CRow>
          <CRow className="mb-3">
                <CCol md={6} className="mb-3">
                    <CFormInput
                        label={<><CIcon icon={cilPhone} className="me-1" />Phone Number</>}
                        name="phoneNumber"
                        style={{backgroundColor: 'aliceblue'}}
                        value={tenantData.contactInformation.phoneNumber}
                        onChange={(e) =>
                            setTenantData({
                                ...tenantData,
                                contactInformation: {
                                    ...tenantData.contactInformation,
                                    phoneNumber: e.target.value,
                                },
                            })
                        }
                        required
                    />
                </CCol>
            <CCol md={6} className="mb-3">
              <CFormInput
                  label={<><CIcon icon={cilContact} className="me-1" />Emergency Contact</>}
                name="emergencyContact"
                  style={{backgroundColor: 'aliceblue'}}
                value={tenantData.contactInformation.emergencyContact}
                onChange={(e) =>
                  setTenantData({
                    ...tenantData,
                    contactInformation: {
                      ...tenantData.contactInformation,
                      emergencyContact: e.target.value,
                    },
                  })
                }
              />
            </CCol>

          </CRow>
          <CRow className="mb-3">
            <CCol md={6} className="mb-3">
              <CFormInput
                  label={<><CIcon icon={cilCalendar} className="me-1" />Lease Start Date</>}
                type="date"
                name="leaseStartDate"
                  style={{backgroundColor: 'aliceblue'}}
                value={tenantData.startDate}
                onChange={(e) => setTenantData({...tenantData, startDate: e.target.value})}
                required
              />
            </CCol>
            <CCol md={6} className="mb-3">
              <CFormInput
                  label={<><CIcon icon={cilCalendar} className="me-1" />Lease End Date</>}
                type="date"
                  style={{backgroundColor: 'aliceblue'}}
                name="leaseEndDate"
                value={tenantData.endDate}
                onChange={(e) => setTenantData({...tenantData, endDate: e.target.value})}
                required
              />
            </CCol>

          </CRow>
          <CRow className="mb-3">
            <CCol md={6} className="mb-3">
              <CFormInput
                 label={<><CIcon icon={cilMoney} className="me-1" />Rent Amount</>}
                type="number"
                name="rentAmount"
                  style={{backgroundColor: 'aliceblue'}}
                value={tenantData.rentAmount}
                onChange={(e) => setTenantData({...tenantData, rentAmount: e.target.value})}
                  required
              />
            </CCol>
            <CCol md={6} className="mb-3">
                <CFormInput
                   label={<><CIcon icon={cilMoney} className="me-1" />Security Deposit</>}
                    type="number"
                    name="securityDeposit"
                    style={{backgroundColor: 'aliceblue'}}
                    value={tenantData.securityDeposit}
                    onChange={(e) => setTenantData({...tenantData, securityDeposit: e.target.value})}
                    required
                />
            </CCol>

          </CRow>
          <CRow className="mb-3">

               <CCol md={12} className="mb-3">
              <CFormInput
                   label={<><CIcon icon={cilDescription} className="me-1" />Special Terms</>}
                name="specialTerms"
                  style={{backgroundColor: 'aliceblue'}}
                value={tenantData.specialTerms}
                onChange={(e) => setTenantData({...tenantData, specialTerms: e.target.value})}
              />
            </CCol>
          </CRow>
          <CRow className="mb-3">
               <CCol md={6} className="mb-3">
              <CFormSelect
                   label={<><CIcon icon={cilCreditCard} className="me-1" />Payment Method</>}
                name="paymentMethod"
                  style={{backgroundColor: 'aliceblue'}}
                value={tenantData.paymentMethod}
                onChange={(e) => setTenantData({...tenantData, paymentMethod: e.target.value})}
                  required
              >
                  <option value="">Select Payment Method</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
              </CFormSelect>
            </CCol>
               <CCol md={6} className="mb-3">
              <CFormInput
                 label={<><CIcon icon={cilCalendar} className="me-1" />Move-in Date</>}
                type="date"
                name="moveInDate"
                  style={{backgroundColor: 'aliceblue'}}
                value={tenantData.moveInDate}
                onChange={(e) => setTenantData({...tenantData, moveInDate: e.target.value})}
                  required
              />
            </CCol>

          </CRow>
          <CRow className="mb-3">
            <CCol md={12} className="mb-3">
                 <label><CIcon icon={cilContact} className="me-1" />Emergency Contacts</label>
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
                                style={{color: 'red'}}
                                onClick={() => handleRemoveArrayItem(index, 'emergencyContacts')}
                            >
                                <CIcon icon={cilTrash}/>
                            </CButton>
                        </CCol>
                    </CRow>
                ))}
                <CButton size="sm" color="dark" onClick={() => handleAddArrayItem('emergencyContacts')}>
                    <CIcon icon={cilPlus} className=""/>
                </CButton>
            </CCol>

          </CRow>
           <CRow>
            <CCol md={6} className="mb-3">
                 <label>ID Proof (Max: 3)</label>
              <CInputGroup>
                <CFormInput
                  type="file"
                  name="idProof"
                  multiple
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileChange}
                />
              </CInputGroup>
                <CRow className="mt-2">
                    {idProofFiles.map((file, idx) => (
                        <CCol key={idx} xs={12}
                              className="d-flex align-items-center justify-content-between">
                            <span>{file.name}</span>
                            <CButton size="sm" color="light" onClick={() => handleRemoveFile(idx)}>
                                <CIcon icon={cilTrash}/>
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
              disabled={isLoading}
            >
              Cancel
            </CButton>
            <CButton color="dark" type="submit" disabled={isLoading} className="ms-2">
                {isLoading ? <CSpinner size="sm"/> : isEditing ? 'Update Tenant' : 'Add Tenant'}
            </CButton>
          </div>
        </CForm>
      </CCardBody>
      </CCard>
    </div>
  );
};

export default AddTenant;