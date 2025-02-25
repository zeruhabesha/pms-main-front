import React, { useState, useEffect } from 'react';
import {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CButton,
    CTable,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
    CTableHead,
    CTableBody,
} from '@coreui/react';
import placeholderImage from './maintenance.jpeg';
import {
    cilUser,
    cilEnvelopeOpen,
    cilPhone,
    cilCalendar,
    cilHome,
    cilList,
    cilClock,
    cilInfo,
    cilDescription,
     cilImage,
    cilMoney,
} from '@coreui/icons';
import { CIcon } from '@coreui/icons-react';
import { format } from 'date-fns';
import httpCommon from '../../api/http-common'; // Import your httpCommon
import { decryptData } from '../../api/utils/crypto';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserById } from '../../api/actions/UserActions';

const MaintenanceDetailsModal = ({ visible, setVisible, maintenance }) => {
    const [assignedMaintainer, setAssignedMaintainer] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const fetchedUser = useSelector((state) => state.user.user);

    useEffect(() => {
        const fetchAssignedMaintainer = async () => {
            if (maintenance?.assignedMaintainer) {
                setLoading(true);
                setError(null);
                try {
                  // const encryptedUser = localStorage.getItem('token')
                  // const token = decryptData(encryptedUser)
                  //   const response = await httpCommon.get(`/users/${maintenance.assignedMaintainer}`, {
                  //     headers: {
                  //       Authorization: `Bearer ${token}`,
                  //     },
                  //   });
                  //   setAssignedMaintainer(response.data.data);
                  const result = await dispatch(fetchUserById(maintenance.assignedMaintainer)).unwrap()
                  console.log("Dispatched fetchUserById:", result)

                } catch (err) {
                    setError(err.message || 'Failed to fetch assigned maintainer.');
                    console.error('Failed to fetch assigned maintainer:', err);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchAssignedMaintainer();
    }, [dispatch, maintenance?.assignedMaintainer]);

    useEffect(() => {
      if (fetchedUser) {
        setAssignedMaintainer(fetchedUser);
        console.log("Assigned Maintainer Set:", fetchedUser)
      }
    }, [fetchedUser]);

    if (!maintenance) return null;

   const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return format(new Date(dateString), 'MMM dd, yyyy hh:mm a');
        } catch (error) {
            console.error("Error formatting date:", dateString, error);
            return 'N/A';
        }
    };


    const getTenantName = () => maintenance?.tenant?.name || 'N/A';

    const getTenantEmail = () => maintenance?.tenant?.email || 'N/A';

    const getTenantPhone = () => maintenance?.tenant?.phoneNumber || 'N/A';

    const getLeaseStartDate = () =>
        maintenance?.tenant?.activeStart
            ? formatDate(maintenance.tenant.activeStart)
            : 'N/A';


    const getPropertyUnit = () =>  maintenance?.property?.numberOfUnits || 'N/A';
      const getPropertyTitle = () => maintenance?.property?.title || 'N/A';
    return (
        <CModal size="lg" visible={visible} onClose={() => setVisible(false)} backdrop="static" keyboard={false} >
            <CModalHeader>
                <CModalTitle>Maintenance Details</CModalTitle>
            </CModalHeader>
            <CModalBody>
             {error && <p className="text-danger">{error}</p>}
                {loading ? (
                    <p>Loading Assigned Maintainer...</p>
                ) : (
                    <CTable bordered hover responsive>
                    <CTableHead>
                         <CTableRow>
                                <CTableHeaderCell colSpan={2}><h5>
                                  Tenant Information
                                    </h5></CTableHeaderCell>
                            </CTableRow>
                         </CTableHead>
                           <CTableBody>
                               <CTableRow>
                                 <CTableDataCell><strong> <CIcon icon={cilUser} className="me-1"/>Tenant Name:</strong></CTableDataCell>
                                   <CTableDataCell>{getTenantName()}</CTableDataCell>
                                </CTableRow>
                                  <CTableRow>
                                 <CTableDataCell><strong> <CIcon icon={cilEnvelopeOpen} className="me-1"/>Contact Email:</strong></CTableDataCell>
                                   <CTableDataCell>{getTenantEmail()}</CTableDataCell>
                                </CTableRow>
                                 <CTableRow>
                                 <CTableDataCell><strong> <CIcon icon={cilPhone} className="me-1"/>Contact Phone:</strong></CTableDataCell>
                                   <CTableDataCell>{getTenantPhone()}</CTableDataCell>
                                </CTableRow>
                            </CTableBody>

                       <CTableHead>
                         <CTableRow>
                                <CTableHeaderCell colSpan={2}><h5>
                                     Lease Agreement
                                    </h5></CTableHeaderCell>
                            </CTableRow>
                       </CTableHead>
                       <CTableBody>
                         <CTableRow>
                            <CTableDataCell> <strong><CIcon icon={cilCalendar} className="me-1" />Lease Start Date:</strong></CTableDataCell>
                            <CTableDataCell>{getLeaseStartDate()}</CTableDataCell>
                          </CTableRow>
                           {/* <CTableRow>
                            <CTableDataCell> <strong><CIcon icon={cilCalendar} className="me-1"/>Lease End Date:</strong></CTableDataCell>
                             <CTableDataCell>{getLeaseEndDate()}</CTableDataCell>
                          </CTableRow> */}

                       </CTableBody>

                     <CTableHead>
                         <CTableRow>
                                <CTableHeaderCell colSpan={2}><h5>
                                   Property Information
                                  </h5></CTableHeaderCell>
                            </CTableRow>
                       </CTableHead>
                       <CTableBody>
                           <CTableRow>
                               <CTableDataCell><strong><CIcon icon={cilHome} className="me-1" />Property Unit:</strong></CTableDataCell>
                                   <CTableDataCell>{getPropertyUnit()}</CTableDataCell>
                               </CTableRow>
                             <CTableRow>
                              <CTableDataCell><strong><CIcon icon={cilHome} className="me-1" />Property Title:</strong></CTableDataCell>
                                   <CTableDataCell>{getPropertyTitle()}</CTableDataCell>
                           </CTableRow>
                        </CTableBody>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell colSpan={2}><h5>
                                  Maintenance Request
                                  </h5></CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                      <CTableBody>
                          <CTableRow>
                                 <CTableDataCell><strong><CIcon icon={cilList} className="me-1" />Request Type:</strong></CTableDataCell>
                                   <CTableDataCell>{maintenance.typeOfRequest || 'N/A'}</CTableDataCell>
                               </CTableRow>
                              <CTableRow>
                                <CTableDataCell><strong><CIcon icon={cilInfo} className="me-1" />Urgency Level:</strong></CTableDataCell>
                                   <CTableDataCell>{maintenance.urgencyLevel || 'N/A'}</CTableDataCell>
                                </CTableRow>
                              <CTableRow>
                               <CTableDataCell><strong><CIcon icon={cilInfo} className="me-1" />Status:</strong></CTableDataCell>
                                  <CTableDataCell>{maintenance.status || 'N/A'}</CTableDataCell>
                              </CTableRow>
                                <CTableRow>
                                 <CTableDataCell> <strong><CIcon icon={cilDescription} className="me-1" />Description:</strong></CTableDataCell>
                                   <CTableDataCell>{maintenance.description || 'No description provided.'}</CTableDataCell>
                                 </CTableRow>
                               <CTableRow>
                                 <CTableDataCell> <strong><CIcon icon={cilClock} className="me-1"/>Estimated Completion Time:</strong></CTableDataCell>
                                  <CTableDataCell>{formatDate(maintenance.estimatedCompletionTime)}</CTableDataCell>
                              </CTableRow>
                               <CTableRow>
                                 <CTableDataCell><strong> <CIcon icon={cilDescription} className="me-1" />Notes:</strong></CTableDataCell>
                                 <CTableDataCell>{maintenance.notes || 'No notes available.'}</CTableDataCell>
                             </CTableRow>
                             {/* <CTableDataCell><strong><CIcon icon={cilUser} className="me-1" />Assigned Maintainer:</strong></CTableDataCell> */}

                               {/* {fetchedUser && ( */}
                                    <CTableRow>
                                        <CTableDataCell><strong><CIcon icon={cilUser} className="me-1" />Assigned Maintainer:</strong></CTableDataCell>
                                        <CTableDataCell>{maintenance.assignedMaintainer.name || 'N/A'}</CTableDataCell>
                                    </CTableRow>
                                {/* )} */}
                      </CTableBody>
                         <CTableHead>
                                 <CTableRow>
                                <CTableHeaderCell colSpan={2}><h5>
                                    Timestamps
                                    </h5></CTableHeaderCell>
                                 </CTableRow>
                          </CTableHead>
                         <CTableBody>
                             <CTableRow>
                                  <CTableDataCell><strong><CIcon icon={cilClock} className="me-1"/>Created At:</strong></CTableDataCell>
                                  <CTableDataCell>{formatDate(maintenance.createdAt)}</CTableDataCell>
                              </CTableRow>
                             <CTableRow>
                                <CTableDataCell> <strong> <CIcon icon={cilClock} className="me-1"/>Updated At:</strong></CTableDataCell>
                                  <CTableDataCell>{formatDate(maintenance.updatedAt)}</CTableDataCell>
                              </CTableRow>
                         </CTableBody>
                </CTable>
                )}
                   {maintenance.photosOrVideos && maintenance.photosOrVideos.length > 0 && (
    <>
        <h5><CIcon icon={cilImage} className="me-1" />Photos/Videos</h5>
        <div className="d-flex flex-wrap mt-2">
            {maintenance.photosOrVideos.map((url, idx) => (
                    <img
                        key={idx}
                        src={url}
                         alt="Maintenance media"
                            style={{
                            width: '100px',
                            height: '100px',
                            objectFit: 'cover',
                            marginRight: '10px',
                            marginBottom: '10px',
                        }}
                        onError={(e) => {
                            e.target.src = placeholderImage;
                        }}
                    />
                ))}
        </div>
    </>
)}
                {maintenance.property?.photos && maintenance.property?.photos.length > 0 && (
    <>
        <h5><CIcon icon={cilImage} className="me-1" />Property Photos</h5>
        <div className="d-flex flex-wrap mt-2">
            {maintenance.property.photos.map((photo, idx) => {

                      const imageUrl = photo.url ? `https://pms-backend-sncw.onrender.com/api/v1/${photo.url}` :
                                            Object.values(photo)[0]  ? `https://pms-backend-sncw.onrender.com/api/v1/properties/${Object.values(photo)[0]}` : null;

                return imageUrl ?
                    (<img
                            key={idx}
                        src={imageUrl}
                        alt={`Property Image ${idx}`}
                        style={{
                            width: '100px',
                            height: '100px',
                            objectFit: 'cover',
                            marginRight: '10px',
                            marginBottom: '10px',
                        }}
                         onError={(e) => {
                             e.target.src = placeholderImage;
                         }}

                    />) : null;
                })}
        </div>
    </>
)}
            {maintenance.tenant?.photo && (
                 <>
                    <h5><CIcon icon={cilImage} className="me-1" />Tenant Photo</h5>
                    <div className="d-flex flex-wrap mt-2">
                     <img
                             src={`https://pms-backend-sncw.onrender.com/api/v1/uploads/maintenance/${maintenance.tenant.photo}`}
                             alt="Tenant Photo"
                            style={{
                                  width: '100px',
                                  height: '100px',
                                  objectFit: 'cover',
                                  marginRight: '10px',
                                  marginBottom: '10px',
                            }}
                              onError={(e) => {
                             e.target.src = placeholderImage;
                            }}
                         />
                    </div>
                 </>
            )}
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={() => setVisible(false)}>
                    Close
                </CButton>
            </CModalFooter>
        </CModal>
    );
};

export default MaintenanceDetailsModal;