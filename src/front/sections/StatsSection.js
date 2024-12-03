import React from 'react';  // Ensure this is the first import
import { CContainer, CRow, CCol } from '@coreui/react';
import CountUp from 'react-countup';

const StatsSection = () => {
  const statsData = [
    { count: 232, label: 'Properties Managed' },
    { count: 521, label: 'Active Leases' },
    { count: 1453, label: 'Total Clients' },
    { count: 32, label: 'Employees' },
  ];

  return (
    <section style={{ padding: '3rem 0', backgroundColor: '#f6fafd' }}>
      <CContainer>
        <CRow className="text-center">
          {statsData.map((stat, index) => (
            <CCol lg="3" md="6" key={index} className="d-flex flex-column align-items-center">
              <h3
                style={{
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  color: '#2487ce',
                  marginBottom: '0.5rem',
                }}
              >
                <CountUp start={0} end={stat.count} duration={3} />
              </h3>
              <p style={{ fontSize: '1rem', color: '#6c757d', margin: 0 }}>{stat.label}</p>
            </CCol>
          ))}
        </CRow>
      </CContainer>
    </section>
  );
};

export default StatsSection;
