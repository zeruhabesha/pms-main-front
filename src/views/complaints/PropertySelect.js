import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProperties } from '../../api/slice/PropertySlice';
import { CFormSelect, CSpinner } from '@coreui/react';

const PropertySelect = ({ value, onChange, required }) => {
    const dispatch = useDispatch();
    const { properties, loading, error } = useSelector((state) => state.property);

    useEffect(() => {
        dispatch(fetchProperties());
    }, [dispatch]);

    if (loading) {
        return <CSpinner size="sm" />;
    }

    if (error) {
        return <p className="text-danger">Failed to load properties: {error}</p>;
    }

    return (
        <CFormSelect
            name="property"
            value={value}
            onChange={onChange}
            required={required}
        >
            <option value="" disabled>
                Select Property
            </option>
            {properties?.map((property) => (
                <option key={property._id} value={property._id}>
                    {property.title}
                </option>
            ))}
        </CFormSelect>
    );
};

export default PropertySelect;