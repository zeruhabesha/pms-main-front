import React, { useState } from 'react'
import { CContainer, CRow, CCol, CForm, CFormInput, CFormTextarea, CButton } from '@coreui/react'
import { BiPhone, BiEnvelope } from 'react-icons/bi'
import { BsFillGeoAltFill } from 'react-icons/bs'

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState({ loading: false, success: false, error: '' })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setStatus({ loading: true, success: false, error: '' })

    // Simulate sending data
    setTimeout(() => {
      if (formData.email.includes('@')) {
        setStatus({ loading: false, success: true, error: '' })
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        setStatus({ loading: false, success: false, error: 'Invalid email address.' })
      }
    }, 1500)
  }

  return (
    <section
      id="contact"
      style={{
        // backgroundColor: '#f6fafd',
        padding: '3rem 0',
      }}
    >
      {/* Section Title */}
      <CContainer style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Contact</h2>
        <p style={{ color: '#777', fontSize: '1rem' }}>
          Necessitatibus eius consequatur ex aliquid fuga eum quidem sint consectetur velit
        </p>
      </CContainer>

      {/* Google Maps */}
      <CContainer>
        <div style={{ marginBottom: '2rem' }}>
          <iframe
            style={{ border: 0, width: '100%', height: '270px' }}
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d805.7956209721643!2d38.773577381176494!3d8.991407997808468!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85b83b1199d3%3A0xd11409f489cda22a!2sBeta%20Tech%20Hub!5e0!3m2!1sen!2set!4v1731918338371!5m2!1sen!2set"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </CContainer>

      {/* Contact Info and Form */}
      <CContainer>
        <CRow className="gy-4">
          {/* Contact Info */}
          <CCol lg={4}>
            <div
              style={{
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
              }}
            >
              <BsFillGeoAltFill size="2rem" style={{ color: '#2487ce' }} />
              <div>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: 'bold' }}>
                  Address
                </h3>
                <p style={{ margin: 0 }}>A108 Adam Street, New York, NY 535022</p>
              </div>
            </div>

            <div
              style={{
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
              }}
            >
              <BiPhone size="2rem" style={{ color: '#2487ce' }} />
              <div>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: 'bold' }}>
                  Call Us
                </h3>
                <p style={{ margin: 0 }}>+1 5589 55488 55</p>
              </div>
            </div>

            <div
              style={{
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
              }}
            >
              <BiEnvelope size="2rem" style={{ color: '#2487ce' }} />
              <div>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: 'bold' }}>
                  Email Us
                </h3>
                <p style={{ margin: 0 }}>info@betatechhub.com</p>
              </div>
            </div>
          </CCol>

          {/* Contact Form */}
          <CCol lg={8}>
            <CForm onSubmit={handleSubmit}>
              <CRow className="gy-4">
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </CCol>
                <CCol md={12}>
                  <CFormInput
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </CCol>
                <CCol md={12}>
                  <CFormTextarea
                    name="message"
                    rows="6"
                    placeholder="Message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </CCol>
                <CCol md={12} style={{ textAlign: 'center' }}>
                  {status.loading && <p>Loading...</p>}
                  {status.error && <p style={{ color: 'red' }}>{status.error}</p>}
                  {status.success && (
                    <p style={{ color: 'green' }}>Your message has been sent. Thank you!</p>
                  )}
                  <CButton type="submit" color="dark" disabled={status.loading}>
                    Send Message
                  </CButton>
                </CCol>
              </CRow>
            </CForm>
          </CCol>
        </CRow>
      </CContainer>
    </section>
  )
}

export default ContactSection
