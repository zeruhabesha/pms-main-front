import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllGuests } from '../../api/actions/guestActions';
import {
    CRow,
    CCol,
    CCard,
    CCardHeader,
    CCardBody,
    CAlert,
    CSpinner
} from '@coreui/react';
import '../Super.scss';  // Assuming you have Super.scss for styling
import 'react-toastify/dist/ReactToastify.css'; // If you want to use toasts

const ViewGuest = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { guest, isLoading, isError, message } = useSelector(
    (state) => state.guest
  );
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
      const fetchGuest = async () => {
          try {
              await dispatch(fetchAllGuests(id));
          } catch (err) {
              setErrorMessage(err.message || 'Failed to fetch guest details');
          }
      };

      fetchGuest();
  }, [dispatch, id]);

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Guest Details</strong>
          </CCardHeader>
          <CCardBody>
              {isLoading && (
              <div className="text-center">
                  <CSpinner color="primary" />
                  <p>Loading guest details...</p>
              </div>
          )}
              {errorMessage && (
              <CAlert color="danger" className="mb-4">
                {errorMessage}
              </CAlert>
          )}
            {isError && (
              <CAlert color="danger" className="mb-4">
                {message}
              </CAlert>
            )}

            {!isLoading && !isError && guest && (
              <div>
                <p>
                  <strong>Name:</strong> {guest.name}
                </p>
                <p>
                  <strong>Email:</strong> {guest.email}
                </p>
                <p>
                  <strong>Phone:</strong> {guest.phoneNumber}
                </p>
                <p>
                  <strong>Arrival Date:</strong>{" "}
                  {new Date(guest.arrivalDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Departure Date:</strong>{" "}
                  {new Date(guest.departureDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Reason:</strong> {guest.reason}
                </p>
                <p>
                  <strong>QR Code:</strong> {guest.qrCode}
                </p>
                <p>
                  <strong>Access Code:</strong> {guest.accessCode}
                </p>
                  <p>
                      <strong>Notes:</strong> {guest.notes}
                  </p>
                  <p>
                      <strong>Status:</strong> {guest.status}
                  </p>
              </div>
            )}

              {!isLoading && !isError && !guest && (
                  <p>Guest not found.</p>
              )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default ViewGuest;