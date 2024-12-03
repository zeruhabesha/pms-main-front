import React from 'react'
import { CContainer, CRow, CCol } from '@coreui/react'
import {
  cilHeart,
  cilSpeak,
  cilClipboard,
  cilPencil,
  cilCalendarCheck,
  cilCommentBubble,
} from '@coreui/icons'
import { CIcon } from '@coreui/icons-react'
import './ServicesSection.css'

const services = [
  {
    id: 1,
    title: 'Property Management',
    description:
      'Manage property details efficiently by adding, updating, and deleting information, assigning availability status, and uploading media such as images and floor plans.',
    icon: cilHeart,
    color: '#1abc9c',
  },
  {
    id: 2,
    title: 'Tenant Management',
    description:
      'Keep precise tenant profiles, including lease terms and payment histories, and provide tenants with an interactive portal for easy access to their data.',
    icon: cilSpeak,
    color: '#e67e22',
  },
  {
    id: 3,
    title: 'Lease Agreements',
    description:
      'Create, edit, and renew legally compliant lease agreements while setting up automated notifications for lease expirations.',
    icon: cilClipboard,
    color: '#3498db',
  },
  {
    id: 4,
    title: 'Maintenance Handling',
    description:
      'Allow tenants to submit maintenance requests with descriptions and media, while landlords can assign tasks and track their progress until completion.',
    icon: cilPencil,
    color: '#e74c3c',
  },
  {
    id: 5,
    title: 'Rent Collection',
    description:
      'Automate invoice generation and payment tracking, enable secure online payment methods, and manage overdue reminders.',
    icon: cilCalendarCheck,
    color: '#9b59b6',
  },
  {
    id: 6,
    title: 'Report Generation',
    description:
      'Generate comprehensive reports with detailed analysis to assist in making informed decisions and maintaining regulatory compliance.',
    icon: cilCommentBubble,
    color: '#f39c12',
  },
]

const ServicesSection = () => {
  return (
    <section className="services-section">
      <CContainer>
        <h2 className="text-center mb-4">Services</h2>
        <p className="text-center mb-5">
          Tailored tools and services to meet the dynamic needs of property managers and tenants.
        </p>
        <CRow>
          {services.map((service) => (
            <CCol lg={4} md={6} key={service.id} className="mb-4">
              <div className="service-item">
                <div className="icon-container" style={{ '--iconColor': service.color }}>
                  <div className="icon-background">
                    <CIcon icon={service.icon} size="3xl" className="service-icon" />
                  </div>
                </div>
                <h3 className="mt-3">{service.title}</h3>
                <p>{service.description}</p>
              </div>
            </CCol>
          ))}
        </CRow>
      </CContainer>
    </section>
  )
}

export default ServicesSection
