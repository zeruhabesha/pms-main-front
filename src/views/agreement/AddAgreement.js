import React, { useEffect, useState, useCallback } from "react";
import {
    CCard,
    CCardBody,
    CCardHeader,
    CButton,
    CAlert,
    CSpinner
} from "@coreui/react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AgreementForm from "./AgreementForm";
import { fetchTenants } from "../../api/actions/TenantActions";
import { filterProperties } from "../../api/actions/PropertyAction";
import { useNavigate, useParams } from "react-router-dom";
import {
    fetchAgreement,
    addAgreement,
    updateAgreement,
} from "../../api/actions/AgreementActions";
import { clearSelectedAgreement } from "../../api/slice/AgreementSlice";

const AddAgreement = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;

    const { tenants, loading: tenantsLoading, error: tenantsError } =
        useSelector((state) => state.tenant);
    const { properties, loading: propertiesLoading, error: propertiesError } =
        useSelector((state) => state.property);
    const { selectedAgreement, loading: agreementLoading, error: agreementError } =
        useSelector((state) => state.agreement);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([
                    dispatch(fetchTenants()).unwrap(),
                    dispatch(filterProperties()).unwrap(),
                ]);
                if (isEditing) {
                   await dispatch(fetchAgreement(id)).unwrap();
                 }
            } catch (error) {
                console.error("Error fetching data:", error);
                setFormError(error.message || "Failed to load initial data.");
            }
        };

        fetchData();

        return () => {
            dispatch(clearSelectedAgreement());
        };
    }, [dispatch, id, isEditing]);


     const handleFormSubmit = async (formData) => {
        if (!formData.tenant || !formData.property) {
            setFormError("Tenant and Property are required fields.");
            toast.error("Tenant and Property are required fields.");
            return;
        }
        try {
            setIsSubmitting(true);
            setFormError("");
            if (isEditing) {
                await dispatch(
                    updateAgreement({ id: id, agreementData: formData })
                ).unwrap();
                toast.success("Agreement updated successfully.");
            } else {
                await dispatch(addAgreement(formData)).unwrap();
                toast.success("Agreement added successfully.");
            }
            navigate("/agreement");
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

    const renderLoadingState = () => (
        <div className="text-center p-4">
            <CSpinner color="dark" />
            <p>Loading data...</p>
        </div>
    );

    const renderErrorState = (error) => {
        if (!error) return null;
        return (
            <CAlert color="danger" dismissible onClose={() => setFormError("")}>
                {typeof error === "object" ? error.message || JSON.stringify(error) : error}
            </CAlert>
        );
    };

    return (
        <CCard>
            <CCardHeader className="d-flex justify-content-between align-items-center">
                <strong>{isEditing ? "Edit Agreement" : "Add Agreement"}</strong>
            </CCardHeader>
            <CCardBody>
                {renderErrorState(formError)}
                {renderErrorState(tenantsError)}
                {renderErrorState(propertiesError)}
                 {renderErrorState(agreementError)}
                {tenantsLoading || propertiesLoading || (isEditing && agreementLoading)  ? (
                    renderLoadingState()
                ) : (
                    <AgreementForm
                        tenants={tenants}
                        properties={properties}
                        initialData={isEditing ? selectedAgreement : null}
                        onSubmit={handleFormSubmit}

                    />
                )}
            </CCardBody>
        </CCard>
    );
};

export default AddAgreement;