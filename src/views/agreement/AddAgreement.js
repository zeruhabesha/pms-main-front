import React, { useEffect, useState } from "react";
import {
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CModalFooter,
  CButton,
  CAlert,
  CSpinner,
} from "@coreui/react";
import axios from "axios";
import { toast } from "react-toastify";
import AgreementForm from "./AgreementForm";

const AddAgreement = ({ visible, setVisible, editingAgreement, handleSave }) => {
  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (visible) {
      fetchData();
    }
  }, [visible]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [tenantsResponse, propertiesResponse] = await Promise.all([
        axios.get("http://localhost:4000/api/v1/tenants"),
        axios.get("http://localhost:4000/api/v1/properties"),
      ]);

      setTenants(tenantsResponse.data.tenants || []);
      setProperties(propertiesResponse.data.properties || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorMessage("Failed to load tenants or properties. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (formData) => {
    try {
      handleSave(formData);
      setVisible(false);
    } catch (error) {
      console.error("Error saving agreement:", error);
      setErrorMessage("Failed to save the agreement. Please try again.");
    }
  };



  return (
    <CModal visible={visible} onClose={() => setVisible(false)} alignment="center" backdrop="static" size="lg">
      <CModalHeader className="bg-dark text-white">
        <CModalTitle>{editingAgreement ? "Edit Lease Agreement" : "Add Lease Agreement"}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {errorMessage && <CAlert color="danger">{errorMessage}</CAlert>}
        {isLoading ? (
          <div className="text-center p-4">
            <CSpinner color="dark" />
            <p>Loading tenants and properties...</p>
          </div>
        ) : (
          <AgreementForm
            tenants={tenants}
            properties={properties}
            initialData={editingAgreement}
            onSubmit={handleFormSubmit}
            setErrorMessage={setErrorMessage}
          />
        )}
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisible(false)} disabled={isLoading}>
          Cancel
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default AddAgreement;