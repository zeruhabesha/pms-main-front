// Hypothetical TenantSelect Component
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTenants } from '../../api/actions/TenantAction'; // Hypothetical Action

const TenantSelect = ({ value, onChange, required }) => {
    const dispatch = useDispatch();
    const { tenants, loading, error } = useSelector((state) => state.tenant); // Hypothetical Slice

    useEffect(() => {
        dispatch(getTenants()); // Dispatch hypothetical action to fetch tenants
    }, [dispatch]);

    console.log("TenantSelect: tenants:", tenants); // Add console log
    console.log("TenantSelect: loading:", loading);   // Add console log
    console.log("TenantSelect: error:", error);     // Add console log

    if (loading) {
        return <p>Loading tenants...</p>;
    }

    if (error) {
        return <p>Error loading tenants: {error}</p>;
    }

    return (
        <select value={value} onChange={onChange} required={required}>
            <option value="" disabled>Select Tenant</option>
            {tenants && tenants.map(tenant => (  // Check if tenants is truthy
                <option key={tenant._id} value={tenant._id}>{tenant.name}</option>
            ))}
        </select>
    );
};