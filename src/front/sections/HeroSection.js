import React from 'react'
import { CContainer, CRow, CCol, CButton } from '@coreui/react'
import { BiCommand } from 'react-icons/bi'
import { FaGem } from 'react-icons/fa'
import { BsFillEaselFill, BsFillGeoAltFill } from 'react-icons/bs'
import BGHero from '../../assets/images/hero-bg-abstract.jpg'
import WhySection from './WhySection'

function HeroSection() {
  return (
    <section
      id="hero"
      className="hero section"
      style={{
        position: 'relative',
        textAlign: 'center',
        height: '85vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        marginBottom: '7rem',
      }}
    >
      <img
        src={BGHero}
        alt="Background"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '95vh',
          objectFit: 'cover',
          zIndex: -1,
        }}
      />

      <CContainer>
        <CRow className="justify-content-center">
          <CCol xl={7} lg={9}>
            <h1
              style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: '#343a40',
                marginBottom: '0.5rem',
              }}
            >
              Holistic Property Mgmnt Solutions
            </h1>
            <p style={{ fontSize: '1.25rem', color: '#6c757d', marginBottom: '1.5rem' }}>
              Streamline your property management tasks with our modern and intuitive platform.
              Manage tenants, leases, maintenance, and payments all in one place.
            </p>
          </CCol>
        </CRow>
        <div className="text-center mt-4">
          <CButton
            color="primary"
            size="lg"
            href="#about"
            style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}
          >
            Get Started
          </CButton>
        </div>
      </CContainer>

      <WhySection />
    </section>
  )
}

export default HeroSection
