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
} from "@coreui/react";
import { useDispatch, useSelector } from "react-redux";
import { decryptData } from "../../api/utils/crypto";
import { addClearance } from "../../api/actions/ClearanceAction";
import PropertySelect from "../guest/PropertySelect";
import { reset } from "../../api/slice/clearanceSlice";
import { toast } from "react-toastify";
import {
    cilUser,
    cilHome,
    cilInfo,
    cilDescription,
    cilCalendar,
    cilWarning,
} from "@coreui/icons";
import { CIcon } from "@coreui/icons-react";
import { fetchTenants } from "../../api/actions/TenantActions";

const AddClearance = ({ visible, setVisible, tenantId }) => {
    const dispatch = useDispatch();
    const properties = useSelector((state) => state.property.properties);
    const { tenants } = useSelector((state) => state.tenant);
    const loading = useSelector((state) => state.property.loading);
    const error = useSelector((state) => state.property.error);
    const { isLoading } = useSelector((state) => state.clearance);
    const [noPropertiesMessage, setNoPropertiesMessage] = useState(null);
    const [localError, setError] = useState(null);
    const [formData, setFormData] = useState({
        tenant: "",
        property: "",
        moveOutDate: "",
        status: "Pending", // Correct initial status
        inspectionStatus: "Pending", //Correct default initial value
        notes: "",
        inspectionDate: "",
        reason: "",
    });
    const [validationError, setValidationError] = useState(null);
    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const encryptedUser = localStorage.getItem("user");
            if (encryptedUser) {
                try {
                    const decryptedUser = decryptData(encryptedUser);
                    if (decryptedUser && decryptedUser._id) {
                        // Ensure the ID is a string
                        const userIdString = decryptedUser._id.toString();

                        setUserId(userIdString);
                        setUserName(decryptedUser.name);
                        // Set the tenant to the current user ID ONLY if no tenantId is passed down.
                        setFormData((prev) => ({
                            ...prev,
                             tenant: tenantId || userIdString, 
                        }));
                    } else {
                        setError("Invalid user data, try to log in again.");
                    }
                } catch (error) {
                    console.error('Decryption error:', error);
                    setError("Error decoding token, try to log in again.");
                }
            }
        };
        fetchUser();
        dispatch(fetchTenants({ page: 1, limit: 10000 }));
    }, [dispatch, tenantId]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        setValidationError(validateForm());
    }, [formData]);

    const validateForm = () => {
        if (!formData.property) return "Please select a property.";
        if (!formData.tenant) return "Please select a tenant.";
        if (!formData.inspectionDate) return "Please select the inspection date.";
         if (!formData.moveOutDate) return "Please select the move out date.";
        if (!formData.reason) return "Please enter the reason for clearance.";
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
                 ...formData,
                moveOutDate: new Date(formData.moveOutDate), // Ensure it's a Date object
                inspectionDate: new Date(formData.inspectionDate),
             };
            await dispatch(addClearance(payload)).unwrap();
            toast.success("Clearance request submitted successfully!");
            dispatch(reset());
            handleClose();
        } catch (error) {
            console.error('Submission error:', error);
            setError(error.message || "Failed to add clearance request.");
        }
    };


    const handleClose = () => {
        if (window.confirm("Are you sure you want to close this form?")) {
            setVisible(false);
            setFormData({
               tenant: "",
                property: "",
                 moveOutDate: "",
                status: "Pending",
                 inspectionStatus: "Pending",
                notes: "",
                inspectionDate: "",
                reason: "",
            });
            setError(null);
        }
    };

    const handlePropertyChange = (e) => {
        const propertyId = e.target.value;
        setFormData(prev => ({ ...prev, property: propertyId }));
    };

    const handleTenantChange = (e) => {
        setFormData((prev) => ({ ...prev, tenant: e.target.value }));
    };



    return (
        <CModal
            visible={visible}
            onClose={handleClose}
            alignment="center"
            backdrop="static"
            size="lg"
        >
            <CModalHeader className="bg-dark text-white">
                <CModalTitle>
                    <CIcon icon={cilWarning} className="me-2" />
                    Request Clearance
                </CModalTitle>
            </CModalHeader>
            <CModalBody>
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
                        <CForm>
                            <CRow className="g-3">
                                <CCol md={6}>
                                    <CFormLabel htmlFor="property">
                                        <CIcon icon={cilHome} className="me-1" />
                                        Property
                                    </CFormLabel>
                                    <PropertySelect
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
                                    <CFormSelect
                                        value={formData.tenant}
                                        onChange={handleTenantChange}
                                        options={[
                                          { label: 'Select a Tenant', value: '' },
                                          ...(userId && !tenantId ? [{ label: userName , value: userId }] : []), // user option
                                          ...(tenants || []).map((tenant) => ({
                                              label: tenant.tenantName,
                                              value: tenant._id,
                                          })),
                                      ]}
                                        required
                                    />
                                </CCol>
                                   <CCol md={6}>
                                    <CFormInput
                                        label={
                                            <span>
                                                <CIcon
                                                    icon={cilCalendar}
                                                    className="me-1"
                                                />
                                               Move Out Date
                                            </span>
                                        }
                                        type="date"
                                        name="moveOutDate"
                                        value={formData.moveOutDate}
                                        onChange={handleChange}
                                         style={{
                                            backgroundColor: "aliceblue",
                                        }}
                                    />
                                </CCol>
                                 <CCol md={6}>
                                    <CFormInput
                                        label={
                                            <span>
                                                <CIcon
                                                    icon={cilCalendar}
                                                    className="me-1"
                                                />
                                                Inspection Date
                                            </span>
                                        }
                                        type="date"
                                        name="inspectionDate"
                                        value={formData.inspectionDate}
                                        onChange={handleChange}
                                        style={{
                                            backgroundColor: "aliceblue",
                                        }}
                                    />
                                </CCol>
                                <CCol md={6}>
                                    <CFormInput
                                        label={
                                            <span>
                                                <CIcon
                                                    icon={cilInfo}
                                                    className="me-1"
                                                />
                                                Reason
                                            </span>
                                        }
                                        type="text"
                                        name="reason"
                                        value={formData.reason}
                                        onChange={handleChange}
                                        style={{
                                            backgroundColor: "aliceblue",
                                        }}
                                    />
                                </CCol>
                                <CCol md={6}>
                                    <CFormInput
                                        label={
                                            <span>
                                                <CIcon
                                                    icon={cilDescription}
                                                    className="me-1"
                                                />
                                                Notes
                                            </span>
                                        }
                                        type="textarea"
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleChange}
                                        style={{
                                            backgroundColor: "aliceblue",
                                        }}
                                    />
                                </CCol>
                            </CRow>
                        </CForm>
                    </CCardBody>
                </CCard>
            </CModalBody>
            <CModalFooter className="border-top-0">
                <CButton
                    color="secondary"
                    variant="ghost"
                    onClick={handleClose}
                    disabled={isLoading}
                >
                    Cancel
                </CButton>
                <CButton
                    color="dark"
                    onClick={onSubmit}
                    disabled={isLoading || typeof validationError === 'string'}
                >
                    {isLoading ? (
                        <>
                            <CSpinner size="sm" className="me-2" />
                            Requesting...
                        </>
                    ) : (
                        "Submit Request"
                    )}
                </CButton>
            </CModalFooter>
        </CModal>
    );
};

export default AddClearance;