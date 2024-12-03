import React from 'react';
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton } from '@coreui/react';

const MaintenanceDetailsModal = ({ visible, setVisible, maintenance }) => {
  if (!maintenance) return null;

  const {
    tenant,
    property,
    typeOfRequest,
    urgencyLevel,
    status,
    description,
    photos = [],
  } = maintenance;

  return (
    <CModal visible={visible} onClose={() => setVisible(false)}>
      <CModalHeader>
        <CModalTitle>Maintenance Details</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <p><strong>Tenant:</strong> {tenant}</p>
        <p><strong>Property:</strong> {property}</p>
        <p><strong>Type of Request:</strong> {typeOfRequest}</p>
        <p><strong>Urgency Level:</strong> {urgencyLevel}</p>
        <p><strong>Status:</strong> {status}</p>
        <p><strong>Description:</strong> {description}</p>
        {photos.length > 0 && (
          <>
            <p><strong>Photos:</strong></p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  style={{
                    width: '75px',
                    height: '75px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    objectFit: 'cover',
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
