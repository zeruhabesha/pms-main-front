import React, { useState, useEffect, useMemo } from "react";
import {
  CForm,
  CFormInput,
  CRow,
  CCol,
  CFormSelect,
  CAlert,
  CButton,
  CSpinner,
} from "@coreui/react";
import Select from "react-select";
import axios from 'axios'; // Assuming you're using axios for API calls

const AgreementForm = ({
  onSubmit,
  isSubmitting = false,
  setErrorMessage,
  initialData = null,
}) => {

    // State for tenants and properties
    const [tenants, setTenants] = useState([]);
    const [properties, setProperties] = useState([]);
    
    // Loading states
    const [isLoadingTenants, setIsLoadingTenants] = useState(true);
    const [isLoadingProperties, setIsLoadingProperties] = useState(true);
  // Default form state with more robust initial values
  const [formData, setFormData] = useState({
    tenant: "",
    property: "",
    leaseStart: "",
    leaseEnd: "",
    rentAmount: "",
    securityDeposit: "",
    paymentTerms: { 
      dueDate: "", 
      paymentMethod: "" 
    },
    rulesAndConditions: "",
    additionalOccupants: "",
    utilitiesAndServices: "",
    documents: [],
  });

  const [fileErrors, setFileErrors] = useState([]);


  useEffect(() => {
    const fetchTenantsAndProperties = async () => {
      try {
        // Fetch Tenants
        const tenantsResponse = await axios.get('http://localhost:4000/api/v1/tenants', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Add authentication if needed
          }
        });
        setTenants(tenantsResponse.data);
        setIsLoadingTenants(false);

        // Fetch Properties
        const propertiesResponse = await axios.get('http://localhost:4000/api/v1/properties', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Add authentication if needed
          }
        });
        setProperties(propertiesResponse.data);
        setIsLoadingProperties(false);
      } catch (error) {
        console.error('Error fetching tenants and properties:', error);
        setErrorMessage('Failed to load tenants and properties');
        setIsLoadingTenants(false);
        setIsLoadingProperties(false);
      }
    };

    fetchTenantsAndProperties();
  }, []);
  // Memoized tenant and property options
  const tenantOptions = useMemo(() => 
    tenants.map((t) => ({
      label: t.tenantName || t.name || 'Unnamed Tenant', 
      value: t._id || t.id
    })), 
    [tenants]
  );

  const propertyOptions = useMemo(() => 
    properties.map((p) => ({
      label: p.title || p.address || 'Unnamed Property', 
      value: p._id || p.id
    })), 
    [properties]
  );

  // Render loading state
  if (isLoadingTenants || isLoadingProperties) {
    return (
      <div className="text-center">
        <CSpinner color="primary" />
        <p>Loading tenants and properties...</p>
      </div>
    );
  }

  // More robust initial data population
  useEffect(() => {
    if (initialData) {
      setFormData(prevState => ({
        ...prevState,
        tenant: initialData.tenant?._id || initialData.tenant || "",
        property: initialData.property?._id || initialData.property || "",
        leaseStart: initialData.leaseStart || "",
        leaseEnd: initialData.leaseEnd || "",
        rentAmount: initialData.rentAmount || "",
        securityDeposit: initialData.securityDeposit || "",
        paymentTerms: {
          dueDate: initialData.paymentTerms?.dueDate || "",
          paymentMethod: initialData.paymentTerms?.paymentMethod || ""
        },
        rulesAndConditions: initialData.rulesAndConditions || "",
        additionalOccupants: initialData.additionalOccupants || "",
        utilitiesAndServices: initialData.utilitiesAndServices || "",
        documents: initialData.documents || [],
      }));
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentTermChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      paymentTerms: { ...prev.paymentTerms, [key]: value },
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = [];
    const errors = [];

    files.forEach((file) => {
      // More comprehensive file type validation
      const allowedTypes = [
        'application/pdf', 
        'application/doc', 
        'application/docx', 
        'image/jpeg', 
        'image/png'
      ];

      if (allowedTypes.includes(file.type)) {
        // Additional file size check (e.g., max 5MB)
        if (file.size <= 5 * 1024 * 1024) {
          newFiles.push(file);
        } else {
          errors.push(`${file.name} exceeds 5MB file size limit.`);
        }
      } else {
        errors.push(`${file.name} is not a valid file type.`);
      }
    });

    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, ...newFiles],
    }));
    setFileErrors(errors);
  };

  const handleRemoveDocument = (index) => {
    setFormData((prev) => {
      const updatedDocuments = [...prev.documents];
      updatedDocuments.splice(index, 1);
      return { ...prev, documents: updatedDocuments };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Comprehensive form validation
    const requiredFields = [
      'tenant', 'property', 'leaseStart', 'leaseEnd', 
      'rentAmount', 'securityDeposit', 
      'paymentTerms.dueDate', 'paymentTerms.paymentMethod'
    ];

    const missingFields = requiredFields.filter(field => {
      const value = field.includes('.') 
        ? formData[field.split('.')[0]][field.split('.')[1]] 
        : formData[field];
      return !value;
    });

    if (missingFields.length > 0) {
      setErrorMessage(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Date validation
    if (new Date(formData.leaseStart) >= new Date(formData.leaseEnd)) {
      setErrorMessage("Lease end date must be after lease start date.");
      return;
    }

    // Clear any previous error messages
    setErrorMessage("");
    
    // Submit form data
    onSubmit(formData);
  };


  return (
    <CForm onSubmit={handleSubmit}>
      <CRow className="g-4">
        <CCol xs={12}>
          <label>Tenant</label>
          <Select
            options={tenantOptions}
            value={tenantOptions.find(t => t.value === formData.tenant) || null}
            onChange={(selected) =>
              setFormData((prev) => ({ 
                ...prev, 
                tenant: selected ? selected.value : "" 
              }))
            }
            placeholder="Select Tenant"
            isLoading={isLoadingTenants}
            isClearable
          />
        </CCol>

        <CCol xs={12}>
          <label>Property</label>
          <Select
            options={propertyOptions}
            value={propertyOptions.find(p => p.value === formData.property) || null}
            onChange={(selected) =>
              setFormData((prev) => ({ 
                ...prev, 
                property: selected ? selected.value : "" 
              }))
            }
            placeholder="Select Property"
            isLoading={isLoadingProperties}
            isClearable
          />
        </CCol>

        <CCol xs={6}>
          <CFormInput
            type="date"
            label="Lease Start Date"
            name="leaseStart"
            value={formData.leaseStart}
            onChange={handleInputChange}
            required
          />
        </CCol>

        <CCol xs={6}>
          <CFormInput
            type="date"
            label="Lease End Date"
            name="leaseEnd"
            value={formData.leaseEnd}
            onChange={handleInputChange}
            required
          />
        </CCol>

        <CCol xs={6}>
          <CFormInput
            type="number"
            label="Rent Amount"
            name="rentAmount"
            placeholder="Enter Rent Amount"
            value={formData.rentAmount}
            onChange={handleInputChange}
            required
          />
        </CCol>

        <CCol xs={6}>
          <CFormInput
            type="number"
            label="Security Deposit"
            name="securityDeposit"
            placeholder="Enter Security Deposit"
            value={formData.securityDeposit}
            onChange={handleInputChange}
            required
          />
        </CCol>

        <CCol xs={6}>
          <CFormInput
            type="text"
            label="Payment Due Date"
            name="paymentTerms.dueDate"
            placeholder="Enter Payment Due Date"
            value={formData.paymentTerms.dueDate}
            onChange={(e) => handlePaymentTermChange("dueDate", e.target.value)}
            required
          />
        </CCol>

        <CCol xs={6}>
          <CFormSelect
            label="Payment Method"
            value={formData.paymentTerms.paymentMethod}
            onChange={(e) => handlePaymentTermChange("paymentMethod", e.target.value)}
            required
          >
            <option value="">Select Payment Method</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Cash">Cash</option>
          </CFormSelect>
        </CCol>

        <CCol xs={12}>
          <CFormInput
            type="text"
            label="Rules and Conditions"
            name="rulesAndConditions"
            placeholder="Enter Rules and Conditions"
            value={formData.rulesAndConditions}
            onChange={handleInputChange}
            textarea
          />
        </CCol>

        <CCol xs={12}>
          <CFormInput
            type="text"
            label="Additional Occupants"
            name="additionalOccupants"
            placeholder="List Additional Occupants"
            value={formData.additionalOccupants}
            onChange={handleInputChange}
          />
        </CCol>

        <CCol xs={12}>
          <CFormInput
            type="text"
            label="Utilities and Services"
            name="utilitiesAndServices"
            placeholder="Describe Utilities and Services"
            value={formData.utilitiesAndServices}
            onChange={handleInputChange}
          />
        </CCol>

        <CCol xs={12}>
          <CFormInput
            type="file"
            label="Upload Documents"
            multiple
            onChange={handleFileChange}
          />
          {fileErrors.length > 0 && (
            <CAlert color="danger">
              {fileErrors.map((error, idx) => (
                <div key={idx}>{error}</div>
              ))}
            </CAlert>
          )}
          <ul>
            {formData.documents.map((doc, idx) => (
              <li key={idx}>
                {doc.name || doc}
                <CButton
                  color="danger"
                  size="sm"
                  onClick={() => handleRemoveDocument(idx)}
                  className="ms-2"
                >
                  Remove
                </CButton>
              </li>
            ))}
          </ul>
        </CCol>

        <CCol xs={12}>
          {isSubmitting && (
            <div className="text-center">
              <CSpinner color="primary" />
              <p>Submitting agreement...</p>
            </div>
          )}
          <CButton 
            type="submit" 
            color="primary" 
            className="mt-3"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Agreement"}
          </CButton>
        </CCol>
      </CRow>
    </CForm>
  );
};

export default React.memo(AgreementForm);