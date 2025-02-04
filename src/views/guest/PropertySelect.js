/* eslint-disable react/prop-types */
import React, { useEffect } from 'react'
import { CFormSelect, CSpinner } from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProperties } from '../../api/actions/PropertyAction'

const PropertySelect = ({ value, onChange, required, name, label }) => {
  const dispatch = useDispatch()
  const { properties = [], loading, error } = useSelector((state) => state.property)

  useEffect(() => {
    dispatch(fetchProperties())
  }, [dispatch])

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
      {properties?.map((property) => (
        <option key={property.id} value={property.id}>
          {property.title} - {property.address}
        </option>
      ))}
    </CFormSelect>
  )
}

export default React.memo(PropertySelect)