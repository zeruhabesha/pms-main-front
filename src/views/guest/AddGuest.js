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
    CForm, //Import CForm here
} from "@coreui/react";
import { useDispatch, useSelector } from "react-redux";
import { decryptData } from "../../api/utils/crypto";
import { useNavigate } from "react-router-dom";
import { createGuest } from "../../api/actions/guestActions";
import PropertySelect from "./PropertySelect";
import { reset } from "../../api/slice/guestSlice";
import { toast } from "react-toastify";
import {
    cilUser,
    cilHome,
    cilInfo,
    cilEnvelopeClosed,
    cilPhone,
    cilCalendar,
    cilDescription ,
} from '@coreui/icons';
import { CIcon } from '@coreui/icons-react';
import { addGuest, updateGuest } from '../../api/actions/guestActions';

const AddGuest = ({ visible, setVisible, editingGuest, setEditingGuest }) => {
    const dispatch = useDispatch();

    const navigate = useNavigate();
    const properties = useSelector((state) => state.property.properties);
    const loading = useSelector((state) => state.property.loading);
    const error = useSelector((state) => state.property.error);
    // const { isLoading } = useSelector((state) => state.guest);
    const [noPropertiesMessage, setNoPropertiesMessage] = useState(null);
    const [localError, setError] = useState(null);
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      phoneNumber: '',
      arrivalDate: '',
      departureDate: '',
      reason: '',
      accessCode: '',
      notes: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (editingGuest) {
          setFormData({
            name: editingGuest.name || '',
            email: editingGuest.email || '',
            phoneNumber: editingGuest.phoneNumber || '',
            arrivalDate: editingGuest.arrivalDate || '',
            departureDate: editingGuest.departureDate || '',
            reason: editingGuest.reason || '',
            accessCode: editingGuest.accessCode || '',
            notes: editingGuest.notes || '',
          });
        } else {
          setFormData({
            name: '',
            email: '',
            phoneNumber: '',
            arrivalDate: '',
            departureDate: '',
            reason: '',
            accessCode: '',
            notes: '',
          });
        }
      }, [editingGuest]);


      useEffect(() => {
          const fetchUser =  () => {
            const encryptedUser = localStorage.getItem("user");
               if (encryptedUser) {
                   try {
                       const decryptedUser = decryptData(encryptedUser);
                        if (decryptedUser && decryptedUser._id) {
                             setFormData((prev) => ({ ...prev, user: decryptedUser._id }));

                         } else {
                            setError("Invalid user data, try to log in again")
                           }

                    } catch (error) {
                        setError("Error decoding token, try to log in again")
                   }
                 }
           };
        fetchUser();
        if (properties.length === 0 && !loading && !error) {
            setNoPropertiesMessage('No properties available for this tenant.');
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
        if (!formData.name) return "Please enter the guest name.";
         if (!formData.phoneNumber) return "Please enter the guest phone number.";
         if (!formData.arrivalDate) return "Please select the arrival date.";
        if (!formData.departureDate) return "Please select the departure date.";
         if (!formData.reason) return "Please enter the reason for visit.";

        return null;
    };

    const onSubmit = async () => {
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            if (editingGuest) {
                // Update guest
                await dispatch(updateGuest({ id: editingGuest._id, guestData: formData })).unwrap();
                toast.success('Guest updated successfully!');
            } else {
                // Add new guest
                await dispatch(createGuest(formData)).unwrap();
                toast.success('Guest added successfully!');
            }

            dispatch(reset());
            handleClose();
        } catch (error) {
            setError(error.message || 'Failed to save guest');
        }
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setIsLoading(true);
    //     try {
    //       if (editingGuest) {
    //         await dispatch(updateGuest({ id: editingGuest._id, guestData: formData })).unwrap();
    //         toast.success('Guest updated successfully!');
    //       } else {
    //         await dispatch(addGuest(formData)).unwrap();
    //         toast.success('Guest added successfully!');
    //       }
    //       setVisible(false);
    //       setEditingGuest(null);
    //     } catch (error) {
    //       toast.error(error?.message || 'Failed to save guest.');
    //     } finally {
    //       setIsLoading(false);
    //     }
    //   };

    const handleClose = () => {
        setVisible(false);
        setEditingGuest(null); // Reset editing guest
        setFormData({
            user: "",
            property: "",
            name: "",
            email: "",
            phoneNumber: "",
            arrivalDate: "",
            departureDate: "",
            reason: "",
            accessCode: "",
            notes: "",
        });
        setError(null);
    };

    const handlePropertyChange = (e) => {
            setFormData((prev) => ({ ...prev, property: e.target.value }));
        };
    return (
        <CModal visible={visible} onClose={handleClose} alignment="center" backdrop="static" size="lg">
            <CModalHeader>
        <CModalTitle>{editingGuest ? 'Edit Guest' : 'Add Guest'}</CModalTitle>
      </CModalHeader>
   
            <CModalBody>
                <div className="maintenance-form">
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

<CForm onSubmit={onSubmit}>
                            <CRow className="g-3">
                                  <CCol md={6}>
                                    <CFormLabel htmlFor="user"><CIcon icon={cilUser} className="me-1" />User ID</CFormLabel>
                                      <CFormInput
                                        id="user"
                                        type="text"
                                        value={formData.user}
                                          readOnly
                                        style={{ backgroundColor: 'aliceblue' }}
                                       />
                                </CCol>
                                 <CCol md={6}>
                                      <CFormLabel htmlFor="property"><CIcon icon={cilHome} className="me-1"/>Property</CFormLabel>
                                        <PropertySelect
                                            value={formData.property}
                                          onChange={handlePropertyChange}
                                         required
                                    />
                                </CCol>
                                <CCol md={6}>
                                    <CFormInput
                                      label={<span><CIcon icon={cilUser} className="me-1" />Name</span>}
                                      type="text"
                                        name="name"
                                         value={formData.name}
                                       onChange={handleChange}
                                        style={{ backgroundColor: 'aliceblue' }}
                                    />
                                </CCol>
                                <CCol md={6}>
                                    <CFormInput
                                        label={<span><CIcon icon={cilEnvelopeClosed} className="me-1" />Email</span>}
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        style={{ backgroundColor: 'aliceblue' }}
                                    />
                                </CCol>
                                <CCol md={6}>
                                    <CFormInput
                                         label={<span><CIcon icon={cilPhone} className="me-1" />Phone Number</span>}
                                        type="tel"
                                        name="phoneNumber"
                                         value={formData.phoneNumber}
                                          onChange={handleChange}
                                        style={{ backgroundColor: 'aliceblue' }}
                                    />
                                </CCol>
                                 <CCol md={6}>
                                    <CFormInput
                                         label={<span><CIcon icon={cilCalendar} className="me-1" />Arrival Date</span>}
                                        type="date"
                                        name="arrivalDate"
                                         value={formData.arrivalDate}
                                          onChange={handleChange}
                                        style={{ backgroundColor: 'aliceblue' }}
                                    />
                                </CCol>
                                <CCol md={6}>
                                    <CFormInput
                                        label={<span><CIcon icon={cilCalendar} className="me-1" />Departure Date</span>}
                                        type="date"
                                        name="departureDate"
                                        value={formData.departureDate}
                                          onChange={handleChange}
                                        style={{ backgroundColor: 'aliceblue' }}
                                    />
                                </CCol>
                                <CCol md={6}>
                                    <CFormInput
                                        label={<span><CIcon icon={cilInfo} className="me-1" />Reason for Visit</span>}
                                        type="text"
                                         name="reason"
                                        value={formData.reason}
                                          onChange={handleChange}
                                        style={{ backgroundColor: 'aliceblue' }}
                                    />
                                </CCol>
                                 <CCol md={6}>
                                    <CFormInput
                                        label={<span><CIcon icon={cilInfo} className="me-1" />Access Code</span>}
                                        type="text"
                                        name="accessCode"
                                          value={formData.accessCode}
                                        onChange={handleChange}
                                         style={{ backgroundColor: 'aliceblue' }}
                                    />
                                </CCol>
                                <CCol md={6}>
                                    <CFormInput
                                          label={<span><CIcon icon={cilDescription} className="me-1" />Notes</span>}
                                        type="textarea"
                                         name="notes"
                                       value={formData.notes}
                                          onChange={handleChange}
                                         style={{ backgroundColor: 'aliceblue' }}
                                    />
                                </CCol>
                            </CRow>
                           </CForm>
                        </CCardBody>
                    </CCard>
                </div>
                </CModalBody>
            <CModalFooter>
                <CButton color="secondary" variant="ghost" onClick={handleClose} disabled={isLoading}>
                    Cancel
                </CButton>
                <CButton color="dark" onClick={onSubmit} disabled={isLoading}>
                    {isLoading ? "Saving..." : editingGuest ? "Update Guest" : "Add Guest"}
                </CButton>
            </CModalFooter>
        </CModal>
    );
};

export default AddGuest;