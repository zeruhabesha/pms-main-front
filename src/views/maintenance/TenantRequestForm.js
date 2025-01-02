import React, { useEffect, useState, useCallback } from 'react';
import {
    CFormInput,
    CFormLabel,
    CRow,
    CCol,
    CCard,
    CCardBody,
    CSpinner,
    CAlert,
    CButton,
     CFormSelect // keep the import for the other selects
} from '@coreui/react';
import { useDispatch, useSelector } from 'react-redux';
import { decryptData } from '../../api/utils/crypto';
import { useNavigate } from 'react-router-dom';
import '../Super.scss';
import "./MaintenanceForm.scss";
import { filterProperties } from '../../api/actions/PropertyAction';
// import { filterProperties } from '../../api/actions/propertyAction';
import Select from 'react-select'; // Import react-select


const TenantRequestForm = ({
    onSubmit,
    editingRequest = null
}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Redux state for properties and loading
    const properties = useSelector((state) => state.property.properties);
    const isLoading = useSelector((state) => state.property.loading);
    const error = useSelector((state) => state.property.error)
    const [noPropertiesMessage, setNoPropertiesMessage] = useState(null);


    // Initial form state with default values
    const initialFormState = {
        tenant: '',
        propertyInformation: {
            propertyId: '',
            unit: ''
        },
        typeOfRequest: '',
        description: '',
        urgencyLevel: '',
        preferredAccessTimes: '',
        photosOrVideos: [],
        notes: '',
    };

    const [formData, setFormData] = useState(initialFormState);
    const [localError, setError] = useState(null); // Separate local error state

    // Fetch properties with Redux
    const fetchProperties = useCallback(() => {
        dispatch(filterProperties());
    }, [dispatch]);
    

     useEffect(() => {
        if(properties.length === 0 && !isLoading && !error){
             setNoPropertiesMessage('No properties available for this tenant.');
        } else {
            setNoPropertiesMessage(null);
        }
    }, [properties, isLoading, error]);


    // Initialize form data on component mount or when editing
     useEffect(() => {
        const initializeForm = () => {
            const encryptedUser = localStorage.getItem('user');
            const decryptedUser = decryptData(encryptedUser);
            const tenantId = decryptedUser?._id || '';

            if (editingRequest) {
                setFormData({
                    ...initialFormState,
                    ...editingRequest,
                    tenant: tenantId,
                });
            } else {
                setFormData({
                    ...initialFormState,
                    tenant: tenantId,
                });
            }
            fetchProperties();
        };
        initializeForm();

    }, [editingRequest, fetchProperties]);


    // Form change handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError(null);
    };

    const handleNestedChange = (parent, field, value) => {
        setFormData((prev) => ({
            ...prev,
            [parent]: {
                ...prev[parent],
                [field]: value
            }
        }));
       setError(null);
    };


    const handlePropertySelectChange = (selectedOption) => {
        handleNestedChange('propertyInformation', 'propertyId', selectedOption ? selectedOption.value : '');
    };

    const getPropertyOptions = () => {
        return properties.map(property => ({
            value: property._id,
            label: property.name || property.title, // Ensure property.name or property.title exists
        }));
    };
    


    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData((prev) => ({ ...prev, photosOrVideos: files }));
    };

    // Form validation
// Form validation
const validateForm = () => {
    const requiredFields = {
        tenant: 'Tenant',
        'propertyInformation.propertyId': 'Property', // Ensure this field is populated
        'propertyInformation.unit': 'Unit',
        typeOfRequest: 'Type of Request',
        description: 'Description',
        urgencyLevel: 'Urgency Level',
    };

    for (const [field, label] of Object.entries(requiredFields)) {
        let value;
        if (field.includes('.')) {
            // Handle nested fields
            const [parent, child] = field.split('.');
            value = formData[parent]?.[child];
        } else {
            value = formData[field];
        }

        if (!value || value === '') {
            return `${label} is required.`;
        }
    }
    return null;
};


    // Submit handler with comprehensive error management
    const handleSubmit = async () => {
        setError(null);
        const validationError = validateForm();
    
        if (validationError) {
            setError(validationError); // Display validation error
            return;
        }
    
        setIsLoading(true);
        try {
            const formDataToSubmit = new FormData();
    
            // Flatten the nested structure for FormData
            const flattenedData = {
                ...formData,
                propertyId: formData.propertyInformation.propertyId,
                unit: formData.propertyInformation.unit,
            };
    
            Object.entries(flattenedData).forEach(([key, value]) => {
                if (key === 'photosOrVideos' && value.length) {
                    value.forEach((file) => formDataToSubmit.append('photosOrVideos', file));
                } else if (key !== 'propertyInformation' && value != null && value !== '') {
                    formDataToSubmit.append(key, value);
                }
            });
    
            await onSubmit(formDataToSubmit);
            navigate('/maintenance');
        } catch (submitError) {
            console.error('Submission failed:', submitError);
            setError(submitError.message || 'Submission failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleClose = () => {
        navigate('/maintenance');
    };

    return (
        <div className="maintenance-form">
            <div className="d-flex justify-content-center">
                <CCard className="border-0 shadow-sm">
                    <CCardBody>
                         <div className="text-center mb-4">
                           <h2>{editingRequest ? 'Edit Tenant Request' : 'Add Tenant Request'}</h2>
                       </div>
                        {localError && (
                            <CAlert color="danger" className="mb-3">
                                {localError}
                            </CAlert>
                        )}
                        {noPropertiesMessage && (
                            <CAlert color="info" className="mb-3">
                                {noPropertiesMessage}
                            </CAlert>
                        )}

                        <CRow className="g-4">
                            <CCol xs={12} className="form-group">
                                <CFormLabel htmlFor="tenant">Tenant ID</CFormLabel>
                                <CFormInput
                                    id="tenant"
                                    name="tenant"
                                    type="text"
                                    value={formData.tenant}
                                    readOnly
                                    className="form-control-animation"
                                />
                            </CCol>
                            <CCol xs={12} md={6} className="form-group">
                              <CFormLabel htmlFor="propertyId">Property</CFormLabel>
                                {isLoading ? (
                                    <CSpinner size="sm" />
                                ) : (
                                    <Select
                                    id="propertyId"
                                    value={getPropertyOptions().find(option => option.value === formData.propertyInformation.propertyId) || null}
                                    onChange={handlePropertySelectChange}
                                    options={getPropertyOptions()}
                                    placeholder="Select Property"
                                    isDisabled={isLoading}
                                    isSearchable
                                />
                                )}
                             </CCol>
                            <CCol xs={12} md={6} className="form-group">
                                <CFormLabel htmlFor="unit">Unit Number</CFormLabel>
                                <CFormInput
                                    id="unit"
                                    type="text"
                                    placeholder="Enter unit number"
                                    value={formData.propertyInformation.unit}
                                    onChange={(e) => handleNestedChange('propertyInformation', 'unit', e.target.value)}
                                    className="form-control-animation"
                                />
                            </CCol>
                            <CCol xs={12} className="form-group">
                                <CFormLabel htmlFor="typeOfRequest">Type of Request</CFormLabel>
                                <CFormSelect // this is the correct CFormSelect
                                    id="typeOfRequest"
                                    name="typeOfRequest"
                                    value={formData.typeOfRequest}
                                    onChange={handleChange}
                                    required
                                    className="form-control-animation"
                                >
                                    <option value="">Select Request Type</option>
                                    <option value="Plumbing">Plumbing</option>
                                    <option value="Electrical">Electrical</option>
                                    <option value="HVAC">HVAC</option>
                                    <option value="Appliance Repair">Appliance Repair</option>
                                    <option value="Other">Other</option>
                                </CFormSelect>
                            </CCol>
                            <CCol xs={12} className="form-group">
                                <CFormLabel htmlFor="urgencyLevel">Urgency Level</CFormLabel>
                                <CFormSelect // this is the correct CFormSelect
                                    id="urgencyLevel"
                                    name="urgencyLevel"
                                    value={formData.urgencyLevel}
                                    onChange={handleChange}
                                    required
                                    className="form-control-animation"
                                >
                                    <option value="">Select Urgency Level</option>
                                    <option value="Urgent">Urgent</option>
                                    <option value="Routine">Routine</option>
                                    <option value="Non-Urgent">Non-Urgent</option>
                                </CFormSelect>
                            </CCol>
                            <CCol xs={12} className="form-group">
                                <CFormLabel htmlFor="description">Description</CFormLabel>
                                <CFormInput
                                    id="description"
                                    name="description"
                                    type="text"
                                    placeholder="Enter description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    className="form-control-animation"
                                />
                            </CCol>
                            <CCol xs={12} className="form-group">
                                <CFormLabel htmlFor="preferredAccessTimes">Preferred Access Times</CFormLabel>
                                <CFormInput
                                    id="preferredAccessTimes"
                                    name="preferredAccessTimes"
                                    type="text"
                                    placeholder="Enter preferred access times"
                                    value={formData.preferredAccessTimes}
                                    onChange={handleChange}
                                    className="form-control-animation"
                                />
                            </CCol>
                            <CCol xs={12} className="form-group">
                                <CFormLabel htmlFor="notes">Notes</CFormLabel>
                                <CFormInput
                                    id="notes"
                                    name="notes"
                                    type="text"
                                    placeholder="Enter additional notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    className="form-control-animation"
                                />
                            </CCol>
                            <CCol xs={12} className="form-group">
                                <CFormLabel htmlFor="photosOrVideos">Upload Photos/Videos</CFormLabel>
                                <CFormInput
                                    id="photosOrVideos"
                                    type="file"
                                    multiple
                                    onChange={handleFileChange}
                                    accept="image/*,video/*"
                                    className="form-control-animation"
                                />
                            </CCol>
                        </CRow>
                        <div className="d-flex justify-content-end mt-4 gap-2">
                            <CButton
                                color="secondary"
                                onClick={handleClose}
                                disabled={isLoading}
                            >
                                Cancel
                            </CButton>
                            <CButton
                                color="dark"
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="form-button"
                            >
                                {isLoading ? (
                                    <CSpinner size="sm" />
                                ) : (
                                    editingRequest ? 'Update Request' : 'Add Request'
                                )}
                            </CButton>
                        </div>
                    </CCardBody>
                </CCard>
            </div>
        </div>
    );
};

export default TenantRequestForm;