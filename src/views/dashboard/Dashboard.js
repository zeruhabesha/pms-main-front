import React from 'react';
import {
    CRow,
    CCol,
    CWidgetStatsA,
    CWidgetStatsC,
    CCard,
    CCardBody,
    CCardHeader,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CProgress,
    CBadge
} from '@coreui/react';
import { CChartDoughnut, CChartBar, CChartLine } from '@coreui/react-chartjs';
import './Dashboard.scss';
import {generateBarChartSVG,generateSparkLineSVG } from './chartHelpers'
import {
  cilPeople,
  cilBuilding,
  cilUser,
  cilMoney,
  cilClock,
  cilUserPlus,
    cilHome,
    cilTask
} from '@coreui/icons'
import CIcon from '@coreui/icons-react';

const Dashboard = () => {
    const stats = {
        admins: 5,
        properties: 20,
        tenants: 50,
        revenue: '12,000',
        pendingRequests: 8,
        newTenants: 12,
        avgRent: 1600,
        maintenanceTasks: 3,
    };

    const propertyDistribution = {
        labels: ['Available', 'Rented', 'Maintenance'],
        datasets: [
            {
                data: [10, 8, 2],
                backgroundColor: ['#39597d', '#1b1c4c', '#000000'],
                hoverOffset: 10,
            },
        ],
    };

    const monthlyRevenue = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
            {
                label: 'Revenue (in $)',
                backgroundColor: '#39597d',
                borderColor: '#1b1c4c',
                borderWidth: 2,
                hoverBackgroundColor: '#64B5F6',
                data: [2000, 3000, 2500, 4000, 5000, 6000],
            },
        ],
    };

    const tenantGrowth = {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [
          {
              label: 'Tenant Growth',
              borderColor: '#2E7D32',
              data: [10, 15, 25, 30],
              fill: false,
              tension: 0.3,
          }
      ]
    };

    const recentProperties = [
        { id: 1, name: 'Green Villas', status: 'Rented', price: '$1500' },
        { id: 2, name: 'Sunny Apartments', status: 'Available', price: '$1200' },
        { id: 3, name: 'Luxury Homes', status: 'Maintenance', price: '$1800' },
        { id: 4, name: 'Mountain View', status: 'Rented', price: '$2000' },
        { id: 5, name: 'Sea View', status: 'Available', price: '$1700' },
    ];

    const recentTenants = [
        { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '987-654-3210' },
        { id: 3, name: 'Sam Wilson', email: 'sam@example.com', phone: '555-555-5555' },
        { id: 4, name: 'Emily Davis', email: 'emily@example.com', phone: '444-555-6666' },
        { id: 5, name: 'Tom Hanks', email: 'tom@example.com', phone: '777-888-9999' },
    ];


    return (
        <div className="dashboard">
            <CRow className="mb-4">
                <CCol sm={6} lg={3}>
                    <CWidgetStatsC
                        className="animated-widget mb-4"
                        color="light"
                        value={stats.admins.toString()}
                        title="Total Admins"
                        icon={<CIcon icon={cilUser} height={36} />}
                        progress={{ color: 'secondary', value: 75 }}

                    />
                </CCol>
                <CCol sm={6} lg={3}>
                    <CWidgetStatsC
                        icon={<CIcon icon={cilBuilding} height={36} />}
                        className="animated-widget mb-4"
                        color="light"
                        value={stats.properties.toString()}
                        title="Total Properties"
                        progress={{ color: 'secondary', value: 75 }}

                    />
                </CCol>
                <CCol sm={6} lg={3}>
                    <CWidgetStatsC
                        className="animated-widget mb-4"
                        color="light"
                        value={stats.tenants.toString()}
                        title="Total Tenants"
                        icon={<CIcon icon={cilPeople} height={36} />}
                        progress={{ color: 'secondary', value: 75 }}

                    />
                </CCol>
                <CCol sm={6} lg={3}>
                <CWidgetStatsC
                  className="animated-widget dark-mode"
                  color="light"
                  value={`$${stats.revenue}`}
                  title="Monthly Revenue"
                  icon={<CIcon icon={cilMoney} height={36} />}
                        progress={{ color: 'secondary', value: 75 }}

                >
                  <span className="trend-arrow up">▲ 10%</span>
                </CWidgetStatsC>

                </CCol>

            </CRow>




            <CRow>
                 <CCol lg={6}>
                    <CCard className="animated-card chart-card">
                        <CCardHeader className="chart-header">Property Distribution</CCardHeader>
                        <br></br> 
                        <CCardBody className="chart-body">
                            <CChartDoughnut
                                data={propertyDistribution}
                                options={{
                                    plugins: {
                                        legend: { position: 'bottom' },
                                    },
                                
                                    animation: {
                                        animateScale: true,
                                        animateRotate: true,
                                    },
                                    animation: {
                                        animateScale: true,
                                        animateRotate: true,
                                    },
                                }}
                            />
                            <br></br><br></br><br></br><br></br> 
                        </CCardBody>
                    </CCard>
                 </CCol>
                <CCol lg={6}>
                    <CCard className="animated-card chart-card">
                        <CCardHeader className="chart-header">Monthly Revenue</CCardHeader>
                        <CCardBody className="chart-body">
                            <CChartBar
                                data={monthlyRevenue}
                                options={{
                                    plugins: {
                                        legend: { display: true, position: 'bottom' },
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

                   <CCard className="animated-card chart-card">
                       <CCardHeader className="chart-header">Tenant Growth</CCardHeader>
                       <CCardBody className="chart-body">
                           <CChartLine
                            data={tenantGrowth}
                            options={{
                                plugins: {
                                    legend: { display: false},
                                },
                                scales: {
                                    x: { grid: { display: false } },
                                    y: { beginAtZero: true },
                                },
                                animation: {
                                    duration: 1000,
                                    easing: 'easeOutQuad'
                                },
                            }}
                           />
                        </CCardBody>
                   </CCard>
               </CCol>

            </CRow>
            <CRow>
                  <CCol xs={12} sm={6} lg={3}>
                    <CCard className="mb-4 colored-card">
                      <div className="border-start border-start-4 border-start-secondary py-1 px-3">
                          <div className="text-body-secondary text-truncate small">Pending Requests</div>
                           <div className="fs-5 fw-semibold">{stats.pendingRequests.toString()}</div>
                         <div className="chart-container">{generateSparkLineSVG([1,3,5,8,6])}</div>
                        </div>
                    </CCard>
                   </CCol>
                  <CCol xs={12} sm={6} lg={3}>
                      <CCard className="mb-4 colored-card">
                         <div className="border-start border-start-4 border-start-secondary py-1 px-3">
                             <div className="text-body-secondary text-truncate small">New Tenants This Month</div>
                            <div className="fs-5 fw-semibold">{stats.newTenants.toString()}</div>
                            <div className="chart-container">{generateSparkLineSVG([1,3,10,9,12])}</div>
                         </div>
                      </CCard>
                 </CCol>
                 <CCol xs={12} sm={6} lg={3}>
                    <CCard className="mb-4 colored-card">
                       <div className="border-start border-start-4 border-start-secondary py-1 px-3">
                         <div className="text-body-secondary text-truncate small">Average Rent</div>
                         <div className="fs-5 fw-semibold">${stats.avgRent}</div>
                            <div className="chart-container">{generateSparkLineSVG([1400, 1500, 1600, 1550, 1700])}</div>
                       </div>
                    </CCard>
                 </CCol>
                <CCol xs={12} sm={6} lg={3}>
                   <CCard className="mb-4 colored-card">
                      <div className="border-start border-start-4 border-start-secondary py-1 px-3">
                         <div className="text-body-secondary text-truncate small">Open Maintenance Tasks</div>
                         <div className="fs-5 fw-semibold">{stats.maintenanceTasks.toString()}</div>
                            <div className="chart-container">{generateBarChartSVG([1,3,2],3)}</div>
                      </div>
                   </CCard>
                 </CCol>


            </CRow>
            <CRow className="mt-4">
                <CCol lg={6}>
                    <CCard className="animated-card table-card">
                        <CCardHeader className="table-header">Recent Properties</CCardHeader>
                        <CCardBody className="table-body">
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
                                        <CTableRow key={property.id} className="table-row-item">
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
                    <CCard className="animated-card table-card">
                        <CCardHeader className="table-header">Recent Tenants</CCardHeader>
                        <CCardBody className="table-body">
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
                                        <CTableRow key={tenant.id} className="table-row-item">
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