import React from 'react';
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton, CTable, CTableRow, CTableHeaderCell, CTableDataCell, CTableHead, CTableBody } from '@coreui/react';import placeholderImage from './maintenance.jpeg';

const MaintenanceDetailsModal = ({ visible, setVisible, maintenance }) => {
    if (!maintenance) return null; // If no maintenance data, do not render the modal.

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString();
    };

    return (
        <CModal size="lg" visible={visible} onClose={() => {}} backdrop="static" keyboard={false} >
            <CModalHeader>
                <CModalTitle>Maintenance Details</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CTable bordered hover responsive>
                    <CTableHead>
                         <CTableRow>
                                <CTableHeaderCell colSpan={2}><h5>Tenant Information</h5></CTableHeaderCell>
                            </CTableRow>
                         </CTableHead>
                           <CTableBody>
                               <CTableRow>
                                 <CTableDataCell><strong>Tenant Name:</strong></CTableDataCell>
                                   <CTableDataCell>{maintenance.tenant?.tenantName || 'N/A'}</CTableDataCell>
                                </CTableRow>
                                  <CTableRow>
                                 <CTableDataCell><strong>Contact Email:</strong></CTableDataCell>
                                   <CTableDataCell>{maintenance.tenant?.contactInformation?.email || 'N/A'}</CTableDataCell>
                                </CTableRow>
                                 <CTableRow>
                                 <CTableDataCell><strong>Contact Phone:</strong></CTableDataCell>
                                   <CTableDataCell>{maintenance.tenant?.contactInformation?.phoneNumber || 'N/A'}</CTableDataCell>
                                </CTableRow>
                            </CTableBody>

                       <CTableHead>
                         <CTableRow>
                                <CTableHeaderCell colSpan={2}><h5>Lease Agreement</h5></CTableHeaderCell>
                            </CTableRow>
                       </CTableHead>
                       <CTableBody>
                         <CTableRow>
                            <CTableDataCell> <strong>Lease Start Date:</strong></CTableDataCell>
                            <CTableDataCell>{formatDate(maintenance.tenant?.leaseAgreement?.startDate)}</CTableDataCell>
                          </CTableRow>
                           <CTableRow>
                            <CTableDataCell> <strong>Lease End Date:</strong></CTableDataCell>
                            <CTableDataCell>{formatDate(maintenance.tenant?.leaseAgreement?.endDate)}</CTableDataCell>
                          </CTableRow>
                           <CTableRow>
                            <CTableDataCell> <strong>Rent Amount:</strong> </CTableDataCell>
                            <CTableDataCell>{maintenance.tenant?.leaseAgreement?.rentAmount || 'N/A'}</CTableDataCell>
                            </CTableRow>
                       </CTableBody>

                     <CTableHead>
                         <CTableRow>
                                <CTableHeaderCell colSpan={2}><h5>Property Information</h5></CTableHeaderCell>
                            </CTableRow>
                       </CTableHead>
                       <CTableBody>
                           <CTableRow>
                               <CTableDataCell><strong>Property Unit:</strong></CTableDataCell>
                                   <CTableDataCell>{maintenance.tenant?.propertyInformation?.unit || 'N/A'}</CTableDataCell>
                               </CTableRow>
                             <CTableRow>
                              <CTableDataCell><strong>Property Title:</strong></CTableDataCell>
                                   <CTableDataCell>{maintenance.property?.title || 'N/A'}</CTableDataCell>
                           </CTableRow>
                        </CTableBody>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell colSpan={2}><h5>Maintenance Request</h5></CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                      <CTableBody>
                          <CTableRow>
                                 <CTableDataCell><strong>Request Type:</strong></CTableDataCell>
                                   <CTableDataCell>{maintenance.typeOfRequest || 'N/A'}</CTableDataCell>
                               </CTableRow>
                              <CTableRow>
                                <CTableDataCell><strong>Urgency Level:</strong></CTableDataCell>
                                   <CTableDataCell>{maintenance.urgencyLevel || 'N/A'}</CTableDataCell>
                                </CTableRow>
                              <CTableRow>
                               <CTableDataCell><strong>Status:</strong></CTableDataCell>
                                  <CTableDataCell>{maintenance.status || 'N/A'}</CTableDataCell>
                              </CTableRow>
                                <CTableRow>
                                 <CTableDataCell> <strong>Description:</strong></CTableDataCell>
                                   <CTableDataCell>{maintenance.description || 'No description provided.'}</CTableDataCell>
                                 </CTableRow>
                               <CTableRow>
                                 <CTableDataCell> <strong>Estimated Completion Time:</strong></CTableDataCell>
                                  <CTableDataCell>{formatDate(maintenance.estimatedCompletionTime)}</CTableDataCell>
                              </CTableRow>
                               <CTableRow>
                                 <CTableDataCell><strong>Notes:</strong></CTableDataCell>
                                 <CTableDataCell>{maintenance.notes || 'No notes available.'}</CTableDataCell>
                             </CTableRow>
                      </CTableBody>
                         <CTableHead>
                                 <CTableRow>
                                <CTableHeaderCell colSpan={2}><h5>Timestamps</h5></CTableHeaderCell>
                                 </CTableRow>
                          </CTableHead>
                         <CTableBody>
                             <CTableRow>
                                  <CTableDataCell><strong>Created At:</strong></CTableDataCell>
                                  <CTableDataCell>{formatDate(maintenance.createdAt)}</CTableDataCell>
                              </CTableRow>
                             <CTableRow>
                                <CTableDataCell> <strong>Updated At:</strong></CTableDataCell>
                                  <CTableDataCell>{formatDate(maintenance.updatedAt)}</CTableDataCell>
                              </CTableRow>
                         </CTableBody>
                </CTable>

                {maintenance.photosOrVideos?.length > 0 && (
                    <>
                        <h5>Photos/Videos</h5>
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