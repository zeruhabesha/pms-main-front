import React, { useState, useEffect } from 'react';
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
import { CChartBar, CChartLine, CChartDoughnut } from '@coreui/react-chartjs';

const Dashboard = () => {
  const [stats, setStats] = useState({
    admins: 0,
    properties: 0,
    tenants: 0,
    revenue: '0',
  });
  const [propertyDistribution, setPropertyDistribution] = useState({
    labels: ['Available', 'Rented', 'Maintenance'],
    datasets: [{ data: [0, 0, 0], backgroundColor: ['#4CAF50', '#FF9800', '#F44336'] }],
  });
  const [monthlyRevenue, setMonthlyRevenue] = useState({
    labels: [],
    datasets: [{ label: 'Revenue (in $)', backgroundColor: '#42A5F5', data: [] }],
  });
  const [recentProperties, setRecentProperties] = useState([]);
  const [recentTenants, setRecentTenants] = useState([]);

  // Fetch data dynamically
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Example API endpoints, replace with actual endpoints
        const statsResponse = await fetch('http://localhost:4000/api/v1/users/user/report');
        const propertyResponse = await fetch('http://localhost:4000/api/v1/properties/report');
        const tenantsResponse = await fetch('http://localhost:4000/api/v1/tenants/report');
        const revenueResponse = await fetch('http://localhost:4000/api/v1/properties/report');

        const statsData = await statsResponse.json();
        const propertyData = await propertyResponse.json();
        const tenantsData = await tenantsResponse.json();
        const revenueData = await revenueResponse.json();

        // Update stats widget
        setStats({
          admins: statsData.admins,
          properties: statsData.properties,
          tenants: statsData.tenants,
          revenue: statsData.revenue,
        });

        // Update property distribution chart
        setPropertyDistribution({
          labels: ['Available', 'Rented', 'Maintenance'],
          datasets: [
            {
              data: propertyData.distribution,
              backgroundColor: ['#4CAF50', '#FF9800', '#F44336'],
            },
          ],
        });

        // Update monthly revenue chart
        setMonthlyRevenue({
          labels: revenueData.labels,
          datasets: [
            {
              label: 'Revenue (in $)',
              backgroundColor: '#42A5F5',
              data: revenueData.values,
            },
          ],
        });

        // Update recent properties and tenants
        setRecentProperties(propertyData.recent);
        setRecentTenants(tenantsData.recent);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <CRow className="mb-4">
        {/* Top Stats Widgets */}
        <CCol sm={6} lg={3}>
          <CWidgetStatsA
            className="mb-4"
            color="primary"
            value={stats.admins.toString()}
            title="Total Admins"
          />
        </CCol>
        <CCol sm={6} lg={3}>
          <CWidgetStatsA
            className="mb-4"
            color="success"
            value={stats.properties.toString()}
            title="Total Properties"
          />
        </CCol>
        <CCol sm={6} lg={3}>
          <CWidgetStatsA
            className="mb-4"
            color="warning"
            value={stats.tenants.toString()}
            title="Total Tenants"
          />
        </CCol>
        <CCol sm={6} lg={3}>
          <CWidgetStatsA
            className="mb-4"
            color="danger"
            value={`$${stats.revenue}`}
            title="Monthly Revenue"
          />
        </CCol>
      </CRow>

      {/* Charts Section */}
      <CRow>
        <CCol lg={6}>
          <CCard>
            <CCardHeader>Property Distribution</CCardHeader>
            <CCardBody>
              <CChartDoughnut
                data={propertyDistribution}
                options={{
                  plugins: {
                    legend: { position: 'top' },
                  },
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol lg={6}>
          <CCard>
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
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Recent Activity Tables */}
      <CRow className="mt-4">
        <CCol lg={6}>
          <CCard>
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
          <CCard>
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
