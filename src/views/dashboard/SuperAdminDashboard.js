import React from 'react';
import {
    CRow,
    CCol,
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
} from '@coreui/react';
import { CChartDoughnut, CChartBar } from '@coreui/react-chartjs';
import styled from 'styled-components';
import {generateBarChartSVG, generateSparkLineSVG } from './chartHelpers';
import {
    cilPeople,
    cilBuilding,
    cilUser,
    cilMoney,
} from '@coreui/icons';
import {
    cilFile,
    cilArrowTop,
    cilArrowBottom,
    cilCheckCircle,
    cilBan,
    cilPhone
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { useNavigate } from 'react-router-dom';
import MainChart from "./MainChart";
import {colors, fadeIn, slideInFromLeft, WidgetStatsContainer, AnimatedCard, ColoredCard, StyledTable, ViewAllButton, ChartContainer} from './styledComponents';



const SuperAdminDashboard = ({
                                stats,
                                monthlyRevenue,
                                propertyTypesData,
                                recentProperties,
                                recentTenants,
                                maintenanceStatusData,
                                getStatusIcon
                            }) => {

    const navigate = useNavigate();

    const handleViewAllProperties = () => {
        navigate('/properties');
    };

    const handleViewAllTenants = () => {
        navigate('/tenants');
    };


    return (
        <>
            <CRow className="mb-4">
                <CCol sm={6} lg={3}>
                    <WidgetStatsContainer
                        className="mb-4 widget-admin"
                        color="white"
                        value={stats.admins.toString()}
                        title="Total Admins"
                        icon={<CIcon icon={cilUser} height={36} style={{ color: colors.primary }} />}
                        progress={{ color: 'secondary', value: 75 }}
                    >
                        <div className="widget-header">
                            <CIcon icon={cilUser} height={36} className="icon" style={{ color: colors.primary }} />
                            <span className="title">Total Admins</span>
                        </div>
                        <div className="value">{stats.admins.toString()}</div>
                    </WidgetStatsContainer>
                </CCol>
                <CCol sm={6} lg={3}>
                    <WidgetStatsContainer
                        icon={<CIcon icon={cilBuilding} height={36} style={{ color: colors.success }} />}
                        title="Total Properties"
                        className="mb-4 widget-property"
                        color="white"
                        value={stats.properties.toString()}
                        progress={{ color: 'secondary', value: 75 }}
                    >
                        <div className="widget-header">
                            <CIcon icon={cilBuilding} height={36} className="icon" style={{ color: colors.success }} />
                            <span className="title">Total Properties</span>
                        </div>
                        <div className="value">{stats.properties.toString()}</div>
                    </WidgetStatsContainer>
                </CCol>
                <CCol sm={6} lg={3}>
                    <WidgetStatsContainer
                        className="mb-4 widget-tenants"
                        color="white"
                        value={stats.tenants.toString()}
                        title="Total Tenants"
                        icon={<CIcon icon={cilPeople} height={36} style={{ color: colors.info }} />}
                        progress={{ color: 'secondary', value: 75 }}
                    >
                        <div className="widget-header">
                            <CIcon icon={cilPeople} height={36} className="icon" style={{ color: colors.info }} />
                            <span className="title">Total Tenants</span>
                        </div>
                        <div className="value">{stats.tenants.toString()}</div>
                    </WidgetStatsContainer>
                </CCol>
                <CCol sm={6} lg={3}>
                    <WidgetStatsContainer
                        className="mb-4 widget-revenue"
                        color="white"
                        value={`$${stats.revenue}`}
                        title="Monthly Revenue"
                        icon={<CIcon icon={cilMoney} height={36} style={{ color: colors.warning }} />}
                        progress={{ color: 'secondary', value: 75 }}
                    >
                        <div className="widget-header">
                            <CIcon icon={cilMoney} height={36} className="icon" style={{ color: colors.warning }} />
                            <span className="title">Monthly Revenue</span>
                        </div>
                        <div className="value">{`$${stats.revenue}`}</div>
                        <span className="trend-arrow up">▲ 10%</span>
                    </WidgetStatsContainer>
                </CCol>
            </CRow>



            <CRow>
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

            </CRow>
            <CRow>
                <CCol xs={12} sm={6} lg={3}>
                    <ColoredCard className="mb-4 widget-pending">
                        <div className="border-start border-start-4  py-1 px-3">
                            <div className="text-body-secondary text-truncate small">Pending Requests</div>
                            <div className="fs-5 fw-semibold">{stats.pendingRequests.toString()}</div>
                            <div className="chart-container">{generateSparkLineSVG([1,3,5,8,6], 60, 20, colors.white)}</div>
                        </div>
                    </ColoredCard>
                </CCol>
                <CCol xs={12} sm={6} lg={3}>
                    <ColoredCard className="mb-4 widget-new-tenants">
                        <div className="border-start border-start-4  py-1 px-3">
                            <div className="text-body-secondary text-truncate small">New Tenants This Month</div>
                            <div className="fs-5 fw-semibold">{stats.newTenants.toString()}</div>
                            <div className="chart-container">{generateSparkLineSVG([1,3,10,9,12], 60, 20, colors.white)}</div>
                        </div>
                    </ColoredCard>
                </CCol>
                <CCol xs={12} sm={6} lg={3}>
                    <ColoredCard className="mb-4 widget-avg-rent">
                        <div className="border-start border-start-4 py-1 px-3">
                            <div className="text-body-secondary text-truncate small">Average Rent</div>
                            <div className="fs-5 fw-semibold">${stats.avgRent}</div>
                            <div className="chart-container">{generateSparkLineSVG([1400, 1500, 1600, 1550, 1700], 60, 20, colors.white)}</div>
                        </div>
                    </ColoredCard>
                </CCol>
                <CCol xs={12} sm={6} lg={3}>
                    <ColoredCard className="mb-4 widget-maintenance-task">
                        <div className="border-start border-start-4 py-1 px-3">
                            <div className="text-body-secondary text-truncate small">Open Maintenance Tasks</div>
                            <div className="fs-5 fw-semibold">{stats.maintenanceTasks.toString()}</div>
                            <div className="chart-container">{generateBarChartSVG([1,3,2],3, colors.white)}</div>
                        </div>
                    </ColoredCard>
                </CCol>
            </CRow>
            <CRow className="mt-4">
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
                                            <CTableDataCell>{index + 1}</CTableDataCell>
                                            <CTableDataCell>{property.title}</CTableDataCell>
                                            <CTableDataCell>
                                                {getStatusIcon(property.status)}
                                            </CTableDataCell>
                                            <CTableDataCell>${property.price}</CTableDataCell>
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
                                            <CTableDataCell>{index + 1}</CTableDataCell>
                                            <CTableDataCell>{tenant.tenantName}</CTableDataCell>
                                            <CTableDataCell>{tenant.contactInformation.email}</CTableDataCell>
                                            <CTableDataCell>{tenant.contactInformation.phoneNumber}</CTableDataCell>
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
                <CCol>
                    <AnimatedCard className="chart-card">
                        <CCardHeader className="chart-header">General Activity</CCardHeader>
                        <CCardBody className="chart-body">
                            <MainChart/>
                        </CCardBody>
                    </AnimatedCard>
                </CCol>
            </CRow>
        </>
    );
};

export default SuperAdminDashboard;