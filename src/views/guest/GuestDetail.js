// src/views/guest/GuestDetail.jsx
import React, { useEffect } from 'react';
import {
    CRow,
    CCol,
    CCard,
    CCardHeader,
    CCardBody,
    CAlert,
    CSpinner,
    CBadge,
    CListGroup,
    CListGroupItem
} from '@coreui/react';
import { CIcon } from '@coreui/icons-react';
import {
    cilUser,
    cilHome,
    cilInfo,
    cilEnvelopeClosed,
    cilPhone,
    cilCalendar,
    cilDescription,
    cilCheckCircle,
    cilWarning,
    cilXCircle,
} from '@coreui/icons';
import { formatDate } from "../../api/utils/dateFormatter";
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGuestById } from '../../api/actions/guestActions';

const GuestDetail = () => {
    const { id } = useParams(); // Access the 'id' parameter from the URL
    const dispatch = useDispatch();
    const { guestDetails, loading, error } = useSelector((state) => state.guest); // Access guestDetails from Redux store

    useEffect(() => {
        // Fetch guest details when the component mounts
        dispatch(fetchGuestById(id));
    }, [dispatch, id]); // Dispatch the fetch action

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center">
                <CSpinner color="primary" />
            </div>
        );
    }

    if (error) {
        return (
            <CAlert color="danger">
                {error.message}
            </CAlert>
        );
    }

    if (!guestDetails) {
        return <CAlert color="warning">No guest details found.</CAlert>;
    }

    const getStatusStyle = (status) => {
        switch (status) {
            case 'expired':
                return 'danger';
            case 'active':
                return 'success';
            case 'cancelled':
                return 'secondary';
            default:
                return 'primary';
        }
    };

    const statusColor = getStatusStyle(guestDetails.status);
    const statusIcon =
        guestDetails.status === 'active' ? cilCheckCircle
            : guestDetails.status === 'expired' ? cilXCircle
                : cilWarning;

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader className="d-flex justify-content-between align-items-center">
                        <strong>Guest Details</strong>
                        <CBadge color={statusColor}>
                            <CIcon icon={statusIcon} className="me-1" />
                            {guestDetails?.status}
                        </CBadge>
                    </CCardHeader>
                    <CCardBody>
                        <CListGroup flush>
                            <CListGroupItem>
                                <strong><CIcon icon={cilUser} className="me-1" />Name:</strong> {guestDetails?.name}
                            </CListGroupItem>
                            <CListGroupItem>
                                <strong><CIcon icon={cilEnvelopeClosed} className="me-1" />Email:</strong> {guestDetails?.email}
                            </CListGroupItem>
                            <CListGroupItem>
                                <strong><CIcon icon={cilPhone} className="me-1" />Phone Number:</strong> {guestDetails?.phoneNumber}
                            </CListGroupItem>
                            <CListGroupItem>
                                <strong><CIcon icon={cilCalendar} className="me-1" />Arrival Date:</strong> {formatDate(guestDetails?.arrivalDate)}
                            </CListGroupItem>
                            <CListGroupItem>
                                <strong><CIcon icon={cilCalendar} className="me-1" />Departure Date:</strong> {formatDate(guestDetails?.departureDate)}
                            </CListGroupItem>
                            <CListGroupItem>
                                <strong><CIcon icon={cilInfo} className="me-1" />Reason:</strong> {guestDetails?.reason}
                            </CListGroupItem>
                            <CListGroupItem>
                                <strong><CIcon icon={cilDescription} className="me-1" />Notes:</strong> {guestDetails?.notes}
                            </CListGroupItem>
                            <CListGroupItem>
                                <strong><CIcon icon={cilHome} className="me-1" />Access Code:</strong> {guestDetails?.accessCode}
                            </CListGroupItem>

                        </CListGroup>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default GuestDetail;