import React, { useState } from 'react'
import { CContainer, CRow, CCol } from '@coreui/react'
import { BiChevronRight } from 'react-icons/bi'

const faqData = [
  {
    id: 1,
    question: 'How can I add a new property to the system?',
    answer:
      'Go to the Property Management section, enter the property details, and upload relevant media like images and floor plans.',
  },
  {
    id: 2,
    question: 'Do tenants have access to their lease agreements?',
    answer:
      'Yes, tenants can view and electronically sign their lease agreements through their dedicated portal.',
  },
  {
    id: 3,
    question: 'What actions are taken for overdue payments?',
    answer:
      'Automated reminders are sent to the tenant, and late fees can be applied if necessary.',
  },
  {
    id: 4,
    question: 'How are maintenance requests processed?',
    answer:
      'Tenants can submit maintenance requests, which are then reviewed and assigned to the appropriate staff for resolution.',
  },
]

const FaqSection = () => {
  const [activeId, setActiveId] = useState(null)

  const toggleFaq = (id) => {
    setActiveId((prevId) => (prevId === id ? null : id))
  }

  return (
    <section
      id="faq"
      style={{
        // backgroundColor: '#f6fafd',
        padding: '3rem 0',
      }}
    >
      {/* Section Title */}
      <CContainer style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Frequently Asked Questions
        </h2>
        <p style={{ color: '#777', fontSize: '1rem' }}>
          Necessitatibus eius consequatur ex aliquid fuga eum quidem sint consectetur velit
        </p>
      </CContainer>

      {/* FAQ Items */}
      <CContainer>
        <CRow className="justify-content-center">
          <CCol lg={10}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {faqData.map((faq) => (
                <div
                  key={faq.id}
                  onClick={() => toggleFaq(faq.id)}
                  style={{
                    border: activeId === faq.id ? '1px solid #2487ce' : '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '1rem 1.5rem',
                    backgroundColor: activeId === faq.id ? '#e8f4fc' : '#fff',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  className={`faq-item ${activeId === faq.id ? 'faq-active' : ''}`}
                >
                  <h3
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      color: activeId === faq.id ? '#2487ce' : '#333',
                      marginBottom: activeId === faq.id ? '0.5rem' : '0',
                    }}
                  >
                    {faq.question}
                  </h3>
                  {activeId === faq.id && (
                    <div style={{ marginTop: '0.5rem', color: '#555', fontSize: '0.95rem' }}>
                      {faq.answer}
                    </div>
                  )}
                  <BiChevronRight
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      fontSize: '1.5rem',
                      color: activeId === faq.id ? '#2487ce' : '#aaa',
                      transition: 'transform 0.3s ease',
                      transform: activeId === faq.id ? 'rotate(90deg)' : 'rotate(0)',
                    }}
                  />
                </div>
              ))}
            </div>
          </CCol>
        </CRow>
      </CContainer>
    </section>
  )
}

export default FaqSection
