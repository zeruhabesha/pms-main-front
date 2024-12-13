import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
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

const AddAgreement = ({ visible, setVisible, editingAgreement, handleSave }) => {
  const dispatch = useDispatch();

  // Use Redux selectors for tenants and properties
  const {
    tenants = [],
    tenantsLoading = false,
    tenantsError = null,
  } = useSelector((state) => state.tenants || {});

  const {
    properties = [],
    propertiesLoading = false,
    propertiesError = null,
  } = useSelector((state) => state.properties || {});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Fetch tenants and properties when modal becomes visible
  useEffect(() => {
    if (visible) {
      dispatch(fetchTenants());
      dispatch(fetchProperties());
    }
  }, [visible, dispatch]);

  const handleFormSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setFormError("");

      await handleSave(formData);

      toast.success(
        editingAgreement
          ? "Agreement updated successfully."
          : "Agreement added successfully."
      );

      setVisible(false);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to save the agreement.";
      setFormError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = useCallback(() => {
    setFormError("");
    setVisible(false);
  }, [setVisible]);

  const renderLoadingState = () => (
    <div className="text-center p-4">
      <CSpinner color="dark" />
      <p>Loading data...</p>
    </div>
  );

  const renderErrorState = (error) => (
    <CAlert color="danger" dismissible onClose={() => setFormError("")}> 
      {typeof error === "object" ? error.message || JSON.stringify(error) : error}
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
        {/* Display errors */}
        {formError && renderErrorState(formError)}
        {tenantsError && renderErrorState(tenantsError)}
        {propertiesError && renderErrorState(propertiesError)}

        {/* Display loading state */}
        {tenantsLoading || propertiesLoading ? (
          renderLoadingState()
        ) : (
          <AgreementForm
            tenants={tenants}
            properties={properties}
            initialData={editingAgreement}
            onSubmit={handleFormSubmit}
            setErrorMessage={setFormError}
            isSubmitting={isSubmitting}
          />
        )}
      </CModalBody>

      <CModalFooter>
        <CButton
          color="secondary"
          onClick={handleClose}
          disabled={isSubmitting || tenantsLoading || propertiesLoading}
        >
          Cancel
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

AddAgreement.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  editingAgreement: PropTypes.object,
  handleSave: PropTypes.func.isRequired,
};

export default React.memo(AddAgreement);
