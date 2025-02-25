import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTenants } from '../../api/actions/TenantActions';
import { filterProperties } from '../../api/actions/PropertyAction';
import { fetchMaintenances, fetchMaintenanceStatusCounts } from '../../api/actions/MaintenanceActions';
import propertyService from "../../api/services/property.service";
import { decryptData } from '../../api/utils/crypto';
import { fetchPropertyStatusCounts } from '../../api/actions/PropertyAction';
import { fetchTenantStatusCounts } from '../../api/actions/TenantActions';
import SuperAdminDashboard from './SuperAdminDashboard';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';
import InspectorDashboard from './InspectorDashboard';
import MaintenorDashboard from './MaintenorDashboard';
import TenantDashboard from './TenantDashboard';
import {
    cilPeople,
    cilFile,
    cilArrowBottom,
    cilCheckCircle,
    cilBan,
    cilPhone
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { colors } from './styledComponents';


const Dashboard = () => {

    const dispatch = useDispatch();
    const [propertyTypesData, setPropertyTypesData] = useState({
        labels: [],
        datasets: [
            {
                data: [],
                backgroundColor: [colors.primary, colors.success, colors.warning, colors.info],
                hoverOffset: 10,
            }
        ]
    });
    const [recentProperties, setRecentProperties] = useState([]);
    const [recentTenants, setRecentTenants] = useState([]);
    const [maintenanceStatusData, setMaintenanceStatusData] = useState({
        labels: [],
        datasets: [
            {
                data: [],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#C9CBCF'],
                hoverOffset: 10,
            }
        ]
    });
    const { properties } = useSelector((state) => state.property);
    const { tenants } = useSelector((state) => state.tenant);
    const { maintenances } = useSelector((state) => state.maintenance);
    const statusCounts = useSelector((state) => state.property.statusCounts);
    const statusTenantCounts = useSelector((state) => state.tenant.statusCounts);
        const { user, loading, error } = useSelector((state) => state.auth);

    useEffect(() => {
        console.log("Fetching Tenant Status Counts...");
        dispatch(fetchTenantStatusCounts());
    }, [dispatch]);

    useEffect(() => {
        console.log("Dashboard - Status Counts from Redux:", statusCounts);
    }, [statusCounts]);

    useEffect(() => {
        console.log("Dispatching fetchPropertyStatusCounts()");
        dispatch(fetchPropertyStatusCounts());
    }, [dispatch]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                await dispatch(filterProperties({ limit: 5, page: 1 }));
                await dispatch(fetchTenants({ limit: 5, page: 1 }));
                await dispatch(fetchMaintenances({limit: 10, page: 1}));
                console.log("Before fetchPropertyStatusCounts");
                await dispatch(fetchPropertyStatusCounts());
                console.log("After fetchPropertyStatusCounts");
            } catch (error) {
                console.error('Failed to fetch initial data:', error);
            }
        };

        fetchInitialData();
    }, [dispatch]);

    useEffect(() => {
        if (properties?.properties) {
            setRecentProperties(properties.properties);
        } else if (properties) {
            setRecentProperties(properties);
        }

        if (tenants?.tenants) {
            setRecentTenants(tenants.tenants);
        } else if (tenants) {
            setRecentTenants(tenants);
        }
    }, [properties, tenants]);

    useEffect(() => {
        dispatch(fetchMaintenanceStatusCounts());
    }, [dispatch]);

    useEffect(() => {
        if (maintenances?.maintenances) {
            const statusCounts = maintenances.maintenances.reduce((acc, maintenance) => {
                const status = maintenance.status;
                acc[status] = (acc[status] || 0) + 1;
                return acc;
            }, {});

            const labels = Object.keys(statusCounts);
            const data = Object.values(statusCounts);

            setMaintenanceStatusData((prevState) => ({
                ...prevState,
                labels: labels,
                datasets: [{ ...prevState.datasets[0], data: data }],
            }));
            console.log('MAINTENANCE DATA', maintenanceStatusData);
        }
    }, [maintenances]);


    const getStatusIcon = (status) => {
        const statusIconMap = {
            open: <CIcon icon={cilCheckCircle} className="text-success" title="Open" />,
            reserved: <CIcon icon={cilBan} className="text-danger" title="Reserved" />,
            closed: <CIcon icon={cilPeople} className="text-dark" title="Closed" />,
            'under maintenance': <CIcon icon={cilPhone} className="text-warning" title="Under Maintenance" />,
            leased: <CIcon icon={cilFile} className="text-info" title="Leased" />,
            sold: <CIcon icon={cilArrowBottom} className="text-primary" title="Sold" />,
        };
        return statusIconMap[status?.toLowerCase()] || null;
    };

    const calculateAdminStats = () => {
        const propertyStatusCounts = useSelector((state) => state.property.statusCounts) || {};
        const tenantStatusCounts = useSelector((state) => state.tenant.statusCounts) || {
            active: 0,
            inactive: 0,
            pending: 0,
        };

        const totalProperties =
            (propertyStatusCounts.closed || 0) +
            (propertyStatusCounts["under maintenance"] || 0) +
            (propertyStatusCounts.reserved || 0) +
            (propertyStatusCounts.open || 0);

        const totalTenants =
            (tenantStatusCounts.active || 0) +
            (tenantStatusCounts.inactive || 0) +
            (tenantStatusCounts.pending || 0);

        return {
            properties: totalProperties,
            tenants: totalTenants,
            revenue: "12000",
            tenantStatusCounts,
            propertyStatusCounts
        };
    };


    const calculatedStats = calculateAdminStats();

    const monthlyRevenue = {
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

    const maintenorStatsData = {
        maintenanceTasks: maintenances?.maintenances?.filter(m => m.status !== 'completed')?.length || 0,
        overdueTasks:  maintenances?.maintenances?.filter(m => m.dueDate < new Date() && m.status !== 'completed')?.length || 0,
        scheduledTasks: maintenances?.maintenances?.filter(m => m.status === 'scheduled').length || 0,
        completedTasksToday: maintenances?.maintenances?.filter(m => m.status === 'completed' && new Date(m.completedAt).toDateString() === new Date().toDateString()).length || 0,
    };

    const maintenanceStatus = maintenanceStatusData;

    const overdueMaintenanceData = {
        labels: ['Last Week', 'This Week'],
        datasets: [
            {
                label: 'Overdue Tasks',
                backgroundColor: colors.red,
                data: [ 5, maintenorStatsData.overdueTasks ],
                borderColor: colors.red,
                borderWidth: 2
            },
        ],
    };


    const scheduledMaintenanceData = {
        labels: ['Last Week', 'This Week'],
        datasets: [
            {
                label: 'Scheduled Tasks',
                backgroundColor: colors.yellow,
                data: [ 2, maintenorStatsData.scheduledTasks ],
                borderColor: colors.yellow,
                borderWidth: 2
            },
        ],
    };

    const recentActivity = [
        { type: 'completed', text: 'Maintenance task #123 completed by John Doe' },
        { type: 'warning', text: 'Maintenance task #124 is due today' },
        { type: 'pending', text: 'Maintenance task #125 is pending assignment' },
    ];

    const tenantData = {
        name: "John Doe",
        leaseStart: '2024-01-01',
        leaseEnd: '2025-01-01',
        rent: 1200,
        property: '123 Main St',
        outstandingBalance: 200,
        notifications: [
            { message: 'Your rent is due on the 1st of the month', type: 'rent' },
            { message: 'Maintenance scheduled for 2024-08-22', type: 'maintenance' }
        ]
    };

    const inspectionStats = {
        completedInspections: 15,
        pendingInspections: 5,
        scheduledInspections: 7,
    }

    const renderDashboard = () => {
    if (loading) {
        return <div>Loading dashboard...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const userRole = user?.role;

    switch (userRole) {
        case 'SuperAdmin':
            return (
                <SuperAdminDashboard
                    stats={calculatedStats}
                    monthlyRevenue={monthlyRevenue}
                    propertyTypesData={propertyTypesData}
                    recentProperties={recentProperties}
                    recentTenants={recentTenants}
                    maintenanceStatusData={maintenanceStatusData}
                    getStatusIcon={getStatusIcon}
                />
            );
        case 'Admin':
            return (
                <AdminDashboard
                    stats={calculatedStats}
                    monthlyRevenue={monthlyRevenue}
                    getStatusIcon={getStatusIcon}
                    inspectionStats={inspectionStats}
                />
            );
        case 'User':
            return <UserDashboard />;
        case 'Inspector':
            return (
                <InspectorDashboard
                    inspectionStats={inspectionStats}
                />
            );
        case 'Maintainer':
            return (
                <MaintenorDashboard
                    stats={maintenorStatsData}
                    maintenanceStatusData={maintenanceStatus}
                    overdueMaintenanceData={overdueMaintenanceData}
                    scheduledMaintenanceData={scheduledMaintenanceData}
                    recentMaintenanceActivity={recentActivity}
                />
            );
        case 'Tenant':
            return <TenantDashboard tenantData={tenantData}  />;
        default:
            return <div>No dashboard for this role</div>;
    }
};

    return (
        <div className="dashboard">
            {renderDashboard()}
        </div>
    );
};

export default Dashboard;