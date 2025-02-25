/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react';
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
    cilBan,
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
import { cilCheckCircle as cilCheckCircleIcon, cilClock, cilCalendar, cilList } from '@coreui/icons';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { fetchMaintenanceStatusCounts } from '../../api/actions/MaintenanceActions'; // Import the new action
import { filterProperties } from '../../api/actions/PropertyAction';


// Styled Components (reusing and extending existing ones)

const SummaryCardContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1rem;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const StyledSummaryCard = styled.div`
    background: #fff;
    border-radius: 0.5rem;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.08);
    padding: 1rem;
    flex: 1;
    min-width: 250px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: transform 0.2s ease-in-out;

    &:hover {
        transform: translateY(-0.25rem);
    }

    .summary-content {
        display: flex;
        align-items: center;
        gap: 1rem;

        .summary-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background-color: rgba(0, 0, 0, 0.05);
        }
    }

    h4 {
        font-size: 1.25rem;
        margin-bottom: 0.5rem;
        color: #333;
    }

    p {
        font-size: 1.5rem;
        font-weight: bold;
        color: ${(props) => props.color || '#007bff'};
    }

    @media (max-width: 576px) {
        min-width: 100%;
    }
`;
const PropertyStatusContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1rem;
    justify-content: space-around; /* Distribute items evenly */

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const StatusCard = styled.div`
    background-color: #f0f0f0; /* Light grey background */
    border-radius: 0.5rem;
    padding: 1rem;
    text-align: center;
    width: calc(50% - 1rem); /* Two cards per row with gap */
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.08);
    transition: transform 0.2s ease-in-out;

    &:hover {
        transform: translateY(-0.25rem);
    }

    h4 {
        font-size: 1.1rem;
        margin-bottom: 0.5rem;
        color: #555;
    }

    p {
        font-size: 1.3rem;
        font-weight: bold;
        color: #333;
    }

    @media (max-width: 576px) {
        width: 100%; /* Full width on small screens */
    }
`;

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
    const dispatch = useDispatch();
    const maintenanceStatusCounts = useSelector((state) => state.maintenance.statusCounts); // Access statusCounts from maintenance
    const properties = useSelector((state) => state.property?.properties?.data || []); // Access properties from store
    const propertyStatusCounts = useSelector((state) => state.property?.statusCounts || {});
    const [recentProperties, setRecentProperties] = React.useState([]);

    useEffect(() => {
        dispatch(fetchMaintenanceStatusCounts()); // Dispatch action to fetch status counts
    }, [dispatch]);

     useEffect(() => {
        // Ensure statusCounts is logged after it's fetched
        console.log("AdminDashboard - Maintenance Status Counts from Redux:", maintenanceStatusCounts);
    }, [maintenanceStatusCounts]);

     useEffect(() => {
        // Ensure propertyStatusCounts is logged after it's fetched
        console.log("AdminDashboard - Property Status Counts from Redux:", propertyStatusCounts);
    }, [propertyStatusCounts]);

    useEffect(() => {
        // Fetch properties, you might want to pass some criteria for 'recent' if needed
        dispatch(filterProperties({}));
    }, [dispatch]);

    useEffect(() => {
        // Once properties are fetched, select the recent ones
        if (properties && properties.length > 0) {
            // Sort by creation date or any other relevant field, and take the first few
            const sortedProperties = [...properties].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setRecentProperties(sortedProperties.slice(0, 3)); // Display up to 3 recent properties
        }
    }, [properties]);

    // const statusCounts = useSelector((state) => state.property?.statusCounts || {});
    const { tenants } = useSelector((state) => state.tenant);
    const { maintenances } = useSelector((state) => state.maintenance);

    // Define default values, including status counts, to avoid undefined errors
    const defaultStats = {
        admins: 5,
        properties: 0,
        tenants: tenants?.total || 0,
        revenue: '12000',
        pendingRequests: 8,
        newTenants: 12,
        avgRent: 1600,
        maintenanceTasks: maintenances?.maintenances?.filter(m => m.status !== 'completed')?.length || 0,
        statusCounts: { // Ensure statusCounts is always an object
            reserved: 0,
            closed: 0,
            "under maintenance": 0,
            open: 0,
            deleted: 0
        },
        tenantStatusCounts: {
            active: 0,
            inactive: 0,
            pending: 0
        }
    };

    // Merge stats and statusCounts carefully to ensure all values are available
    const mergedStats = { ...defaultStats, ...stats, statusCounts: { ...defaultStats.statusCounts, ...propertyStatusCounts } };

    // Calculate total properties from status counts
    const totalProperties = mergedStats.statusCounts ? (
        (mergedStats.statusCounts.closed || 0) +
        (mergedStats.statusCounts["under maintenance"] || 0) +
        (mergedStats.statusCounts.reserved || 0) +
        (mergedStats.statusCounts.open || 0)
    ) : 0;

    // Update summaryCardData to use merged values
    const summaryCardData = [
        {
            icon: cilBuilding,
            label: "Total Properties",
            value: totalProperties.toString(),
            color: "green",
        },
        {
            icon: cilPeople,
            label: "Total Tenants",
            value: mergedStats.tenants.toString(),
            color: "blue",
        },
        {
            icon: cilMoney,
            label: "Monthly Revenue",
            value: mergedStats.revenue,
            color: "orange",
        },
        {
            icon: cilTags,
            label: "Active Tenants",
            value: mergedStats.tenantStatusCounts.active.toString(),
            color: "blue",
        },
        {
            icon: cilBan,
            label: "Inactive Tenants",
            value: mergedStats.tenantStatusCounts.inactive.toString(),
            color: "red",
        },
        {
            icon: cilClock,
            label: "Pending Tenants",
            value: mergedStats.tenantStatusCounts.pending.toString(),
            color: "yellow",
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

    const random = () => Math.round(Math.random() * 100)

    const chartHeight = 300; // Set your desired height

    const chartOptions = {
        plugins: {
            legend: { position: 'bottom' },
        },
        animation: {
            animateScale: true,
            animateRotate: true,
        },
        maintainAspectRatio: false,
        responsive: true,
    };
    const maintenancesData = {
        labels: ["Pending", "Approved", "In Progress", "Completed", "Cancelled", "Inspected", "Incomplete"],
        datasets: [
            {
                label: 'Maintenance Status',
                data: [maintenanceStatusCounts?.Pending, maintenanceStatusCounts?.Approved, maintenanceStatusCounts["In Progress"], maintenanceStatusCounts?.Completed, maintenanceStatusCounts?.Cancelled, maintenanceStatusCounts?.Inspected, maintenanceStatusCounts?.Incomplete],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#C9CBCF', '#000000'],
                hoverOffset: 10,
            }
        ]
    };
    // const chartOptions = {
    //     plugins: {
    //         legend: { position: 'bottom' },
    //     },
    //     animation: {
    //         animateScale: true,
    //         animateRotate: true,
    //     },
    // };

    return (
        <>
            {/* Top-Level Summary Metrics */}
            <SummaryCardContainer>
                {summaryCardData.map((data, index) => (
                    <StyledSummaryCard key={index} color={data.color}>
                        <div className="summary-content">
                            <div className="summary-icon">
                                <CIcon icon={data.icon} size="xl" style={{ color: data.color }} />
                            </div>
                            <div>
                                <h4>{data.label}</h4>
                                <p>{data.value}</p>
                            </div>
                        </div>
                    </StyledSummaryCard>
                ))}
            </SummaryCardContainer>

            {/* Property Status Classification */}
            <PropertyStatusContainer>
                <StatusCard>
                    <h4>Open Properties</h4>
                    <p>{mergedStats.statusCounts.open || 0}</p>
                </StatusCard>
                <StatusCard>
                    <h4>Reserved Properties</h4>
                    <p>{mergedStats.statusCounts.reserved || 0}</p>
                </StatusCard>
                <StatusCard>
                    <h4>Under Maintenance</h4>
                    <p>{mergedStats.statusCounts["under maintenance"] || 0}</p>
                </StatusCard>
                <StatusCard>
                    <h4>Closed Properties</h4>
                    <p>{mergedStats.statusCounts.closed || 0}</p>
                </StatusCard>
            </PropertyStatusContainer>

            {/* Secondary Metrics and Trends */}
            <CRow className="mb-4">
                <CCol md={4}>
                    <MetricCard gradient="linear-gradient(45deg, #FF6B6B, #FF8E53)">
                        <div className="metric-header">
                            <CIcon icon={cilGraph} height={24} style={{ marginRight: '0.5em' }} />
                            <h4>Revenue Growth</h4>
                        </div>
                        <div className="metric-body">
                            <div style={{ fontSize: '1.5em', fontWeight: 'bold' }}>$2500</div>
                            <div><SparkLine data={[10, 20, 15, 25, 30, 22, 28]} /></div>
                        </div>
                    </MetricCard>
                </CCol>
                <CCol md={4}>
                    <MetricCard gradient="linear-gradient(45deg, #42A5F5, #64B5F6)">
                        <div className="metric-header">
                            <CIcon icon={cilUserPlus} height={24} style={{ marginRight: '0.5em' }} />
                            <h4>New Tenants</h4>
                        </div>
                        <div className="metric-body">
                            <div style={{ fontSize: '1.5em', fontWeight: 'bold' }}>10</div>
                            <div><SparkLine data={[5, 8, 6, 10, 12, 15, 11]} /></div>
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
                            <div style={{ fontSize: '1.5em', fontWeight: 'bold' }}>10</div>
                            <div><SparkLine data={[5, 8, 6, 10, 12, 15, 11]} /></div>
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
                            <ChartContainer style={{ height: chartHeight }}>
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
                            <ChartContainer style={{ height: chartHeight }}>
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
                        <CCardHeader>Maintenance Requests Trend</CCardHeader>
                        <CCardBody>
                            <ChartContainer style={{ height: chartHeight }}>
                                <CChartLine
                                    data={{
                                        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                                        datasets: [
                                            {
                                                label: 'Plumbing',
                                                backgroundColor: 'rgba(220, 220, 220, 0.2)',
                                                borderColor: 'rgba(220, 220, 220, 1)',
                                                pointBackgroundColor: 'rgba(220, 220, 220, 1)',
                                                pointBorderColor: '#fff',
                                                data: [random(), random(), random(), random(), random(), random(), random()],
                                            },
                                            {
                                                label: 'Electrical',
                                                backgroundColor: 'rgba(151, 187, 205, 0.2)',
                                                borderColor: 'rgba(151, 187, 205, 1)',
                                                pointBackgroundColor: 'rgba(151, 187, 205, 1)',
                                                pointBorderColor: '#fff',
                                                data: [random(), random(), random(), random(), random(), random(), random()],
                                            },
                                            {
                                                label: 'HVAC',
                                                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                                borderColor: 'rgba(255, 99, 132, 1)',
                                                pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                                                pointBorderColor: '#fff',
                                                data: [random(), random(), random(), random(), random(), random(), random()],
                                            },
                                            {
                                                label: 'Appliance Repair',
                                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                                borderColor: 'rgba(75, 192, 192, 1)',
                                                pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                                                pointBorderColor: '#fff',
                                                data: [random(), random(), random(), random(), random(), random(), random()],
                                            },
                                            {
                                                label: 'Other',
                                                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                                                borderColor: 'rgba(54, 162, 235, 1)',
                                                pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                                                pointBorderColor: '#fff',
                                                data: [random(), random(), random(), random(), random(), random(), random()],
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
                            <ChartContainer style={{ height: chartHeight }}>
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
                            <div className="summary-icon"><CIcon icon={cilCheckCircleIcon} height={36} style={{ color: colors.success }} />
                            </div>
                            <LabeledValue label="Completed Inspections"
                                value={inspectionStats?.completedInspections || 0} />
                        </div>
                    </SummaryCard>
                </CCol>
                <CCol sm={6} lg={3}>
                    <SummaryCard>
                        <div className="summary-content">
                            <div className="summary-icon"><CIcon icon={cilClock} height={36} style={{ color: colors.warning }} />
                            </div>
                            <LabeledValue label="Pending Inspections" value={inspectionStats?.pendingInspections || 0} />
                        </div>
                    </SummaryCard>
                </CCol>
                <CCol sm={6} lg={3}>
                    <SummaryCard>
                        <div className="summary-content">
                            <div className="summary-icon"><CIcon icon={cilCalendar} height={36} style={{ color: colors.info }} />
                            </div>
                            <LabeledValue label="Scheduled Inspections" value={inspectionStats?.scheduledInspections || 0} />
                        </div>
                    </SummaryCard>
                </CCol>
                <CCol sm={6} lg={3}>
                    <SummaryCard>
                        <div className="summary-content">
                            <div className="summary-icon"><CIcon icon={cilList} height={36} style={{ color: colors.primary }} />
                            </div>
                            <LabeledValue label="Total Inspections"
                                value={(inspectionStats?.completedInspections || 0) + (inspectionStats?.pendingInspections || 0) + (inspectionStats?.scheduledInspections || 0)} />
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
                                    {recentProperties.map((property, index) => (
                                        <CTableRow key={property.id}>
                                            <CTableDataCell style={{ fontSize: '0.9rem' }}>{index + 1}</CTableDataCell>
                                            <CTableDataCell style={{ fontSize: '0.9rem' }}>{property.name}</CTableDataCell>
                                            <CTableDataCell style={{ fontSize: '0.9rem' }}>
                                                {getStatusIcon(property.status)}
                                            </CTableDataCell>
                                            <CTableDataCell style={{ fontSize: '0.9rem' }}>{property.price}</CTableDataCell>
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