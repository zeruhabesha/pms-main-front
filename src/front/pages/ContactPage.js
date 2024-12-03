import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CContainer, CRow, CCol, CButton, CForm, CFormInput, CFormTextarea, CAlert } from '@coreui/react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    const errors = {};
    if (!name) errors.name = 'Name is required';
    if (!email) errors.email = 'Email is required';
    if (!message) errors.message = 'Message is required';

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
    } else {
      setIsSubmitting(true);
      setErrors({});

      // Simulate form submission (without API)
      setTimeout(() => {
        setName('');
        setEmail('');
        setMessage('');
        alert('Message sent successfully!');
        setIsSubmitting(false);
      }, 1000);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="bg-dark text-white py-5">
        <CContainer>
          <CRow className="justify-content-center text-center">
            <CCol>
              <motion.h1
                className="display-4 font-weight-bold"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                CONTACT US
              </motion.h1>
            </CCol>
          </CRow>
        </CContainer>
      </div>

      <CContainer className="my-5">
        <CRow className="justify-content-center">
          <CCol md={8}>
            <h2 className="h4 mb-4">Get in Touch</h2>
            <CForm onSubmit={handleSubmit}>
              <CRow className="mb-3">
                <CCol>
                  <CFormInput
                    type="text"
                    id="name"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    invalid={!!errors.name}
                  />
                  {errors.name && <CAlert color="danger">{errors.name}</CAlert>}
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol>
                  <CFormInput
                    type="email"
                    id="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    invalid={!!errors.email}
                  />
                  {errors.email && <CAlert color="danger">{errors.email}</CAlert>}
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol>
                  <CFormTextarea
                    id="message"
                    placeholder="Message"
                    rows="5"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    invalid={!!errors.message}
                  />
                  {errors.message && <CAlert color="danger">{errors.message}</CAlert>}
                </CCol>
              </CRow>
              <CButton type="submit" color="primary" className="w-100" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send'}
              </CButton>
            </CForm>
          </CCol>
        </CRow>
      </CContainer>

      <Footer />
    </div>
  );
};

export default ContactPage;
