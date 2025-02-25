import React, { useEffect, useState } from "react";
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
    CModal,
    CModalBody,
    CModalHeader,
    CModalTitle,
    CModalFooter,
    CForm,
    CFormSelect,
    CFormTextarea,
} from "@coreui/react";
import { useDispatch, useSelector } from "react-redux";
import { decryptData } from "../../api/utils/crypto";
import { addClearance } from "../../api/actions/ClearanceAction";
import PropertySelect from "../guest/PropertySelect"; // Ensure this component is properly imported
import { reset } from "../../api/slice/clearanceSlice";
import { toast } from "react-toastify";
import { cilUser, cilHome, cilInfo, cilDescription, cilCalendar } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { filterProperties, getLeasedPropertiesForTenant } from "../../api/actions/PropertyAction"; // Import the new action

const AddClearance = ({ visible, setVisible, selectedClearance }) => {
    const dispatch = useDispatch();
    const { isLoading } = useSelector((state) => state.clearance);
    const { properties, loading: propertyLoading, error: propertyError } = useSelector((state) => state.property);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        tenant: "",
        property: "",
        moveOutDate: "",
        inspectionDate: "",
        reason: "",
        notes: "",
    });
    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState(null);
    const [isTenantUser, setIsTenantUser] = useState(false);
    const { tenants } = useSelector((state) => state.tenant);
    // const { properties } = useSelector((state) => state.property);

    useEffect(() => {
      const fetchUserAndProperties = async () => {
        const encryptedUser = localStorage.getItem("user");
        if (encryptedUser) {
          try {
            const decryptedUser = decryptData(encryptedUser);
            if (decryptedUser && decryptedUser._id) {
              const userId = decryptedUser._id;
              setUserId(String(decryptedUser._id));
              setUserName(decryptedUser.name);
              setIsTenantUser(decryptedUser.role === "Tenant");

              // If user is tenant, set the tenant field to their ID
              setFormData((prev) => ({
                ...prev,
                tenant:
                  decryptedUser.role === "Tenant"
                    ? decryptedUser._id
                    : prev.tenant,
              }));

              // Dispatch the action to fetch leased properties
              await dispatch(getLeasedPropertiesForTenant(userId));
            }
          } catch (error) {
            console.error("Decryption error:", error);
            setError("Error decoding user data");
          }
        }
      };

      fetchUserAndProperties();
    }, [dispatch]);

    useEffect(() => {
        if (selectedClearance) {
            setFormData({
                tenant: selectedClearance.tenant || "",
                property: selectedClearance.property || "",
                moveOutDate: selectedClearance.moveOutDate ? selectedClearance.moveOutDate.split("T")[0] : "",
                inspectionDate: selectedClearance.inspectionDate ? selectedClearance.inspectionDate.split("T")[0] : "",
                reason: selectedClearance.reason || "",
                notes: selectedClearance.notes || "",
            });
        } else {
            setFormData({
                tenant: isTenantUser ? userId : "",
                property: "",
                moveOutDate: "",
                inspectionDate: "",
                reason: "",
                notes: "",
            });
        }
    }, [selectedClearance, userId, isTenantUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        if (!formData.property) return "Please select a property.";
        if (!formData.tenant) return "Tenant ID is required.";
        if (!formData.moveOutDate) return "Please select the move-out date.";
        if (!formData.inspectionDate) return "Please select the inspection date.";
        // if (!formData.reason) return "Please enter the reason for clearance.";
        return null;
    };

    const onSubmit = async () => {
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            const payload = {
                tenant: formData.tenant,
                property: formData.property,
                moveOutDate: new Date(formData.moveOutDate).toISOString(),
                inspectionDate: new Date(formData.inspectionDate).toISOString(),
                reason: formData.reason,
                notes: formData.notes,
                status: "Pending",
                inspectionStatus: "Pending",
            };

            await dispatch(addClearance(payload)).unwrap();
            toast.success("Clearance request submitted successfully!");
            dispatch(reset());
            handleClose();
        } catch (error) {
            console.error("Submission error:", error);
            setError(error.message || "Failed to create clearance request.");
        }
    };

    const handleClose = () => {
        setVisible(false);
        setFormData({
            tenant: isTenantUser ? userId : "",
            property: "",
            moveOutDate: "",
            inspectionDate: "",
            reason: "",
            notes: "",
        });
        setError(null);
    };

    const handlePropertyChange = (e) => {
      setFormData((prev) => ({ ...prev, property: e.target.value }));
    };

    return (
        <CModal visible={visible} onClose={handleClose} alignment="center" backdrop="static" size="lg">
            <CModalHeader>
                <CModalTitle>{selectedClearance ? "Edit Clearance Request" : "Request Clearance"}</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CCard className="border-0 shadow-sm">
                    <CCardBody>
                        {error && <CAlert color="danger">{error}</CAlert>}
                        <CForm>
                            <CRow className="g-3">
                                <CCol md={6}>
                                    <CFormLabel htmlFor="property">
                                        <CIcon icon={cilHome} className="me-1" />
                                        Property
                                    </CFormLabel>
                                    <PropertySelect
                                        id="property"
                                        name="property"
                                        value={formData.property}
                                        onChange={handlePropertyChange}
                                        required
                                    />
                                </CCol>
                                <CCol md={6}>
                                    <CFormLabel htmlFor="tenant">
                                        <CIcon icon={cilUser} className="me-1" />
                                        Tenant
                                    </CFormLabel>
                                    <CFormInput type="text" value={userName || ""} readOnly disabled />
                                </CCol>
                                <CCol md={6}>
                                    <CFormInput label="Move Out Date" type="date" name="moveOutDate" value={formData.moveOutDate} onChange={handleChange} required />
                                </CCol>
                                <CCol md={6}>
                                    <CFormInput label="Inspection Date" type="date" name="inspectionDate" value={formData.inspectionDate} onChange={handleChange} required />
                                </CCol>
                                <CCol md={12}>
                                    <CFormTextarea label="notes" name="notes" value={formData.notes} onChange={handleChange} required />
                                </CCol>
                            </CRow>
                        </CForm>
                    </CCardBody>
                </CCard>
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={handleClose}>Cancel</CButton>
                <CButton color="dark" onClick={onSubmit}>{selectedClearance ? "Update" : "Submit"}</CButton>
            </CModalFooter>
        </CModal>
    );
};

export default AddClearance;