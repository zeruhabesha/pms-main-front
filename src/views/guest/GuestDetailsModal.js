import React from 'react';
import {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CButton,
    CCol,
    CRow,
} from '@coreui/react';
import { CIcon } from '@coreui/icons-react';
import { cilUser, cilHome, cilInfo, cilEnvelopeClosed, cilPhone, cilCalendar, cilDescription, cilCheckCircle, cilXCircle, cilWarning } from '@coreui/icons';
import { format } from 'date-fns';
import './GuestDetailsModal.scss';

const GuestDetailsModal = ({ visible, setVisible, guestDetails }) => {
    const closeModal = () => {
        setVisible(false);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return format(new Date(dateString), 'yyyy-MM-dd');
        } catch (e) {
            return 'N/A';
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'active':
                return { icon: cilCheckCircle, color: '#4caf50' }; // Green
            case 'expired':
                return { icon: cilXCircle, color: '#e50505' }; // Red
            default:
                return { icon: cilInfo, color: '#9e9e9e' }; // Gray
        }
    };

    return (
        <CModal size="lg" visible={visible} onClose={closeModal} className="guest-details-modal">
            <CModalHeader>
                <CModalTitle>Guest Details</CModalTitle>
            </CModalHeader>
            <CModalBody>
                {guestDetails ? (
                    <CRow>
                        <CCol md={6}>
                            <p><strong>Name:</strong> {guestDetails.name}</p>
                            <p><strong>Email:</strong> {guestDetails.email}</p>
                            <p><strong>Phone:</strong> {guestDetails.phoneNumber}</p>
                            <p><strong>Arrival Date:</strong> {formatDate(guestDetails.arrivalDate)}</p>
                            <p><strong>Departure Date:</strong> {formatDate(guestDetails.departureDate)}</p>
                            <p><strong>Reason:</strong> {guestDetails.reason}</p>
                            <p><strong>Notes:</strong> {guestDetails.notes}</p>
                        </CCol>
                        <CCol md={6} className="qr-code-section">
                            {guestDetails.qrCode ? (
                                <div className="qr-code-container">
                                    <img
                                        src={`https://pms-backend-sncw.onrender.com/api/v1/${guestDetails.qrCode}`}
                                        alt="QR Code"
                                        className="qr-code"
                                    />
                                    <p className="qr-code-label">Scan this code for guest access</p>
                                </div>
                            ) : (
                                <p>No QR Code available</p>
                            )}
                            <p><strong>Access Code:</strong> {guestDetails.accessCode}</p>
                        </CCol>
                        <CCol md={6} className="status-section">
                            <div
                                className="status-icon"
                                style={{
                                    fontSize: '40px',
                                    fontWeight: 'bold',
                                    color: getStatusStyle(guestDetails.status).color,
                                    marginBottom: '10px',
                                }}
                            >
                                <CIcon icon={getStatusStyle(guestDetails.status).icon} size="xl" />
                            </div>
                            <p className="status-label">
                                <strong>Status:</strong>{' '}
                                <span style={{ color: getStatusStyle(guestDetails.status).color }}>
                                    {guestDetails.status}
                                </span>
                            </p>
                        </CCol>
                    </CRow>
                ) : (
                    <p>No details available for this guest.</p>
                )}
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={closeModal}>
                    Close
                </CButton>
            </CModalFooter>
        </CModal>
    );
};

export default GuestDetailsModal;
