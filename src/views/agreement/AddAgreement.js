import React, { useEffect, useState, useCallback } from "react";
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
import { addAgreement } from "../../api/actions/AgreementActions";
import  {  clearError } from "../../api/slice/agreementSlice";
import TenantPropertySelect from "./TenantPropertySelect";
import { fetchTenants } from "../../api/actions/TenantActions";
import { fetchProperties } from "../../api/actions/PropertyAction";

const AddAgreement = ({ visible, setVisible }) => {
    const dispatch = useDispatch();
    const { properties, loading: propertiesLoading, error: propertiesError } =
        useSelector((state) => state.property);
    const { tenants, loading: tenantsLoading, error: tenantsError } =
         useSelector((state) => state.tenant);
    const { isLoading, error } = useSelector((state) => state.agreement);
    const [formError, setFormError] = useState("");
    const [loadingUser, setLoadingUser] = useState(true);
    const [loading, setLoading] = useState(true);

     const [paymentMethods] = useState([
            "cash",
            "cheque",
            "bank transfer",
            "credit card"
        ]);


    const [formData, setFormData] = useState({
        user: "",
        property: "",
        tenant: "",
        leaseStart: null,
         leaseEnd: null,
        rentAmount: null,
        securityDeposit: null,
        paymentTerms: {
              dueDate: "",
              paymentMethod: ""
         },
          rulesAndConditions: "",
        additionalOccupants: "",
        utilitiesAndServices: "",
        documents: null,
    });

    useEffect(() => {
        dispatch(fetchProperties());
         dispatch(fetchTenants())
      const fetchUser = async () => {
        try {
          setLoading(true);
          const encryptedUser = localStorage.getItem("user");
          if (encryptedUser) {
            const decryptedUser = decryptData(encryptedUser);
            if (decryptedUser && decryptedUser.id) {
              setFormData((prev) => ({
                ...prev,
                user: decryptedUser.id,
              }));
            } else {
              setFormError("Invalid user data, try to log in again.");
            }
          } else {
             setFormError("No user found please log in again");
          }
        } catch (error) {
          setFormError("Error decoding token, try to log in again.");
        } finally {
             setLoading(false);
            setLoadingUser(false);
          }
      };
      fetchUser();
    }, [dispatch]);


    const handlePropertyChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if(name.startsWith('paymentTerms.')){
           const paymentTerm = name.split('.')[1]
               setFormData((prev) => ({
                   ...prev,
                     paymentTerms: {
                        ...prev.paymentTerms,
                        [paymentTerm]: value,
                    }
              }));
        }else {
           setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleDismissError = () => {
        dispatch(clearError());
        setFormError("");
    };

     const validateForm = () => {
      if (!formData.property || formData.property.trim() === "")
          return "Please select a property.";
      if (!formData.tenant || formData.tenant.trim() === "")
          return "Please select a tenant.";
       if (!formData.leaseStart)
          return "Please select the lease start date.";
        if (!formData.leaseEnd)
          return "Please select the lease end date.";
         if (formData.rentAmount === null || formData.rentAmount <= 0)
            return "Please select the rent amount.";
        if (!formData.securityDeposit)
            return "Please select the security deposit.";
      if (!formData.paymentTerms.dueDate || formData.paymentTerms.dueDate.trim() === "")
        return "Please provide the payment due date.";
     if (!formData.paymentTerms.paymentMethod || formData.paymentTerms.paymentMethod.trim() === "")
           return "Please select the payment method.";

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
            const dataToSend = {
                ...formData,
                  rentAmount: Number(formData.rentAmount), // Ensure rentAmount is a number
            }
           const response = await dispatch(addAgreement(dataToSend)).unwrap();
           if(response){
                toast.success("Agreement submitted successfully!");
                 handleClose();
           }

        } catch (error) {
            const errorMsg =
                error.message ||
                error.response?.data?.message ||
                "Failed to add agreement.";
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
             leaseStart: null,
             leaseEnd: null,
            rentAmount: null,
             securityDeposit: null,
             paymentTerms: {
                  dueDate: "",
                  paymentMethod: ""
             },
            rulesAndConditions: "",
            additionalOccupants: "",
            utilitiesAndServices: "",
             documents: null,
        });
        setFormError("");
        dispatch(clearError())
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

      const tenantOptions = tenants?.map(tenant => ({
           id: tenant.id,
           tenantName: tenant.tenantName
      }))
       const propertyOptions = properties?.map(property => ({
           id: property.id,
           name: property.title
       }))

    return (
        <CCard>
            <CCardHeader className="d-flex justify-content-between align-items-center">
                <strong>Add Agreement</strong>
            </CCardHeader>
            <CCardBody>
                {renderErrorState(error)}
                 {renderErrorState(formError)}
                 {renderErrorState(propertiesError)}
                 {renderErrorState(tenantsError)}
                   {loading ? (
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
                                  <TenantPropertySelect
                                          tenantOptions={tenantOptions}
                                          propertyOptions={propertyOptions}
                                          formData={formData}
                                          setFormData={setFormData}

                                      />

                                        <CCol md={6}>
                                            <CFormLabel htmlFor="property">Property</CFormLabel>
                                            <CFormSelect
                                                name="property"
                                                value={formData.property}
                                                onChange={handlePropertyChange}
                                                required
                                                label="Property"
                                                className="form-control-animation"
                                            >
                                                <option value="">Select Property</option>
                                                {propertyOptions?.map((property) => (
                                                    <option key={property.id} value={property.id}>
                                                        {property.name}
                                                    </option>
                                                ))}
                                            </CFormSelect>
                                        </CCol>
                                     <CCol md={6}>
                                        <CFormLabel htmlFor="leaseStart">
                                           Lease Start Date
                                        </CFormLabel>
                                         <CFormInput
                                            type="date"
                                            name="leaseStart"
                                            value={formData.leaseStart || ""}
                                             onChange={handleChange}
                                            className="input-background"
                                        />
                                     </CCol>
                                        <CCol md={6}>
                                            <CFormLabel htmlFor="leaseEnd">
                                                Lease End Date
                                            </CFormLabel>
                                            <CFormInput
                                                 type="date"
                                                name="leaseEnd"
                                                 value={formData.leaseEnd || ""}
                                                 onChange={handleChange}
                                                className="input-background"
                                            />
                                        </CCol>
                                     <CCol md={6}>
                                        <CFormLabel htmlFor="rentAmount">
                                             Rent Amount
                                        </CFormLabel>
                                         <CFormInput
                                            type="number"
                                            name="rentAmount"
                                            value={formData.rentAmount || ""}
                                            onChange={handleChange}
                                            className="input-background"
                                        />
                                     </CCol>
                                      <CCol md={6}>
                                        <CFormLabel htmlFor="securityDeposit">
                                            Security Deposit
                                        </CFormLabel>
                                         <CFormInput
                                            type="number"
                                            name="securityDeposit"
                                            value={formData.securityDeposit || ""}
                                            onChange={handleChange}
                                            className="input-background"
                                        />
                                     </CCol>
                                        <CCol md={6}>
                                            <CFormLabel htmlFor="paymentTerms.dueDate">
                                                Due Date
                                            </CFormLabel>
                                            <CFormInput
                                                 type="date"
                                                name="paymentTerms.dueDate"
                                                 value={formData.paymentTerms.dueDate || ""}
                                                 onChange={handleChange}
                                                className="input-background"
                                            />
                                        </CCol>
                                        <CCol md={6}>
                                            <CFormLabel htmlFor="paymentTerms.paymentMethod">
                                                Payment Method
                                            </CFormLabel>
                                            <CFormSelect
                                               name="paymentTerms.paymentMethod"
                                               value={formData.paymentTerms.paymentMethod}
                                               onChange={handleChange}
                                            >
                                                  <option value="">Select Method</option>
                                                {paymentMethods?.map((method, index) => (
                                                    <option key={index} value={method}>
                                                        {method}
                                                    </option>
                                                ))}
                                            </CFormSelect>
                                        </CCol>
                                    <CCol md={6}>
                                        <CFormLabel htmlFor="rulesAndConditions">Rules & Conditions</CFormLabel>
                                        <CFormInput
                                            type="text"
                                            name="rulesAndConditions"
                                            value={formData.rulesAndConditions}
                                            onChange={handleChange}
                                            className="input-background"
                                        />
                                    </CCol>
                                       <CCol md={6}>
                                        <CFormLabel htmlFor="additionalOccupants">Additional Occupants</CFormLabel>
                                        <CFormInput
                                            type="text"
                                            name="additionalOccupants"
                                            value={formData.additionalOccupants}
                                            onChange={handleChange}
                                            className="input-background"
                                        />
                                    </CCol>
                                     <CCol md={6}>
                                        <CFormLabel htmlFor="utilitiesAndServices">Utilities & Services</CFormLabel>
                                        <CFormTextarea
                                            name="utilitiesAndServices"
                                            value={formData.utilitiesAndServices}
                                            onChange={handleChange}
                                            className="input-background"
                                        />
                                    </CCol>

                                      <CCol md={6}>
                                        <CFormLabel htmlFor="documents">Documents</CFormLabel>
                                        <CFormInput
                                            type="file"
                                            name="documents"
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
                      )}
            </CCardBody>
        </CCard>
    );
};

export default AddAgreement;
