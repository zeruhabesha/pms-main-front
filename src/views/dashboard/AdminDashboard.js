import React from 'react';
import {
    CRow,
    CCol,
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
import {
    cilPeople,
    cilBuilding,
    cilMoney,
    cilTags,
    cilBarChart,
    cilGraph,
    cilUserPlus,
    cilWarning,
} from '@coreui/icons';
import {
    CChartBar,
    CChartDoughnut,
    CChartLine,
    CChartPie,
    CChartPolarArea,
    CChartRadar,
} from '@coreui/react-chartjs';
import CIcon from '@coreui/icons-react';
import { useNavigate } from 'react-router-dom';
import MainChart from "./MainChart";
import {
    colors,
    fadeIn,
    slideInFromLeft,
    WidgetStatsContainer,
    AnimatedCard,
    ColoredCard,
    StyledTable,
    ViewAllButton,
    ChartContainer,
    EnhancedChartCard,
    MetricCard,
    CircularProgressWrapper,
    EnhancedTable,
    StatisticBox,
    SummaryCard,
    SparkLine,
    LabeledValue,
} from './styledComponents';
import { generateBarChartSVG, generateSparkLineSVG } from './chartHelpers';
import "./Dashboard.scss"
import {  cilCheckCircle as cilCheckCircleIcon, cilClock, cilCalendar, cilList } from '@coreui/icons';
 const AdminDashboard = ({
                           stats,
                           monthlyRevenue,
                            getStatusIcon,
                           inspectionStats
                       }) => {

    const navigate = useNavigate();

    const handleViewAllProperties = () => {
        navigate('/properties');
    };

    const handleViewAllTenants = () => {
        navigate('/tenants');
    };
        const handleViewAllMaintenance = () => {
            navigate('/maintenances');
        };
    const blurredText = {
        filter: 'blur(2px)',
        userSelect: 'none',
    };

    const summaryCardData = [
        {
          icon: cilBuilding,
          label: "Total Properties",
          value: "150", // Static Value
          color: "green",
        },
        {
          icon: cilPeople,
          label: "Total Tenants",
          value: "450", // Static Value
          color: "blue",
        },
        {
          icon: cilMoney,
          label: "Monthly Revenue",
          value: "$120,000", // Static Value
          color: "orange",
        },
        {
          icon: cilTags,
          label: "Open Maintenance Tasks",
          value: "35", // Static Value
          color: "red",
        },
      ];
    
 const staticPropertyTypesData = {
        labels: ['Apartment', 'House', 'Condo', 'Townhouse'],
        datasets: [
            {
                data: [60, 40, 30, 20],
                backgroundColor: [colors.primary, colors.success, colors.warning, colors.info],
                hoverOffset: 10,
            }
        ]
    };

  const staticMonthlyRevenue = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
            {
                label: 'Revenue (in $)',
                backgroundColor: '#607D8B',
                borderColor: '#3F51B5',
                borderWidth: 2,
                hoverBackgroundColor: '#78909C',
                data: [2000, 3000, 2500, 4000, 5000, 6000],
            },
        ],
    };

   const staticMaintenanceStatusData = {
        labels: ["open", "reserved", "closed", "under maintenance", "leased", "sold"],
        datasets: [
            {
                data: [15, 10, 5, 10, 20, 10],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#C9CBCF'],
                hoverOffset: 10,
            }
        ]
    };

    const renderSummaryCard = (icon, label, value, color) => {
        return (
          <CCol sm={6} lg={3} key={label}>
            <SummaryCard>
              <div className="summary-content">
                <div className="summary-icon">
                  <CIcon icon={icon} height={36} style={{ color: color }} />
                </div>
                   <div style={{ fontSize: '1.5em', fontWeight: 'bold', filter: 'blur(2px)'  }}>{value}</div>
                <LabeledValue  label={label} value=""/>
              </div>
            </SummaryCard>
          </CCol>
        );
      };

      const random = () => Math.round(Math.random() * 100)

    // Define a consistent height for charts
      const chartHeight = 300; // Set your desired height here
      
       const chartOptions = {
            plugins: {
                legend: { position: 'bottom' },
            },
            animation: {
                animateScale: true,
                animateRotate: true,
            },
            maintainAspectRatio: false,  // Disable aspect ratio for custom height
            responsive: true,
        };

    return (
        <>
            {/* Top-Level Summary Metrics */}
           
            <CRow className="mb-4">
      {summaryCardData.map((data, index) =>
        renderSummaryCard(data.icon, data.label, data.value, data.color)
      )}
    </CRow>
              {/* Secondary Metrics and Trends */}
              <CRow className="mb-4">
                 <CCol md={4}>
                    <MetricCard gradient="linear-gradient(45deg, #FF6B6B, #FF8E53)">
                        <div className="metric-header">
                            <CIcon icon={cilGraph} height={24} style={{marginRight: '0.5em'}}/>
                            <h4>Revenue Growth</h4>
                        </div>
                         <div className="metric-body">
                            <div style={{ fontSize: '1.5em', fontWeight: 'bold', filter: 'blur(2px)'  }}>$2500</div>
                             <div> <SparkLine data={[10, 20, 15, 25, 30, 22, 28]} /></div>
                        </div>
                    </MetricCard>
                 </CCol>
                   <CCol md={4}>
                    <MetricCard gradient="linear-gradient(45deg, #42A5F5, #64B5F6)">
                        <div className="metric-header">
                            <CIcon icon={cilUserPlus} height={24} style={{marginRight: '0.5em'}}/>
                             <h4>New Tenants</h4>
                        </div>
                        <div className="metric-body">
                            <div style={{ fontSize: '1.5em', fontWeight: 'bold', filter: 'blur(2px)'  }}>10</div>
                            <div> <SparkLine data={[5, 8, 6, 10, 12, 15, 11]}/></div>
                        </div>
                    </MetricCard>
                </CCol>
                <CCol md={4}>
                   <MetricCard gradient="linear-gradient(45deg, #FFCA28, #FFD54F)">
                        <div className="metric-header">
                            <CIcon icon={cilWarning} height={24} style={{ marginRight: '0.5em' }} />
                            <h4>Pending Requests</h4>
                        </div>
                         <div className="metric-body">
                             <div style={{ fontSize: '1.5em', fontWeight: 'bold', filter: 'blur(2px)' }}>10</div>
                             <div> <SparkLine data={[5, 8, 6, 10, 12, 15, 11]} /></div>
                        </div>
                    </MetricCard>
                </CCol>
            </CRow>
            {/* Charts and Analysis */}
            <CRow className="mb-4">
               <CCol lg={6}>
                    <AnimatedCard className="chart-card">
                        <CCardHeader className="chart-header">Property Distribution</CCardHeader>
                        <CCardBody className="chart-body">
                            <ChartContainer style={{ height: chartHeight }}> {/* Added height */}
                            
                                <CChartDoughnut
                                    data={staticPropertyTypesData}
                                    options={{
                                       ...chartOptions,
                                    }}
                                     height={chartHeight}
                                />
                            </ChartContainer>
                        </CCardBody>
                    </AnimatedCard>
                 </CCol>
                   <CCol lg={6}>
                     <AnimatedCard className="chart-card">
                         <CCardHeader className="chart-header">Monthly Revenue</CCardHeader>
                         <CCardBody className="chart-body">
                            <ChartContainer style={{ height: chartHeight }}>  {/* Added height */}
                            
                            <CChartBar
                                data={staticMonthlyRevenue}
                                options={{
                                      ...chartOptions,
                                       scales: {
                                            x: { grid: { display: false } },
                                            y: { beginAtZero: true },
                                        },
                                    animation: {
                                            duration: 1500,
                                            easing: 'easeOutBounce',
                                        },
                                }}
                                height={chartHeight}
                            />
                             </ChartContainer>
                        </CCardBody>
                    </AnimatedCard>
                </CCol>
                </CRow>
                <CRow className="mb-4">
    <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>Maintenance Requests Trend</CCardHeader> {/* Changed header */}
          <CCardBody>
            <ChartContainer  style={{ height: chartHeight }}>
             <CChartLine
              data={{
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'], // Assuming monthly data
                datasets: [
                  {
                    label: 'Plumbing',
                    backgroundColor: 'rgba(220, 220, 220, 0.2)',
                    borderColor: 'rgba(220, 220, 220, 1)',
                    pointBackgroundColor: 'rgba(220, 220, 220, 1)',
                    pointBorderColor: '#fff',
                    data: [random(), random(), random(), random(), random(), random(), random()], // Replace with actual data
                  },
                   {
                    label: 'Electrical',
                    backgroundColor: 'rgba(151, 187, 205, 0.2)',
                    borderColor: 'rgba(151, 187, 205, 1)',
                    pointBackgroundColor: 'rgba(151, 187, 205, 1)',
                    pointBorderColor: '#fff',
                    data: [random(), random(), random(), random(), random(), random(), random()], // Replace with actual data
                  },
                  {
                    label: 'HVAC',
                      backgroundColor: 'rgba(255, 99, 132, 0.2)', // Example color
                      borderColor: 'rgba(255, 99, 132, 1)',
                      pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                      pointBorderColor: '#fff',
                    data: [random(), random(), random(), random(), random(), random(), random()], // Replace with actual data
                  },
                    {
                    label: 'Appliance Repair',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Example color
                      borderColor: 'rgba(75, 192, 192, 1)',
                      pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                      pointBorderColor: '#fff',
                    data: [random(), random(), random(), random(), random(), random(), random()], // Replace with actual data
                   },
                  {
                     label: 'Other',
                      backgroundColor: 'rgba(54, 162, 235, 0.2)', // Example color
                      borderColor: 'rgba(54, 162, 235, 1)',
                      pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                      pointBorderColor: '#fff',
                    data: [random(), random(), random(), random(), random(), random(), random()], // Replace with actual data
                 }
                ],
              }}
               options={chartOptions}
               height={chartHeight}
             />
            </ChartContainer>
          </CCardBody>
        </CCard>
      </CCol>
           
                  <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>Maintenance</CCardHeader>
          <CCardBody>
            <ChartContainer style={{ height: chartHeight }}>  {/* Added height */}
            
            <CChartPolarArea
              data={{
                labels: ['Pending', 'Approved', 'In Progress', 'Completed', 'Cancelled'],
                datasets: [
                  {
                    data: [11, 16, 7, 3, 14],
                    backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB'],
                  },
                ],
              }}
             options={chartOptions}
               height={chartHeight}
            />
           </ChartContainer>
          </CCardBody>
        </CCard>
      </CCol>
            </CRow>
             <CRow className="mb-4">
           <CCol sm={6} lg={3}>
                    <SummaryCard>
                         <div className="summary-content">
                            <div className="summary-icon"><CIcon icon={cilCheckCircleIcon} height={36} style={{ color: colors.success }} /></div>
                             <LabeledValue label="Completed Inspections" value={<span style={{ filter: 'blur(2px)' }}>15</span>}/>
                        </div>
                    </SummaryCard>
                </CCol>
                <CCol sm={6} lg={3}>
                    <SummaryCard>
                         <div className="summary-content">
                             <div className="summary-icon"><CIcon icon={cilClock} height={36} style={{ color: colors.warning }} /></div>
                             <LabeledValue label="Pending Inspections" value={<span style={{ filter: 'blur(2px)' }}>5</span>}/>
                         </div>
                    </SummaryCard>
                </CCol>
                 <CCol sm={6} lg={3}>
                    <SummaryCard>
                         <div className="summary-content">
                             <div className="summary-icon"><CIcon icon={cilCalendar} height={36} style={{ color: colors.info }} /></div>
                             <LabeledValue label="Scheduled Inspections" value={<span style={{ filter: 'blur(2px)' }}>7</span>}/>
                         </div>
                    </SummaryCard>
                 </CCol>
                 <CCol sm={6} lg={3}>
                    <SummaryCard>
                         <div className="summary-content">
                             <div className="summary-icon"><CIcon icon={cilList} height={36} style={{ color: colors.primary }} /></div>
                              <LabeledValue label="Total Inspections" value={<span style={{ filter: 'blur(2px)' }}>22</span>}/>
                         </div>
                     </SummaryCard>
                </CCol>
            </CRow>
              {/* Data Tables */}
              <CRow>
                  <CCol lg={6}>
                    <AnimatedCard className="table-card">
                        <CCardHeader className="table-header">Recent Properties
                        </CCardHeader>
                        <CCardBody className="table-body">
                            <StyledTable hover>
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell>#</CTableHeaderCell>
                                        <CTableHeaderCell>Name</CTableHeaderCell>
                                        <CTableHeaderCell>Status</CTableHeaderCell>
                                        <CTableHeaderCell>Price</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {/* {recentProperties && recentProperties.length > 0 ? ( */}
                                    {/* {recentProperties?.map((property, index) => ( */}
                                     <CTableRow>
                                            <CTableDataCell style={{ fontSize: '0.9rem' }}>1</CTableDataCell>
                                            <CTableDataCell style={{ fontSize: '0.9rem' }}>Property A</CTableDataCell>
                                            <CTableDataCell style={{ fontSize: '0.9rem' }}>
                                               {getStatusIcon('open')}
                                            </CTableDataCell>
                                            <CTableDataCell style={{ fontSize: '0.9rem' }}>$2000</CTableDataCell>
                                        </CTableRow>
                                     <CTableRow>
                                            <CTableDataCell style={{ fontSize: '0.9rem' }}>2</CTableDataCell>
                                            <CTableDataCell style={{ fontSize: '0.9rem' }}>Property B</CTableDataCell>
                                            <CTableDataCell style={{ fontSize: '0.9rem' }}>
                                                {getStatusIcon('closed')}
                                            </CTableDataCell>
                                            <CTableDataCell style={{ fontSize: '0.9rem' }}>$1500</CTableDataCell>
                                        </CTableRow>
                                      <CTableRow>
                                            <CTableDataCell style={{ fontSize: '0.9rem' }}>3</CTableDataCell>
                                            <CTableDataCell style={{ fontSize: '0.9rem' }}>Property C</CTableDataCell>
                                            <CTableDataCell style={{ fontSize: '0.9rem' }}>
                                                {getStatusIcon('leased')}
                                            </CTableDataCell>
                                            <CTableDataCell style={{ fontSize: '0.9rem' }}>$1800</CTableDataCell>
                                        </CTableRow>
                                    {/* )) */}
                                    {/* ) : (
                                        <CTableRow>
                                            <CTableDataCell colSpan="4" className="text-center">No recent properties</CTableDataCell>
                                        </CTableRow>
                                    )} */}
                                </CTableBody>
                            </StyledTable>
                            <div className="view-all-button">
                                <ViewAllButton onClick={handleViewAllProperties}>View All</ViewAllButton>
                            </div>
                        </CCardBody>
                    </AnimatedCard>
                 </CCol>
                 <CCol lg={6}>
                    <AnimatedCard className="table-card">
                         <CCardHeader className="table-header">Recent Tenants</CCardHeader>
                        <CCardBody className="table-body">
                            <StyledTable hover>
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell>#</CTableHeaderCell>
                                        <CTableHeaderCell>Name</CTableHeaderCell>
                                        <CTableHeaderCell>Email</CTableHeaderCell>
                                        <CTableHeaderCell>Phone</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                  <CTableBody>
                                        {/* {recentTenants && recentTenants.length > 0 ? ( */}
                                          {/* {recentTenants?.map((tenant, index) => ( */}
                                             <CTableRow>
                                            <CTableDataCell style={{ fontSize: '0.9rem' }}>1</CTableDataCell>
                                            <CTableDataCell style={{ fontSize: '0.9rem' }}>John Doe</CTableDataCell>
                                            <CTableDataCell style={{ fontSize: '0.9rem' }}>john.doe@example.com</CTableDataCell>
                                            <CTableDataCell style={{ fontSize: '0.9rem' }}>555-123-4567</CTableDataCell>
                                        </CTableRow>
                                               <CTableRow>
                                            <CTableDataCell style={{ fontSize: '0.9rem' }}>2</CTableDataCell>
                                            <CTableDataCell style={{ fontSize: '0.9rem' }}>Jane Smith</CTableDataCell>
                                            <CTableDataCell style={{ fontSize: '0.9rem' }}>jane.smith@example.com</CTableDataCell>
                                            <CTableDataCell style={{ fontSize: '0.9rem' }}>555-987-6543</CTableDataCell>
                                        </CTableRow>
                                                <CTableRow>
                                            <CTableDataCell style={{ fontSize: '0.9rem' }}>3</CTableDataCell>
                                            <CTableDataCell style={{ fontSize: '0.9rem' }}>Mike Brown</CTableDataCell>
                                            <CTableDataCell style={{ fontSize: '0.9rem' }}>mike.brown@example.com</CTableDataCell>
                                            <CTableDataCell style={{ fontSize: '0.9rem' }}>555-246-8109</CTableDataCell>
                                        </CTableRow>
                                       {/* )) */}
                                          {/* ) : (
                                            <CTableRow>
                                                <CTableDataCell colSpan="4" className="text-center">No recent tenants</CTableDataCell>
                                           </CTableRow>
                                         )} */}
                                </CTableBody>
                            </StyledTable>
                            <div className="view-all-button">
                                <ViewAllButton onClick={handleViewAllTenants}>View All</ViewAllButton>
                            </div>
                        </CCardBody>
                    </AnimatedCard>
                </CCol>
            </CRow>
             <CRow>
                <CCol lg={12}>
                    <AnimatedCard className="table-card">
                        <CCardHeader className="table-header">Recent Maintenances</CCardHeader>
                        <CCardBody className="table-body">
                            <StyledTable hover>
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell>#</CTableHeaderCell>
                                        <CTableHeaderCell>Description</CTableHeaderCell>
                                        <CTableHeaderCell>Status</CTableHeaderCell>
                                         <CTableHeaderCell>Due Date</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                     {/*   {maintenanceStatusData?.datasets[0].data.length > 0 ? (
                                    maintenanceStatusData?.labels?.map((maintenance, index) => ( */}
                                        <CTableRow>
                                            <CTableDataCell style={{ fontSize: '0.9rem' }}>1</CTableDataCell>
                                            <CTableDataCell style={{ fontSize: '0.9rem' }}>Fix leaky faucet</CTableDataCell>
                                            <CTableDataCell style={{ fontSize: '0.9rem' }}>
                                                {getStatusIcon('open')}
                                            </CTableDataCell>
                                             <CTableDataCell style={{ fontSize: '0.9rem' }}>2024-02-20</CTableDataCell>
                                        </CTableRow>
                                          <CTableRow>
                                            <CTableDataCell style={{ fontSize: '0.9rem' }}>2</CTableDataCell>
                                            <CTableDataCell style={{ fontSize: '0.9rem' }}>Repair broken window</CTableDataCell>
                                             <CTableDataCell style={{ fontSize: '0.9rem' }}>
                                                {getStatusIcon('closed')}
                                            </CTableDataCell>
                                             <CTableDataCell style={{ fontSize: '0.9rem' }}>2024-02-15</CTableDataCell>
                                        </CTableRow>
                                         <CTableRow>
                                            <CTableDataCell style={{ fontSize: '0.9rem' }}>3</CTableDataCell>
                                           <CTableDataCell style={{ fontSize: '0.9rem' }}>Replace light bulb</CTableDataCell>
                                             <CTableDataCell style={{ fontSize: '0.9rem' }}>
                                                {getStatusIcon('under maintenance')}
                                            </CTableDataCell>
                                               <CTableDataCell style={{ fontSize: '0.9rem' }}>2024-02-25</CTableDataCell>
                                        </CTableRow>
                                    {/* ))
                                    ) : (
                                        <CTableRow>
                                             <CTableDataCell colSpan="4" className="text-center">No recent maintenances</CTableDataCell>
                                        </CTableRow>
                                    )} */}
                                </CTableBody>
                            </StyledTable>
                              <div className="view-all-button">
                                <ViewAllButton onClick={handleViewAllMaintenance}>View All</ViewAllButton>
                            </div>
                        </CCardBody>
                    </AnimatedCard>
                </CCol>
            </CRow>
        </>
    );
};

export default AdminDashboard;