import React from 'react'
import { CContainer, CRow, CCol } from '@coreui/react'
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa'
import logo from '../../../assets/images/logo-dark.png'

const NewFooter = () => {
  return (
    <footer
      style={{
        backgroundColor: '#f6fafd',
        padding: '3rem 0',
        color: '#333',
      }}
    >
      {/* Footer Top */}
      <CContainer style={{ marginBottom: '2rem' }}>
        <CRow className="gy-4" style={{ justifyContent: 'space-between' }}>
          {/* About Section */}
          <CCol lg={5} md={12} style={{ textAlign: 'left' }}>
            <a
              href="/"
              style={{
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <img
                src={logo}
                alt="Beta PMS"
                style={{
                  width: '100px', // Increased width
                  height: 'auto',
                  maxWidth: '100%', // Ensures responsiveness
                }}
              />
            </a>
            <p style={{ marginTop: '1rem', color: '#666', textAlign: 'justify' }}>
              Our platform revolutionizes property management by offering a seamless and efficient
              way to handle properties, tenants, and leases. With cutting-edge tools and
              integrations, we empower landlords to save time and enhance tenant satisfaction.
            </p>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
              <a href="#" style={{ color: '#1da1f2', fontSize: '1.5rem' }}>
                <FaTwitter />
              </a>
              <a href="#" style={{ color: '#3b5998', fontSize: '1.5rem' }}>
                <FaFacebook />
              </a>
              <a href="#" style={{ color: '#e4405f', fontSize: '1.5rem' }}>
                <FaInstagram />
              </a>
              <a href="#" style={{ color: '#0077b5', fontSize: '1.5rem' }}>
                <FaLinkedin />
              </a>
            </div>
          </CCol>

          {/* Useful Links */}
          <CCol lg={2} md={6}>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Useful Links
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, color: '#666' }}>
              <li>
                <a href="#" style={{ textDecoration: 'none', color: '#2487ce' }}>
                  Home
                </a>
              </li>
              <li>
                <a href="#" style={{ textDecoration: 'none', color: '#2487ce' }}>
                  About us
                </a>
              </li>
              <li>
                <a href="#" style={{ textDecoration: 'none', color: '#2487ce' }}>
                  Services
                </a>
              </li>
              <li>
                <a href="#" style={{ textDecoration: 'none', color: '#2487ce' }}>
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" style={{ textDecoration: 'none', color: '#2487ce' }}>
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" style={{ textDecoration: 'none', color: '#2487ce' }}>
                  Contacts
                </a>
              </li>
            </ul>
          </CCol>

          {/* Our Services */}
          {/* <CCol lg={2} md={6}>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Our Services
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, color: '#666' }}>
              <li>
                <a href="#" style={{ textDecoration: 'none', color: '#2487ce' }}>
                  Web Design
                </a>
              </li>
              <li>
                <a href="#" style={{ textDecoration: 'none', color: '#2487ce' }}>
                  Web Development
                </a>
              </li>
              <li>
                <a href="#" style={{ textDecoration: 'none', color: '#2487ce' }}>
                  Product Management
                </a>
              </li>
              <li>
                <a href="#" style={{ textDecoration: 'none', color: '#2487ce' }}>
                  Marketing
                </a>
              </li>
              <li>
                <a href="#" style={{ textDecoration: 'none', color: '#2487ce' }}>
                  Graphic Design
                </a>
              </li>
            </ul>
          </CCol> */}

          {/* Contact Section */}
          <CCol lg={3} md={12} style={{ textAlign: 'left' }}>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Contact Us
            </h4>
            <p style={{ marginBottom: '0.5rem', color: '#666' }}>A108 Adam Street</p>
            <p style={{ marginBottom: '0.5rem', color: '#666' }}>New York, NY 535022</p>
            <p style={{ marginBottom: '0.5rem', color: '#666' }}>United States</p>
            <p style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Phone: <span style={{ fontWeight: 'normal' }}>+1 5589 55488 55</span>
            </p>
            <p style={{ fontWeight: 'bold' }}>
              Email: <span style={{ fontWeight: 'normal' }}>info@example.com</span>
            </p>
          </CCol>
        </CRow>
      </CContainer>

      {/* Footer Bottom */}
      <CContainer
        style={{
          textAlign: 'center',
          borderTop: '1px solid #ddd',
          paddingTop: '1rem',
          textDecoration: 'none',
        }}
      >
        <p style={{ margin: 0, color: '#666' }}>
          ©{' '}
          <strong style={{ color: '#2487ce' }}>
            <a href="http://betatechhub.com" style={{ textDecoration: 'none', color: '#2487ce' }}>
              BETA Tech Hub
            </a>
          </strong>{' '}
          All Rights Reserved
        </p>
      </CContainer>
    </footer>
  )
}

export default NewFooter
