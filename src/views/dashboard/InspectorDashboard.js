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
import styled from 'styled-components';
import MainChart from "./MainChart";
import CIcon from '@coreui/icons-react';
import {  cilCalendar, cilList, cilGraph } from '@coreui/icons';
import { cilCheckCircle as cilCheckCircleIcon, cilClock } from '@coreui/icons'; // Corrected import
import { AnimatedCard, colors, StyledTable,  StatisticBox, MetricCard, SummaryCard, LabeledValue, SparkLine } from "./styledComponents";
import { generateBarChartSVG, generateSparkLineSVG } from './chartHelpers';

const InspectorDashboard = () => {

    const inspectionStats = {
        completedInspections: 15,
        pendingInspections: 5,
        scheduledInspections: 7,
    }

     const recentInspections = [
        { id: 1, property: '123 Main St', date: '2024-08-20', status: 'completed', inspector: 'Jane Doe' },
        { id: 2, property: '456 Oak Ave', date: '2024-08-18', status: 'pending', inspector: 'John Smith' },
        { id: 3, property: '789 Pine Ln', date: '2024-08-16', status: 'completed', inspector: 'Jane Doe' },
        { id: 4, property: '101 Elm Rd', date: '2024-08-15', status: 'pending', inspector: 'John Smith' },
    ];
     const scheduledInspections = [
       {id: 1, property: '101 Elm Rd', date: '2024-08-20'},
       {id: 2, property: '789 Pine Ln', date: '2024-08-22'},
        {id: 3, property: '456 Oak Ave', date: '2024-08-25'}
     ]
      const kpiData = [
        { name: 'Efficiency', value: 85, change: 5 },
        { name: 'Accuracy', value: 92, change: -2 },
          { name: 'Timeliness', value: 78, change: 3 },
    ];
     const blurredText = {
        filter: 'blur(5px)',
        userSelect: 'none',
    };

     const getStatusIcon = (status) => {
        const statusIconMap = {
            pending: <CIcon icon={cilClock} className="text-warning" title="Pending" />,
            completed: <CIcon icon={cilCheckCircleIcon} className="text-success" title="Completed" />,
        };
        return statusIconMap[status?.toLowerCase()] || null;
    };

    return (
         <>
            <CRow className="mb-4">
                <CCol sm={6} lg={3}>
                    <SummaryCard>
                         <div className="summary-content">
                            <div className="summary-icon"><CIcon icon={cilCheckCircleIcon} height={36} style={{ color: colors.success }} /></div>
                             <LabeledValue label="Completed Inspections" value={<span style={blurredText}>{inspectionStats.completedInspections}</span>}/>
                        </div>
                    </SummaryCard>
                </CCol>
                <CCol sm={6} lg={3}>
                    <SummaryCard>
                         <div className="summary-content">
                             <div className="summary-icon"><CIcon icon={cilClock} height={36} style={{ color: colors.warning }} /></div>
                             <LabeledValue label="Pending Inspections" value={<span style={blurredText}>{inspectionStats.pendingInspections}</span>}/>
                         </div>
                    </SummaryCard>
                </CCol>
                 <CCol sm={6} lg={3}>
                    <SummaryCard>
                         <div className="summary-content">
                             <div className="summary-icon"><CIcon icon={cilCalendar} height={36} style={{ color: colors.info }} /></div>
                             <LabeledValue label="Scheduled Inspections" value={<span style={blurredText}>{inspectionStats.scheduledInspections}</span>}/>
                         </div>
                    </SummaryCard>
                 </CCol>
                 <CCol sm={6} lg={3}>
                    <SummaryCard>
                         <div className="summary-content">
                             <div className="summary-icon"><CIcon icon={cilList} height={36} style={{ color: colors.primary }} /></div>
                              <LabeledValue label="Total Inspections" value={<span style={blurredText}>{inspectionStats.completedInspections + inspectionStats.pendingInspections}</span>}/>
                         </div>
                     </SummaryCard>
                </CCol>
            </CRow>
            <CRow className="mb-4">
              <CCol md={4}>
                 <MetricCard gradient="linear-gradient(45deg, #4CAF50, #66BB6A)">
                        <div className="metric-header">
                           <CIcon icon={cilGraph} height={24} style={{marginRight: '0.5em'}}/>
                            <h4>Inspection Efficiency</h4>
                         </div>
                            <div className="metric-body">
                                <div>  <SparkLine data={[60, 70, 80, 85, 90, 88, 92]} /></div>
                        </div>
                    </MetricCard>
              </CCol>
                 <CCol md={4}>
                    <MetricCard gradient="linear-gradient(45deg, #FF9800, #FFA726)">
                         <div className="metric-header">
                            <CIcon icon={cilGraph} height={24} style={{marginRight: '0.5em'}}/>
                            <h4>Pending Inspections</h4>
                         </div>
                          <div className="metric-body">
                                <div> <SparkLine data={[20, 18, 15, 10, 8, 6, 5]}/></div>
                        </div>
                    </MetricCard>
                </CCol>
                 <CCol md={4}>
                    <MetricCard gradient="linear-gradient(45deg, #2196F3, #42A5F5)">
                      <div className="metric-header">
                            <CIcon icon={cilCalendar} height={24} style={{marginRight: '0.5em'}}/>
                             <h4>Scheduled Inspections</h4>
                        </div>
                         <div className="metric-body">
                              <LabeledValue value={<span style={blurredText}>{inspectionStats.scheduledInspections}</span>}/>
                        </div>
                    </MetricCard>
               </CCol>
           </CRow>
            <CRow>
                <CCol lg={6}>
                    <AnimatedCard className="table-card">
                        <CCardHeader className="table-header">Recent Inspections</CCardHeader>
                       <CCardBody className="table-body">
                           <StyledTable hover>
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell>#</CTableHeaderCell>
                                        <CTableHeaderCell>Property</CTableHeaderCell>
                                        <CTableHeaderCell>Date</CTableHeaderCell>
                                        <CTableHeaderCell>Status</CTableHeaderCell>
                                          <CTableHeaderCell>Inspector</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {recentInspections.map((inspection, index) => (
                                        <CTableRow key={inspection.id}>
                                            <CTableDataCell style={{ fontSize: '0.9rem', ...blurredText }}>{index + 1}</CTableDataCell>
                                            <CTableDataCell style={{ fontSize: '0.9rem', ...blurredText }}>{inspection.property}</CTableDataCell>
                                             <CTableDataCell style={{ fontSize: '0.9rem', ...blurredText }}>{inspection.date}</CTableDataCell>
                                            <CTableDataCell style={{ fontSize: '0.9rem' }}>
                                                {getStatusIcon(inspection.status)} <span style={blurredText}>{inspection.status}</span>
                                            </CTableDataCell>
                                              <CTableDataCell style={{ fontSize: '0.9rem', ...blurredText }}>{inspection.inspector}</CTableDataCell>
                                        </CTableRow>
                                    ))}
                                </CTableBody>
                            </StyledTable>
                         </CCardBody>
                    </AnimatedCard>
                </CCol>
                 <CCol lg={6}>
                    <AnimatedCard className="table-card">
                        <CCardHeader className="table-header">Scheduled Inspections</CCardHeader>
                         <CCardBody className="table-body">
                               <StyledTable hover>
                                   <CTableHead>
                                      <CTableRow>
                                        <CTableHeaderCell>#</CTableHeaderCell>
                                          <CTableHeaderCell>Property</CTableHeaderCell>
                                        <CTableHeaderCell>Date</CTableHeaderCell>
                                      </CTableRow>
                                   </CTableHead>
                                  <CTableBody>
                                       {scheduledInspections.map((inspection, index) => (
                                            <CTableRow key={inspection.id}>
                                                 <CTableDataCell style={{ fontSize: '0.9rem', ...blurredText }}>{index + 1}</CTableDataCell>
                                                 <CTableDataCell style={{ fontSize: '0.9rem', ...blurredText }}>{inspection.property}</CTableDataCell>
                                                 <CTableDataCell style={{ fontSize: '0.9rem', ...blurredText }}>{inspection.date}</CTableDataCell>
                                           </CTableRow>
                                      ))}
                                </CTableBody>
                             </StyledTable>
                         </CCardBody>
                    </AnimatedCard>
                </CCol>
             </CRow>
             <CRow>
               <CCol>
                   <AnimatedCard className="chart-card">
                     <CCardHeader className="chart-header">Key Performance Indicators</CCardHeader>
                       <CCardBody className="chart-body">
                         <CRow>
                           {kpiData.map((kpi, index) => (
                             <CCol md={4} key={index} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                               <StatisticBox background="#f8f9fa" >
                                  <div className="title"  style={blurredText}>{kpi.name}</div>
                                   <div className="value"  style={blurredText}>{kpi.value}%</div>
                                  <span  style={{
                                   color: kpi.change > 0 ? colors.success : colors.danger,
                                   fontSize: '0.8rem',
                                   ...blurredText,
                                  }}>
                                     {kpi.change > 0 ? '▲' : '▼'} {Math.abs(kpi.change)}%
                                  </span>
                              </StatisticBox>
                           </CCol>
                            ))}
                         </CRow>
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

export default InspectorDashboard;