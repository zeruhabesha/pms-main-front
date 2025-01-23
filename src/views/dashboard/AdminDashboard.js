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
import { CChartDoughnut, CChartBar } from '@coreui/react-chartjs';
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
                           propertyTypesData,
                           recentProperties,
                           recentTenants,
                           maintenanceStatusData,
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
        filter: 'blur(5px)',
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
      

      const renderSummaryCard = (icon, label, value, color) => {
        return (
          <CCol sm={6} lg={3}>
            <SummaryCard>
              <div className="summary-content">
                <div className="summary-icon">
                  <CIcon icon={icon} height={36} style={{ color: color }} />
                </div>
                <LabeledValue label={label} value={value} />
              </div>
            </SummaryCard>
          </CCol>
        );
      };

      
    return (
        <>
            {/* Top-Level Summary Metrics */}
            {/* <CRow className="mb-4">

                 {renderSummaryCard(cilBuilding, "Total Properties", stats?.properties?.toString(), colors.success)}
                   {renderSummaryCard(cilPeople, "Total Tenants", stats?.tenants?.toString(), colors.info)}
                    {renderSummaryCard(cilMoney, "Monthly Revenue", `$${stats?.revenue}`, colors.warning)}
                     {renderSummaryCard(cilTags, "Open Maintenance Tasks", stats?.maintenanceTasks?.toString(), colors.red)}
            </CRow> */}
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
                            {/* For now, just a placeholder */}
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
                            {/* For now, just a placeholder */}
                            <div> <SparkLine data={[5, 8, 6, 10, 12, 15, 11]}/></div>
                        </div>
                    </MetricCard>
                </CCol>
                <CCol md={4}>
                    <MetricCard gradient="linear-gradient(45deg, #FFCA28, #FFD54F)">
                         <div className="metric-header">
                            <CIcon icon={cilWarning} height={24} style={{marginRight: '0.5em'}}/>
                             <h4>Pending Requests</h4>
                        </div>
                         <div className="metric-body">
                             <LabeledValue value={stats?.pendingRequests?.toString()} />
                            {/* For now, just a placeholder */}
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
                            <ChartContainer>
                                <CChartDoughnut
                                    data={propertyTypesData}
                                    options={{
                                        plugins: {
                                            legend: { position: 'bottom' },
                                        },
                                        animation: {
                                            animateScale: true,
                                            animateRotate: true,
                                        },
                                    }}
                                />
                            </ChartContainer>
                        </CCardBody>
                    </AnimatedCard>
                 </CCol>
                   <CCol lg={6}>
                     <AnimatedCard className="chart-card">
                         <CCardHeader className="chart-header">Monthly Revenue</CCardHeader>
                         <CCardBody className="chart-body">
                           <ChartContainer>
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
                             </ChartContainer>
                        </CCardBody>
                    </AnimatedCard>
                </CCol>
                 <CCol lg={6}>
                    <AnimatedCard className="chart-card">
                        <CCardHeader className="chart-header">Maintenance Status</CCardHeader>
                        <CCardBody className="chart-body">
                            <ChartContainer>
                                <CChartDoughnut
                                    data={maintenanceStatusData}
                                    options={{
                                        plugins: {
                                            legend: { position: 'bottom' },
                                        },
                                        animation: {
                                            animateScale: true,
                                            animateRotate: true,
                                        },
                                    }}
                                />
                            </ChartContainer>
                        </CCardBody>
                    </AnimatedCard>
                 </CCol>
                 <CCol lg={6}>
                    <AnimatedCard className="chart-card">
                        <CCardHeader className="chart-header">
                            <CIcon icon={cilBarChart} className="me-2" />
                            General Activity
                        </CCardHeader>
                        <CCardBody className="chart-body">
                            <MainChart />
                        </CCardBody>
                    </AnimatedCard>
                </CCol>
            </CRow>
<CRow className="mb-4">
           <CCol sm={6} lg={3}>
                    <SummaryCard>
                         <div className="summary-content">
                            <div className="summary-icon"><CIcon icon={cilCheckCircleIcon} height={36} style={{ color: colors.success }} /></div>
                             <LabeledValue label="Completed Inspections" value={<span style={blurredText}>{inspectionStats?.completedInspections}</span>}/>
                        </div>
                    </SummaryCard>
                </CCol>
                <CCol sm={6} lg={3}>
                    <SummaryCard>
                         <div className="summary-content">
                             <div className="summary-icon"><CIcon icon={cilClock} height={36} style={{ color: colors.warning }} /></div>
                             <LabeledValue label="Pending Inspections" value={<span style={blurredText}>{inspectionStats?.pendingInspections}</span>}/>
                         </div>
                    </SummaryCard>
                </CCol>
                 <CCol sm={6} lg={3}>
                    <SummaryCard>
                         <div className="summary-content">
                             <div className="summary-icon"><CIcon icon={cilCalendar} height={36} style={{ color: colors.info }} /></div>
                             <LabeledValue label="Scheduled Inspections" value={<span style={blurredText}>{inspectionStats?.scheduledInspections}</span>}/>
                         </div>
                    </SummaryCard>
                 </CCol>
                 <CCol sm={6} lg={3}>
                    <SummaryCard>
                         <div className="summary-content">
                             <div className="summary-icon"><CIcon icon={cilList} height={36} style={{ color: colors.primary }} /></div>
                              <LabeledValue label="Total Inspections" value={<span style={blurredText}>{inspectionStats?.completedInspections + inspectionStats?.pendingInspections}</span>}/>
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
                                    {recentProperties?.map((property, index) => (
                                        <CTableRow key={property._id} className="table-row-item">
                                            <CTableDataCell style={{ fontSize: '0.9rem' }}>{index + 1}</CTableDataCell>
                                            <CTableDataCell style={{ fontSize: '0.9rem' }}>{property.title}</CTableDataCell>
                                            <CTableDataCell style={{ fontSize: '0.9rem' }}>
                                                {getStatusIcon(property.status)}
                                            </CTableDataCell>
                                            <CTableDataCell style={{ fontSize: '0.9rem' }}>${property.price}</CTableDataCell>
                                        </CTableRow>
                                    ))}
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
                                    {recentTenants?.map((tenant, index) => (
                                        <CTableRow key={tenant._id} className="table-row-item">
                                            <CTableDataCell style={{ fontSize: '0.9rem' }}>{index + 1}</CTableDataCell>
                                            <CTableDataCell style={{ fontSize: '0.9rem' }}>{tenant.tenantName}</CTableDataCell>
                                            <CTableDataCell style={{ fontSize: '0.9rem' }}>{tenant.contactInformation.email}</CTableDataCell>
                                            <CTableDataCell style={{ fontSize: '0.9rem' }}>{tenant.contactInformation.phoneNumber}</CTableDataCell>
                                        </CTableRow>
                                    ))}
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
                                    {recentProperties?.map((maintenance, index) => (
                                        <CTableRow key={maintenance._id} className="table-row-item">
                                            <CTableDataCell style={{ fontSize: '0.9rem' }}>{index + 1}</CTableDataCell>
                                            <CTableDataCell style={{ fontSize: '0.9rem' }}>{maintenance.description}</CTableDataCell>
                                            <CTableDataCell style={{ fontSize: '0.9rem' }}>
                                                {getStatusIcon(maintenance.status)}
                                            </CTableDataCell>
                                            <CTableDataCell style={{ fontSize: '0.9rem' }}>{maintenance.dueDate}</CTableDataCell>
                                        </CTableRow>
                                    ))}
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

