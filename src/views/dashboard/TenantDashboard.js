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
import { CChartBar } from '@coreui/react-chartjs';
import { generateBarChartSVG } from './chartHelpers';
import CIcon from '@coreui/icons-react';
import {
    cilMoney,
    cilCalendar,
    cilClock,
    cilCheckCircle,
} from '@coreui/icons'; // Add relevant icons
import { colors, AnimatedCard, ColoredCard, ChartContainer } from './styledComponents';

const TenantDashboard = ({ tenantData }) => {
    //Sample data for demo
    const tenant = {
        name: "John Doe",
        leaseStart: '2024-01-01',
        leaseEnd: '2025-01-01',
        rent: 1200,
        property: '123 Main St',
        outstandingBalance: 200,
        notifications: [
            { message: 'Your rent is due on the 1st of the month', type: 'rent' },
            { message: 'Maintenance scheduled for 2024-08-22', type: 'maintenance' }
        ],
        paymentDueDate: '2024-08-01', // Next payment due date
        propertyManager: {
            name: 'Jane Smith',
            phone: '555-123-4567',
        },
        maintenanceRequests: [
            { id: 1, description: 'Leaky faucet', status: 'pending', date: '2024-08-15' },
            { id: 2, description: 'Broken window', status: 'in progress', date: '2024-08-10' },
            { id: 3, description: 'Blocked toilet', status: 'completed', date: '2024-08-01' },
        ]
    };


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

    const getStatusIcon = (status) => {
        const statusIconMap = {
            pending: <CIcon icon={cilClock} className="text-warning" title="Pending" />,
            'in progress': <CIcon icon={cilClock} className="text-info" title="In Progress" />,
            completed: <CIcon icon={cilCheckCircle} className="text-success" title="Completed" />,
        };
        return statusIconMap[status?.toLowerCase()] || null;
    };

     // CSS class for blurring
    const blurredText = {
         filter: 'blur(2px)',
         userSelect: 'none', // Optional: Prevents text selection
    };

    return (
        <>
            <CRow className="mb-4">
                <CCol xs={12} sm={6} lg={3}>
                    <ColoredCard className="mb-4 widget-property">
                        <div className="border-start border-start-4 py-1 px-3">
                            <div className="text-body-secondary text-truncate small">Property</div>
                            <div className="fs-5 fw-semibold" style={blurredText}>{tenant.property}</div>
                            <div className="chart-container">{generateBarChartSVG([1, 4, 2], 3, colors.white)}</div>
                        </div>
                    </ColoredCard>
                </CCol>
                <CCol xs={12} sm={6} lg={3}>
                    <ColoredCard className="mb-4 widget-rent-due" style={{ backgroundColor: colors.yellow }}>
                        <div className="border-start border-start-4 py-1 px-3">
                            <div className="text-body-secondary text-truncate small">Monthly Rent</div>
                            <div className="fs-5 fw-semibold"  style={blurredText}>${tenant.rent}</div>
                            <div className="chart-container">{generateBarChartSVG([4, 1, 2], 3, colors.white)}</div>
                        </div>
                    </ColoredCard>
                </CCol>
                <CCol xs={12} sm={6} lg={3}>
                    <ColoredCard className="mb-4 widget-balance" style={{ backgroundColor: colors.red }}>
                        <div className="border-start border-start-4 py-1 px-3">
                            <div className="text-body-secondary text-truncate small">Outstanding Balance</div>
                            <div className="fs-5 fw-semibold" style={blurredText}>${tenant.outstandingBalance}</div>
                            <div className="chart-container">{generateBarChartSVG([2, 1, 4], 3, colors.white)}</div>
                        </div>
                    </ColoredCard>
                </CCol>
                <CCol xs={12} sm={6} lg={3}>
                    <ColoredCard className="mb-4 widget-lease-end" style={{ backgroundColor: colors.info }}>
                        <div className="border-start border-start-4 py-1 px-3">
                            <div className="text-body-secondary text-truncate small">Lease Ending</div>
                            <div className="fs-5 fw-semibold" style={blurredText}>{tenant.leaseEnd}</div>
                            <div className="chart-container">{generateBarChartSVG([1, 4, 2], 3, colors.white)}</div>
                        </div>
                    </ColoredCard>
                </CCol>
            </CRow>

            <CRow className="mb-4">
                <CCol lg={4}>
                    <AnimatedCard className="chart-card">
                        <CCardHeader className="chart-header">Lease Details</CCardHeader>
                        <CCardBody className="chart-body">
                            <div style={{ marginBottom: '10px' }}>
                                <strong>Start Date:</strong> <span style={blurredText}>{tenant.leaseStart}</span>
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <strong>End Date:</strong> <span style={blurredText}>{tenant.leaseEnd}</span>
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <strong>Next Payment Due:</strong><span style={blurredText}>{tenant.paymentDueDate}</span>
                            </div>
                        </CCardBody>
                    </AnimatedCard>
                </CCol>
                <CCol lg={4}>
                    <AnimatedCard className="chart-card">
                        <CCardHeader className="chart-header">Property Manager Contact</CCardHeader>
                        <CCardBody className="chart-body">
                            <div style={{ marginBottom: '10px' }}>
                                <strong>Name:</strong> <span style={blurredText}>{tenant.propertyManager.name}</span>
                            </div>
                            <div>
                                <strong>Phone:</strong> <a href={`tel:${tenant.propertyManager.phone}`} style={blurredText}>
                                {tenant.propertyManager.phone}</a>
                            </div>
                        </CCardBody>
                    </AnimatedCard>
                </CCol>
                <CCol lg={4}>
                    <AnimatedCard className="chart-card">
                        <CCardHeader className="chart-header">Notifications</CCardHeader>
                        <CCardBody className="chart-body">
                            <ChartContainer>
                                {tenant.notifications.map((notification, index) => (
                                    <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                        {notification.type === 'rent' && <CIcon icon={cilMoney} className="me-2" style={{ color: colors.blue }} />}
                                        {notification.type === 'maintenance' && <CIcon icon={cilCalendar} className="me-2" style={{ color: colors.green }} />}
                                        <span style={{ fontSize: '0.9rem', ...blurredText}}>{notification.message}</span>
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
                       <CCardHeader className="chart-header">Maintenance Requests</CCardHeader>
                      <CCardBody className="chart-body">
                        <CTable striped>
                                <CTableHead>
                                    <CTableRow>
                                      <CTableHeaderCell scope="col">Description</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                             <CTableBody>
                             {tenant.maintenanceRequests.map((request) => (
                                  <CTableRow key={request.id}>
                                      <CTableDataCell style={blurredText}>{request.description}</CTableDataCell>
                                      <CTableDataCell style={blurredText}>{request.date}</CTableDataCell>
                                        <CTableDataCell>
                                           {getStatusIcon(request.status)}  <span style={blurredText}>{request.status}</span>
                                        </CTableDataCell>
                                  </CTableRow>
                                ))}
                              </CTableBody>
                       </CTable>
                      </CCardBody>
                </AnimatedCard>
               </CCol>
           </CRow>

        </>
    );
};

export default TenantDashboard;