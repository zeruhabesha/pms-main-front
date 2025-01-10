// components/complaints/ComplaintModal.js
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
import { filterProperties } from "../../api/actions/PropertyAction";
import { addComplaint, updateComplaint } from "../../api/actions/ComplaintAction";
import PropertySelect from "./PropertySelect";

const ComplaintModal = ({ visible, setVisible, editingComplaint = null }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const properties = useSelector((state) => state.property.properties);
    const loading = useSelector((state) => state.property.loading);
    const error = useSelector((state) => state.property.error);
    const [isLoading, setIsLoading] = useState(false);
    const [noPropertiesMessage, setNoPropertiesMessage] = useState(null);
    
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
        const fetchProperties = async () => {
            dispatch(filterProperties());
        };
        
        fetchProperties();
    }, [dispatch]);


    useEffect(() => {
        if (properties.length === 0 && !loading && !error) {
            setNoPropertiesMessage('No properties available for this tenant.');
        } else {
            setNoPropertiesMessage(null);
        }
    }, [properties, loading, error]);


    useEffect(() => {
        const initializeForm = () => {
            const encryptedUser = localStorage.getItem("user");
            const decryptedUser = decryptData(encryptedUser);
            const tenantId = decryptedUser?._id || "";

            if (editingComplaint) {
                setFormData({
                    ...formData,
                    ...editingComplaint,
                    tenant: tenantId,
                    property: editingComplaint?.property?._id || ""
                });
            } else {
                setFormData((prev) => ({
                    ...prev,
                    tenant: tenantId,
                }));
            }
        };

        initializeForm();
    }, [editingComplaint]);


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
        setFormData((prev) => ({
            ...prev,
            property: e.target.value
        }));
    };

    const validateForm = () => {
        if (!formData.property) return "Please select a property.";
        if (!formData.complaintType) return "Please select a complaint type.";
        if (!formData.description) return "Please provide a description.";
        return null;
    };

    const handleSubmit = async () => {
        setError(null);
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setIsLoading(true);
            const submissionData = new FormData();
            Object.keys(formData).forEach((key) => {
                if (key === "supportingFiles") {
                    formData.supportingFiles.forEach((file) => {
                        submissionData.append(key, file);
                    });
                } else {
                    submissionData.append(key, formData[key]);
                }
            });
            if (editingComplaint && editingComplaint._id) {
                await dispatch(updateComplaint({ id: editingComplaint._id, complaintData: submissionData })).unwrap();
            } else {
                await dispatch(addComplaint(submissionData)).unwrap();
            }
            handleClose();
        } catch (error) {
            setError("Failed to submit complaint.");
        }
         finally {
             setIsLoading(false);
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
                                  />
                                </CCol>

                                <CCol xs={12}>
                                    <CFormLabel htmlFor="complaintType">Type of Complaint</CFormLabel>
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
                                    <CFormLabel htmlFor="priority">Priority Level</CFormLabel>
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
                                </CCol>
                                <CCol xs={12}>
                                    <CFormLabel htmlFor="supportingFiles">Upload Files</CFormLabel>
                                    <CFormInput
                                        id="supportingFiles"
                                        name="supportingFiles"
                                        type="file"
                                        multiple
                                        onChange={handleChange}
                                        accept="image/*,video/*"
                                    />
                                </CCol>
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