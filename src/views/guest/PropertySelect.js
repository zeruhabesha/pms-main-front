/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { CFormSelect, CSpinner } from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { getLeasedPropertiesForTenant } from '../../api/actions/PropertyAction'
import { decryptData } from '../../api/utils/crypto'

const PropertySelect = ({ value, onChange, required, name, label }) => {
  const dispatch = useDispatch()
  const [tenantId, setTenantId] = useState(null); // State for tenant ID
  const { properties: leasedProperties = [], loading, error } = useSelector((state) => state.property) // Make sure it's leasedProperties and default to empty array

  useEffect(() => {
    const fetchTenantId = async () => {
      try {
        const encryptedUser = localStorage.getItem('user');
        if (!encryptedUser) {
          console.warn('No user found in local storage');
          return;
        }

        const decryptedUser = decryptData(encryptedUser);
        const user = typeof decryptedUser === 'string' ? JSON.parse(decryptedUser) : decryptedUser;

        if (user && user._id) {
          setTenantId(user._id);
        } else {
          console.warn('User data or _id not found in local storage');
        }
      } catch (error) {
        console.error('Error fetching or parsing user data:', error);
      }
    };

    fetchTenantId();
  }, []);

  useEffect(() => {
    if (tenantId) {
      dispatch(getLeasedPropertiesForTenant(tenantId));
    }
  }, [dispatch, tenantId]);

  if (!tenantId) {
    return <p>Loading tenant information...</p>; // Or a spinner
  }

  if (loading) {
    return <CSpinner size="sm" />
  }

  if (error) {
    return <p className="text-danger">Failed to load properties: {error}</p>
  }

  return (
    <CFormSelect
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      aria-label={label}
    >
      <option value="">Select a Property</option>
      {leasedProperties?.map((property) => (
        <option key={property.id} value={property.id}>
          {property.title} - {property.address}
        </option>
      ))}
    </CFormSelect>
  )
}

export default React.memo(PropertySelect)