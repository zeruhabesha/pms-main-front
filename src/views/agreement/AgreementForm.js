import React, { useState, useEffect } from "react";
import {
  CForm,
  CFormInput,
  CRow,
  CCol,
  CFormSelect,
  CAlert,
  CButton,
  CSpinner,
} from "@coreui/react";
import Select from "react-select";

const AgreementForm = ({
  tenants = [],
  properties = [],
  initialData = {},
  onSubmit,
  isLoading,
  setErrorMessage,
}) => {
  const [formData, setFormData] = useState({
    tenant: "",
    property: "",
    leaseStart: "",
    leaseEnd: "",
    rentAmount: "",
    securityDeposit: "",
    paymentTerms: { dueDate: "", paymentMethod: "" },
    rulesAndConditions: "",
    additionalOccupants: "",
    utilitiesAndServices: "",
    documents: [],
  });

  // Effect to update formData when initialData changes (e.g., on edit)
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        tenant: initialData?.tenant?._id || "",
        property: initialData?.property?._id || "",
        leaseStart: initialData?.leaseStart || "",
        leaseEnd: initialData?.leaseEnd || "",
        rentAmount: initialData?.rentAmount || "",
        securityDeposit: initialData?.securityDeposit || "",
        paymentTerms: initialData?.paymentTerms || { dueDate: "", paymentMethod: "" },
        rulesAndConditions: initialData?.rulesAndConditions || "",
        additionalOccupants: initialData?.additionalOccupants || "",
        utilitiesAndServices: initialData?.utilitiesAndServices || "",
        documents: initialData?.documents || [],
      });
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentTermChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      paymentTerms: { ...prev.paymentTerms, [key]: value },
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = [];
    const errors = [];

    files.forEach((file) => {
      if (file.type.startsWith("application/") || file.type.startsWith("image/")) {
        newFiles.push(file);
      } else {
        errors.push(`${file.name} is not a valid file type.`);
      }
    });

    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, ...newFiles],
    }));
    setFileErrors(errors);
  };

  const handleRemoveDocument = (index) => {
    setFormData((prev) => {
      const updatedDocuments = [...prev.documents];
      updatedDocuments.splice(index, 1);
      return { ...prev, documents: updatedDocuments };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.tenant || !formData.property || !formData.leaseStart || !formData.leaseEnd) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }
    onSubmit(formData);
  };

  return (
    <CForm onSubmit={handleSubmit}>
      <CRow className="g-4">
        <CCol xs={12}>
          <label>Tenant</label>
          <Select
            options={tenants.map((t) => ({
              label: t.tenantName,
              value: t._id,
            }))}
            value={tenants.find((t) => t._id === formData.tenant) || null}
            onChange={(selected) =>
              setFormData((prev) => ({ ...prev, tenant: selected ? selected.value : "" }))
            }
            placeholder="Select Tenant"
            isClearable
          />
        </CCol>
        <CCol xs={12}>
          <label>Property</label>
          <Select
            options={properties.map((p) => ({
              label: p.title || p.address,
              value: p._id,
            }))}
            value={properties.find((p) => p._id === formData.property) || null}
            onChange={(selected) =>
              setFormData((prev) => ({ ...prev, property: selected ? selected.value : "" }))
            }
            placeholder="Select Property"
            isClearable
          />
        </CCol>
        <CCol xs={6}>
          <CFormInput
            type="date"
            label="Lease Start Date"
            name="leaseStart"
            value={formData.leaseStart}
            onChange={handleInputChange}
            required
          />
        </CCol>
        <CCol xs={6}>
          <CFormInput
            type="date"
            label="Lease End Date"
            name="leaseEnd"
            value={formData.leaseEnd}
            onChange={handleInputChange}
            required
          />
        </CCol>
        <CCol xs={6}>
          <CFormInput
            type="number"
            label="Rent Amount"
            name="rentAmount"
            placeholder="Enter Rent Amount"
            value={formData.rentAmount}
            onChange={handleInputChange}
            required
          />
        </CCol>
        <CCol xs={6}>
          <CFormInput
            type="number"
            label="Security Deposit"
            name="securityDeposit"
            placeholder="Enter Security Deposit"
            value={formData.securityDeposit}
            onChange={handleInputChange}
            required
          />
        </CCol>
        <CCol xs={6}>
          <CFormInput
            type="text"
            label="Payment Due Date"
            placeholder="Enter Payment Due Date"
            value={formData.paymentTerms.dueDate}
            onChange={(e) => handlePaymentTermChange("dueDate", e.target.value)}
            required
          />
        </CCol>
        <CCol xs={6}>
          <CFormSelect
            label="Payment Method"
            value={formData.paymentTerms.paymentMethod}
            onChange={(e) => handlePaymentTermChange("paymentMethod", e.target.value)}
            required
          >
            <option value="">Select Payment Method</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Credit Card">Credit Card</option>
          </CFormSelect>
        </CCol>
        <CCol xs={12}>
          <CFormInput
            type="file"
            label="Upload Documents"
            multiple
            onChange={handleFileChange}
          />
          {fileErrors.length > 0 && (
            <CAlert color="danger">
              {fileErrors.map((error, idx) => (
                <div key={idx}>{error}</div>
              ))}
            </CAlert>
          )}
          <ul>
            {formData.documents.map((doc, idx) => (
              <li key={idx}>
                {doc.name || doc}
                <CButton
                  color="danger"
                  size="sm"
                  onClick={() => handleRemoveDocument(idx)}
                  className="ms-2"
                >
                  Remove
                </CButton>
              </li>
            ))}
          </ul>
        </CCol>
      </CRow>
      {isLoading && <CSpinner size="sm" className="mt-3" />}
      <CButton type="submit" color="primary" className="mt-3">
        Submit
      </CButton>
    </CForm>
  );
};

export default AgreementForm;
