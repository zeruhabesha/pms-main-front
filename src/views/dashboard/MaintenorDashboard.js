import React from 'react';
import {
    CRow,
    CCol,
    CCard,
    CCardBody,
    CCardHeader,
} from '@coreui/react';
import { CChartDoughnut, CChartLine } from '@coreui/react-chartjs';
import CIcon from '@coreui/icons-react';
import {cilWarning, cilCheckCircle, cilClock} from '@coreui/icons';
import MainChart from "./MainChart";
import {colors, WidgetStatsContainer, AnimatedCard, ColoredCard, ChartContainer} from './styledComponents';

// --- Helper function to simulate blurred effect ---
const BlurredValue = ({ value }) => {
    return <span style={{ filter: 'blur(0px)', display: 'inline-block', width: '30px', textAlign: 'center' }}>{value}</span>;
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
        maintenanceTasks: '2',
        overdueTasks: '1',
        scheduledTasks: '1',
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


    // Function to transform the maintenance status data for the Doughnut chart
    const transformMaintenanceStatusData = (data) => {
      if (!data || Object.keys(data).length === 0) {
          return defaultMaintenanceStatusData;
      }

      const labels = Object.keys(data);
      const values = Object.values(data);
      const backgroundColors = labels.map((label, index) => {
        if (label === 'Pending') return colors.yellow;
        if (label === 'Approved') return colors.blue;
        if (label === 'In Progress') return colors.orange;
        if (label === 'Completed') return colors.green;
        if (label === 'Cancelled') return colors.red;
        if (label === 'Inspected') return colors.teal;
        if (label === 'Incomplete') return colors.gray; // Or a different color
        return colors.gray; // Default color if no match
      });

      const hoverBackgroundColors = backgroundColors.map(color => lightenColor(color, 0.2));

      return {
          labels: labels,
          datasets: [{
              data: values,
              backgroundColor: backgroundColors,
              hoverBackgroundColor: hoverBackgroundColors,
          }],
      };
    };

  // Function to lighten a color
  const lightenColor = (color, percent) => {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);

    R = parseInt((R * (1 + percent)), 10);
    G = parseInt((G * (1 + percent)), 10);
    B = parseInt((B * (1 + percent)), 10);

    R = (R < 255) ? R : 255;
    G = (G < 255) ? G : 255;
    B = (B < 255) ? B : 255;

    const RR = ((R.toString(16).length === 1) ? "0" + R.toString(16) : R.toString(16));
    const GG = ((G.toString(16).length === 1) ? "0" + G.toString(16) : G.toString(16));
    const BB = ((B.toString(16).length === 1) ? "0" + B.toString(16) : B.toString(16));

    return "#" + RR + GG + BB;
  }

  const updatedMaintenanceStatusData = maintenanceStatusData && maintenanceStatusData.data
                                      ? transformMaintenanceStatusData(maintenanceStatusData.data)
                                      : defaultMaintenanceStatusData;



    return (
      <>
          <CRow className="mb-4">
              <CCol xs={12} sm={6} lg={3}>
                   <ColoredCard className="mb-4 widget-maintenance-task">
                      <div className="border-start border-start-4 py-1 px-3">
                        <div className="text-body-secondary text-truncate small">Open Maintenance Tasks</div>
                        <div className="fs-5 fw-semibold"><BlurredValue value={currentStats.maintenanceTasks} />2</div>
                          {/* Removed chart-container and generateBarChartSVG from widget */}
                      </div>
                   </ColoredCard>
              </CCol>
            <CCol xs={12} sm={6} lg={3}>
                <ColoredCard className="mb-4 widget-overdue-task" style={{backgroundColor: colors.red}}>
                    <div className="border-start border-start-4 py-1 px-3">
                        <div className="text-body-secondary text-truncate small">Overdue Maintenance</div>
                        <div className="fs-5 fw-semibold"><BlurredValue value={currentStats.overdueTasks} />1</div>
                        {/* Removed chart-container and generateBarChartSVG from widget */}
                    </div>
                </ColoredCard>
            </CCol>
            <CCol xs={12} sm={6} lg={3}>
                 <ColoredCard className="mb-4 widget-scheduled-task" style={{backgroundColor: colors.yellow}}>
                    <div className="border-start border-start-4 py-1 px-3">
                        <div className="text-body-secondary text-truncate small">Scheduled Maintenance</div>
                         <div className="fs-5 fw-semibold"><BlurredValue value={currentStats.scheduledTasks} />1</div>
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
                                    data={updatedMaintenanceStatusData}
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
        <CCardHeader className="chart-header" style={{ backgroundColor: colors.red, color: 'white' }}>
            Overdue Maintenance Trends
        </CCardHeader>
        <CCardBody className="chart-body">
            <ChartContainer style={{ padding: '1rem' }}> {/* Added padding for visual breathing room */}
                <CChartLine
                    data={currentOverdueMaintenanceData}
                    options={{
                        plugins: {
                            legend: {
                                display: true,
                                labels: {
                                    font: {
                                        size: 14, // Increased font size for readability
                                    },
                                },
                            },
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    font: {
                                        size: 12, // Increased font size for y-axis ticks
                                    },
                                },
                                grid: {
                                    color: 'rgba(0, 0, 0, 0.1)', // Lighter grid lines
                                },
                            },
                            x: {
                                ticks: {
                                    font: {
                                        size: 12, // Increased font size for x-axis ticks
                                    },
                                },
                                grid: {
                                    color: 'rgba(0, 0, 0, 0.1)', // Lighter grid lines
                                },
                            },
                        },
                        elements: {
                            line: {
                                tension: 0.4, // Smoother lines
                            },
                            point: {
                                radius: 4,   // Larger point radius
                                hitRadius: 10, // Larger hit radius for easier selection
                                hoverRadius: 6,
                            },
                        },
                        layout: {
                            padding: {
                                left: 10,
                                right: 10,
                                top: 10,
                                bottom: 10,
                            },
                        },
                    }}
                />
            </ChartContainer>
            <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.8rem', color: 'gray' }}>
                Data reflects overdue tasks over time.
            </div>
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

         
      </>
    );
};

export default MaintenorDashboard;