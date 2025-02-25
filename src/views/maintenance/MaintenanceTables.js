import React, { memo } from 'react';
import {
  CTable,
  CTableHead,
  CTableBody,
  CTableHeaderCell,
  CTableRow,
  CTableDataCell,
  CBadge,
} from '@coreui/react';
import { CIcon } from '@coreui/icons-react';
import { getStatusIcon } from '../../api/utils/maintenanceUtils'; // Import utility function
import { format } from 'date-fns'; // Import date-fns for formatting

const MaintenanceTable = ({ maintenanceList = [] }) => {
  const blurredText = {
    filter: 'blur(0px)',
    userSelect: 'none',
  };

  const getStatusColor = (status) => {
    const statusColorMap = {
      pending: 'warning',
      approved: 'primary',
      'in progress': 'info',
      completed: 'success',
      cancelled: 'danger',
      inspected: 'info',
      incomplete: 'dark',
    };
    return statusColorMap[status?.toLowerCase()] || 'secondary';
  };

  return (
    <div>
      <CTable align="middle" className="mb-0 border" hover responsive>
        <CTableHead className="text-nowrap">
          <CTableRow>
            <CTableHeaderCell className="bg-body-tertiary text-center">#</CTableHeaderCell>
            <CTableHeaderCell className="bg-body-tertiary">Description</CTableHeaderCell>
            <CTableHeaderCell className="bg-body-tertiary">Request Date</CTableHeaderCell>
            <CTableHeaderCell className="bg-body-tertiary">Status</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {maintenanceList && maintenanceList.length > 0 ? (
            maintenanceList.map((maintenance, index) => {
              const rowNumber = index + 1;
              const statusIcon = getStatusIcon(maintenance?.status);
              const formattedDate = maintenance.requestDate ? format(new Date(maintenance.requestDate), 'yyyy-MM-dd') : 'N/A';

              return (
                <CTableRow key={maintenance?._id || index}>
                  <CTableDataCell className="text-center" style={blurredText}>{rowNumber}</CTableDataCell>
                  <CTableDataCell style={blurredText}>{maintenance?.description || 'N/A'}</CTableDataCell>
                  <CTableDataCell style={blurredText}>{formattedDate}</CTableDataCell>
                  <CTableDataCell style={blurredText}>
                    <CBadge color={getStatusColor(maintenance?.status)}>
                      {statusIcon && <CIcon icon={statusIcon} size="sm" className="me-1" />}
                      {maintenance?.status || 'N/A'}
                    </CBadge>
                  </CTableDataCell>
                </CTableRow>
              );
            })
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="4" className="text-center">
                No maintenance requests found.
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
    </div>
  );
};

export default memo(MaintenanceTable);