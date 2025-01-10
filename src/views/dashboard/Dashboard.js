import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTenants } from '../../api/actions/TenantActions';
import { filterProperties } from '../../api/actions/PropertyAction';
import { fetchMaintenances } from '../../api/actions/MaintenanceActions';
import propertyService from "../../api/services/property.service";
import { decryptData } from '../../api/utils/crypto';

import SuperAdminDashboard from './SuperAdminDashboard';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';
import InspectorDashboard from './InspectorDashboard';
import MaintenorDashboard from './MaintenorDashboard';
import {
    cilPeople,
    cilFile,
    cilArrowBottom,
    cilCheckCircle,
    cilBan,
    cilPhone
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {colors} from './styledComponents';


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

    const encryptedUser = localStorage.getItem('user');
    const user = decryptData(encryptedUser);
  const userRole = user.role;

    console.log('User Role:', userRole);
  console.log('Redux Properties:', properties);
    console.log('Redux Tenants:', tenants);
    console.log('Redux Maintenances:', maintenances);


  useEffect(() => {
    const fetchInitialData = async () => {
        try {
            await dispatch(filterProperties({ limit: 5, page: 1 }));
            await dispatch(fetchTenants({ limit: 5, page: 1 }));
            await dispatch(fetchMaintenances({limit: 10, page: 1}))
        } catch (error) {
            console.error('Failed to fetch initial data:', error);
        }
    };

    fetchInitialData();
}, [dispatch]);


    useEffect(() => {
        // Ensure the data is mapped correctly from the Redux state
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
            console.log('MAINTENACE DATA', maintenanceStatusData)
        }
    }, [maintenances]);


  useEffect(() => {
    const fetchPropertyTypes = async () => {
      try {
        const response = await propertyService.getPropertyTypes();
          console.log('Response', response)
        if (response?.propertyTypes) {
          const labels = response.propertyTypes.map(item => item.propertyType);
          const data = response.propertyTypes.map(item => item.count);

          setPropertyTypesData(prevState => ({
            ...prevState,
            labels: labels,
            datasets: [{ ...prevState.datasets[0], data: data }]
          }));
        }

      } catch (error) {
        console.error('Failed to fetch property types:', error);
      }
    };
    fetchPropertyTypes();
  }, []);


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


  const renderDashboard = () => {
    switch (userRole) {
      case 'SuperAdmin':
          return (
          <SuperAdminDashboard
            stats={stats}
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
            stats={stats}
            monthlyRevenue={monthlyRevenue}
            propertyTypesData={propertyTypesData}
            recentProperties={recentProperties}
            recentTenants={recentTenants}
            maintenanceStatusData={maintenanceStatusData}
            getStatusIcon={getStatusIcon}
          />
        );
      case 'User':
        return <UserDashboard />;
        case 'Inspector':
           return <InspectorDashboard />;
      case 'Maintenor':
           return (
             <MaintenorDashboard
             stats={stats}
             maintenanceStatusData={maintenanceStatusData}
               />
           );
        case 'Tenant':
            return <UserDashboard />;
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