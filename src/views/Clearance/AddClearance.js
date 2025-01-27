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
    CTooltip,
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

const AddClearance = ({ visible, setVisible }) => {
    const dispatch = useDispatch();
    const properties = useSelector((state) => state.property.properties);
    const loading = useSelector((state) => state.property.loading);
    const error = useSelector((state) => state.property.error);
    const { isLoading } = useSelector((state) => state.clearance);
    const [noPropertiesMessage, setNoPropertiesMessage] = useState(null);
    const [localError, setError] = useState(null);
    const [formData, setFormData] = useState({
        user: "",
        property: "",
        tenant: "",
        reason: "",
        notes: "",
        inspectionDate: "",
        status: "pending",
    });

    useEffect(() => {
        const fetchUser = () => {
            const encryptedUser = localStorage.getItem("user");
            if (encryptedUser) {
                try {
                    const decryptedUser = decryptData(encryptedUser);
                    if (decryptedUser && decryptedUser._id) {
                        setFormData((prev) => ({
                            ...prev,
                            user: decryptedUser._id,
                        }));
                    } else {
                        setError("Invalid user data, try to log in again.");
                    }
                } catch (error) {
                    setError("Error decoding token, try to log in again.");
                }
            }
        };
        fetchUser();
        if (properties.length === 0 && !loading && !error) {
            setNoPropertiesMessage(
                "No properties available for this tenant."
            );
        } else {
            setNoPropertiesMessage(null);
        }
    }, [properties, loading, error]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        if (!formData.property) return "Please select a property.";
        if (!formData.tenant) return "Please select a tenant.";
        if (!formData.inspectionDate) return "Please select the inspection date.";
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
            await dispatch(addClearance(formData)).unwrap();
            toast.success("Clearance request submitted successfully!");
            dispatch(reset());
            handleClose();
        } catch (error) {
            setError(error.message || "Failed to add clearance request.");
        }
    };

    const handleClose = () => {
        if (window.confirm("Are you sure you want to close this form?")) {
            setVisible(false);
            setFormData({
                user: "",
                property: "",
                tenant: "",
                reason: "",
                notes: "",
                inspectionDate: "",
                status: "pending",
            });
            setError(null);
        }
    };

    const handlePropertyChange = (e) => {
        setFormData((prev) => ({ ...prev, property: e.target.value }));
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
                                    <CFormLabel htmlFor="user">
                                        <CIcon icon={cilUser} className="me-1" />
                                        User ID
                                    </CFormLabel>
                                    <CTooltip content="Your user ID is auto-filled and cannot be changed.">
                                        <CFormInput
                                            id="user"
                                            type="text"
                                            value={formData.user}
                                            readOnly
                                            style={{
                                                backgroundColor: "aliceblue",
                                            }}
                                        />
                                    </CTooltip>
                                </CCol>
                                <CCol md={6}>
                                    <CFormLabel htmlFor="property">
                                        <CIcon
                                            icon={cilHome}
                                            className="me-1"
                                        />
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
                                        <CIcon
                                            icon={cilHome}
                                            className="me-1"
                                        />
                                        Tenant
                                    </CFormLabel>
                                    <CFormSelect
                                        name="tenant"
                                        value={formData.tenant}
                                        onChange={handleTenantChange}
                                        required
                                    >
                                        <option value="">
                                            Select Tenant
                                        </option>
                                        {properties
                                            ?.filter(
                                                (property) =>
                                                    property._id ===
                                                    formData.property
                                            )?.[0]
                                            ?.tenants?.map((tenant, index) => (
                                                <option
                                                    key={index}
                                                    value={tenant?._id}
                                                >
                                                    {tenant?.name}
                                                </option>
                                            ))}
                                    </CFormSelect>
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
                    disabled={isLoading || validateForm() !== null}
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
