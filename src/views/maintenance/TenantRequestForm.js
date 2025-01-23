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
        tenant: '',
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
                if(!encryptedUser) {
                     setError('User not found, please login again');
                     return;
                }
            const decryptedUser = decryptData(encryptedUser);
             const tenantId = decryptedUser?._id || '';
              let initialFormData = {
                    ...formData,
                    tenant: tenantId,
                   requestDate: new Date(),
                };
              if (id) {
                  setIsEditing(true)
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
                   }else {
                          setFetchError('Failed to fetch maintenance details for editing. Please try again.');
                   }
                 }
              setFormData(initialFormData);
           } catch (err) {
             console.error('Fetch error:', err);
              setError(err?.message || "Failed to initialize form data, try again");
          }finally {
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

    const handleSubmit = async () => {
        try {
           setIsLoading(true);
           setError(null);
            // Validation
           const validationError = validateForm();
           if (validationError) {
              setError(validationError);
              return;
           }
        // Create FormData
            const submissionData = new FormData();
            for (const key in formData) {
                if (formData.hasOwnProperty(key)) {
                    if (key === 'requestedFiles') {
                        // Handle multiple files
                        const files = formData[key];
                        if (files && files.length > 0) {
                           for (let i = 0; i < files.length; i++) {
                               submissionData.append('requestedFiles', files[i]);
                           }
                      }
                   } else if (key === 'requestDate') {
                       submissionData.append(key, formData[key].toISOString());
                    }
                   else if (formData[key] != null && formData[key] !== '') {
                        // Handle all other fields
                        submissionData.append(key, formData[key]);
                   }
                }
            }

            // Dispatch action
            const result = await dispatch(addMaintenance(submissionData)).unwrap();

            if (result) {
              console.log('Maintenance request submitted successfully');
              navigate('/maintenance');
          }

        } catch (error) {
          console.error('Submit error:', error);
            setError(typeof error === 'string' ? error : 'Failed to submit maintenance request. Please try again.');
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
                                    value={formData.tenant}
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
                    </CCardBody>
                </CCard>
            </div>
        </div>
    );
};

export default TenantRequestForm;