import { CCol, CContainer, CRow } from '@coreui/react'
import React from 'react'
import { BiCommand } from 'react-icons/bi'
import { BsFillEaselFill, BsFillGeoAltFill } from 'react-icons/bs'
import { FaGem } from 'react-icons/fa'

const WhySection = () => {
  const reasons = [
    {
      id: 1,
      icon: <BsFillEaselFill />,
      title: 'Streamlined Management',
      description:
        'Effortlessly manage properties, tenants, and leases with our all-in-one platform designed for landlords.',
      color: '#007bff',
    },
    {
      id: 2,
      icon: <FaGem />,
      title: 'Better Tenant Experience',
      description:
        'Provide tenants with an easy-to-use portal for payments, maintenance requests, and lease reviews.',
      color: '#28a745',
    },
    {
      id: 3,
      icon: <BsFillGeoAltFill />,
      title: 'Data-Driven Insights',
      description:
        'Gain actionable insights into your property portfolio with detailed analytics and reporting.',
      color: '#17a2b8',
    },
    {
      id: 4,
      icon: <BiCommand />,
      title: 'Secure & Reliable',
      description:
        'Rest assured with robust data security measures and compliance with global privacy standards.',
      color: '#ffc107',
    },
  ]

  return (
    <section id="why-us" style={{ position: 'relative', top: '40vh', marginBottom: '4rem' }}>
      <CContainer>
        <CRow className="gy-4 text-center">
          {reasons.map((reason) => (
            <CCol md={6} lg={3} key={reason.id}>
              <div
                className="icon-box"
                style={{
                  padding: '20px',
                  border: '1px solid #e9ecef',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  cursor: 'pointer',
                }}
              >
                <div
                  className="icon"
                  style={{
                    fontSize: '2.5rem',
                    color: reason.color,
                  }}
                >
                  {reason.icon}
                </div>
                <h4
                  className="title"
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    marginTop: '1rem',
                    color: '#343a40',
                  }}
                >
                  {reason.title}
                </h4>
                <p className="description" style={{ color: '#6c757d', marginTop: '0.5rem' }}>
                  {reason.description}
                </p>
              </div>
            </CCol>
          ))}
        </CRow>
      </CContainer>
    </section>
  )
}

export default WhySection
