import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CFormSelect, CSpinner } from "@coreui/react";
import { filterProperties } from "../../api/actions/PropertyAction";

const PropertySelect = ({ value, onChange, required }) => {
  const dispatch = useDispatch();
  const { properties, loading, error } = useSelector((state) => state.property); // ✅ Fixes 'properties not defined'

  useEffect(() => {
    dispatch(filterProperties()); // ✅ Fetch properties
  }, [dispatch]);

  if (loading) {
    return <CSpinner size="sm" />;
  }

  if (error) {
    return <p className="text-danger">Failed to load properties: {error}</p>;
  }

  return (
    <CFormSelect name="property" value={value} onChange={onChange} required={required}>
      <option value="" disabled>
        Select Property
      </option>
      {properties.length > 0 ? (
        properties.map((property) => (
          <option key={property.id} value={property.id}>
            {property.title}
          </option>
        ))
      ) : (
        <option disabled>No properties available</option>
      )}
    </CFormSelect>
  );
};

export default PropertySelect;
