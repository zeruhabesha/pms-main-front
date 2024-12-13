import React from "react";
import { CCol } from "@coreui/react";
import Select from "react-select";
import PropTypes from "prop-types";

const TenantPropertySelect = ({ tenantOptions, propertyOptions, formData, setFormData }) => {
  return (
    <>
      <CCol xs={12}>
        <label>Tenant</label>
        <Select
          options={tenantOptions}
          value={tenantOptions.find((t) => t.value === formData.tenant) || null}
          onChange={(selected) =>
            setFormData((prev) => ({
              ...prev,
              tenant: selected ? selected.value : "", // Ensure a string is stored
            }))
          }
          placeholder="Select Tenant"
          isClearable
        />
      </CCol>
      <CCol xs={12}>
        <label>Property</label>
        <Select
          options={propertyOptions}
          value={propertyOptions.find((p) => p.value === formData.property) || null}
          onChange={(selected) =>
            setFormData((prev) => ({
              ...prev,
              property: selected ? selected.value : "", // Ensure a string is stored
            }))
          }
          placeholder="Select Property"
          isClearable
        />
      </CCol>
    </>
  );
};

TenantPropertySelect.propTypes = {
  tenantOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  propertyOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  formData: PropTypes.shape({
    tenant: PropTypes.string.isRequired,
    property: PropTypes.string.isRequired,
  }).isRequired,
  setFormData: PropTypes.func.isRequired,
};

export default TenantPropertySelect;
