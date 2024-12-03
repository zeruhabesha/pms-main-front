import React from 'react';
import {
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
} from '@coreui/react';

const ManageLeaseAgreements = ({ leaseAgreements = [], maintenanceRequests = [] }) => (
  <div>
    <h5>Manage Lease Agreements</h5>
    <CTable>
      <CTableHead color="light">
        <CTableRow>
          <CTableHeaderCell scope="col">#</CTableHeaderCell>
          <CTableHeaderCell scope="col">Tenant Name</CTableHeaderCell>
          <CTableHeaderCell scope="col">Property</CTableHeaderCell>
          <CTableHeaderCell scope="col">Start Date</CTableHeaderCell>
          <CTableHeaderCell scope="col">End Date</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {leaseAgreements.length > 0 ? (
          leaseAgreements.map((agreement, index) => (
            <CTableRow key={agreement.id}>
              <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
              <CTableDataCell>{agreement.tenantName}</CTableDataCell>
              <CTableDataCell>{agreement.property}</CTableDataCell>
              <CTableDataCell>{agreement.startDate}</CTableDataCell>
              <CTableDataCell>{agreement.endDate}</CTableDataCell>
            </CTableRow>
          ))
        ) : (
          <CTableRow>
            <CTableDataCell colSpan="5" className="text-center">
              No lease agreements available
            </CTableDataCell>
          </CTableRow>
        )}
      </CTableBody>
    </CTable>

    <h5>Handle Maintenance</h5>
    <CTable>
      <CTableHead color="light">
        <CTableRow>
          <CTableHeaderCell scope="col">#</CTableHeaderCell>
          <CTableHeaderCell scope="col">Property</CTableHeaderCell>
          <CTableHeaderCell scope="col">Issue</CTableHeaderCell>
          <CTableHeaderCell scope="col">Status</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {maintenanceRequests.length > 0 ? (
          maintenanceRequests.map((request, index) => (
            <CTableRow key={request.id}>
              <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
              <CTableDataCell>{request.property}</CTableDataCell>
              <CTableDataCell>{request.issue}</CTableDataCell>
              <CTableDataCell>{request.status}</CTableDataCell>
            </CTableRow>
          ))
        ) : (
          <CTableRow>
            <CTableDataCell colSpan="4" className="text-center">
              No maintenance requests available
            </CTableDataCell>
          </CTableRow>
        )}
      </CTableBody>
    </CTable>
  </div>
);

export default ManageLeaseAgreements;
