import React, { useState, useEffect } from 'react';
import {
    CForm, CFormInput, CButton, CSpinner, CToast, CToastBody, CFormSelect, CFormLabel, CCol, CRow
} from '@coreui/react';
import { useDispatch, useSelector } from 'react-redux';
import { addTenant } from '../../api/actions/TenantActions';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
// import { getRegisteredBy } from '../../api/actions/UserActions';

const AddTenant = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // const [registeredByAdmin, setRegisteredByAdmin] = useState(null);

    // useEffect(() => {
    //     // Fetch registeredByAdmin from localStorage or wherever you store it
    //     const user = getRegisteredBy();
    //     if (user) {
    //         setRegisteredByAdmin(user._id);
    //     }
    // }, []);
    // Initial state for tenant data
    const [tenantData, setTenantData] = useState({
        tenantName: '',
        status: 'active',
        // registeredByAdmin: registeredByAdmin, // Replace with actual admin ID
        contactInformation: {
            email: '',
            phoneNumber: '',
            emergencyContact: '',
        },
        leaseAgreement: {
            startDate: '',
            endDate: '',
            rentAmount: 0,
            securityDeposit: 0,
            specialTerms: '',
        },
        propertyInformation: {
            propertyId: '', // Ensure this is a string
        },
        paymentMethod: 'creditCard',
        moveInDate: '',
        emergencyContacts: [],
    });

    const [idProofFiles, setIdProofFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // useEffect(() => {
    //     // Fetch registeredByAdmin from localStorage or wherever you store it
    //     const user = JSON.parse(localStorage.getItem('user'))
    //     if (user) {
    //         setTenantData(prev => ({
    //             ...prev,
    //             registeredByAdmin: user._id
    //         }));
    //     }
    // }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');

        // Validate required fields
        if (!tenantData.tenantName || !tenantData.contactInformation.email) {
            setErrorMessage('Tenant name and email are required.');
            setIsLoading(false);
            return;
        }
        if (!tenantData.propertyInformation.propertyId) {
            setErrorMessage('Property ID is required.');
            setIsLoading(false);
            return;
        }

        try {
            const formData = new FormData();

            // Append tenant information
            formData.append('tenantName', tenantData.tenantName);
            formData.append('status', tenantData.status);
            // formData.append('registeredByAdmin', tenantData.registeredByAdmin);

            // Append contact information
            Object.entries(tenantData.contactInformation).forEach(([key, value]) => {
                formData.append(`contactInformation[${key}]`, value);
            });

            // Append lease agreement information
            //Append property information
            formData.append('propertyInformation[propertyId]', tenantData.propertyInformation.propertyId);

            // Append ID proof files
            idProofFiles.forEach(file => {
                formData.append('idProof', file);
            });
            console.log("this is the final data", formData);

            const response = await dispatch(addTenant(formData)).unwrap();
            toast.success('Tenant added successfully');
            navigate('/tenant');
        } catch (error) {
            console.error('Error adding tenant:', error);
            toast.error(error.message || 'Failed to add tenant');
            setErrorMessage(error.message || 'Failed to add tenant');
        } finally {
            setIsLoading(false);
        }
    };

    // Input change handlers
    const handleInputChange = (field, value) => {
        setTenantData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleContactChange = (field, value) => {
        setTenantData(prev => ({
            ...prev,
            contactInformation: {
                ...prev.contactInformation,
                [field]: value,
            },
        }));
    };

    const handlePropertyInformationChange = (field, value) => {
        setTenantData(prev => ({
            ...prev,
            propertyInformation: {
                ...prev.propertyInformation,
                [field]: value,
            },
        }));
    };
    const handleLeaseChange = (field, value) => {
        setTenantData(prev => ({
            ...prev,
            leaseAgreement: {
                ...prev.leaseAgreement,
                [field]: value,
            },
        }));
    };

    const handleEmergencyContactChange = (index, value) => {
        const updatedContacts = [...tenantData.emergencyContacts];
        updatedContacts[index] = value;
        setTenantData(prev => ({
            ...prev,
            emergencyContacts: updatedContacts,
        }));
    };

    const handleIdProofChange = (e) => {
        setIdProofFiles(Array.from(e.target.files));
    };
    return (
        <CForm onSubmit={handleSubmit}>
            {errorMessage && <CAlert color="danger">{errorMessage}</CAlert>}

            <CRow className="mb-3">
                <CCol md={6}>
                    <CFormLabel htmlFor="tenantName">Tenant Name</CFormLabel>
                    <CFormInput
                        type="text"
                        id="tenantName"
                        value={tenantData.tenantName}
                        onChange={(e) => handleInputChange('tenantName', e.target.value)}
                        required
                    />
                </CCol>
                <CCol md={6}>
                    <CFormLabel htmlFor="email">Email</CFormLabel>
                    <CFormInput
                        type="email"
                        id="email"
                        value={tenantData.contactInformation.email}
                        onChange={(e) => handleContactChange('email', e.target.value)}
                        required
                    />
                </CCol>
            </CRow>
            <CRow className="mb-3">
                <CCol md={6}>
                    <CFormLabel htmlFor="phoneNumber">Phone Number</CFormLabel>
                    <CFormInput
                        type="text"
                        id="phoneNumber"
                        value={tenantData.contactInformation.phoneNumber}
                        onChange={(e) => handleContactChange('phoneNumber', e.target.value)}
                    />
                </CCol>
                <CCol md={6}>
                    <CFormLabel htmlFor="emergencyContact">Emergency Contact</CFormLabel>
                    <CFormInput
                        type="text"
                        id="emergencyContact"
                        value={tenantData.contactInformation.emergencyContact}
                        onChange={(e) => handleContactChange('emergencyContact', e.target.value)}
                    />
                </CCol>
            </CRow>
            <CRow className="mb-3">
                <CCol md={6}>
                    <CFormLabel htmlFor="propertyId">Property ID</CFormLabel>
                    <CFormInput
                        type="text"
                        id="propertyId"
                        value={tenantData.propertyInformation.propertyId}
                        onChange={(e) => handlePropertyInformationChange('propertyId', e.target.value)}
                        required
                    />
                </CCol>
                  <CCol md={6}>
                    <CFormLabel htmlFor="status">Status</CFormLabel>
                    <CFormSelect
                        id="status"
                        value={tenantData.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="pending">Pending</option>
                    </CFormSelect>
                </CCol>
             </CRow>
           
            <CRow className="mb-3">
                <CCol>
                    <CFormLabel htmlFor="idProof">Upload ID Proof</CFormLabel>
                    <CFormInput
                        type="file"
                        id="idProof"
                        multiple
                        onChange={handleIdProofChange}
                    />
                </CCol>
            </CRow>
            <CButton type="submit" disabled={isLoading}>
                {isLoading ? <CSpinner size="sm"/> : 'Add Tenant'}
            </CButton>
        </CForm>
    );
};
export default AddTenant;