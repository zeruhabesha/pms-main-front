import React, { useEffect, useState, useCallback } from "react";
import Select from "react-select";
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
} from "@coreui/react";
import { useDispatch, useSelector } from "react-redux";
import { decryptData } from "../../api/utils/crypto";
import { useNavigate } from "react-router-dom";
import { filterProperties } from "../../api/actions/PropertyAction";
import { addMaintenance } from "../../api/actions/MaintenanceActions";

const TenantRequestForm = ({ onSubmit, editingRequest = null }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Redux state for properties and loading
    const properties = useSelector((state) => state.property.properties);
    const loading = useSelector((state) => state.property.loading);
    const error = useSelector((state) => state.property.error);
    const [isLoading, setIsLoading] = useState(false); // Add isLoading state
    const [noPropertiesMessage, setNoPropertiesMessage] = useState(null);

    // Initial form state with default values
    // const initialFormState = {
    //     tenant: "",
    //     property: "",
    //     typeOfRequest: "",
    //     description: "",
    //     urgencyLevel: "",
    //     preferredAccessTimes: "",
    //     status: "Pending",
    //     approvalStatus: "Pending",
    //     notes: "",
    //     requestedFiles: [],
    //     requestDate: new Date(),
    // };
    const [formData, setFormData] = useState({
        tenant: "",
        property: "",
        typeOfRequest: "",
        description: "",
        urgencyLevel: "",
        preferredAccessTimes: "",
        status: "Pending",
        approvalStatus: "Pending",
        notes: "",
        requestedFiles: [],
        requestDate: new Date(),
    });
    // const [formData, setFormData] = useState(initialFormState);
    const [localError, setError] = useState(null); // Separate local error state
    useEffect(() => {
        const fetchProperties = async () => {
          dispatch(filterProperties());
        };
    
        fetchProperties();
      }, [dispatch]);
    // Fetch properties with Redux
    const fetchProperties = useCallback(() => {
        dispatch(filterProperties());
    }, [dispatch]);

    useEffect(() => {
        if (properties.length === 0 && !loading && !error) {
            setNoPropertiesMessage('No properties available for this tenant.');
        } else {
            setNoPropertiesMessage(null);
        }
    }, [properties, loading, error]);

    // Initialize form data on component mount or when editing
    useEffect(() => {
        const initializeForm = () => {
          const encryptedUser = localStorage.getItem("user");
          const decryptedUser = decryptData(encryptedUser);
          const tenantId = decryptedUser?._id || "";
    
          if (editingRequest) {
            setFormData({
              ...formData,
              ...editingRequest,
              tenant: tenantId,
            });
          } else {
            setFormData((prev) => ({
              ...prev,
              tenant: tenantId,
            }));
          }
        };
    
        initializeForm();
      }, [editingRequest]);

    // Form change handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setLocalError(null);
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

    const handlePropertySelectChange = (selectedOption) => {
        setFormData((prev) => ({
          ...prev,
          property: selectedOption ? selectedOption.value : "",
        }));
      };
    
    
    

    const getPropertyOptions = () =>
        properties.map((property) => ({
          value: property._id,
          label: property.title || "Unnamed Property",
        }));

        const handleFileChange = (e) => {
            const files = Array.from(e.target.files);
            setFormData((prev) => ({ ...prev, requestedFiles: files }));
          };


    // Form validation
    const validateForm = () => {
        if (!formData.property) return "Please select a property.";
        if (!formData.typeOfRequest) return "Please select a type of request.";
        if (!formData.description) return "Please provide a description.";
        return null;
      };
    


    // Submit handler with comprehensive error management
    const handleSubmit = async () => {
        setError(null); // Reset error before validation
        const validationError = validateForm();
        if (validationError) {
            setError(validationError); // Use setError instead of setLocalError
            return;
        }
    
        try {
            const submissionData = new FormData();
            Object.keys(formData).forEach((key) => {
                if (key === "requestedFiles") {
                    formData.requestedFiles.forEach((file) => {
                        submissionData.append(key, file);
                    });
                } else {
                    submissionData.append(key, formData[key]);
                }
            });
    
            await dispatch(addMaintenance(submissionData));
            navigate("/maintenance");
        } catch (error) {
            setError("Failed to submit maintenance request."); // Use setError instead of setLocalError
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
                        {editingRequest ? "Edit Request" : "New Request"}
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
                            <CCol xs={12}>
                <CFormLabel htmlFor="property">Property</CFormLabel>
                <Select
                  id="property"
                  value={getPropertyOptions().find(
                    (option) => option.value === formData.property
                  )}
                  onChange={handlePropertySelectChange}
                  options={getPropertyOptions()}
                  isDisabled={loading}
                  isLoading={loading}
                  placeholder="Select a property"
                />
              </CCol>
                            {/* <CCol xs={12} md={6} className="form-group">
                                <CFormLabel htmlFor="unit">Unit Number</CFormLabel>
                                <CFormInput
                                    id="unit"
                                    type="text"
                                    placeholder="Enter unit number"
                                    value={formData.propertyInformation.unit}
                                    onChange={(e) =>
                                        handleNestedChange('propertyInformation', 'unit', e.target.value)
                                    }
                                    className="form-control-animation"
                                />
                            </CCol> */}
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
              <CButton color="secondary" onClick={() => navigate("/maintenance")}>
                Cancel
              </CButton>
              <CButton color="primary" onClick={handleSubmit}>
                Submit
              </CButton>
            </div>
                    </CCardBody>
                </CCard>
            </div>
        </div>
    );
};

export default TenantRequestForm;