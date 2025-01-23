import React from 'react';
import {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CButton,
    CCol,
    CRow
} from '@coreui/react';
import { format } from 'date-fns';


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
    return (
        <CModal size="lg"  visible={visible} onClose={closeModal}>
            <CModalHeader>
                <CModalTitle>Guest Details</CModalTitle>
            </CModalHeader>
            <CModalBody>
                {guestDetails ? (
                    <CRow>
                        <CCol md={6}>
                            <p>
                                <strong>Name:</strong> {guestDetails.name}
                            </p>
                            <p>
                                <strong>Email:</strong> {guestDetails.email}
                            </p>
                            <p>
                                <strong>Phone:</strong> {guestDetails.phoneNumber}
                            </p>
                            <p>
                                <strong>Arrival Date:</strong> {formatDate(guestDetails.arrivalDate)}
                            </p>
                             <p>
                                 <strong>Departure Date:</strong> {formatDate(guestDetails.departureDate)}
                             </p>
                             <p>
                                 <strong>Reason:</strong> {guestDetails.reason}
                             </p>
                              <p>
                                 <strong>Notes:</strong> {guestDetails.notes}
                             </p>
                        </CCol>
                        <CCol md={6}>
                              <p>
                                <strong>QR Code:</strong> {guestDetails.qrCode}
                            </p>
                            <p>
                                <strong>Access Code:</strong> {guestDetails.accessCode}
                            </p>
                             <p>
                                <strong>Status:</strong> {guestDetails.status}
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