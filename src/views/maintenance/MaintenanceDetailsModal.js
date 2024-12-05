import React from 'react';
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton } from '@coreui/react';

const MaintenanceDetailsModal = ({ visible, setVisible, maintenance }) => {
  if (!maintenance) return null; // If no maintenance data, do not render the modal.

  return (
    <CModal size="lg" visible={visible} onClose={() => setVisible(false)}>
      <CModalHeader>
        <CModalTitle>Maintenance Details</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <h5>Tenant Information</h5>
        <p><strong>Tenant Name:</strong> {maintenance.tenant?.tenantName || 'N/A'}</p>
        <p><strong>Contact Email:</strong> {maintenance.tenant?.contactInformation?.email || 'N/A'}</p>
        <p><strong>Contact Phone:</strong> {maintenance.tenant?.contactInformation?.phoneNumber || 'N/A'}</p>

        <h5>Lease Agreement</h5>
        <p><strong>Lease Start Date:</strong> {maintenance.tenant?.leaseAgreement?.startDate?.split('T')[0] || 'N/A'}</p>
        <p><strong>Lease End Date:</strong> {maintenance.tenant?.leaseAgreement?.endDate?.split('T')[0] || 'N/A'}</p>
        <p><strong>Rent Amount:</strong> {maintenance.tenant?.leaseAgreement?.rentAmount || 'N/A'}</p>

        <h5>Property Information</h5>
        <p><strong>Property Unit:</strong> {maintenance.tenant?.propertyInformation?.unit || 'N/A'}</p>
        <p><strong>Property Title:</strong> {maintenance.property?.title || 'N/A'}</p>

        <h5>Maintenance Request</h5>
        <p><strong>Request Type:</strong> {maintenance.typeOfRequest || 'N/A'}</p>
        <p><strong>Urgency Level:</strong> {maintenance.urgencyLevel || 'N/A'}</p>
        <p><strong>Status:</strong> {maintenance.status || 'N/A'}</p>
        <p><strong>Description:</strong> {maintenance.description || 'No description provided.'}</p>
        <p><strong>Estimated Completion Time:</strong> {maintenance.estimatedCompletionTime || 'N/A'}</p>
        <p><strong>Notes:</strong> {maintenance.notes || 'No notes available.'}</p>

        <h5>Timestamps</h5>
        <p><strong>Created At:</strong> {new Date(maintenance.createdAt).toLocaleString() || 'N/A'}</p>
        <p><strong>Updated At:</strong> {new Date(maintenance.updatedAt).toLocaleString() || 'N/A'}</p>

        {maintenance.photosOrVideos?.length > 0 && (
          <>
            <h5>Photos/Videos</h5>
            <div className="d-flex flex-wrap mt-2">
              {maintenance.photosOrVideos.map((file, idx) => (
                <img
                  key={idx}
                  src={file}
                  alt="Maintenance media"
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover',
                    marginRight: '10px',
                    marginBottom: '10px',
                  }}
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
