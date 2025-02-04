import React from "react";
import PropTypes from "prop-types";
import { CCol, CFormSelect } from "@coreui/react";

const TenantPropertySelect = ({
  tenantOptions,
  propertyOptions,
  formData,
  setFormData,
}) => {
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
            <option key={tenant._id} value={tenant._id}>
              {tenant.tenantName}
            </option>
          ))}
        </CFormSelect>
      </CCol>

    </>
  );
};

TenantPropertySelect.propTypes = {
  tenantOptions: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      tenantName: PropTypes.string.isRequired,
    })
  ).isRequired,
    propertyOptions: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      })
    ).isRequired,
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
};

export default TenantPropertySelect;