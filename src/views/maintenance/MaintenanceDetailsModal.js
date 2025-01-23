import React from 'react';
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
    cilMoney, // Import cilMoney here
} from '@coreui/icons';
import { CIcon } from '@coreui/icons-react';

const MaintenanceDetailsModal = ({ visible, setVisible, maintenance }) => {
    if (!maintenance) return null;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleString();
        } catch (error) {
            console.error("Error formatting date:", dateString, error);
            return 'N/A';
        }
    };

    const getTenantName = () => {
        return maintenance.tenant && maintenance.tenant.tenantName ? maintenance.tenant.tenantName : 'N/A';
    };

    const getTenantEmail = () => {
        return maintenance.tenant && maintenance.tenant.contactInformation && maintenance.tenant.contactInformation.email ? maintenance.tenant.contactInformation.email : 'N/A';
    };

    const getTenantPhone = () => {
        return maintenance.tenant && maintenance.tenant.contactInformation && maintenance.tenant.contactInformation.phoneNumber ? maintenance.tenant.contactInformation.phoneNumber : 'N/A';
    };

    const getLeaseStartDate = () => {
        return maintenance.tenant && maintenance.tenant.leaseAgreement && maintenance.tenant.leaseAgreement.startDate ? formatDate(maintenance.tenant.leaseAgreement.startDate) : 'N/A';
    };

    const getLeaseEndDate = () => {
          return maintenance.tenant && maintenance.tenant.leaseAgreement && maintenance.tenant.leaseAgreement.endDate ? formatDate(maintenance.tenant.leaseAgreement.endDate) : 'N/A';
     };

    const getRentAmount = () => {
         return maintenance.tenant && maintenance.tenant.leaseAgreement && maintenance.tenant.leaseAgreement.rentAmount ? maintenance.tenant.leaseAgreement.rentAmount : 'N/A';
    };


    const getPropertyUnit = () => {
        return maintenance.tenant && maintenance.tenant.propertyInformation && maintenance.tenant.propertyInformation.unit ? maintenance.tenant.propertyInformation.unit : 'N/A';
    };

     const getPropertyTitle = () => {
        return maintenance.property && maintenance.property.title ? maintenance.property.title : 'N/A';
     };

    return (
        <CModal size="lg" visible={visible} onClose={() => setVisible(false)} backdrop="static" keyboard={false} >
            <CModalHeader>
                <CModalTitle>Maintenance Details</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CTable bordered hover responsive>
                    <CTableHead>
                         <CTableRow>
                                <CTableHeaderCell colSpan={2}><h5>
                                  {/* <CIcon icon={cilUser} className="me-1" /> */}
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
                                    {/* <CIcon icon={cilCalendar} className="me-1" /> */}
                                     Lease Agreement
                                    </h5></CTableHeaderCell>
                            </CTableRow>
                       </CTableHead>
                       <CTableBody>
                         <CTableRow>
                            <CTableDataCell> <strong><CIcon icon={cilCalendar} className="me-1" />Lease Start Date:</strong></CTableDataCell>
                            <CTableDataCell>{getLeaseStartDate()}</CTableDataCell>
                          </CTableRow>
                           <CTableRow>
                            <CTableDataCell> <strong><CIcon icon={cilCalendar} className="me-1"/>Lease End Date:</strong></CTableDataCell>
                             <CTableDataCell>{getLeaseEndDate()}</CTableDataCell>
                          </CTableRow>
                           <CTableRow>
                            <CTableDataCell> <strong> <CIcon icon={cilMoney} className="me-1"/>Rent Amount:</strong> </CTableDataCell>
                            <CTableDataCell>{getRentAmount()}</CTableDataCell>
                            </CTableRow>
                       </CTableBody>

                     <CTableHead>
                         <CTableRow>
                                <CTableHeaderCell colSpan={2}><h5>
                                  {/* <CIcon icon={cilHome} className="me-1" /> */}
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
                                   {/* <CIcon icon={cilList} className="me-1" /> */}
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
                      </CTableBody>
                         <CTableHead>
                                 <CTableRow>
                                <CTableHeaderCell colSpan={2}><h5>
                                     {/* <CIcon icon={cilClock} className="me-1"/> */}
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

                {maintenance.photosOrVideos && maintenance.photosOrVideos.length > 0 && (
                    <>
                        <h5><CIcon icon={cilImage} className="me-1" />Photos/Videos</h5>
                        <div className="d-flex flex-wrap mt-2">
                            {maintenance.photosOrVideos.map((file, idx) => (
                                <img
                                    key={idx}
                                     src={`http://localhost:4000/api/v1/maintenances/${maintenance._id}/${file}` || placeholderImage}
                                    alt="Maintenance media"
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        objectFit: 'cover',
                                        marginRight: '10px',
                                        marginBottom: '10px',
                                    }}
                                    onError={(e) => { e.target.src = placeholderImage; }} // Fallback to placeholder image if the media fails to load
                                />
                            ))}
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