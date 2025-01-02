import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
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
} from '@coreui/react';
import { CChartDoughnut, CChartBar, CChartLine } from '@coreui/react-chartjs';
import './Dashboard.scss';
import {generateBarChartSVG, generateSparkLineSVG } from './chartHelpers';
import {
    cilPeople,
    cilBuilding,
    cilUser,
    cilMoney,
    cilClock,
    cilUserPlus,
    cilHome,
    cilTask
} from '@coreui/icons';
import {
    cilFile,
    cilCloudDownload,
    cilPencil,
    cilTrash,
    cilFullscreen,
    cilArrowTop,
    cilArrowBottom,
    cilEnvelopeOpen,
    cilPhone,
    cilCheckCircle,
    cilBan,
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import propertyService from "../../api/services/property.service";
import { useDispatch, useSelector } from 'react-redux';
import { fetchTenants } from '../../api/actions/TenantActions';
import { filterProperties } from '../../api/actions/PropertyAction';
import { useNavigate } from 'react-router-dom';
import { fetchMaintenances } from '../../api/actions/MaintenanceActions';

// Define Keyframes for animations
const fadeIn = keyframes`
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
`;

const slideInFromLeft = keyframes`
  from {
    transform: translateX(-50px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;


const WidgetStatsContainer = styled(CWidgetStatsC)`
     border-radius: 12px;
     overflow: hidden;
     position: relative;
     box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
     transition: transform 0.3s ease, box-shadow 0.3s ease;
        
        &:hover {
          transform: translateY(-4px);
         box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }


        .widget-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 15px;
         
          .icon {
             font-size: 1.8rem;
            }
            .title {
                font-size: 1.1rem;
                font-weight: 600;
                 color: #f0f0f0;
            }
      }


        .value {
      font-size: .4rem !important; /* Increased font size and adds !important*/
      font-weight: bold;
      padding: 0 15px 5px 15px;
       color: #fff;
  }

        &.widget-admin {
            background: linear-gradient(to right,rgb(204, 223, 239),rgb(255, 255, 255));
            
        }
        &.widget-property {
            background: linear-gradient(to right,rgb(202, 244, 212),rgb(255, 255, 255));
             
        }
        &.widget-tenants {
            background: linear-gradient(to right,rgb(197, 241, 248),rgb(255, 255, 255));
        }
        &.widget-revenue {
            background: linear-gradient(to right,rgb(245, 232, 192),rgb(255, 255, 255));
             
        }
        
        
          .trend-arrow {
            display: inline-block;
            padding: 3px 8px;
            font-size: 0.8rem;
            margin-left: auto;
            border-radius: 5px;

             &.up{
                 background-color: rgba(0, 123, 255, 0.3);
                 color: #fff;
                 
                &:before {
                  content: "▲";
                   color: #fff;
                 }
             }
             &.down{
                  background-color: rgba(255, 69, 0, 0.3);
                  color: #fff;
                   &:before {
                      content: "▼";
                      color: #fff;
                }
             }
         }
`;

const AnimatedCard = styled(CCard)`
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    margin-bottom: 20px;
    animation: ${fadeIn} 0.5s ease;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
         transform: translateY(-4px);
         box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }

  
    .chart-header,
    .table-header {
      border-bottom: 1px solid #eee;
      padding: 15px 20px;
      font-weight: 600;
       background: linear-gradient(to right, #f8f9fa, #e9ecef);

    }
    .chart-body,
    .table-body{
      padding: 20px;
    }
`;

const ColoredCard = styled(CCard)`
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    animation: ${slideInFromLeft} 0.4s ease;

      &:hover{
           transform: translateY(-2px);
            box-shadow: 0 5px 10px rgba(0,0,0,0.15);
      }
       .border-start {
             padding: 10px 15px;
         
         .text-body-secondary {
             font-size: 0.9rem;
         }
       }


    &.widget-pending {
        background: #f9f9f9;
          .border-start{
              border-color: #007BFF !important;
          }
      }
    &.widget-new-tenants {
          background: #f9f9f9;
           .border-start{
              border-color: #28A745 !important;
          }
      }
    &.widget-avg-rent {
          background: #f9f9f9;
           .border-start{
              border-color: #17A2B8 !important;
          }
      }
    &.widget-maintenance-task {
          background: #f9f9f9;
          .border-start{
             border-color: #FFC107 !important;
          }
      }
`;


const StyledTable = styled(CTable)`
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 20px;

    thead {
        tr {
            background-color: #f8f9fa;
            th {
                padding: 10px 15px;
                text-align: left;
                font-weight: 600;
                 color: #555;
            }
        }
    }
    tbody {
        tr {
             transition: background-color 0.3s ease;

            &:hover{
               background-color: #f0f0f0;
             }
            td {
                padding: 10px 15px;
                text-align: left;
                 color: #555;
                vertical-align: middle;
            }
        }
    }
`;

const ViewAllButton = styled.button`
    background-color: rgb(13, 31, 49);
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease, transform 0.2s ease;
    overflow: hidden;
    position: relative;

        &:hover {
            background-color: rgb(6, 11, 16);
            transform: translateY(-2px);
        }
        &:focus {
            outline: none;
            box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.5);
        }
         &:active {
             transform: translateY(1px);
        }
          &::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent);
                transition: left 0.5s ease-in-out;
            }
        &:hover::before {
            left: 100%;
          }
`;

const ChartContainer = styled.div`
        animation: ${fadeIn} 1s ease;

`;


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
    const navigate = useNavigate();
    const [propertyTypesData, setPropertyTypesData] = useState({
        labels: [],
        datasets: [
            {
                data: [],
                backgroundColor: ['#007BFF', '#28A745', '#FFC107', '#17A2B8'],
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


    
    console.log('Redux Properties:', properties);
    console.log('Redux Tenants:', tenants);
    console.log('Redux Maintenances:', maintenances);
    


    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const propertyResponse = await dispatch(filterProperties({ limit: 5, page: 1 }));
                console.log('Properties:', propertyResponse);
                const tenantResponse = await dispatch(fetchTenants({ limit: 5, page: 1 }));
                console.log('Tenants:', tenantResponse);
                const maintenanceResponse = await dispatch(fetchMaintenances({limit: 10, page: 1}))
                console.log('Maintenances', maintenanceResponse);
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
            if (response && response.propertyTypes) {
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

    const handleViewAllProperties = () => {
        navigate('/properties');
    };

    const handleViewAllTenants = () => {
        navigate('/tenants');
    };

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


    return (
        <div className="dashboard">
            <CRow className="mb-4">
            <CCol sm={6} lg={3}>
            <WidgetStatsContainer
  className="mb-4 widget-admin"
  color="white"
  value={stats.admins.toString()}
  title="Total Admins"
  icon={<CIcon icon={cilUser} height={36} style={{ color: '#007BFF' }} />}
  progress={{ color: 'secondary', value: 75 }}
>
                <div className="widget-header">
                    <CIcon icon={cilUser} height={36} className="icon" style={{ color: '#007BFF' }} />
                    <span className="title">Total Admins</span>
                </div>
                <div className="value">{stats.admins.toString()}</div>
                </WidgetStatsContainer>
            </CCol>
            <CCol sm={6} lg={3}>
               <WidgetStatsContainer
                icon={<CIcon icon={cilBuilding} height={36} style={{ color: '#28A745' }} />}
                title="Total Properties"
                className="mb-4 widget-property"
                color="white"
                value={stats.properties.toString()}
                progress={{ color: 'secondary', value: 75 }}
                >
                <div className="widget-header">
                    <CIcon icon={cilBuilding} height={36} className="icon" style={{ color: '#28A745' }} />
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
                icon={<CIcon icon={cilPeople} height={36} style={{ color: '#17A2B8' }} />}
                progress={{ color: 'secondary', value: 75 }}
                >
                <div className="widget-header">
                    <CIcon icon={cilPeople} height={36} className="icon" style={{ color: '#17A2B8' }} />
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
                icon={<CIcon icon={cilMoney} height={36} style={{ color: '#FFC107' }} />}
                progress={{ color: 'secondary', value: 75 }}
                 >
                <div className="widget-header">
                    <CIcon icon={cilMoney} height={36} className="icon" style={{ color: '#FFC107' }} />
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
                         <div className="chart-container">{generateSparkLineSVG([1,3,5,8,6])}</div>
                        </div>
                    </ColoredCard>
                </CCol>
                <CCol xs={12} sm={6} lg={3}>
                      <ColoredCard className="mb-4 widget-new-tenants">
                         <div className="border-start border-start-4  py-1 px-3">
                             <div className="text-body-secondary text-truncate small">New Tenants This Month</div>
                            <div className="fs-5 fw-semibold">{stats.newTenants.toString()}</div>
                            <div className="chart-container">{generateSparkLineSVG([1,3,10,9,12])}</div>
                         </div>
                      </ColoredCard>
                 </CCol>
                 <CCol xs={12} sm={6} lg={3}>
                    <ColoredCard className="mb-4 widget-avg-rent">
                       <div className="border-start border-start-4 py-1 px-3">
                         <div className="text-body-secondary text-truncate small">Average Rent</div>
                         <div className="fs-5 fw-semibold">${stats.avgRent}</div>
                            <div className="chart-container">{generateSparkLineSVG([1400, 1500, 1600, 1550, 1700])}</div>
                       </div>
                    </ColoredCard>
                </CCol>
                 <CCol xs={12} sm={6} lg={3}>
                    <ColoredCard className="mb-4 widget-maintenance-task">
                      <div className="border-start border-start-4 py-1 px-3">
                         <div className="text-body-secondary text-truncate small">Open Maintenance Tasks</div>
                         <div className="fs-5 fw-semibold">{stats.maintenanceTasks.toString()}</div>
                            <div className="chart-container">{generateBarChartSVG([1,3,2],3)}</div>
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
        </div>
    );
};

export default Dashboard;