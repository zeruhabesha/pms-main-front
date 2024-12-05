import React, { useEffect, useState, useCallback } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import AgreementForm from "./AgreementForm";
import { fetchTenants } from "../../api/actions/TenantActions";
import { fetchProperties } from "../../api/actions/PropertyAction";

const AddAgreement = ({ 
  visible, 
  setVisible, 
  editingAgreement, 
  handleSave 
}) => {
  const dispatch = useDispatch();
  
  // Use Redux selectors for tenants and properties
  const { 
    tenants = [], 
    properties = [], 
    loading: resourceLoading = false, 
    error: resourceError = null 
  } = useSelector(state => state.resources || {});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch resources when modal becomes visible
  useEffect(() => {
    if (visible) {
      dispatch(fetchTenants());
      dispatch(fetchProperties());
    }
  }, [visible, dispatch]);

  // Handle form submission with improved error handling
  const handleFormSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setErrorMessage("");

      await handleSave(formData);
      
      toast.success(
        editingAgreement 
          ? "Agreement updated successfully" 
          : "Agreement added successfully"
      );
      
      setVisible(false);
    } catch (error) {
      const errorMsg = 
        error.response?.data?.message || 
        error.message ||
        "Failed to save the agreement";
      
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Memoized close handler to prevent unnecessary re-renders
  const handleClose = useCallback(() => {
    setErrorMessage("");
    setVisible(false);
  }, [setVisible]);

  // Render loading state
  const renderLoadingState = () => (
    <div className="text-center p-4">
      <CSpinner color="dark" />
      <p>Loading data...</p>
    </div>
  );

  // Render error state
  const renderErrorState = () => (
    <CAlert color="danger" dismissible onClose={() => setErrorMessage("")}>
      {resourceError || errorMessage}
    </CAlert>
  );
  
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
          {editingAgreement ? "Edit Lease Agreement" : "Add Lease Agreement"}
        </CModalTitle>
      </CModalHeader>
      
      <CModalBody>
        {/* Error handling */}
        {(resourceError || errorMessage) && renderErrorState()}

        {/* Loading state */}
        {resourceLoading ? (
          renderLoadingState()
        ) : (
          <AgreementForm
            tenants={tenants}
            properties={properties}
            initialData={editingAgreement}
            onSubmit={handleFormSubmit}
            setErrorMessage={setErrorMessage}
            isSubmitting={isSubmitting}
          />
        )}
      </CModalBody>
      
      <CModalFooter>
        <CButton 
          color="secondary" 
          onClick={handleClose} 
          disabled={isSubmitting || resourceLoading}
        >
          Cancel
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

// Memoize component to prevent unnecessary re-renders
export default React.memo(AddAgreement);