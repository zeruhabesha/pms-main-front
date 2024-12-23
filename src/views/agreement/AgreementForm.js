import React, { useEffect, useMemo, useState, useCallback } from "react";
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
import {
    cilTrash,
    cilPlus,
} from "@coreui/icons";

const AgreementForm = ({ onSubmit, isSubmitting = false, initialData = null, tenants, properties }) => {
    const navigate = useNavigate();

    const tenantOptions = useMemo(
        () =>
            tenants?.map((t) => ({
                label: t.tenantName || t.name || "Unnamed Tenant",
                value: t._id || t.id,
            })) || [],
        [tenants]
    );

    const propertyOptions = useMemo(
        () =>
            properties?.map((p) => ({
                label: p.title || p.address || "Unnamed Property",
                value: p._id || p.id,
            })) || [],
        [properties]
    );

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
    }));
    useEffect(() => {
        if (initialData) {
            setFormData({
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
            });
        }
    }, [initialData]);
    
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

    const handleFileChange = (files) => {
        setFormData((prev) => ({
            ...prev,
            documents: files,
        }));
    };

    const handleRemoveDocument = (index) => {
        const updatedDocuments = [...formData.documents];
        updatedDocuments.splice(index, 1);
        setFormData((prev) => ({ ...prev, documents: updatedDocuments }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Data:", formData);
        onSubmit(formData);
    };

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
                    tenantOptions={tenantOptions}
                    propertyOptions={propertyOptions}
                    formData={formData}
                    setFormData={setFormData}
                />

                <CCol xs={12} md={6} className="form-group">
                    <CFormInput
                        type="date"
                        label="Lease Start Date"
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
                        label="Lease End Date"
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
                        label="Rent Amount"
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
                        label="Security Deposit"
                        name="securityDeposit"
                        value={formData.securityDeposit}
                        onChange={handleInputChange}
                        required
                        className="form-control-animation"
                    />
                </CCol>

                <CCol xs={12} md={6} className="form-group">
                    <CFormSelect
                        label="Payment Method"
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
                        label="Due Date"
                        name="paymentTerms.dueDate"
                        value={formData.paymentTerms.dueDate}
                        onChange={handleInputChange}
                        required
                        className="form-control-animation"
                    />
                </CCol>

                <CCol xs={12} className="form-group">
                    <CFormTextarea
                        label="Rules and Conditions"
                        name="rulesAndConditions"
                        rows="3"
                        value={formData.rulesAndConditions}
                        onChange={handleInputChange}
                        className="form-control-animation"
                    />
                </CCol>

                <CCol xs={12} className="form-group">
                    <label className="me-2">Additional Occupants</label>
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
                        label="Utilities and Services"
                        name="utilitiesAndServices"
                        rows="2"
                        value={formData.utilitiesAndServices}
                        onChange={handleInputChange}
                        className="form-control-animation"
                    />
                </CCol>

                <DocumentUpload
                    formData={formData}
                    handleFileChange={handleFileChange}
                    handleRemoveDocument={handleRemoveDocument}
                />

                <CCol xs={12} className="mt-4 d-flex justify-content-end gap-2">
                    <CButton
                        color="secondary"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                        className="ms-2 mt-3 form-button">
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
