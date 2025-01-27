import React, { useEffect, useState } from "react";
import {
    CCard,
    CCardBody,
    CCardHeader,
    CButton,
    CAlert,
    CSpinner,
    CRow,
    CCol,
    CForm,
    CFormInput,
    CFormLabel,
    CFormSelect,
    CFormTextarea,
} from "@coreui/react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { decryptData } from "../../api/utils/crypto";
import { addClearance } from "../../api/actions/ClearanceAction";
import PropertySelect from "../guest/PropertySelect";
import { reset } from "../../api/slice/clearanceSlice";
import { clearError } from "../../api/slice/clearanceSlice"; // Correct Import
// import "./AddClearance.css"

const AddClearance = ({ visible, setVisible }) => {
    const dispatch = useDispatch();
    const { properties, loading: propertiesLoading, error: propertiesError } =
        useSelector((state) => state.property);
    const { isLoading, error } = useSelector((state) => state.clearance);
       const [loadingUser, setLoadingUser] = useState(true);

    const [formError, setFormError] = useState("");
    const [formData, setFormData] = useState({
        user: "",
        property: "",
        tenant: "",
        reason: "",
        notes: "",
        inspectionDate: null, // Set to null as default
        status: "pending",
    });

    useEffect(() => {
        const fetchUser = async() => {
            setLoadingUser(true);
            const encryptedUser = localStorage.getItem("user");
             if (encryptedUser) {
                try {
                    const decryptedUser = decryptData(encryptedUser);
                    if (decryptedUser && decryptedUser._id) {
                        setFormData((prev) => ({
                            ...prev,
                            user: decryptedUser._id,
                        }));
                        setLoadingUser(false);
                    } else {
                        setFormError("Invalid user data, try to log in again.");
                        setLoadingUser(false);
                    }
                } catch (error) {
                    setFormError("Error decoding token, try to log in again.");
                    setLoadingUser(false);
                }
            } else{
               setLoadingUser(false)
            }
        };
      fetchUser()
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

      const handleDismissError = () => {
          dispatch(clearError());
      };


    const validateForm = () => {
        if (!formData.property) return "Please select a property.";
        if (!formData.tenant) return "Please select a tenant.";
        if (!formData.inspectionDate) return "Please select the inspection date.";
        if (!formData.reason) return "Please enter the reason for clearance.";
        return null;
    };

    const handleFormSubmit = async () => {
        const validationError = validateForm();
        if (validationError) {
            setFormError(validationError);
            toast.error(validationError);
            return;
        }

        try {
            setFormError("");
            const response = await dispatch(addClearance(formData)).unwrap();
           if(response.success){
                toast.success("Clearance request submitted successfully!");
                dispatch(reset());
                handleClose();
           }else{
                const errorMsg =
                    response.message ||
                    "Failed to add clearance request.";
                setFormError(errorMsg);
                toast.error(errorMsg);
           }

        } catch (error) {
            const errorMsg =
                error.message ||
                error.response?.data?.message ||
                "Failed to add clearance request.";
             setFormError(errorMsg);
            toast.error(errorMsg);
        }
    };

    const handleClose = () => {
        setVisible(false);
        setFormData({
            user: "",
            property: "",
            tenant: "",
            reason: "",
            notes: "",
            inspectionDate: null,
            status: "pending",
        });
        setFormError("");
    };

    const renderLoadingState = () => (
        <div className="text-center p-4">
            <CSpinner color="dark" />
            <p>Loading data...</p>
        </div>
    );

    const renderErrorState = (error) => {
        if (!error) return null;
         return (
            <CAlert color="danger" dismissible onClose={handleDismissError}>
                {typeof error === "object"
                    ? error.message || JSON.stringify(error)
                    : error}
            </CAlert>
        );
    };

     const renderUserLoadingState = () => (
          <div className="text-center p-4">
              <CSpinner color="dark" />
              <p>Loading User data...</p>
          </div>
      );


    return (
        <CCard>
            <CCardHeader className="d-flex justify-content-between align-items-center">
                <strong>Add Clearance</strong>
            </CCardHeader>
            <CCardBody>
               {renderErrorState(error)}
                {renderErrorState(formError)}
                {renderErrorState(propertiesError)}
                 {loadingUser ? (
                        renderUserLoadingState()
                    ) :(
                         propertiesLoading ? (
                            renderLoadingState()
                        ) : (
                            <CForm>
                                <CRow className="g-3">
                                    <CCol md={6}>
                                        <CFormLabel htmlFor="user">User ID</CFormLabel>
                                        <CFormInput
                                            id="user"
                                            type="text"
                                            value={formData.user}
                                            readOnly
                                            className="input-background"
                                        />
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormLabel htmlFor="property">Property</CFormLabel>
                                        <PropertySelect
                                            value={formData.property}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    property: e.target.value,
                                                }))
                                            }
                                        />
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormLabel htmlFor="tenant">Tenant</CFormLabel>
                                        <CFormSelect
                                            name="tenant"
                                            value={formData.tenant}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    tenant: e.target.value,
                                                }))
                                            }
                                        >
                                            <option value="">Select Tenant</option>
                                            {properties
                                                ?.filter(
                                                    (property) =>
                                                        property._id === formData.property
                                                )?.[0]
                                                ?.tenants?.map((tenant, index) => (
                                                    <option key={index} value={tenant?._id}>
                                                        {tenant?.name}
                                                    </option>
                                                ))}
                                        </CFormSelect>
                                    </CCol>
                                     <CCol md={6}>
                                        <CFormLabel htmlFor="inspectionDate">
                                            Inspection Date
                                        </CFormLabel>
                                         <CFormInput
                                            type="date"
                                            name="inspectionDate"
                                            value={formData.inspectionDate || ""}
                                             onChange={handleChange}
                                            className="input-background"
                                        />
                                     </CCol>
                                    <CCol md={6}>
                                        <CFormLabel htmlFor="reason">Reason</CFormLabel>
                                        <CFormInput
                                            type="text"
                                            name="reason"
                                            value={formData.reason}
                                            onChange={handleChange}
                                            className="input-background"
                                        />
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormLabel htmlFor="notes">Notes</CFormLabel>
                                        <CFormTextarea
                                            name="notes"
                                            value={formData.notes}
                                            onChange={handleChange}
                                             className="input-background"
                                        />
                                    </CCol>
                                </CRow>
                                <div className="d-flex justify-content-end mt-4">
                                    <CButton
                                        color="secondary"
                                        variant="ghost"
                                        onClick={handleClose}
                                        disabled={isLoading}
                                        className="me-2"
                                    >
                                        Cancel
                                    </CButton>
                                    <CButton
                                        color="dark"
                                        onClick={handleFormSubmit}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <CSpinner size="sm" className="me-2" />
                                                Submitting...
                                            </>
                                        ) : (
                                            "Submit"
                                        )}
                                    </CButton>
                                </div>
                            </CForm>
                        )
                    )}
            </CCardBody>
        </CCard>
    );
};

export default AddClearance;