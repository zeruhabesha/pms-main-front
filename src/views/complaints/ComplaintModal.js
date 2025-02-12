import React, { useEffect, useState, useCallback } from "react";
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
    CFormSelect,
    CModal,
    CModalBody,
    CModalHeader,
    CModalTitle,
    CModalFooter,
} from "@coreui/react";
import { useDispatch, useSelector } from "react-redux";
import { decryptData } from "../../api/utils/crypto";
import { useNavigate } from "react-router-dom";
import { filterProperties } from "../../api/actions/PropertyAction"; // Import getPropertiesByUser
import { addComplaint, updateComplaint } from "../../api/actions/ComplaintAction";
import {
    cilUser,
    cilHome,
    cilList,
    cilInfo,
    cilDescription,
    cilPaperclip
} from '@coreui/icons';
import { CIcon } from '@coreui/icons-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Ensure styles are imported

const ComplaintModal = ({ visible, setVisible, editingComplaint = null }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const properties = useSelector((state) => state.property.properties);
    const propertyLoading = useSelector((state) => state.property.loading);
    const propertyError = useSelector((state) => state.property.error);
    const [isLoading, setIsLoading] = useState(false);
    const [noPropertiesMessage, setNoPropertiesMessage] = useState(null);
    const [tenantId, setTenantId] = useState(''); // State to hold tenant ID
    const [tenantProperties, setTenantProperties] = useState([]); // State for tenant properties

    const [formData, setFormData] = useState({
        tenant: "",
        property: "",
        complaintType: "Noise",
        description: "",
        status: "Pending",
        priority: "Low",
        supportingFiles: [],
        feedback: "",
    });
    const [localError, setError] = useState(null);

    useEffect(() => {
        const encryptedUser = localStorage.getItem("user");
        const decryptedUser = decryptData(encryptedUser);
        const currentTenantId = decryptedUser?._id || "";
        setTenantId(currentTenantId); // Set tenant ID in state
        setFormData(prevFormData => ({ ...prevFormData, tenant: currentTenantId })); // Set tenant ID in form data

        const fetchPropertiesForTenant = async () => {
            // if (currentTenantId) {
                dispatch(filterProperties())
                    .unwrap()
                    .then(response => {
                        setTenantProperties(response); // Set tenant properties
                    })
                    .catch(error => {
                        console.error("Error fetching properties for tenant:", error);
                        setNoPropertiesMessage('Failed to load properties.');
                    });
            // } else {
            //     setNoPropertiesMessage('Tenant ID not found.');
            // }
        };

        fetchPropertiesForTenant();
    }, [dispatch]);


    useEffect(() => {
        if (tenantProperties.length === 0 && !propertyLoading && !propertyError) {
            setNoPropertiesMessage('No properties available for this tenant.');
        } else {
            setNoPropertiesMessage(null);
        }
    }, [tenantProperties, propertyLoading, propertyError]);


    useEffect(() => {
        const initializeForm = () => {
            if (editingComplaint) {
                setFormData({
                    tenant: tenantId, // Use tenantId from state
                    property: editingComplaint?.property?.id || "",
                    complaintType: editingComplaint?.complaintType || "Noise",
                    description: editingComplaint?.description || "",
                    status: editingComplaint?.status || "Pending",
                    priority: editingComplaint?.priority || "Low",
                    supportingFiles: [],
                    feedback: editingComplaint?.feedback || "",
                });
            } else {
                setFormData({
                    tenant: tenantId, // Use tenantId from state
                    property: "",
                    complaintType: "Noise",
                    description: "",
                    status: "Pending",
                    priority: "Low",
                    supportingFiles: [],
                    feedback: "",
                });
            }
        };

        initializeForm();
    }, [editingComplaint, tenantId]); // Include tenantId in dependency array


     const handleChange = (e) => {
         const { name, value, type, files } = e.target;

          if (type === 'file') {
              if (files.length > 5) {
                  setError('You can only upload a maximum of 5 files.');
                  return;
              }
              setFormData((prev) => ({
                  ...prev,
                  supportingFiles: Array.from(files),
              }));
          } else {
              setFormData((prev) => ({ ...prev, [name]: value }));
          }
      };

    const handleNestedChange = (parent, field, value) => {
        setFormData((prev) => ({
            ...prev,
            [parent]: {
                ...prev[parent],
                [field]: value,
            },
        }));
        setError(null);
    };

    const handlePropertyChange = (e) => {
        const selectedPropertyId = e.target.value;
        setFormData((prev) => ({
            ...prev,
            property: selectedPropertyId, // Store only property ID
        }));
    };

    const validateForm = () => {
        if (!formData.property) return "Please select a property.";
        if (!formData.complaintType) return "Please select a complaint type.";
        if (!formData.description) return "Please provide a description.";
        return null;
    };


    const handleSubmit = async () => {
      setIsLoading(true); // Start loading
        try {
        const submissionData = new FormData();
        submissionData.append('tenant', formData.tenant);
        submissionData.append('property', formData.property);
        submissionData.append('complaintType', formData.complaintType);
        submissionData.append('description', formData.description);
        submissionData.append('priority', formData.priority);
        submissionData.append('status', formData.status);

        // Append files correctly
        if (formData.supportingFiles?.length > 0) {
          formData.supportingFiles.forEach((file, index) => {
            submissionData.append('supportingFiles', file);
          });
        }

        if (editingComplaint) {
          // Add _method parameter for PUT request
          submissionData.append('_method', 'PUT');

          // Sanity check:  Make sure editingComplaint has a valid _id.
          if (!editingComplaint._id) {
              console.error("Error: editingComplaint does not have a valid _id.");
              toast.error("Could not update complaint: Invalid complaint ID.");
              setIsLoading(false); // Stop loading even when error occurred
              return;
          }

          const response = await dispatch(
            updateComplaint({
              id: editingComplaint._id, // Use _id here.
              complaintData: submissionData // corrected this as well
            })
          ).unwrap();
          toast.success('Complaint updated successfully');
        } else {
          await dispatch(addComplaint(submissionData)).unwrap();
          toast.success('Complaint added successfully');
        }

        handleClose();
        } catch (error) {
        console.error('Submission Error:', error);
        toast.error(error.message || 'Failed to submit complaint');
        } finally {
          setIsLoading(false); // Stop loading
        }
        };


    const handleClose = () => {
        setFormData({
            tenant: "",
            property: "",
            complaintType: "Noise",
            description: "",
            status: "Pending",
            priority: "Low",
            supportingFiles: [],
            feedback: "",
        });
        setVisible(false);
        setError(null);
    };

    return (
        <CModal visible={visible} onClose={handleClose} alignment="center" backdrop="static" size="lg">
           <CModalHeader className="bg-dark text-white">
    <CModalTitle>{editingComplaint ? 'Edit Complaint' : 'Add Complaint'}</CModalTitle>
</CModalHeader>
            <CModalBody>
                <div className="maintenance-form">
                    <CCard className="border-0 shadow-sm">
                        <CCardBody>
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
                                    <CFormLabel htmlFor="tenant"><CIcon icon={cilUser} className="me-1" />Tenant ID</CFormLabel>
                                    <CFormInput
                                        id="tenant"
                                        name="tenant"
                                        type="text"
                                        value={formData.tenant}
                                        readOnly // Make Tenant ID read-only
                                        className="form-control-animation"
                                    />
                                </CCol>

 <CCol xs={12}>
     <CFormLabel htmlFor="property"><CIcon icon={cilHome} className="me-1"/>Property</CFormLabel>
    <CFormSelect
        value={formData.property}
        onChange={handlePropertyChange}
        required
    >
        <option value="">Select a property</option>
        {tenantProperties && tenantProperties.map((property) => (
            <option key={property.id} value={property.id}>
                {property.title}
            </option>
        ))}
    </CFormSelect>

</CCol>

                                <CCol xs={12}>
                                    <CFormLabel htmlFor="complaintType"><CIcon icon={cilList} className="me-1" />Type of Complaint</CFormLabel>
                                    <CFormSelect
                                        id="complaintType"
                                        name="complaintType"
                                        value={formData.complaintType}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select a complaint type</option>
                                        <option value="Noise">Noise</option>
                                        <option value="Property Damage">Property Damage</option>
                                        <option value="Maintenance">Maintenance</option>
                                        <option value="Harassment">Harassment</option>
                                        <option value="Other">Other</option>
                                    </CFormSelect>
                                </CCol>
                                <CCol xs={12} className="form-group">
                                    <CFormLabel htmlFor="priority"><CIcon icon={cilInfo} className="me-1" />Priority Level</CFormLabel>
                                    <CFormSelect
                                        id="priority"
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleChange}
                                        required
                                        className="form-control-animation"
                                    >
                                        <option value="">Select priority level</option>
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </CFormSelect>
                                </CCol>
                                <CCol xs={12}>
                                    <CFormLabel htmlFor="description"><CIcon icon={cilDescription} className="me-1" />Description</CFormLabel>
                                    <CFormInput
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Enter description"
                                    />
                                </CCol>
                                {/* <CCol xs={12} className="form-group">
                                    <CFormLabel htmlFor="feedback">Feedback</CFormLabel>
                                    <CFormInput
                                        id="feedback"
                                        name="feedback"
                                        type="text"
                                        placeholder="Enter feedback"
                                        value={formData.feedback}
                                        onChange={handleChange}
                                        className="form-control-animation"
                                    />
                                </CCol> */}
                                {/* <CCol xs={12}>
                                    <CFormLabel htmlFor="supportingFiles"><CIcon icon={cilPaperclip} className="me-1" />Upload Files</CFormLabel>
                                    <CFormInput
                                        id="supportingFiles"
                                        name="supportingFiles"
                                        type="file"
                                        multiple
                                        onChange={handleChange}
                                        accept="image/*,video/*"
                                    />
                                </CCol> */}
                            </CRow>
                        </CCardBody>
                    </CCard>
                </div>
            </CModalBody>
            <CModalFooter className="border-top-0">
                <CButton color="secondary" variant="ghost" onClick={handleClose} disabled={isLoading}>
                    Cancel
                </CButton>
                <CButton color="dark" onClick={handleSubmit} disabled={isLoading}>
    {isLoading ? (
        <>
            <CSpinner size="sm" className="me-2" />
            {editingComplaint ? 'Updating...' : 'Adding...'}
        </>
    ) : (
        editingComplaint ? 'Update Complaint' : 'Add Complaint'
    )}
</CButton>
            </CModalFooter>
        </CModal>
    );
};

export default ComplaintModal;