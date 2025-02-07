import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AgreementForm from './AgreementForm';
import { fetchTenants,  } from '../../api/actions/TenantActions';
import { fetchProperties } from '../../api/actions/PropertyAction';
import { addAgreement } from '../../api/actions/AgreementActions';
import { clearError } from '../../api/slice/AgreementSlice';
import { toast } from 'react-toastify';
import { CAlert, CSpinner } from '@coreui/react';

const AddAgreementPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formError, setFormError] = useState(null);
    const { loading: isSubmitting, error: submitError } = useSelector(state => state.agreement);
    const { tenants, loading: tenantsLoading, error: tenantsError } = useSelector(state => state.tenant);
    const { properties, loading: propertiesLoading, error: propertiesError } = useSelector(state => state.property);

    // const loading = tenantsLoading || propertiesLoading || isSubmitting;

    useEffect(() => {
        dispatch(fetchTenants());
        dispatch(fetchProperties());
        dispatch(clearError());
    }, [dispatch]);

    useEffect(() => {
        if (submitError) {
            setFormError(submitError);
            toast.error(submitError || "Failed to add agreement unexpectedly.");
            dispatch(clearError());
        }
    }, [submitError, dispatch]);

    const handleSubmit = async (formData) => {
        try {
            const resultAction = await dispatch(addAgreement(formData));
            if (addAgreement.fulfilled.match(resultAction)) {
                toast.success("Agreement added successfully!");
                navigate('/agreement');
            }
        } catch (error) {
            setFormError(error.message || "Failed to add agreement unexpectedly.");
        }
    };

    // if (loading) {
    //     return <div className="text-center"><CSpinner color="primary" variant="grow" size="sm" /><p>Loading data...</p></div>;
    // }

    if (tenantsError || propertiesError) {
        const displayError = tenantsError || propertiesError || "Failed to load initial data.";
        return <CAlert color="danger">{displayError}</CAlert>;
    }

    return (
        <div>
            <h2>Add New Agreement</h2>
            {formError && <CAlert color="danger">{formError}</CAlert>}
            {/* Ensure initialData prop is NOT being passed or is explicitly null */}
            <AgreementForm
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                tenants={tenants}
                properties={properties}
                // DO NOT PASS initialData here for adding a new agreement
                // OR, if you are passing it conditionally, ensure it's null/undefined for "add" mode
                // initialData={null} or simply remove the prop if not needed
            />
        </div>
    );
};

export default AddAgreementPage;