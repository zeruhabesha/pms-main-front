import React from 'react';
import {
    CRow,
    CCol,
    CCard,
    CCardBody,
    CCardHeader,
} from '@coreui/react';
import { CChartDoughnut, CChartLine } from '@coreui/react-chartjs';
// import {generateBarChartSVG, generateLineChartSVG} from './chartHelpers'; // Removed import of chartHelpers
import CIcon from '@coreui/icons-react';
import {cilWarning, cilCheckCircle, cilClock} from '@coreui/icons';
import MainChart from "./MainChart";
import {colors, WidgetStatsContainer, AnimatedCard, ColoredCard, ChartContainer} from './styledComponents';

// --- Helper function to simulate blurred effect ---
const BlurredValue = ({ value }) => {
    return <span style={{ filter: 'blur(5px)', display: 'inline-block', width: '30px', textAlign: 'center' }}>{value ? '███' : '---'}</span>;
};

const MaintenorDashboard = ({
                         stats,
                         maintenanceStatusData,
                        overdueMaintenanceData,
                         scheduledMaintenanceData,
                         recentMaintenanceActivity,
                       }) => {

    // --- Fallback data ---
    const defaultStats = {
        maintenanceTasks: '---',
        overdueTasks: '---',
        scheduledTasks: '---',
        completedTasksToday: '---',
    };

    const currentStats = stats || defaultStats;

    const defaultMaintenanceStatusData = {
        labels: ['Data Not Available'],
        datasets: [{
            data: [100],
            backgroundColor: [colors.gray],
            hoverBackgroundColor: [colors.lightGray],
        }],
    };
    const currentMaintenanceStatusData = maintenanceStatusData || defaultMaintenanceStatusData;

    const defaultOverdueMaintenanceData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
            {
                label: 'Overdue Tasks',
                backgroundColor: colors.red,
                borderColor: colors.darkRed,
                data: [0, 0, 0, 0, 0, 0, 0],
            },
        ],
    };
    const currentOverdueMaintenanceData = overdueMaintenanceData || defaultOverdueMaintenanceData;

    const defaultScheduledMaintenanceData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
            {
                label: 'Scheduled Tasks',
                backgroundColor: colors.yellow,
                borderColor: colors.darkYellow,
                data: [0, 0, 0, 0, 0, 0, 0],
            },
        ],
    };
    const currentScheduledMaintenanceData = scheduledMaintenanceData || defaultScheduledMaintenanceData;

    const defaultRecentMaintenanceActivity = [
        { type: 'pending', text: 'Loading activity...' },
    ];
    const currentRecentMaintenanceActivity = recentMaintenanceActivity || defaultRecentMaintenanceActivity;

    return (
      <>
          <CRow className="mb-4">
              <CCol xs={12} sm={6} lg={3}>
                   <ColoredCard className="mb-4 widget-maintenance-task">
                      <div className="border-start border-start-4 py-1 px-3">
                        <div className="text-body-secondary text-truncate small">Open Maintenance Tasks</div>
                        <div className="fs-5 fw-semibold"><BlurredValue value={currentStats.maintenanceTasks} /></div>
                          {/* Removed chart-container and generateBarChartSVG from widget */}
                      </div>
                   </ColoredCard>
              </CCol>
            <CCol xs={12} sm={6} lg={3}>
                <ColoredCard className="mb-4 widget-overdue-task" style={{backgroundColor: colors.red}}>
                    <div className="border-start border-start-4 py-1 px-3">
                        <div className="text-body-secondary text-truncate small">Overdue Maintenance</div>
                        <div className="fs-5 fw-semibold"><BlurredValue value={currentStats.overdueTasks} /></div>
                        {/* Removed chart-container and generateBarChartSVG from widget */}
                    </div>
                </ColoredCard>
            </CCol>
            <CCol xs={12} sm={6} lg={3}>
                 <ColoredCard className="mb-4 widget-scheduled-task" style={{backgroundColor: colors.yellow}}>
                    <div className="border-start border-start-4 py-1 px-3">
                        <div className="text-body-secondary text-truncate small">Scheduled Maintenance</div>
                         <div className="fs-5 fw-semibold"><BlurredValue value={currentStats.scheduledTasks} /></div>
                         {/* Removed chart-container and generateBarChartSVG from widget */}
                    </div>
                </ColoredCard>
            </CCol>
            <CCol xs={12} sm={6} lg={3}>
                 <ColoredCard className="mb-4 widget-completed-task" style={{backgroundColor: colors.green}}>
                    <div className="border-start border-start-4 py-1 px-3">
                        <div className="text-body-secondary text-truncate small">Completed Today</div>
                         <div className="fs-5 fw-semibold"><BlurredValue value={currentStats.completedTasksToday} /></div>
                         {/* Removed chart-container and generateBarChartSVG from widget */}
                    </div>
                </ColoredCard>
            </CCol>
          </CRow>

          <CRow>
              <CCol lg={6}>
                   <AnimatedCard className="chart-card">
                       <CCardHeader className="chart-header">Maintenance Status</CCardHeader>
                       <CCardBody className="chart-body">
                            <ChartContainer>
                                <CChartDoughnut
                                    data={currentMaintenanceStatusData}
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
                    <CCardHeader className="chart-header">Overdue Maintenance Trends</CCardHeader>
                    <CCardBody className="chart-body">
                        <ChartContainer>
                            <CChartLine
                                data={currentOverdueMaintenanceData}
                                options={{
                                    plugins: {
                                        legend: { display: true },
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
         </CRow>

          <CRow>
              <CCol lg={6}>
                  <AnimatedCard className="chart-card">
                      <CCardHeader className="chart-header">Scheduled Maintenance</CCardHeader>
                        <CCardBody className="chart-body">
                           <ChartContainer>
                               <CChartLine
                                 data={currentScheduledMaintenanceData}
                                 options={{
                                     plugins: {
                                         legend: { display: true },
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
                      <CCardHeader className="chart-header">Recent Activity</CCardHeader>
                        <CCardBody className="chart-body">
                           <ChartContainer>
                              {currentRecentMaintenanceActivity.map((activity, index) => (
                                    <div key={index} style={{display: 'flex', alignItems: 'center', marginBottom: '8px'}}>
                                        {activity.type === 'completed' &&  <CIcon icon={cilCheckCircle} className="me-2" style={{ color: colors.green }}/>}
                                        {activity.type === 'warning' && <CIcon icon={cilWarning} className="me-2" style={{ color: colors.yellow }}/>}
                                        {activity.type === 'pending' && <CIcon icon={cilClock} className="me-2" style={{ color: colors.gray }}/>}

                                        <span style={{fontSize: '0.9rem'}}>{activity.text}</span>
                                    </div>
                                 ))}
                           </ChartContainer>
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

export default MaintenorDashboard;