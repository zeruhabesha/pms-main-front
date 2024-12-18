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
    CInputGroup,
    CFormSelect,
    CAlert,
    CSpinner,
} from '@coreui/react';
import { cilTrash, cilPlus } from '@coreui/icons';
import { CIcon } from '@coreui/icons-react';
import { useDispatch, useSelector } from 'react-redux';
import { addTenant, updateTenant } from '../../api/actions/TenantActions';
import { toast } from 'react-toastify';

const AddTenant = ({ visible, setVisible, editingTenant = null }) => {
    const dispatch = useDispatch();
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

    // Populate form with tenant data if editing
    useEffect(() => {
        if (editingTenant) {
            setTenantData({
                tenantName: editingTenant.tenantName || '',
                contactInformation: {
                    email: editingTenant.contactInformation?.email || '',
                    phoneNumber: editingTenant.contactInformation?.phoneNumber || '',
                    emergencyContact: editingTenant.contactInformation?.emergencyContact || '',
                },
                leaseAgreement: {
                    startDate: editingTenant.leaseAgreement?.startDate?.split('T')[0] || '',
                    endDate: editingTenant.leaseAgreement?.endDate?.split('T')[0] || '',
                    rentAmount: editingTenant.leaseAgreement?.rentAmount || '',
                    securityDeposit: editingTenant.leaseAgreement?.securityDeposit || '',
                    specialTerms: editingTenant.leaseAgreement?.specialTerms || '',
                },
                propertyInformation: {
                    unit: editingTenant.propertyInformation?.unit || '',
                    propertyId: editingTenant.propertyInformation?.propertyId || '',
                },
                password: '',
                idProof: editingTenant.idProof || [],
                paymentMethod: editingTenant.paymentMethod || '',
                moveInDate: editingTenant.moveInDate?.split('T')[0] || '',
                emergencyContacts: editingTenant.emergencyContacts || [''],
            });
        } else {
            resetForm();
        }
        setErrorMessage('');
    }, [editingTenant]);

    // Reset the form
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

    // Validate form inputs
    const validateTenantData = () => {
        if (!tenantData.tenantName.trim()) return 'Tenant name is required';
        if (
            !tenantData.contactInformation.email.trim() ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tenantData.contactInformation.email)
        )
            return 'A valid email is required';
        if (!tenantData.contactInformation.phoneNumber.trim()) return 'Phone number is required';
        if (!tenantData.paymentMethod) return 'Payment method is required';
        if (!tenantData.moveInDate) return 'Move-in date is required';
        if (!tenantData.leaseAgreement.startDate) return 'Lease start date is required';
        if (!tenantData.leaseAgreement.endDate) return 'Lease end date is required';
        if (tenantData.idProof.length > 3) return 'No more than 3 ID proofs can be uploaded';
        return ''; // No validation errors
    };

    // Submit form data
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateTenantData();
        if (validationError) {
            setErrorMessage(validationError);
            return;
        }

        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('tenantName', tenantData.tenantName);
            formData.append('contactInformation', JSON.stringify(tenantData.contactInformation));
            formData.append('leaseAgreement', JSON.stringify(tenantData.leaseAgreement));
            formData.append('propertyInformation', JSON.stringify(tenantData.propertyInformation));
            formData.append('password', tenantData.password);
             tenantData.idProof.forEach((file) => formData.append('idProof', file));
            formData.append('paymentMethod', tenantData.paymentMethod);
            formData.append('moveInDate', tenantData.moveInDate);
            formData.append('emergencyContacts', JSON.stringify(tenantData.emergencyContacts));

            // Dispatch Redux action for adding the tenant
            const response = await dispatch(addTenant(formData)).unwrap();
             toast.success('Tenant added successfully');
             setVisible(false);
        } catch (error) {
            console.error('Error adding tenant:', error);
            toast.error(error.message || 'Failed to add tenant');
             setErrorMessage(error.message || 'Failed to add tenant')
        } finally {
            setIsLoading(false);
        }
    };


    // Close the modal
    const handleClose = () => {
        resetForm();
        setVisible(false);
    };
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setTenantData((prev) => ({
            ...prev,
            idProof: [...prev.idProof, ...files].slice(0, 3), // Limit to 3 files
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
        <CModal visible={visible} onClose={handleClose} alignment="center" backdrop="static" size="lg">
            <CModalHeader className="bg-dark text-white">
                <CModalTitle>{editingTenant ? 'Edit Tenant' : 'Add Tenant'}</CModalTitle>
            </CModalHeader>
            <CModalBody>
                {errorMessage && <CAlert color="danger">{errorMessage}</CAlert>}
                <CForm onSubmit={handleSubmit}>
                    <CRow className="g-3">
                        <CCol md={6}>
                            <CFormInput
                                label="Tenant Name"
                                name="tenantName"
                                value={tenantData.tenantName}
                                onChange={(e) => setTenantData({ ...tenantData, tenantName: e.target.value })}
                                required
                            />
                        </CCol>
                        <CCol md={6}>
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
                            />
                        </CCol>

                        {/* Phone Number */}
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

                        {/* Emergency Contact */}
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

                        {/* Lease Start Date */}
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

                        {/* Lease End Date */}
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

                        {/* Rent Amount */}
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

                        {/* Security Deposit */}
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

                        {/* Special Terms */}
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

                        {/* Unit */}
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

                        {/* Property ID */}
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

                        {/* Password */}
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

                        {/* Payment Method */}
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

                        {/* Move-in Date */}
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

                        {/* Emergency Contacts */}
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
                                            onClick={() => handleRemoveArrayItem(index, 'emergencyContacts')}
                                        >
                                            <CIcon icon={cilTrash} />
                                        </CButton>
                                    </CCol>
                                </CRow>
                            ))}
                            <CButton size="sm" color="dark" onClick={() => handleAddArrayItem('emergencyContacts')}>
                                <CIcon icon={cilPlus} className="me-1" />
                                Add Contact
                            </CButton>
                        </CCol>

                         {/* ID Proof */}
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
                    <CModalFooter>
                        <CButton color="secondary" onClick={handleClose} disabled={isLoading}>
                            Cancel
                        </CButton>
                        <CButton color="dark" type="submit" disabled={isLoading}>
                            {isLoading ? <CSpinner size="sm" /> : editingTenant ? 'Update Tenant' : 'Add Tenant'}
                        </CButton>
                    </CModalFooter>
                </CForm>
            </CModalBody>
        </CModal>
    );
};

export default AddTenant;