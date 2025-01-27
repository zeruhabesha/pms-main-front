import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    CForm,
    CRow,
    CCol,
    CButton,
    CFormInput,
    CFormTextarea,
    CFormSelect,
} from "@coreui/react";
import PropTypes from "prop-types";
import CIcon from "@coreui/icons-react";
import "./AgreementForm.scss";
import TenantPropertySelect from "./TenantPropertySelect";
import DocumentUpload from "./DocumentUpload";
import { cilTrash, cilPlus, cilUser, cilHome, cilCalendar, cilMoney, cilOptions, cilFile } from "@coreui/icons";

const AgreementForm = ({ onSubmit, isSubmitting = false, initialData = null, tenants, properties }) => {
    const navigate = useNavigate();
    const isEditing = !!initialData?.id;
     // Form data and state initialization
    const [formData, setFormData] = useState(() => ({
        tenant: initialData?.tenant?._id || initialData?.tenant || "",
        property: initialData?.property?._id || initialData?.property || "",
        leaseStart: initialData?.leaseStart || "",
        leaseEnd: initialData?.leaseEnd || "",
        rentAmount: initialData?.rentAmount || "",
        securityDeposit: initialData?.securityDeposit || "",
        paymentTerms: {
            dueDate: initialData?.paymentTerms?.dueDate || "",
            paymentMethod: initialData?.paymentTerms?.paymentMethod || "",
        },
        rulesAndConditions: initialData?.rulesAndConditions || "",
        additionalOccupants: initialData?.additionalOccupants || [],
        utilitiesAndServices: initialData?.utilitiesAndServices || "",
        documents: initialData?.documents || [],
        fileErrors: [],
        formErrors: []
    }));


   // Sync form data with initialData
    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({
                ...prev,
                tenant: initialData.tenant?._id || initialData.tenant || "",
                property: initialData.property?._id || initialData.property || "",
                leaseStart: initialData.leaseStart || "",
                leaseEnd: initialData.leaseEnd || "",
                rentAmount: initialData.rentAmount || "",
                securityDeposit: initialData.securityDeposit || "",
                paymentTerms: {
                    dueDate: initialData.paymentTerms?.dueDate || "",
                    paymentMethod: initialData.paymentTerms?.paymentMethod || "",
                },
                rulesAndConditions: initialData.rulesAndConditions || "",
                additionalOccupants: initialData.additionalOccupants || [],
                utilitiesAndServices: initialData.utilitiesAndServices || "",
                documents: initialData.documents || [],
                fileErrors: [],
                formErrors: []
            }))
        }
    }, [initialData]);


    // Options for tenants and properties
    const tenantOptions = useCallback(
        () =>
            tenants?.map((t) => ({
                label: t.tenantName || t.name || "Unnamed Tenant",
                value: t._id || t.id,
            })) || [],
        [tenants]
    );

    const propertyOptions = useCallback(
        () =>
            properties?.map((p) => ({
                label: p.title || p.address || "Unnamed Property",
                value: p._id || p.id,
            })) || [],
        [properties]
    );
    // File validation
    const validateFiles = (files) => {
        const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
        const maxFileSize = 5 * 1024 * 1024; // 5MB
        const errors = [];

        for (const file of files) {
            if (!allowedTypes.includes(file.type)) {
                errors.push(`File type '${file.type}' is not allowed for '${file.name}'.`);
            } else if (file.size > maxFileSize) {
                errors.push(`File '${file.name}' exceeds the maximum size of 5MB.`);
            }
        }

        return errors;
    };

    const handleFileChange = (files) => {
        const errors = validateFiles(files);
        setFormData((prev) => ({
            ...prev,
            documents: files,
            fileErrors: errors,
        }));
    };


    const handleRemoveDocument = (index) => {
        const updatedDocuments = [...formData.documents];
        updatedDocuments.splice(index, 1);
        setFormData((prev) => ({ ...prev, documents: updatedDocuments }));
    };
    // Handlers for dynamic arrays
    const handleArrayChange = (index, value, field) => {
        const updatedArray = [...formData[field]];
        updatedArray[index] = value;
        setFormData((prev) => ({ ...prev, [field]: updatedArray }));
    };

    const handleAddToArray = (field) => {
        setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
    };

    const handleRemoveFromArray = (index, field) => {
        const updatedArray = [...formData[field]];
        updatedArray.splice(index, 1);
        setFormData((prev) => ({ ...prev, [field]: updatedArray }));
    };


    // Form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        const errors = [];
        if (!formData.tenant) {
            errors.push("Tenant is required.");
        }
        if (!formData.property) {
            errors.push("Property is required.");
        }
        if (formData.fileErrors.length > 0) {
            setFormData(prev => ({...prev, formErrors: errors}))
            return;
        }

        setFormData(prev => ({...prev, formErrors: errors}));
        if (errors.length > 0) {
            return;
        }

        onSubmit(formData);
    };

    // Input change handler
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("paymentTerms.")) {
            const paymentTermField = name.split(".").pop();
            setFormData((prev) => ({
                ...prev,
                paymentTerms: { ...prev.paymentTerms, [paymentTermField]: value },
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleCancel = useCallback(() => {
        navigate("/agreement");
    }, [navigate]);

    return (
        <CForm onSubmit={handleSubmit} className="agreement-form">
            <CRow>
                <TenantPropertySelect
                    tenantOptions={tenantOptions()}
                    propertyOptions={propertyOptions()}
                    formData={formData}
                    setFormData={setFormData}
                />

                <CCol xs={12} md={6} className="form-group">
                    <CFormInput
                        type="date"
                        label={<span><CIcon icon={cilCalendar} className="me-1" />Lease Start Date</span>}
                        name="leaseStart"
                        value={formData.leaseStart}
                        onChange={handleInputChange}
                        required
                        className="form-control-animation"
                    />
                </CCol>
                <CCol xs={12} md={6} className="form-group">
                    <CFormInput
                        type="date"
                        label={<span><CIcon icon={cilCalendar} className="me-1" />Lease End Date</span>}
                        name="leaseEnd"
                        value={formData.leaseEnd}
                        onChange={handleInputChange}
                        required
                        className="form-control-animation"
                    />
                </CCol>
                <CCol xs={12} md={6} className="form-group">
                    <CFormInput
                        type="number"
                        label={<span><CIcon icon={cilMoney} className="me-1" />Rent Amount</span>}
                        name="rentAmount"
                        value={formData.rentAmount}
                        onChange={handleInputChange}
                        required
                        className="form-control-animation"
                    />
                </CCol>
                <CCol xs={12} md={6} className="form-group">
                    <CFormInput
                        type="number"
                        label={<span><CIcon icon={cilMoney} className="me-1" />Security Deposit</span>}
                        name="securityDeposit"
                        value={formData.securityDeposit}
                        onChange={handleInputChange}
                        required
                        className="form-control-animation"
                    />
                </CCol>

                <CCol xs={12} md={6} className="form-group">
                    <CFormSelect
                        label={<span><CIcon icon={cilOptions} className="me-1" />Payment Method</span>}
                        name="paymentTerms.paymentMethod"
                        value={formData.paymentTerms.paymentMethod}
                        onChange={handleInputChange}
                        required
                        className="form-control-animation"
                    >
                        <option value="">Select Method</option>
                        <option value="cash">Cash</option>
                        <option value="cheque">Cheque</option>
                        <option value="bank transfer">Bank Transfer</option>
                    </CFormSelect>
                </CCol>
                <CCol xs={12} md={6} className="form-group">
                    <CFormInput
                        type="date"
                        label={<span><CIcon icon={cilCalendar} className="me-1" />Due Date</span>}
                        name="paymentTerms.dueDate"
                        value={formData.paymentTerms.dueDate}
                        onChange={handleInputChange}
                        required
                        className="form-control-animation"
                    />
                </CCol>

                <CCol xs={12} className="form-group">
                    <CFormTextarea
                        label={<span><CIcon icon={cilOptions} className="me-1" />Rules and Conditions</span>}
                        name="rulesAndConditions"
                        rows="3"
                        value={formData.rulesAndConditions}
                        onChange={handleInputChange}
                        className="form-control-animation"
                    />
                </CCol>

                <CCol xs={12} className="form-group">
                    <label className="me-2"><span><CIcon icon={cilUser} className="me-1" />Additional Occupants</span></label>
                    {formData.additionalOccupants?.map((occupant, index) => (
                        <div key={index} className="d-flex align-items-center mb-2">
                            <CFormInput
                                value={occupant}
                                onChange={(e) => handleArrayChange(index, e.target.value, "additionalOccupants")}
                                className="form-control-animation me-2"
                            />
                            <CButton
                                color="light"
                                style={{ color: "red" }}
                                size="sm"
                                className="ms-2"
                                onClick={() => handleRemoveFromArray(index, "additionalOccupants")}
                                title="Remove Occupant"
                            >
                                <CIcon icon={cilTrash} />
                            </CButton>
                        </div>
                    ))}
                    <CButton
                        color="light"
                        size="sm"
                        onClick={() => handleAddToArray("additionalOccupants")}
                        title="Add Occupant"
                        className="me-2"
                    >
                        <CIcon icon={cilPlus} />
                    </CButton>
                </CCol>

                <CCol xs={12} className="form-group">
                    <CFormTextarea
                        label={<span><CIcon icon={cilHome} className="me-1" />Utilities and Services</span>}
                        name="utilitiesAndServices"
                        rows="2"
                        value={formData.utilitiesAndServices}
                        onChange={handleInputChange}
                        className="form-control-animation"
                    />
                </CCol>

                <DocumentUpload
                    formData={formData}
                    fileErrors={formData.fileErrors}
                    handleFileChange={handleFileChange}
                    handleRemoveDocument={handleRemoveDocument}
                    isEditing={isEditing}
                />
                {formData.formErrors.length > 0 && (
                    <ul className="text-danger mt-2">
                        {formData.formErrors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                )}

                <CCol xs={12} className="mt-4 d-flex justify-content-end gap-2">
                    <CButton
                        color="secondary"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                        className="ms-2 mt-3 form-button"
                    >
                        Cancel
                    </CButton>
                    <CButton type="submit" color="dark" className="ms-2 mt-3 form-button" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </CButton>
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