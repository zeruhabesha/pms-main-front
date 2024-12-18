import React from 'react';
import {
  CRow,
  CCol,
  CWidgetStatsA,
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react';
import { CChartLine } from '@coreui/react-chartjs'
import { CChartDoughnut, CChartBar } from '@coreui/react-chartjs';
import './Dashboard.scss';

const Dashboard = () => {
  const stats = {
    admins: 5,
    properties: 20,
    tenants: 50,
    revenue: '12,000',
  };

  const propertyDistribution = {
    labels: ['Available', 'Rented', 'Maintenance'],
    datasets: [
      {
        data: [10, 8, 2],
        backgroundColor: ['#4CAF50', '#FF9800', '#F44336'],
        hoverOffset: 10,
      },
    ],
  };

  const monthlyRevenue = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'Revenue (in $)',
        backgroundColor: '#42A5F5',
        borderColor: '#1E88E5',
        borderWidth: 2,
        hoverBackgroundColor: '#64B5F6',
        data: [2000, 3000, 2500, 4000, 5000],
      },
    ],
  };

  const recentProperties = [
    { id: 1, name: 'Green Villas', status: 'Rented', price: '$1500' },
    { id: 2, name: 'Sunny Apartments', status: 'Available', price: '$1200' },
    { id: 3, name: 'Luxury Homes', status: 'Maintenance', price: '$1800' },
  ];

  const recentTenants = [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '987-654-3210' },
    { id: 3, name: 'Sam Wilson', email: 'sam@example.com', phone: '555-555-5555' },
  ];

  return (
    <div className="dashboard">
      <CRow className="mb-4">
        <CCol sm={6} lg={3}>
          <CWidgetStatsA
            className="animated-widget mb-4"
            color="dark"
            value={stats.admins.toString()}
            title="Total Admins"
            chart={
              <CChartLine
                ref={widgetChartRef1}
                className="mt-3 mx-3"
                style={{ height: '70px' }}
                data={{
                  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                  datasets: [
                    {
                      label: 'My First dataset',
                      backgroundColor: 'transparent',
                      borderColor: 'rgba(255,255,255,.55)',
                      pointBackgroundColor: getStyle('--cui-primary'),
                      data: [65, 59, 84, 84, 51, 55, 40],
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      border: {
                        display: false,
                      },
                      grid: {
                        display: false,
                        drawBorder: false,
                      },
                      ticks: {
                        display: false,
                      },
                    },
                    y: {
                      min: 30,
                      max: 89,
                      display: false,
                      grid: {
                        display: false,
                      },
                      ticks: {
                        display: false,
                      },
                    },
                  },
                  elements: {
                    line: {
                      borderWidth: 1,
                      tension: 0.4,
                    },
                    point: {
                      radius: 4,
                      hitRadius: 10,
                      hoverRadius: 4,
                    },
                  },
                }}
              />
            }/>
        </CCol>
        <CCol sm={6} lg={3}>
          <CWidgetStatsA
            className="animated-widget mb-4"
            color="dark"
            value={stats.properties.toString()}
            title="Total Properties"
          />
        </CCol>
        <CCol sm={6} lg={3}>
          <CWidgetStatsA
            className="animated-widget mb-4"
            color="dark"
            value={stats.tenants.toString()}
            title="Total Tenants"
          />
        </CCol>
        <CCol sm={6} lg={3}>
          <CWidgetStatsA
            className="animated-widget mb-4"
            color="dark"
            value={`$${stats.revenue}`}
            title="Monthly Revenue"
          />
        </CCol>
      </CRow>

      <CRow>
        <CCol lg={6}>
          <CCard className="animated-card">
            <CCardHeader>Property Distribution</CCardHeader>
            <CCardBody>
              <CChartDoughnut
                data={propertyDistribution}
                options={{
                  plugins: {
                    legend: { position: 'top' },
                  },
                  animation: {
                    animateScale: true,
                    animateRotate: true,
                  },
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol lg={6}>
          <CCard className="animated-card">
            <CCardHeader>Monthly Revenue</CCardHeader>
            <CCardBody>
              <CChartBar
                data={monthlyRevenue}
                options={{
                  plugins: {
                    legend: { display: true, position: 'top' },
                  },
                  scales: {
                    x: { grid: { display: false } },
                    y: { beginAtZero: true },
                  },
                  animation: {
                    duration: 1500,
                    easing: 'easeOutBounce',
                  },
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow className="mt-4">
        <CCol lg={6}>
          <CCard className="animated-card">
            <CCardHeader>Recent Properties</CCardHeader>
            <CCardBody>
              <CTable hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>#</CTableHeaderCell>
                    <CTableHeaderCell>Name</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Price</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {recentProperties.map((property) => (
                    <CTableRow key={property.id}>
                      <CTableDataCell>{property.id}</CTableDataCell>
                      <CTableDataCell>{property.name}</CTableDataCell>
                      <CTableDataCell>{property.status}</CTableDataCell>
                      <CTableDataCell>{property.price}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol lg={6}>
          <CCard className="animated-card">
            <CCardHeader>Recent Tenants</CCardHeader>
            <CCardBody>
              <CTable hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>#</CTableHeaderCell>
                    <CTableHeaderCell>Name</CTableHeaderCell>
                    <CTableHeaderCell>Email</CTableHeaderCell>
                    <CTableHeaderCell>Phone</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {recentTenants.map((tenant) => (
                    <CTableRow key={tenant.id}>
                      <CTableDataCell>{tenant.id}</CTableDataCell>
                      <CTableDataCell>{tenant.name}</CTableDataCell>
                      <CTableDataCell>{tenant.email}</CTableDataCell>
                      <CTableDataCell>{tenant.phone}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};

export default Dashboard;
