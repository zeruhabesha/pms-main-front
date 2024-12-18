import React from "react";
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton } from "@coreui/react";

const TenantDetailsModal = ({ visible, setVisible, tenantDetails }) => {
  if (!tenantDetails) return null;

  return (
    <CModal visible={visible} onClose={() => setVisible(false)}>
      <CModalHeader>
        <CModalTitle>Tenant Details</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <p><strong>Name:</strong> {tenantDetails.tenantName}</p>
        <p><strong>Email:</strong> {tenantDetails.contactInformation.email}</p>
        <p><strong>Phone:</strong> {tenantDetails.contactInformation.phoneNumber}</p>
        <p><strong>Emergency Contact:</strong> {tenantDetails.contactInformation.emergencyContact || "N/A"}</p>
        <p><strong>Rent Amount:</strong> ${tenantDetails.leaseAgreement.rentAmount}</p>
        <p><strong>Security Deposit:</strong> ${tenantDetails.leaseAgreement.securityDeposit}</p>
        <p><strong>Lease Start:</strong> {new Date(tenantDetails.leaseAgreement.startDate).toLocaleDateString()}</p>
        <p><strong>Lease End:</strong> {new Date(tenantDetails.leaseAgreement.endDate).toLocaleDateString()}</p>
        <p><strong>Unit:</strong> {tenantDetails.propertyInformation.unit}</p>
        <p><strong>Property ID:</strong> {tenantDetails.propertyInformation.propertyId}</p>
        <p><strong>Payment Method:</strong> {tenantDetails.paymentMethod}</p>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisible(false)}>Close</CButton>
      </CModalFooter>
    </CModal>
  );
};

export default TenantDetailsModal;