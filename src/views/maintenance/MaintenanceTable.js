import React from 'react';
import MaintenanceTableRow from './MaintenanceTableRow'; // Ensure this import is correct
import { CTable, CTableHead, CTableBody, CTableHeaderCell, CTableRow } from '@coreui/react';

const MaintenanceTable = ({ maintenanceList = [], onEdit, onDelete, onViewDetails }) => {
  if (!maintenanceList || maintenanceList.length === 0) {
    return <div className="text-center text-muted">No maintenance records available.</div>;
  }

  return (
    <CTable striped hover responsive>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell scope="col">#</CTableHeaderCell>
          <CTableHeaderCell scope="col">Tenant</CTableHeaderCell>
          <CTableHeaderCell scope="col">Property</CTableHeaderCell>
          <CTableHeaderCell scope="col">Request Type</CTableHeaderCell>
          <CTableHeaderCell scope="col">Urgency</CTableHeaderCell>
          <CTableHeaderCell scope="col">Status</CTableHeaderCell>
          <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {maintenanceList.map((maintenance, index) => (
          <MaintenanceTableRow
            key={maintenance._id || `maintenance-${index}`}
            maintenance={maintenance}
            index={index}
            onEdit={onEdit}
            onDelete={onDelete}
            onViewDetails={onViewDetails} // Pass the onViewDetails prop here
          />
        ))}
      </CTableBody>
    </CTable>
  );
};

export default MaintenanceTable;
