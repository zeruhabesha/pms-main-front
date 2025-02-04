/* eslint-disable react/prop-types */
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { CFormSelect, CSpinner } from '@coreui/react'
import { fetchProperties } from '../../api/actions/PropertyAction'

const PropertySelect = ({ value, onChange, required }) => {
  const dispatch = useDispatch()
  const { properties, loading, error } = useSelector((state) => state.property)

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
    <CFormSelect name="property" value={value} onChange={onChange} required={required}>
      <option value="" disabled>
        Select Property
      </option>
      {properties?.map((property) => (
        <option key={property.id} value={property.id}>
          {property.title}
        </option>
      ))}
    </CFormSelect>
  )
}

export default PropertySelect
