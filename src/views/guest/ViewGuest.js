import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    CRow,
    CCol,
    CCard,
    CCardHeader,
    CCardBody,
    CAlert,
    CSpinner,
} from '@coreui/react';
import '../Super.scss';
import 'react-toastify/dist/ReactToastify.css';
import { fetchGuestById } from '../../api/actions/guestActions';
import { decryptData } from '../../api/utils/crypto';

const ViewGuest = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { guestDetails, loading, error } = useSelector((state) => ({
        guestDetails: state.guest.guestDetails,
        loading: state.guest.loading,
        error: state.guest.error,
    }));

    const [errorMessage, setErrorMessage] = useState('');
     const [userPermissions, setUserPermissions] = useState(null);

    useEffect(() => {
         const encryptedUser = localStorage.getItem('user');
        if (encryptedUser) {
            const decryptedUser = decryptData(encryptedUser);
            if (decryptedUser && decryptedUser.permissions) {
                setUserPermissions(decryptedUser.permissions);
            }
        }

        const fetchGuest = async () => {
            try {
                const response = await dispatch(fetchGuestById(id)).unwrap();
                if (!response) {
                    setErrorMessage('Guest details not found');
                    navigate('/guests');
                }
            } catch (err) {
                setErrorMessage(err.message || 'Failed to fetch guest details');
                navigate('/guests');
            }
        };
        fetchGuest();
    }, [dispatch, id, navigate]);


    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader className="d-flex justify-content-between align-items-center">
                        <strong>Guest Details</strong>
                        <div className="d-flex gap-2">
                        {userPermissions?.addGuest && (
                            <Link to="/guests/add" className="learn-more" style={{ textDecoration: 'none' }}>
                                <span className="circle" aria-hidden="true">
                                    <span className="icon arrow"></span>
                                </span>
                                <span className="button-text">Add Guest</span>
                            </Link>
                         )}

                         <Link to="/guests" className="learn-more" style={{textDecoration: 'none'}}>
                            <span className="circle" aria-hidden="true">
                                <span className="icon arrow"></span>
                            </span>
                            <span className="button-text">Go Back</span>
                         </Link>
                     </div>
                    </CCardHeader>
                    <CCardBody>
                        {errorMessage && (
                            <CAlert color="danger" className="mb-4">
                                {errorMessage}
                            </CAlert>
                        )}
                        {loading && (
                            <div className="text-center">
                                <CSpinner color="primary" />
                                <p>Loading guest details...</p>
                            </div>
                        )}
                        {error && (
                            <CAlert color="danger" className="mb-4">
                                {error}
                            </CAlert>
                        )}

                        {!loading && !error && guestDetails && (
                            <div>
                                <p>
                                    <strong>Name:</strong> {guestDetails?.name}
                                </p>
                                <p>
                                    <strong>Email:</strong> {guestDetails?.email}
                                </p>
                                <p>
                                    <strong>Phone:</strong> {guestDetails?.phoneNumber}
                                </p>
                                <p>
                                    <strong>Arrival Date:</strong>{" "}
                                    {new Date(guestDetails?.arrivalDate).toLocaleDateString()}
                                </p>
                                <p>
                                    <strong>Departure Date:</strong>{" "}
                                    {new Date(guestDetails?.departureDate).toLocaleDateString()}
                                </p>
                                <p>
                                    <strong>Reason:</strong> {guestDetails?.reason}
                                </p>
                                <p>
                                    <strong>QR Code:</strong> {guestDetails?.qrCode}
                                </p>
                                <p>
                                    <strong>Access Code:</strong> {guestDetails?.accessCode}
                                </p>
                                <p>
                                    <strong>Notes:</strong> {guestDetails?.notes}
                                </p>
                                <p>
                                    <strong>Status:</strong> {guestDetails?.status}
                                </p>
                            </div>
                        )}

                        {!loading && !error && !guestDetails && (
                            <p>Guest not found.</p>
                        )}
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default ViewGuest;