import React from 'react';
import {
    CRow,
    CCol,
    CWidgetStatsC,
    CCard,
    CCardBody,
    CCardHeader,
} from '@coreui/react';
import { CChartDoughnut } from '@coreui/react-chartjs';
import styled from 'styled-components';
import {generateBarChartSVG } from './chartHelpers';
import {
} from '@coreui/icons';
import {
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import MainChart from "./MainChart";
import {colors, WidgetStatsContainer, AnimatedCard, ColoredCard, ChartContainer} from './styledComponents';



const MaintenorDashboard = ({
                         stats,
                         maintenanceStatusData,
                       }) => {


    return (
      <>
          <CRow className="mb-4">
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
          <CRow>
              <CCol lg={6}>
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