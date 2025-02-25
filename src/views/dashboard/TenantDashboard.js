import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
    CTableDataCell,
    CAlert,
    CSpinner,
} from '@coreui/react';
import { CChartBar } from '@coreui/react-chartjs';
import { generateBarChartSVG } from './chartHelpers';
import CIcon from '@coreui/icons-react';
import {
    cilMoney,
    cilCalendar,
    cilClock,
    cilCheckCircle,
} from '@coreui/icons';
import { colors, AnimatedCard, ColoredCard, ChartContainer } from './styledComponents';
import { decryptData } from '../../api/utils/crypto';
import { getLeasedPropertiesForTenant } from '../../api/actions/PropertyAction';
// import { getStatusIcon } from '../../utils/maintenanceUtils'; // Import utility function
import MaintenanceTable from '../maintenance/MaintenanceTable'; // Import the simplified MaintenanceTable
import { fetchMaintenances } from '../../api/actions/MaintenanceActions' // Import the simplified MaintenanceTable

const TenantDashboard = () => {
    const dispatch = useDispatch();
    const [managerProfile, setManagerProfile] = useState(null);
    const { properties: leasedProperties = [], loading: propertiesLoading, error: propertyError } = useSelector((state) => state.property);
    const { maintenances = [] } = useSelector((state) => state.maintenance);
    const [localError, setLocalError] = useState(null)
    const [tenantMaintenanceRequests, setTenantMaintenanceRequests] = useState([]);
    const [userId, setUserId] = useState(null);
    const [tenantData, setTenantData] = useState({}); // Initialize state for tenantData

    useEffect(() => {
        const fetchManagerProfileAndProperties = async () => {
            try {
                const encryptedUserData = localStorage.getItem('user');
                if (!encryptedUserData) {
                    setLocalError("No user data found in local storage, please login again.");
                    return;
                }

                const userData = decryptData(encryptedUserData);
                const parsedUserData = typeof userData === 'string' ? JSON.parse(userData) : userData;

                if (!parsedUserData || !parsedUserData._id) {
                    setLocalError("Invalid user data found in local storage. please login");
                    return;
                }
                setManagerProfile(parsedUserData);
                setUserId(parsedUserData._id); // Set the user ID
                setTenantData(parsedUserData)
                dispatch(getLeasedPropertiesForTenant(parsedUserData._id));

            } catch (error) {
                console.error('Error fetching or parsing user data from local storage:', error);
                setLocalError(error.message || "Failed fetching Data");
            }
        };

        fetchManagerProfileAndProperties();
    }, [dispatch]);

    const selectedProperty = useMemo(() => {
        if (leasedProperties && leasedProperties.length > 0) {
            return leasedProperties[0];
        }
        return null;
    }, [leasedProperties]);

    useEffect(() => {
        if (userId && selectedProperty) {
            dispatch(fetchMaintenances({ userId: userId, propertyId: selectedProperty._id })); // Dispatch fetchMaintenances with both user and property IDs
        }
    }, [dispatch, userId, selectedProperty]);
    
    useEffect(() => {
        if (selectedProperty) {
            const latestRequests = maintenances
                ?.filter(req => {
                     console.log(`Comparing req.property (type ${typeof req.property}): ${req.property}, and selectedProperty._id: ${selectedProperty._id}`); // Add Log
                     return String(req.property) === String(selectedProperty._id);
                })
                ?.slice(0, 5) || [];
            console.log('latestRequests:', latestRequests);
            setTenantMaintenanceRequests(latestRequests);
        }
    }, [selectedProperty, maintenances]);

    const rentPaymentChart = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        datasets: [
            {
                label: 'Rent Paid',
                backgroundColor: colors.green,
                data: [1200, 1200, 1200, 1200, 1200, 1200, 0, 0],
                borderColor: colors.green,
                borderWidth: 2
            },
        ],
    };

    const blurredText = {
        filter: 'blur(0px)',
        userSelect: 'none',
    };
    const propertyChartSVG = generateBarChartSVG([1, 4, 2], 3, colors.white);
    const rentChartSVG = generateBarChartSVG([4, 1, 2], 3, colors.white);
    const balanceChartSVG = generateBarChartSVG([2, 1, 4], 3, colors.white);
    const leaseChartSVG = generateBarChartSVG([1, 4, 2], 3, colors.white);

        // Function to determine the lease ending card color
        const { activeEnd } = tenantData;
        const getLeaseEndCardColor = () => {
            if (!activeEnd) {
                return colors.info; // Default color
            }

            const endDate = new Date(activeEnd);
            const now = new Date();
            const timeDifference = endDate.getTime() - now.getTime();
            const differenceInDays = Math.ceil(timeDifference / (1000 * 3600 * 24));

            if (differenceInDays > 30) {
                return colors.success;
            } else if (differenceInDays <= 30 && differenceInDays >= 0) {
                return colors.warning;
            } else {
                return colors.danger;
            }
        };

    const leaseEndCardColor = useMemo(() => getLeaseEndCardColor(), [tenantData?.activeEnd]);
        //  const {activeEnd} = tenantData
          const endDate = new Date(activeEnd)
          const now = new Date()
          const timeDifference = endDate.getTime() - now.getTime()
          const differenceInDays = Math.ceil(timeDifference / (1000 * 3600 * 24))
    return (
        <>
            <CRow className="mb-4">
            {localError && (
                <CAlert color="danger" className="mb-4">
                    {localError}
                </CAlert>
            )}
            {propertiesLoading ? (
                <CCol xs={12} className="text-center">
                    <CSpinner color="primary" />
                </CCol>
            ) : ( <>
                <CCol xs={12} sm={6} lg={3}>
                    <ColoredCard className="mb-4 widget-property">
                        <div className="border-start border-start-4 py-1 px-3">
                            <div className="text-body-secondary text-truncate small">Property</div>
                            <div className="fs-5 fw-semibold" style={blurredText}>{selectedProperty?.title || "N/A"}</div>
                            <div className="chart-container" dangerouslySetInnerHTML={{ __html: propertyChartSVG }} />
                        </div>
                    </ColoredCard>
                </CCol>
                <CCol xs={12} sm={6} lg={3}>
                    <ColoredCard className="mb-4 widget-rent-due" style={{ backgroundColor: colors.yellow }}>
                        <div className="border-start border-start-4 py-1 px-3">
                            <div className="text-body-secondary text-truncate small">Monthly Rent</div>
                            <div className="fs-5 fw-semibold" style={blurredText}>${selectedProperty?.rentPrice || "N/A"}</div>
                            <div className="chart-container" dangerouslySetInnerHTML={{ __html: rentChartSVG }} />
                        </div>
                    </ColoredCard>
                </CCol>
                <CCol xs={12} sm={6} lg={3}>
                    <ColoredCard className="mb-4 widget-balance" style={{ backgroundColor: colors.red }}>
                        <div className="border-start border-start-4 py-1 px-3">
                            <div className="text-body-secondary text-truncate small">Outstanding Balance</div>
                            <div className="fs-5 fw-semibold" style={blurredText}>${tenantData?.outstandingBalance || 'N/A'}</div>
                            <div className="chart-container" dangerouslySetInnerHTML={{ __html: balanceChartSVG }} />
                        </div>
                    </ColoredCard>
                </CCol>
                <CCol xs={12} sm={6} lg={3}>
                    <ColoredCard className="mb-4 widget-lease-end" style={{ backgroundColor: leaseEndCardColor }}>
                        <div className="border-start border-start-4 py-1 px-3">
                            <div className="text-body-secondary text-truncate small">Lease Ending</div>
                            <div className="fs-5 fw-semibold" style={blurredText}>{differenceInDays} days</div>
                            <div className="chart-container" dangerouslySetInnerHTML={{ __html: leaseChartSVG }} />
                        </div>
                    </ColoredCard>
                </CCol>
                 </>
            )}
            </CRow>

            <CRow className="mb-4">
                <CCol lg={4}>
                    <AnimatedCard className="chart-card">
                        <CCardHeader className="chart-header">Lease Details</CCardHeader>
                        <CCardBody className="chart-body">
                            <div style={{ marginBottom: '10px' }}>
                                <strong>Start Date:</strong> <span style={blurredText}>{tenantData?.activeStart || "N/A"}</span>
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <strong>End Date:</strong> <span style={blurredText}>{tenantData?.activeEnd || "N/A"}</span>
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <strong>Next Payment Due:</strong><span style={blurredText}>Next Payment Data</span>
                            </div>
                        </CCardBody>
                    </AnimatedCard>
                </CCol>
                <CCol lg={4}>
                    <AnimatedCard className="chart-card">
                        <CCardHeader className="chart-header">Property Manager Contact</CCardHeader>
                        <CCardBody className="chart-body">
                            {managerProfile ? (
                                <>
                                    <div style={{ marginBottom: '10px' }}>
                                        <strong>Name:</strong> <span>{managerProfile.registeredByAdmin?.name || "N/A"}</span>
                                    </div>
                                    <div>
                                        {/* <strong>Phone:</strong> <a href={`tel:${managerProfile.phone}`}>{managerProfile.phone}</a> */}
                                    </div>
                                    <div>
                                        <strong>Email:</strong> <a href={`mailto:${managerProfile.registeredByAdmin?.email || '#'}`}>{managerProfile.registeredByAdmin?.email || "N/A"}</a>
                                    </div>
                                </>
                            ) : (
                                <p>Loading Manager Information...</p>
                            )}
                        </CCardBody>
                    </AnimatedCard>
                </CCol>
                <CCol lg={4}>
                    <AnimatedCard className="chart-card">
                        <CCardHeader className="chart-header">Notifications</CCardHeader>
                        <CCardBody className="chart-body">
                            <ChartContainer>
                                {tenantData?.notifications?.map((notification, index) => (
                                    <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                        {notification.type === 'rent' && <CIcon icon={cilMoney} className="me-2" style={{ color: colors.blue }} />}
                                        {notification.type === 'maintenance' && <CIcon icon={cilCalendar} className="me-2" style={{ color: colors.green }} />}
                                        <span style={{ fontSize: '0.9rem', ...blurredText }}>{notification.message}</span>
                                    </div>
                                ))}
                            </ChartContainer>
                        </CCardBody>
                    </AnimatedCard>
                </CCol>
            </CRow>

            <CRow>
                <CCol lg={6}>
                    <AnimatedCard className="chart-card">
                        <CCardHeader className="chart-header">Rent Payment History</CCardHeader>
                        <CCardBody className="chart-body">
                            <ChartContainer>
                                <CChartBar
                                    data={rentPaymentChart}
                                    options={{
                                        plugins: {
                                            legend: { display: false },
                                        },
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                            },
                                        },
                                    }}
                                />
                            </ChartContainer>
                        </CCardBody>
                    </AnimatedCard>
                </CCol>
                <CCol lg={6}>
                    <AnimatedCard className="chart-card">
                        <CCardHeader className="chart-header">Latest Maintenance Requests</CCardHeader>
                        <CCardBody className="chart-body">
                            {tenantMaintenanceRequests.length > 0 ? (
                                <MaintenanceTable maintenanceList={tenantMaintenanceRequests} />
                            ) : (
                                <p className="text-muted text-center">No maintenance requests found for this property.</p>
                            )}
                        </CCardBody>
                    </AnimatedCard>
                </CCol>
            </CRow>

        </>
    );
};

export default TenantDashboard;
