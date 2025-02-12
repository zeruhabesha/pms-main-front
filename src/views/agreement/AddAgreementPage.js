import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AgreementForm from './AgreementForm';
import { fetchTenants } from '../../api/actions/TenantActions';
import { fetchProperties } from '../../api/actions/PropertyAction';
import { addAgreement } from '../../api/actions/AgreementActions';
import { clearError } from '../../api/slice/AgreementSlice';
import { toast } from 'react-toastify';
import { CAlert, CSpinner } from '@coreui/react';

const AddAgreementPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formError, setFormError] = useState(null);
    
    const { loading: isSubmitting, error: submitError } = useSelector(state => {
        console.log('Agreement State:', state.agreement); // Add this log
        return state.agreement;
    });
    
    const { tenants } = useSelector(state => state.tenant);
    const { properties } = useSelector(state => state.property);

    useEffect(() => {
        dispatch(fetchTenants());
        dispatch(fetchProperties());
        dispatch(clearError());
    }, [dispatch]);

    const handleSubmit = useCallback(async (formData) => {
        console.log('HandleSubmit called with formData:', formData);
        
        try {
            const resultAction = await dispatch(addAgreement(formData)).unwrap();
            console.log('Add agreement result:', resultAction);
            
            if (resultAction) {
                toast.success("Agreement added successfully!");
                navigate('/agreement');
            }
        } catch (error) {
            console.error('Error adding agreement:', error);
            setFormError(error.message || "Failed to add agreement unexpectedly.");
            toast.error(error.message || "Failed to add agreement unexpectedly.");
        }
    }, [dispatch, navigate]);

    return (
        <div className="p-4">
            <h2 className="mb-4">Add New Agreement</h2>
            {formError && (
                <CAlert color="danger" className="mb-4">
                    {formError}
                </CAlert>
            )}
            <AgreementForm
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                tenants={tenants}
                properties={properties}
                initialData={null}
            />
        </div>
    );
};

export default AddAgreementPage;