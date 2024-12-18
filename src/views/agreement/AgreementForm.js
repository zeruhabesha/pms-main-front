import React, { useMemo, useState } from "react";
import {
    CForm,
    CRow,
    CCol,
    CButton,
    CSpinner,
    CAlert,
    CFormInput,
    CFormTextarea,
} from "@coreui/react";
import PropTypes from "prop-types";

import TenantPropertySelect from "./TenantPropertySelect";
import DocumentUpload from "./DocumentUpload";

const AgreementForm = ({ onSubmit, isSubmitting = false, initialData = null, tenants, properties }) => {

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

    const [formData, setFormData] = useState(() => {
        return {
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
        };
    });


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

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
        onSubmit(formData);
    };

    return (
        <CForm onSubmit={handleSubmit}>
            <CRow>
                <TenantPropertySelect
                    tenantOptions={tenantOptions}
                    propertyOptions={propertyOptions}
                    formData={formData}
                    setFormData={setFormData}
                />

                <CCol xs={12} md={6}>
                    <CFormInput
                        type="date"
                        label="Lease Start Date"
                        name="leaseStart"
                        value={formData.leaseStart}
                        onChange={handleInputChange}
                        required
                    />
                </CCol>
                <CCol xs={12} md={6}>
                    <CFormInput
                        type="date"
                        label="Lease End Date"
                        name="leaseEnd"
                        value={formData.leaseEnd}
                        onChange={handleInputChange}
                        required
                    />
                </CCol>
                <CCol xs={12} md={6}>
                    <CFormInput
                        type="number"
                        label="Rent Amount"
                        name="rentAmount"
                        value={formData.rentAmount}
                        onChange={handleInputChange}
                        required
                    />
                </CCol>
                <CCol xs={12} md={6}>
                    <CFormInput
                        type="number"
                        label="Security Deposit"
                        name="securityDeposit"
                        value={formData.securityDeposit}
                        onChange={handleInputChange}
                        required
                    />
                </CCol>

                <CCol xs={12}>
                    <CFormTextarea
                        label="Rules and Conditions"
                        name="rulesAndConditions"
                        rows="3"
                        value={formData.rulesAndConditions}
                        onChange={handleInputChange}
                    />
                </CCol>

                <CCol xs={12}>
                    <label>Additional Occupants</label>
                    {formData.additionalOccupants?.map((occupant, index) => (
                        <div key={index} className="d-flex align-items-center mb-2">
                            <CFormInput
                                value={occupant}
                                onChange={(e) => handleArrayChange(index, e.target.value, "additionalOccupants")}
                            />
                            <CButton
                                color="danger"
                                size="sm"
                                className="ms-2"
                                onClick={() => handleRemoveFromArray(index, "additionalOccupants")}
                            >
                                Remove
                            </CButton>
                        </div>
                    ))}
                    <CButton
                        color="primary"
                        size="sm"
                        onClick={() => handleAddToArray("additionalOccupants")}
                    >
                        Add Occupant
                    </CButton>
                </CCol>

                <CCol xs={12}>
                    <CFormTextarea
                        label="Utilities and Services"
                        name="utilitiesAndServices"
                        rows="2"
                        value={formData.utilitiesAndServices}
                        onChange={handleInputChange}
                    />
                </CCol>

                <DocumentUpload
                    formData={formData}
                    handleFileChange={handleFileChange}
                    handleRemoveDocument={handleRemoveDocument} // Here is the change
                />

                <CCol xs={12} className="text-center">
                    <CButton type="submit" color="primary" className="mt-3" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit Agreement"}
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
  properties: PropTypes.array
};
export default AgreementForm;