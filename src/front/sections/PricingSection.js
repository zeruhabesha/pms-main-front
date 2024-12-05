import React from 'react'
import { CContainer, CRow, CCol, CButton } from '@coreui/react'
import { FaCheck, FaTimes } from 'react-icons/fa'

const plans = [
  {
    title: 'Free Plan',
    price: 0,
    features: [
      { text: 'Basic property management', included: true },
      { text: 'Tenant profile management', included: true },
      { text: 'View-only lease agreements', included: true },
      { text: 'Limited maintenance handling', included: false },
      { text: 'Basic rent collection', included: false },
    ],
  },
  {
    title: 'Business Plan',
    price: 29,
    features: [
      { text: 'Comprehensive property management', included: true },
      { text: 'Full tenant management', included: true },
      { text: 'Create and renew lease agreements', included: true },
      { text: 'Advanced maintenance handling', included: true },
      { text: 'Enhanced rent collection', included: true },
    ],
    featured: true,
  },
  {
    title: 'Developer Plan',
    price: 49,
    features: [
      { text: 'All-inclusive property management', included: true },
      { text: 'Full tenant management with portal', included: true },
      { text: 'Automated lease agreements', included: true },
      { text: 'Complete maintenance handling', included: true },
      { text: 'Full rent collection with reminders', included: true },
    ],
  },
]

const PricingSection = () => {
  return (
    <section
      id="pricing"
      style={{
        padding: '3rem 0',
      }}
    >
      {/* Section Title */}
      <CContainer style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Pricing</h2>
        <p style={{ color: '#777', fontSize: '1rem' }}>
          Choose the plan that fits your property management needs.
        </p>
      </CContainer>

      {/* Pricing Plans */}
      <CContainer>
        <CRow className="gy-4" style={{ alignItems: 'center' }}>
          {plans.map((plan, index) => (
            <CCol
              lg={4}
              md={6}
              key={index}
              style={{
                textAlign: 'center',
                padding: '1.5rem',
                backgroundColor: plan.featured ? '#2487ce' : '#fff',
                color: plan.featured ? '#fff' : '#333',
                borderRadius: '8px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                height: plan.featured ? '600px' : '500px', // Increased height for featured plan
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignSelf: plan.featured ? 'center' : 'auto', // Center the middle plan vertically
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    marginBottom: '1rem',
                  }}
                >
                  {plan.title}
                </h3>
                <h4
                  style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    marginBottom: '1.5rem',
                  }}
                >
                  Birr {plan.price}
                  <span style={{ fontSize: '1rem', fontWeight: 'normal' }}> / month</span>
                </h4>
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    textAlign: 'left',
                    margin: '1rem 0',
                    lineHeight: '2', // Increased line height for padding between features
                  }}
                >
                  {plan.features.map((feature, idx) => (
                    <li
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: feature.included ? (plan.featured ? '#fff' : '#2487ce') : '#aaa',
                        textDecoration: feature.included ? 'none' : 'line-through',
                      }}
                    >
                      {feature.included ? (
                        <FaCheck />
                      ) : (
                        <FaTimes style={{ color: plan.featured ? '#f5f5f5' : '#aaa' }} />
                      )}
                      <span>{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <CButton
                href="#"
                color={plan.featured ? 'light' : 'dark'}
                style={{
                  marginTop: '1rem',
                  padding: '0.75rem 1.5rem',
                  fontSize: '1rem',
                  backgroundColor: plan.featured ? '#fff' : '#2487ce',
                  color: plan.featured ? '#2487ce' : '#fff',
                  border: 'none',
                  borderRadius: '5px',
                }}
              >
                Buy Now
              </CButton>
            </CCol>
          ))}
        </CRow>
      </CContainer>
    </section>
  )
}

export default PricingSection
