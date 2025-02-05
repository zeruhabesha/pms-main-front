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
import { clearError } from "../../api/slice/AgreementSlice";
import TenantPropertySelect from "./TenantPropertySelect";
import { fetchTenants } from "../../api/actions/TenantActions";
import { fetchProperties } from "../../api/actions/PropertyAction";
import { fetchPropertiess } from "../../api/actions/PropertyAction";
import { Upload } from 'lucide-react';


const AddAgreement = ({ visible, setVisible }) => {
    const dispatch = useDispatch();
    const { properties, error: propertiesError } = useSelector((state) => state.property);
    const { tenants, error: tenantsError } = useSelector((state) => state.tenant);
    const { isLoading, error: agreementError } = useSelector((state) => state.agreement);


    const [formError, setFormError] = useState("");
    // const [loading, setLoading] = useState(false);


    const paymentMethods = ['cash', 'cheque', 'bank transfer', 'credit card'];
    const [formData, setFormData] = useState({
        user: "",
        property: "",
        tenant: "",
        leaseStart: "",
        leaseEnd: "",
        rentAmount: "",
        securityDeposit: "",
        paymentTerms: { dueDate: "", paymentMethod: "" },
        rulesAndConditions: "",
        additionalOccupants: "",
        utilitiesAndServices: "",
        documents: null,
    });



    useEffect(() => {
        // dispatch(fetchProperties());
        dispatch(fetchPropertiess());
        dispatch(fetchTenants());

        const fetchUser = async () => {
            try {
                const encryptedUser = localStorage.getItem("user");
                if (encryptedUser) {
                    const decryptedUser = decryptData(encryptedUser);
                    if (decryptedUser && decryptedUser._id) {
                        setFormData(prev => ({ ...prev, user: decryptedUser._id }));
                    } else {
                        toast.error("Invalid user data, please log in again.");
                    }
                } else {
                    toast.error("No user found, please log in again.");
                }
            } catch (error) {
                toast.error("Error decoding token, please log in again.");
            }
        };
        fetchUser();
    }, [dispatch]);


    const handlePropertyChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === "file") {
            setFormData(prev => ({ ...prev, documents: files[0] }));
        } else if (name.startsWith("paymentTerms.")) {
            const term = name.split(".")[1];
            setFormData(prev => ({ ...prev, paymentTerms: { ...prev.paymentTerms, [term]: value } }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const validateForm = () => {
        if (!formData.property) return "Please select a property.";
        if (!formData.tenant) return "Please select a tenant.";
        if (!formData.leaseStart) return "Please select the lease start date.";
        if (!formData.leaseEnd) return "Please select the lease end date.";
        if (!formData.rentAmount || formData.rentAmount <= 0) return "Please enter a valid rent amount.";
        if (!formData.securityDeposit) return "Please enter a security deposit amount.";
        if (!formData.paymentTerms.dueDate) return "Please provide the payment due date.";
        if (!formData.paymentTerms.paymentMethod) return "Please select the payment method.";
        return null;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            toast.error(validationError);
            return;
        }

        try {
            const response = await dispatch(addAgreement({ ...formData, rentAmount: Number(formData.rentAmount) })).unwrap();
            if (response) {
                toast.success("Agreement submitted successfully!");
                handleClose();
            }
        } catch (error) {
            toast.error(error.message || "Failed to add agreement.");
        }
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
              <CAlert color="danger" dismissible onClose={() => dispatch(clearError())}>
                  {typeof error === "object"
                      ? error.message || JSON.stringify(error)
                      : error}
              </CAlert>
          );
      };

      const tenantOptions = tenants?.map(tenant => ({
           _id: tenant._id,
           tenantName: tenant.tenantName
      }))
       const propertyOptions = properties?.map(property => ({
           _id: property._id,
           name: property.title
       }))

       const handleClose = () => {
        setVisible(false);
        setFormData({
            user: "",
            property: "",
            tenant: "",
            leaseStart: "",
            leaseEnd: "",
            rentAmount: "",
            securityDeposit: "",
            paymentTerms: { dueDate: "", paymentMethod: "" },
            rulesAndConditions: "",
            additionalOccupants: "",
            utilitiesAndServices: "",
            documents: null,
        });
        dispatch(clearError());
    };

    return (
        <CCard>
            <CCardHeader className="d-flex justify-content-between align-items-center">
                <strong>Add Agreement</strong>
            </CCardHeader>
            <CCardBody>
                {renderErrorState(agreementError)}
                 {renderErrorState(formError)}
                 {renderErrorState(propertiesError)}
                 {renderErrorState(tenantsError)}
                   {isLoading ? (
                         renderLoadingState()
                        ) : (
                            <CForm onSubmit={handleSubmit}>
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
                                    <TenantPropertySelect tenantOptions={tenants} propertyOptions={properties} formData={formData} setFormData={setFormData} />
                                    <CCol md={6}>
                                            <CFormLabel htmlFor="property">Property</CFormLabel>
                                            <CFormSelect
                                                name="property"
                                                // value={formData.property}
                                                // onChange={handlePropertyChange}
                                                value={formData.property}
                                                onChange={handleChange}
                                                required
                                                label="Property"
                                                className="form-control-animation"
                                            >
                                                <option value="">Select Property</option>
                                                {propertyOptions?.map((property) => (
                                                    <option key={property._id} value={property._id}>
                                                        {property.name}
                                                    </option>
                                                ))}
                                            </CFormSelect>
                                        </CCol>
                                     <CCol md={6}>
                                        <CFormLabel htmlFor="leaseStart">
                                           Lease Start Date
                                        </CFormLabel>
                                        <CFormInput type="date" name="leaseStart" value={formData.leaseStart} onChange={handleChange} />

                                     </CCol>
                                        <CCol md={6}>
                                            <CFormLabel htmlFor="leaseEnd">
                                                Lease End Date
                                            </CFormLabel>
                                            <CFormInput type="date" name="leaseEnd" value={formData.leaseEnd} onChange={handleChange} />
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
                                    <CFormLabel>Documents</CFormLabel>
                                    <input type="file" name="documents" onChange={handleChange} />
                                </CCol>

                                </CRow>
                     <div className="d-flex justify-content-end mt-4">
                        <CButton color="secondary" variant="ghost" onClick={handleClose} disabled={isLoading} className="me-2">Cancel</CButton>
                        <CButton color="dark" type="submit" disabled={isLoading}>{isLoading ? "Submitting..." : "Submit"}</CButton>
                    </div>
                            </CForm>
                      )}
            </CCardBody>
        </CCard>
    );
};

export default AddAgreement;