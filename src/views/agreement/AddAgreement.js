import React, { useEffect, useState, useCallback, useRef } from "react";
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
import { filterProperties } from "../../api/actions/PropertyAction";

const AddAgreement = ({ visible, setVisible, editingAgreement, handleSave }) => {
    const dispatch = useDispatch();

    const { tenants, loading: tenantsLoading, error: tenantsError } =
        useSelector((state) => state.tenant);
    const { properties, loading: propertiesLoading, error: propertiesError } =
        useSelector((state) => state.property);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState("");
    const hasFetchedData = useRef(false);

    useEffect(() => {
        const fetchData = async () => {
            if (visible && !hasFetchedData.current) {
                try {
                    await Promise.all([
                        dispatch(fetchTenants()).unwrap(),
                        dispatch(filterProperties()).unwrap(),
                    ]);
                    hasFetchedData.current = true;
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            } else if (!visible) {
                 hasFetchedData.current = false
            }
        };

        fetchData();
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
                error.message ||
                error.response?.data?.message ||
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
         hasFetchedData.current = false
    }, [setVisible]);


    const renderLoadingState = () => (
        <div className="text-center p-4">
            <CSpinner color="dark" />
            <p>Loading data...</p>
        </div>
    );

    const renderErrorState = (error) => {
        if (!error) return null
        return(
             <CAlert color="danger" dismissible onClose={() => setFormError("")}>
                  {typeof error === "object" ? error.message || JSON.stringify(error) : error}
              </CAlert>
            )
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
                    {editingAgreement ? "Edit Lease Agreement" : "Add Lease Agreement"}
                </CModalTitle>
            </CModalHeader>

            <CModalBody>
                {/* Display errors */}
                {renderErrorState(formError)}
                {renderErrorState(tenantsError)}
                {renderErrorState(propertiesError)}
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