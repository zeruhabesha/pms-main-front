import React from 'react';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CRow,
    CCol
} from '@coreui/react';
import styled from 'styled-components';
import MainChart from "./MainChart";
import {AnimatedCard} from "./styledComponents";


const InspectorDashboard = () => {
    return (
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
    );
};

export default InspectorDashboard;