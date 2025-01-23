import React from "react";
import PropTypes from "prop-types";
import { CCol, CFormSelect } from "@coreui/react";

const TenantPropertySelect = ({ tenantOptions, propertyOptions, formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <CCol xs={12} md={6} className="form-group">
        <CFormSelect
          name="tenant"
          value={formData.tenant}
          onChange={handleChange}
          required
          label="Tenant"
          className="form-control-animation"
        >
          <option value="">Select Tenant</option>
          {tenantOptions.map((tenant) => (
            <option key={tenant.value} value={tenant.value}>
              {tenant.label}
            </option>
          ))}
        </CFormSelect>
      </CCol>
      <CCol xs={12} md={6} className="form-group">
        <CFormSelect
          name="property"
          value={formData.property}
          onChange={handleChange}
          required
          label="Property"
          className="form-control-animation"
        >
          <option value="">Select Property</option>
          {propertyOptions.map((property) => (
            <option key={property.value} value={property.value}>
              {property.label}
            </option>
          ))}
        </CFormSelect>
      </CCol>
    </>
  );
};

TenantPropertySelect.propTypes = {
  tenantOptions: PropTypes.array.isRequired,
  propertyOptions: PropTypes.array.isRequired,
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
};

export default TenantPropertySelect;