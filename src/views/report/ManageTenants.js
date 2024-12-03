import React from 'react';
import { CTable, CTableHead, CTableBody, CTableRow, CTableHeaderCell, CTableDataCell } from '@coreui/react';

const ManageTenants = ({ tenants = [] }) => (
  <div>
    <h5>Manage Tenants</h5>
    <CTable>
      <CTableHead color="light">
        <CTableRow>
          <CTableHeaderCell scope="col">#</CTableHeaderCell>
          <CTableHeaderCell scope="col">Tenant Name</CTableHeaderCell>
          <CTableHeaderCell scope="col">Contact</CTableHeaderCell>
          <CTableHeaderCell scope="col">Property</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {tenants.length > 0 ? (
          tenants.map((tenant, index) => (
            <CTableRow key={tenant.id}>
              <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
              <CTableDataCell>{tenant.name}</CTableDataCell>
              <CTableDataCell>{tenant.contact}</CTableDataCell>
              <CTableDataCell>{tenant.property}</CTableDataCell>
            </CTableRow>
          ))
        ) : (
          <CTableRow>
            <CTableDataCell colSpan="4" className="text-center">
              No tenants available
            </CTableDataCell>
          </CTableRow>
        )}
      </CTableBody>
    </CTable>
  </div>
);

export default ManageTenants;
