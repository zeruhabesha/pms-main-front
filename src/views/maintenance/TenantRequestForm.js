/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import {
  CFormInput,
  CFormLabel,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CAlert,
  CButton,
  CFormSelect,
} from '@coreui/react';
import { useDispatch } from 'react-redux';
import { decryptData } from '../../api/utils/crypto';
import { useNavigate, useParams } from 'react-router-dom';
import { addMaintenance, fetchMaintenanceById } from '../../api/actions/MaintenanceActions';
import PropertySelect from './PropertySelect'; // Import PropertySelect

const TenantRequestForm = ({ onSubmit, editingRequest = null }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [noPropertiesMessage, setNoPropertiesMessage] = useState(null);
    const [formData, setFormData] = useState({
        tenant: '', // Default to an empty string
        property: '',
        typeOfRequest: '',
        description: '',
        urgencyLevel: '',
        preferredAccessTimes: '',
        notes: '',
        requestedFiles: [],
        requestDate: new Date(),
    });    
    
    const [localError, setError] = useState(null); // Separate local error state
    const [fetchError, setFetchError] = useState(null);
      const [isEditing, setIsEditing] = useState(false);


      useEffect(() => {
        const initializeForm = async () => {
            setIsLoading(true);
            setFetchError(null); // Reset any previous fetch errors
            try {
                const encryptedUser = localStorage.getItem('user');
                if (!encryptedUser) {
                    setError('User not found. Please log in again.');
                    setIsLoading(false);
                    return;
                }
                const decryptedUser = decryptData(encryptedUser);
                console.log('Decrypted User:', decryptedUser);
                const tenantId = decryptedUser?._id || ''; // Ensure tenantId is extracted safely
        
                let initialFormData = {
                    ...formData,
                    tenant: tenantId,
                    requestDate: new Date(),
                };
        
                if (id) {
                    setIsEditing(true);
                    // Fetch the maintenance request data for editing
                    const result = await dispatch(fetchMaintenanceById(id)).unwrap();
                    if (result) {
                        initialFormData = {
                            ...result,
                            tenant: tenantId,
                            requestDate: result.requestDate
                                ? new Date(result.requestDate)
                                : new Date(),
                        };
                    } else {
                        setFetchError('Failed to fetch maintenance details for editing. Please try again.');
                    }
                }
        
                setFormData(initialFormData);
            } catch (err) {
                console.error('Fetch error:', err);
                setError(err?.message || 'Failed to initialize form data. Please try again.');
            } finally {
                setIsLoading(false);
            }
        
        };
    
        initializeForm();
    }, [dispatch, id]);
    


    // Form change handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError(null);
    };

    useEffect(() => {
        console.log('formData after change:', formData);
    }, [formData]);


    const handlePropertyChange = (e) => {
        setFormData((prev) => ({ ...prev, property: e.target.value }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData((prev) => ({ ...prev, requestedFiles: files }));
    };
    const validateFormData = (data) => {
        if (!data.property) return 'Property is required';
        if (!data.typeOfRequest) return 'Type of request is required';
        if (!data.description) return 'Description is required';
        if (!data.urgencyLevel) return 'Urgency level is required';
    
        // Validate files
        if (data.requestedFiles.length > 0) {
            const maxFileSize = 5 * 1024 * 1024; // 5MB
            for (const file of data.requestedFiles) {
                if (file.size > maxFileSize) {
                    return `File ${file.name} is too large. Maximum size is 5MB.`;
                }
            }
        }
    
        return null;
    };
    

    // Form validation
    const validateForm = () => {
        // Basic required field validation
        const requiredFields = {
            property: 'Property',
            typeOfRequest: 'Type of Request',
            description: 'Description',
            urgencyLevel: 'Urgency Level'
        };

        for (const [field, label] of Object.entries(requiredFields)) {
            if (!formData[field] || formData[field].trim() === '') {
                return `${label} is required`;
            }
        }

        // File validation
        if (formData.requestedFiles.length > 0) {
            const maxFileSize = 5 * 1024 * 1024; // 5MB
            for (const file of formData.requestedFiles) {
                if (file.size > maxFileSize) {
                    return `File ${file.name} is too large. Maximum size is 5MB`;
                }
            }
        }

        return null;
    };

    const createFormDataWithLogs = (formData) => {
        const submissionData = new FormData();
        
        // Log the input data
        console.log('Creating FormData with:', {
            ...formData,
            requestedFiles: formData.requestedFiles ? `${formData.requestedFiles.length} files` : 'no files'
        });

        try {
            // Add required fields
            submissionData.append('tenant', formData.tenant || '');
            submissionData.append('property', formData.property || '');
            submissionData.append('typeOfRequest', formData.typeOfRequest || '');
            submissionData.append('description', formData.description || '');
            submissionData.append('urgencyLevel', formData.urgencyLevel || '');

            // Add optional fields
            if (formData.preferredAccessTimes) {
                submissionData.append('preferredAccessTimes', formData.preferredAccessTimes);
            }
            if (formData.notes) {
                submissionData.append('notes', formData.notes);
            }

            // Handle files
            if (formData.requestedFiles && formData.requestedFiles.length > 0) {
                Array.from(formData.requestedFiles).forEach((file, index) => {
                    submissionData.append(`requestedFiles`, file);
                    console.log(`Appending file ${index}:`, file.name);
                });
            }

            // Log the final FormData entries
            console.log('FormData entries:');
            for (let pair of submissionData.entries()) {
                console.log(pair[0], pair[1] instanceof File ? pair[1].name : pair[1]);
            }

            return submissionData;
        } catch (error) {
            console.error('Error creating FormData:', error);
            throw new Error(`Failed to prepare form data: ${error.message}`);
        }
    };


     const handleSubmit = async (e) => {
        e?.preventDefault();
        
        try {
            setIsLoading(true);
            setError(null);

            // Validate form data
            const validationError = validateFormData(formData);
            if (validationError) {
                setError(validationError);
                return;
            }

            console.log('Starting submission with form data:', formData);

            // Create and validate FormData
            const submissionData = createFormDataWithLogs(formData);

            // Dispatch the action
            console.log('Dispatching addMaintenance action...');
            const result = await dispatch(addMaintenance(submissionData)).unwrap();

            console.log('Submission result:', result);

            // Handle successful submission
            if (result) {
                console.log('Maintenance request created successfully');
                navigate('/maintenance');
            } else {
                throw new Error('No response data received');
            }

        } catch (error) {
            console.error('Submission error details:', error);
            
            let errorMessage = 'Failed to create maintenance request: ';
            
            if (error.response) {
                // Server responded with an error
                errorMessage += error.response.data?.message || error.response.statusText;
                console.error('Server error:', error.response.data);
            } else if (error.request) {
                // Request was made but no response received
                errorMessage += 'No response from server';
                console.error('Network error:', error.request);
            } else {
                // Error in request setup
                errorMessage += error.message || 'Unknown error occurred';
                console.error('Request setup error:', error);
            }

            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };



  const handleClose = () => {
    navigate('/maintenance');
  };

    return (
        <div className="maintenance-form">
        <CCard className="border-0 shadow-sm">
            <CCardBody>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="text-center mb-4">
                            {isEditing ? 'Edit Request' : 'New Request'}
                        </div>
                          {fetchError && (
                            <CAlert color="danger" className="mb-3">
                                 {fetchError}
                            </CAlert>
                         )}
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
    value={formData.tenant || ''} // Fallback to an empty string if tenant is undefined
    readOnly
    className="form-control-animation"
/>

                            </CCol>
                            <CCol xs={12}>
                                <CFormLabel htmlFor="property">Property</CFormLabel>
                                <PropertySelect
                                    value={formData.property}
                                    onChange={handlePropertyChange}
                                    required
                                    name="property"
                                    label="Select a property"
                                />
                            </CCol>
                            <CCol xs={12}>
                                <CFormLabel htmlFor="typeOfRequest">Type of Request</CFormLabel>
                                <CFormSelect
                                    id="typeOfRequest"
                                    name="typeOfRequest"
                                    value={formData.typeOfRequest}
                                    onChange={handleChange}
                                >
                                    <option value="">Select a request type</option>
                                    <option value="Plumbing">Plumbing</option>
                                    <option value="Electrical">Electrical</option>
                                    <option value="HVAC">HVAC</option>
                                    <option value="Other">Other</option>
                                </CFormSelect>
                            </CCol>
                            <CCol xs={12} className="form-group">
                                <CFormLabel htmlFor="urgencyLevel">Urgency Level</CFormLabel>
                                <CFormSelect
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
                            <CCol xs={12}>
                                <CFormLabel htmlFor="description">Description</CFormLabel>
                                <CFormInput
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Enter description"
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
                            <CCol xs={12}>
                                <CFormLabel htmlFor="requestedFiles">Upload Files</CFormLabel>
                                <CFormInput
                                    id="requestedFiles"
                                    name="requestedFiles"
                                    type="file"
                                    multiple
                                    onChange={handleFileChange}
                                />
                            </CCol>
                        </CRow>
                        <div className="mt-4 d-flex justify-content-end gap-2">
                            <CButton
                                color="primary"
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="position-relative"
                            >
                                {isLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Submitting...
                                    </>
                                ) : (
                                        'Submit'
                                    )}
                            </CButton>
                        </div>
                        </form>
                </CCardBody>
            </CCard>
        </div>
    );
};

export default TenantRequestForm;