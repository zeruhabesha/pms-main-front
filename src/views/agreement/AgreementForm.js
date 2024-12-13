import React, { useEffect, useMemo, useState } from "react";
import { CForm, CRow, CCol, CButton, CSpinner, CAlert, CFormInput, CFormTextarea } from "@coreui/react";
import { useDispatch, useSelector } from "react-redux";

import { fetchTenants } from "../../api/actions/TenantActions";
import { fetchProperties } from "../../api/actions/PropertyAction";

import TenantPropertySelect from "./TenantPropertySelect";
import DocumentUpload from "./DocumentUpload";

const AgreementForm = ({ onSubmit, isSubmitting = false, initialData = null }) => {
  const dispatch = useDispatch();

  const { tenants = [], loading: loadingTenants = false, error: tenantsError = null } =
    useSelector((state) => state.tenants || {});

  const { properties = [], loading: loadingProperties = false, error: propertiesError = null } =
    useSelector((state) => state.properties || {});

  const tenantOptions = useMemo(
    () =>
      tenants.map((t) => ({
        label: t.tenantName || t.name || "Unnamed Tenant",
        value: t._id || t.id,
      })),
    [tenants]
  );

  const propertyOptions = useMemo(
    () =>
      properties.map((p) => ({
        label: p.title || p.address || "Unnamed Property",
        value: p._id || p.id,
      })),
    [properties]
  );

  const [formData, setFormData] = useState({
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
  });

  useEffect(() => {
    if (tenants.length === 0) dispatch(fetchTenants());
    if (properties.length === 0) dispatch(fetchProperties());
  }, [dispatch, tenants.length, properties.length]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        tenant: initialData.tenant?._id || initialData.tenant || "", // Ensure it's a string ID
        property: initialData.property?._id || initialData.property || "", // Ensure it's a string ID
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <CForm onSubmit={handleSubmit}>
      <CRow>
        {(tenantsError || propertiesError) && (
          <CAlert color="danger">
            {tenantsError || propertiesError}
          </CAlert>
        )}

        {loadingTenants || loadingProperties ? (
          <div className="text-center">
            <CSpinner color="primary" />
            <p>Loading tenants and properties...</p>
          </div>
        ) : (
          <>
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
              {formData.additionalOccupants.map((occupant, index) => (
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
            />

            <CCol xs={12} className="text-center">
              <CButton type="submit" color="primary" className="mt-3" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Agreement"}
              </CButton>
            </CCol>
          </>
        )}
      </CRow>
    </CForm>
  );
};

export default AgreementForm;
