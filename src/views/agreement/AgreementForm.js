// src/views/agreement/AgreementForm.js
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    CForm,
    CRow,
    CCol,
    CButton,
    CFormInput,
    CFormTextarea,
    CFormSelect,
    CInputGroup,
    CFormFeedback,
    CInputGroupText,
    CFormLabel,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import PropTypes from "prop-types";
import { decryptData } from "../../api/utils/crypto";
import DocumentUpload from "./DocumentUpload";
import { cilTrash, cilPlus, cilHome, cilDescription, cilLocationPin, cilMoney, cilBuilding, cilList, cilMap, cilCreditCard, cilPeople, cilSettings, cilCalendar } from "@coreui/icons";

const AgreementForm = ({ onSubmit, initialData = {}, tenants = [], properties = [] }) => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);
    const [formData, setFormData] = useState(() => {
        const defaultForm = {
            user: "",
            tenant: "",
            property: "",
            leaseStart: "",
            leaseEnd: "",
            rentAmount: "",
            securityDeposit: "",
            paymentTerms: { dueDate: "", paymentMethod: "" },
            rulesAndConditions: "",
            additionalOccupants: [],
            utilitiesAndServices: "",
            documents: [],
            fileErrors: [],
            formErrors: {},
            propertyType: "",
        };
        if (initialData && Object.keys(initialData).length > 0) {
            return {
                ...defaultForm,
                ...initialData,
                paymentTerms: { ...defaultForm.paymentTerms, ...initialData.paymentTerms },
            };
        }
        return defaultForm;
    });
    const [filesToUpload, setFilesToUpload] = useState([]);

    useEffect(() => {
        const encryptedUser = localStorage.getItem('user');
        if (encryptedUser) {
            try {
                const decryptedUser = decryptData(encryptedUser);
                    if (decryptedUser?._id) {
                        setUserId(decryptedUser._id);
                    }
                } catch (error) {
                console.error("Failed to decrypt user data:", error);
            }
        }
    }, []);

    useEffect(() => {
        setFormData(prev => ({ ...prev, user: userId }));
    }, [userId]);

    useEffect(() => {
        console.log("initialData prop received in AgreementForm:", initialData); // Debug log

        if (initialData) {
          setFormData(prev => {
            const updatedFormData =  {
              ...prev,
              ...initialData,
              tenant: initialData.tenant?._id || '',
              property: initialData.property?._id || '',
              additionalOccupants: initialData.additionalOccupants || [''],
              paymentTerms: { ...prev.paymentTerms, ...initialData.paymentTerms },
            };
            console.log("formData state updated based on initialData:", updatedFormData); // Debug log
            return updatedFormData;
          });
        }
      }, [initialData]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('paymentTerms.')) {
            const paymentTermField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                paymentTerms: { ...prev.paymentTerms, [paymentTermField]: value }
            }));
        } else if (name.startsWith('additionalOccupants.')) {
            const index = parseInt(name.split('.')[1], 10);
            const updatedOccupants = [...formData.additionalOccupants];
            updatedOccupants[index] = value;
            setFormData(prev => ({ ...prev, additionalOccupants: updatedOccupants }));
        } else {
            setFormData(prev => {
                const updatedFormData = { ...prev, [name]: value };
                delete updatedFormData.formErrors[name];
                return updatedFormData;
            });
        }
    };

    const handleFileChange = useCallback((files) => {
        setFilesToUpload(files);
    }, [setFilesToUpload]);
    
    const handleRemoveDocument = (index) => {
        const updatedFiles = [...filesToUpload];
        updatedFiles.splice(index, 1);
        setFilesToUpload(updatedFiles);
    };
    

    const handleAddOccupant = () => {
        setFormData(prev => ({ ...prev, additionalOccupants: [...prev.additionalOccupants, ""] }));
    };
    
    const handleRemoveOccupant = (index) => {
        const updatedOccupants = [...formData.additionalOccupants];
        updatedOccupants.splice(index, 1);
        setFormData(prev => ({ ...prev, additionalOccupants: updatedOccupants }));
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = {}; // Use a local errors object for validation
    
        if (!formData.tenant) errors.tenant = 'Tenant is required';
        if (!formData.property) errors.property = 'Property is required';
        if (!formData.leaseStart) errors.leaseStart = 'Lease Start Date is required';
        if (!formData.leaseEnd) errors.leaseEnd = 'Lease End Date is required';
        if (!formData.rentAmount) errors.rentAmount = 'Rent Amount is required';
        if (!formData.securityDeposit) errors.securityDeposit = 'Security Deposit is required';
        if (!formData.paymentTerms.dueDate) errors['paymentTerms.dueDate'] = 'Payment Due Date is required';
        if (!formData.paymentTerms.paymentMethod) errors['paymentTerms.paymentMethod'] = 'Payment Method is required';
        if (!formData.user) errors.user = 'User information is missing.';
        if (!formData.propertyType) errors.propertyType = 'Property Type is required';
    
    
        if (Object.keys(errors).length > 0) {
            setFormData(prev => ({ ...prev, formErrors: errors })); // Set formErrors state
            return;
        }
    
        const submissionData = { ...formData, documents: filesToUpload };
        onSubmit(submissionData);
    };    


    return (
        <CForm onSubmit={handleSubmit} className="space-y-6 p-4" noValidate>
            <CRow className="g-4">
                <CCol xs={12} md={6}>
                    <CFormLabel htmlFor="tenant"><CIcon icon={cilPeople} className="me-1"/>Tenant</CFormLabel>
                    <CFormSelect
                        className="form-control-md"
                        name="tenant"
                        value={formData.tenant}
                        onChange={handleInputChange}
                        required
                        invalid={!!formData.formErrors.tenant} // Use formData.formErrors
                    >
                        <option value="">Select Tenant</option>
                        {tenants.map(t => (
                            <option key={t._id} value={t._id}>{t.tenantName}</option>
                        ))}
                    </CFormSelect>
                    {formData.formErrors.tenant && ( // Use formData.formErrors
                        <CFormFeedback invalid>{formData.formErrors.tenant}</CFormFeedback>
                    )}
                </CCol>
                <CCol xs={12} md={6}>
                    <CFormLabel htmlFor="property"><CIcon icon={cilHome} className="me-1"/>Property</CFormLabel>
                    <CFormSelect
                        className="form-control-md"
                        name="property"
                        value={formData.property}
                        onChange={handleInputChange}
                        required
                        invalid={!!formData.formErrors.property} // Use formData.formErrors
                    >
                        <option value="">Select Property</option>
                        {properties.map(p => (
                            <option key={p._id} value={p._id}>{p.title}</option>
                        ))}
                    </CFormSelect>
                    {formData.formErrors.property && ( // Use formData.formErrors
                        <CFormFeedback invalid>{formData.formErrors.property}</CFormFeedback>
                    )}
                </CCol>
                <CCol xs={12} md={6}>
                    <CFormLabel htmlFor="propertyType"><CIcon icon={cilBuilding} className="me-1"/>Property Type</CFormLabel>
                    <CFormSelect
                        className="form-control-md"
                        id="propertyType"
                        name="propertyType"
                        value={formData.propertyType}
                        onChange={handleInputChange}
                        invalid={!!formData.formErrors.propertyType} // Use formData.formErrors
                    >
                        <option value="">Select Property Type</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Detached House">Detached House</option>
                        <option value="Semi-Detached House">Semi-Detached House</option>
                        <option value="Condominium">Condominium</option>
                        <option value="Townhouse">Townhouse</option>
                    </CFormSelect>
                    {formData.formErrors.propertyType && ( // Use formData.formErrors
                        <CFormFeedback invalid>{formData.formErrors.propertyType}</CFormFeedback>
                    )}
                </CCol>
                <CCol xs={12} md={6}>
                    <CFormLabel htmlFor="leaseStart"><CIcon icon={cilCalendar} className="me-1"/>Lease Start Date</CFormLabel>
                    <CFormInput
                        className="form-control-md"
                        type="date"
                        id="leaseStart"
                        name="leaseStart"
                        value={formData.leaseStart}
                        onChange={handleInputChange}
                        required
                        invalid={!!formData.formErrors.leaseStart} // Use formData.formErrors
                    />
                    {formData.formErrors.leaseStart && ( // Use formData.formErrors
                        <CFormFeedback invalid>{formData.formErrors.leaseStart}</CFormFeedback>
                    )}
                </CCol>
                <CCol xs={12} md={6}>
                    <CFormLabel htmlFor="leaseEnd"><CIcon icon={cilCalendar} className="me-1"/>Lease End Date</CFormLabel>
                    <CFormInput
                        className="form-control-md"
                        type="date"
                        id="leaseEnd"
                        name="leaseEnd"
                        value={formData.leaseEnd}
                        onChange={handleInputChange}
                        required
                        invalid={!!formData.formErrors.leaseEnd} // Use formData.formErrors
                    />
                    {formData.formErrors.leaseEnd && ( // Use formData.formErrors
                        <CFormFeedback invalid>{formData.formErrors.leaseEnd}</CFormFeedback>
                    )}
                </CCol>
                <CCol xs={12} md={6}>
                    <CFormLabel htmlFor="rentAmount"><CIcon icon={cilMoney} className="me-1"/>Rent Amount</CFormLabel>
                    <CInputGroup>
                        <CInputGroupText>$</CInputGroupText>
                        <CFormInput
                            className="form-control-md"
                            type="number"
                            id="rentAmount"
                            name="rentAmount"
                            value={formData.rentAmount}
                            onChange={handleInputChange}
                            required
                            invalid={!!formData.formErrors.rentAmount} // Use formData.formErrors
                        />
                    </CInputGroup>
                    {formData.formErrors.rentAmount && ( // Use formData.formErrors
                        <CFormFeedback invalid>{formData.formErrors.rentAmount}</CFormFeedback>
                    )}
                </CCol>
                <CCol xs={12} md={6}>
                    <CFormLabel htmlFor="securityDeposit"><CIcon icon={cilMoney} className="me-1"/>Security Deposit</CFormLabel>
                    <CInputGroup>
                        <CInputGroupText>$</CInputGroupText>
                        <CFormInput
                            className="form-control-md"
                            type="number"
                            id="securityDeposit"
                            name="securityDeposit"
                            value={formData.securityDeposit}
                            onChange={handleInputChange}
                            required
                            invalid={!!formData.formErrors.securityDeposit} // Use formData.formErrors
                        />
                    </CInputGroup>
                    {formData.formErrors.securityDeposit && ( // Use formData.formErrors
                        <CFormFeedback invalid>{formData.formErrors.securityDeposit}</CFormFeedback>
                    )}
                </CCol>
                <CCol xs={12} md={6}>
                    <CFormLabel htmlFor="paymentTerms.dueDate"><CIcon icon={cilDescription} className="me-1"/>Payment Due Date</CFormLabel>
                    <CFormInput
                        className="form-control-md"
                        type="text"
                        id="paymentTerms.dueDate"
                        name="paymentTerms.dueDate"
                        value={formData.paymentTerms.dueDate}
                        onChange={handleInputChange}
                        required
                        invalid={!!formData.formErrors['paymentTerms.dueDate']} // Use formData.formErrors
                    />
                    {formData.formErrors['paymentTerms.dueDate'] && ( // Use formData.formErrors
                        <CFormFeedback invalid>{formData.formErrors['paymentTerms.dueDate']}</CFormFeedback>
                    )}
                </CCol>
                <CCol xs={12} md={6}>
                    <CFormLabel htmlFor="paymentTerms.paymentMethod"><CIcon icon={cilCreditCard} className="me-1"/>Payment Method</CFormLabel>
                    <CFormSelect
                        className="form-control-md"
                        name="paymentTerms.paymentMethod"
                        value={formData.paymentTerms.paymentMethod}
                        onChange={handleInputChange}
                        required
                        invalid={!!formData.formErrors['paymentTerms.paymentMethod']} // Use formData.formErrors
                    >
                        <option value="">Select Payment Method</option>
                        <option value="cash">Cash</option>
                        <option value="cheque">Cheque</option>
                        <option value="bank transfer">Bank Transfer</option>
                        <option value="credit card">Credit Card</option>
                    </CFormSelect>
                    {formData.formErrors['paymentTerms.paymentMethod'] && ( // Use formData.formErrors
                        <CFormFeedback invalid>{formData.formErrors['paymentTerms.paymentMethod']}</CFormFeedback>
                    )}
                </CCol>
    
                <CCol xs={12}>
                    <CFormLabel htmlFor="rulesAndConditions"><CIcon icon={cilList} className="me-1"/>Rules & Conditions</CFormLabel>
                    <CFormTextarea
                        className="form-control-md"
                        id="rulesAndConditions"
                        name="rulesAndConditions"
                        value={formData.rulesAndConditions}
                        onChange={handleInputChange}
                        rows={3}
                    />
                </CCol>
                <CCol xs={12}>
                    <label className="block text-gray-700"><CIcon icon={cilPeople} className="me-1"/>Additional Occupants</label>
                    {formData.additionalOccupants.map((occupant, index) => (
                        <CInputGroup className="mb-3" key={index}>
                            <CFormInput
                                className="form-control-md"
                                type="text"
                                name={`additionalOccupants.${index}`}
                                value={occupant}
                                onChange={handleInputChange}
                                placeholder={`Occupant ${index + 1} Name`}
                            />
                            <CButton
                                type="button"
                                color="danger"
                                variant="outline"
                                onClick={() => handleRemoveOccupant(index)}
                                disabled={formData.additionalOccupants.length <= 1}
                            >
                                <CIcon icon={cilTrash} />
                            </CButton>
                        </CInputGroup>
                    ))}
                    <CButton
                        type="button"
                        color="light"
                        onClick={handleAddOccupant}
                    >
                        <CIcon icon={cilPlus} className="me-1"/> Add Occupant
                    </CButton>
                </CCol>
                <CCol xs={12}>
                    <CFormLabel htmlFor="utilitiesAndServices"><CIcon icon={cilSettings} className="me-1"/>Utilities and Services</CFormLabel>
                    <CFormTextarea
                        className="form-control-md"
                        id="utilitiesAndServices"
                        name="utilitiesAndServices"
                        value={formData.utilitiesAndServices}
                        onChange={handleInputChange}
                        rows={2}
                    />
                </CCol>
                <CCol xs={12}>
                    <DocumentUpload
                        formData={formData}
                        fileErrors={formData.fileErrors || []}
                        handleFileChange={handleFileChange}
                        handleRemoveDocument={handleRemoveDocument}
                        filesToUpload={filesToUpload}
                        setFilesToUpload={setFilesToUpload}
                    />
                </CCol>
                {formData.formErrors && Object.keys(formData.formErrors).length > 0 && (
                    <CCol xs={12}>
                        <ul className="text-red-600 mt-2">
                            {Object.keys(formData.formErrors).map((key, index) => (
                                <li key={index} className="text-sm">{formData.formErrors[key]}</li>
                            ))}
                        </ul>
                    </CCol>
                )}
    
                <CCol xs={12} className="d-flex justify-content-end gap-2">
                    <CButton color="secondary" onClick={() => navigate("/agreement")} >Cancel</CButton>
                    <CButton color="dark" type="submit" disabled={false}>Submit</CButton>
                </CCol>
            </CRow>
        </CForm>
    );
};

AgreementForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool,
    initialData: PropTypes.object,
    tenants: PropTypes.array,
    properties: PropTypes.array,
};

export default AgreementForm;