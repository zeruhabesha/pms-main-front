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
import { CChartDoughnut } from '@coreui/react-chartjs';
import {
    cilUser,
    cilCheckCircle,
    cilXCircle,
    cilBriefcase
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { useNavigate } from 'react-router-dom';
import {
    colors,
    fadeIn,
    slideInFromLeft,
    WidgetStatsContainer,
    AnimatedCard,
    ColoredCard,
    StyledTable,
    ViewAllButton,
    ChartContainer
} from './superadminstyled';


const SuperAdminDashboard = ({
                                 stats,
                                 adminStatusData,
                                 adminRoleData,
                                 recentAdmins,
                                 getStatusIcon
                             }) => {

    const navigate = useNavigate();

    const handleViewAllAdmins = () => {
        navigate('/admins');
    };

    // Debugging logs - check if stats and its properties are defined
    console.log("Stats prop in SuperAdminDashboard:", stats);
    if (stats) {
        console.log("stats.admins:", stats.admins);
        console.log("stats.activeAdmins:", stats.activeAdmins);
        console.log("stats.inactiveAdmins:", stats.inactiveAdmins);
    }

    return (
        <>
            <CRow className="mb-4">
                <CCol sm={6} lg={3}>
                    <WidgetStatsContainer
                        className="mb-4 widget-admin"
                        color="white"
                        value={stats?.admins?.toString() || 'N/A'} // Added optional chaining and default value
                        title="Total Admins"
                        icon={<CIcon icon={cilUser} height={36} style={{ color: colors.primary }} />}
                        progress={{ color: 'secondary', value: 75 }}
                    >
                        <div className="widget-header">
                            <CIcon icon={cilUser} height={36} className="icon" style={{ color: colors.primary }} />
                            <span className="title">Total Admins</span>
                        </div>
                        <div className="value">{stats?.admins?.toString() || 'N/A'}</div> {/* Added optional chaining and default value */}
                    </WidgetStatsContainer>
                </CCol>
                <CCol sm={6} lg={3}>
                    <WidgetStatsContainer
                        className="mb-4 widget-active-admins"
                        color="white"
                        value={stats?.activeAdmins?.toString()  || 'N/A'} // Added optional chaining and default value
                        title="Active Admins"
                        icon={<CIcon icon={cilCheckCircle} height={36} style={{ color: colors.success }} />}
                        progress={{ color: 'success', value: 75 }}
                    >
                        <div className="widget-header">
                            <CIcon icon={cilCheckCircle} height={36} className="icon" style={{ color: colors.success }} />
                            <span className="title">Active Admins</span>
                        </div>
                        <div className="value">{stats?.activeAdmins?.toString() || 'N/A'}</div> {/* Added optional chaining and default value */}
                    </WidgetStatsContainer>
                </CCol>
                <CCol sm={6} lg={3}>
                    <WidgetStatsContainer
                        className="mb-4 widget-inactive-admins"
                        color="white"
                        value={stats?.inactiveAdmins?.toString() || 'N/A'} // Added optional chaining and default value
                        title="Inactive Admins"
                        icon={<CIcon icon={cilXCircle} height={36} style={{ color: colors.danger }} />}
                        progress={{ color: 'danger', value: 75 }}
                    >
                        <div className="widget-header">
                            <CIcon icon={cilXCircle} height={36} className="icon" style={{ color: colors.danger }} />
                            <span className="title">Inactive Admins</span>
                        </div>
                        <div className="value">{stats?.inactiveAdmins?.toString() || 'N/A'}</div> {/* Added optional chaining and default value */}
                    </WidgetStatsContainer>
                </CCol>
                <CCol sm={6} lg={3}>
                    {/* You can add another admin-related widget here if needed */}
                </CCol>
            </CRow>

            <CRow>
                <CCol lg={6}>
                    <AnimatedCard className="chart-card">
                        <CCardHeader className="chart-header">Admin Status Distribution</CCardHeader>
                        <CCardBody className="chart-body">
                            <ChartContainer>
                                <CChartDoughnut
                                    data={adminStatusData}
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
                        <CCardHeader className="chart-header">Admin Role Distribution</CCardHeader>
                        <CCardBody className="chart-body">
                            <ChartContainer>
                                <CChartDoughnut
                                    data={adminRoleData}
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

            <CRow className="mt-4">
                <CCol lg={12}>
                    <AnimatedCard className="table-card">
                        <CCardHeader className="table-header">Recent Admins</CCardHeader>
                        <CCardBody className="table-body">
                            <StyledTable hover>
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell>#</CTableHeaderCell>
                                        <CTableHeaderCell>Name</CTableHeaderCell>
                                        <CTableHeaderCell>Email</CTableHeaderCell>
                                        <CTableHeaderCell>Role</CTableHeaderCell>
                                        <CTableHeaderCell>Status</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {recentAdmins?.map((admin, index) => (
                                        <CTableRow key={admin._id} className="table-row-item">
                                            <CTableDataCell>{index + 1}</CTableDataCell>
                                            <CTableDataCell>{admin.name}</CTableDataCell>
                                            <CTableDataCell>{admin.email}</CTableDataCell>
                                            <CTableDataCell>{admin.role}</CTableDataCell>
                                            <CTableDataCell>
                                                {getStatusIcon(admin.status)}
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))}
                                </CTableBody>
                            </StyledTable>
                            <div className="view-all-button">
                                <ViewAllButton onClick={handleViewAllAdmins}>View All Admins</ViewAllButton>
                            </div>
                        </CCardBody>
                    </AnimatedCard>
                </CCol>
            </CRow>
        </>
    );
};

export default SuperAdminDashboard;