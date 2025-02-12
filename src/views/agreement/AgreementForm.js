import React, { useState, useEffect, useCallback, useRef } from "react";
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
    CSpinner,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import PropTypes from "prop-types";
import { decryptData } from "../../api/utils/crypto";
import { cilTrash, cilPlus, cilHome, cilDescription, cilLocationPin, cilMoney, cilBuilding, cilList, cilMap, cilCreditCard, cilPeople, cilSettings, cilCalendar, cilCloudUpload } from "@coreui/icons";

const AgreementForm = ({ onSubmit, tenants = [], properties = [], isSubmitting = false }) => { // initialData defaults to null
    const navigate = useNavigate();
    const [formData, setFormData] = useState(() => {
        const defaultForm = {
            // user: "", // ✅ Ensure this is populated
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
        };
    
        return defaultForm
    });

    const [filesToUpload, setFilesToUpload] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

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

    const handleSubmitLocal = async (e) => {
        e.preventDefault();
        console.log('Form submitted with data:', formData);
        
        const errors = {};

        if (Object.keys(errors).length > 0) {
            setFormData(prev => ({ ...prev, formErrors: errors }));
            console.log('Validation errors:', errors);
            return;
        }

        const formDataToSend = new FormData();
        for (const key in formData) {
            if (key === 'paymentTerms') {
                formDataToSend.append('dueDate', formData.paymentTerms.dueDate);
                formDataToSend.append('paymentMethod', formData.paymentTerms.paymentMethod);
            } else if (key === 'additionalOccupants') {
                formData.additionalOccupants.forEach(occupant => {
                    formDataToSend.append('additionalOccupants', occupant);
                });
            } else if (key !== 'documents' && key !== 'formErrors' && key !== 'fileErrors') {
                formDataToSend.append(key, formData[key]);
            }
        }

        filesToUpload.forEach(file => {
            formDataToSend.append('documents', file);
        });

        console.log('Final FormData contents:');
        for (let pair of formDataToSend.entries()) {
            console.log(pair[0], pair[1]);
        }

        onSubmit(formDataToSend);
    };

    // Drag and Drop Handlers
    const handleDragEnter = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);

        const droppedFiles = Array.from(e.dataTransfer.files);
        setFilesToUpload(droppedFiles);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFiles = Array.from(e.dataTransfer.files);
        handleFileChange(droppedFiles);
    };


    return (
        <CForm onSubmit={handleSubmitLocal} className="space-y-6 p-4" noValidate>
            <CRow className="g-4">
                <CCol xs={12} md={6}>
                    <CFormLabel htmlFor="tenant"><CIcon icon={cilPeople} className="me-1"/>Tenant</CFormLabel>
                    <CFormSelect
                        className="form-control-md"
                        name="tenant"
                        value={formData.tenant}
                        onChange={handleInputChange}
                        required
                        invalid={!!formData.formErrors.tenant}
                    >
                        <option value="">Select Tenant</option>
                        {tenants.map(t => (
                            <option key={t._id} value={t._id}>{t.tenantName}</option>
                        ))}
                    </CFormSelect>
                    {formData.formErrors.tenant && (
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
                        invalid={!!formData.formErrors.property}
                    >
                        <option value="">Select Property</option>
                        {properties.map(p => (
                            <option key={p.id} value={p.id}>{p.title}</option>
                        ))}
                    </CFormSelect>
                    {formData.formErrors.property && (
                        <CFormFeedback invalid>{formData.formErrors.property}</CFormFeedback>
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
                        invalid={!!formData.formErrors.leaseStart}
                    />
                    {formData.formErrors.leaseStart && (
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
                        invalid={!!formData.formErrors.leaseEnd}
                    />
                    {formData.formErrors.leaseEnd && (
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
                            invalid={!!formData.formErrors.rentAmount}
                        />
                    </CInputGroup>
                    {formData.formErrors.rentAmount && (
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
                            invalid={!!formData.formErrors.securityDeposit}
                        />
                    </CInputGroup>
                    {formData.formErrors.securityDeposit && (
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
                        invalid={!!formData.formErrors['paymentTerms.dueDate']}
                    />
                    {formData.formErrors['paymentTerms.dueDate'] && (
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
                        invalid={!!formData.formErrors['paymentTerms.paymentMethod']}
                    >
                        <option value="">Select Payment Method</option>
                        <option value="cash">Cash</option>
                        <option value="cheque">Cheque</option>
                        <option value="bank transfer">Bank Transfer</option>
                        <option value="credit card">Credit Card</option>
                    </CFormSelect>
                    {formData.formErrors['paymentTerms.paymentMethod'] && (
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
                    <CFormLabel htmlFor="documents"><CIcon icon={cilDescription} className="me-1"/>Documents</CFormLabel>
                    <div
                        className={`border-2 border-dashed rounded-md p-6 text-center ${
                            isDragging ? 'border-primary bg-light' : 'border-gray-400'
                        }`}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    >
                        <CIcon icon={cilCloudUpload} size="3xl" className="text-gray-500 mb-3" />
                        <p className="text-gray-600">
                            Drag and drop files here or click to select files
                        </p>
                        <input
                            type="file"
                            className="hidden"
                            id="documentUpload"
                            multiple
                            onChange={(e) => handleFileChange(Array.from(e.target.files))}
                        />
                        <label htmlFor="documentUpload" className="text-blue-500 hover:underline cursor-pointer">
                            Browse files
                        </label>
                        {filesToUpload.length > 0 && (
                            <div className="mt-4">
                                <p className="text-gray-700">Files to upload:</p>
                                <ul>
                                    {filesToUpload.map((file, index) => (
                                        <li key={index} className="flex items-center justify-between py-1">
                                            <span>{file.name}</span>
                                            <CButton
                                                type="button"
                                                color="danger"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleRemoveDocument(index)}
                                            >
                                                <CIcon icon={cilTrash} />
                                            </CButton>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    {/* Upload progress bar */}
                    {uploadProgress > 0 && (
                        <div className="progress mt-3">
                            <div
                                className="progress-bar"
                                role="progressbar"
                                style={{ width: `${uploadProgress}%` }}
                                aria-valuenow={uploadProgress}
                                aria-valuemin="0"
                                aria-valuemax="100"
                            >{uploadProgress}%</div>
                        </div>
                    )}
                    {formData.fileErrors && formData.fileErrors.length > 0 && (
                        <ul className="text-red-600 mt-2">
                            {formData.fileErrors.map((error, index) => (
                                <li key={index} className="text-sm">{error}</li>
                            ))}
                        </ul>
                    )}
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
                    <CButton color="secondary" onClick={() => navigate("/agreement")}>Cancel</CButton>
                    <CButton color="dark" type="submit" >
                        {'Submit'}
                    </CButton>
                </CCol>
            </CRow>
        </CForm>
    );
};

AgreementForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool,
    tenants: PropTypes.array,
    properties: PropTypes.array,
};

export default AgreementForm;