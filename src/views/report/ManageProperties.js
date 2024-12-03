import React from 'react';
import { Bar } from 'react-chartjs-2';
import { CTable, CTableHead, CTableBody, CTableRow, CTableHeaderCell, CTableDataCell } from '@coreui/react';

const ManageProperties = ({ properties, propertyStatusData }) => {
  // Ensure the chart data has a valid structure
  const defaultChartData = {
    labels: [],
    datasets: [
      {
        label: 'Property Status',
        data: [],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  const chartData = propertyStatusData || defaultChartData;

  return (
    <div>
      <h5>Manage Properties</h5>
      {chartData.labels.length > 0 ? (
        <Bar data={chartData} />
      ) : (
        <div className="text-center">No chart data available</div>
      )}
      <CTable>
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell scope="col">#</CTableHeaderCell>
            <CTableHeaderCell scope="col">Property Name</CTableHeaderCell>
            <CTableHeaderCell scope="col">Location</CTableHeaderCell>
            <CTableHeaderCell scope="col">Status</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {properties.length > 0 ? (
            properties.map((property, index) => (
              <CTableRow key={property.id}>
                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                <CTableDataCell>{property.name}</CTableDataCell>
                <CTableDataCell>{property.location}</CTableDataCell>
                <CTableDataCell>{property.status}</CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="4" className="text-center">
                No properties available
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
    </div>
  );
};

export default ManageProperties;
