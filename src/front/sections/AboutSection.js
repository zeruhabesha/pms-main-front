import { CCol, CContainer, CRow } from '@coreui/react'
import React from 'react'

const AboutSection = () => {
  return (
    <section id="about" className="pt-5">
      <CContainer className="py-5 ">
        <div className="text-center my-5" data-aos="fade-up">
          <h2>
            About Us
            <br />
          </h2>
          <p>A little bit about BetaPMS and its maginificent idea of property management.</p>
        </div>
        <>
          <CRow xs={{ gutterX: 5 }}>
            <CCol>
              <div className="p-3 text-justify">
                <CCol className="pb-3">
                  <h5>
                    <b>Vision: </b>
                  </h5>
                  To transform the property management industry by creating a future where managing
                  properties is intuitive, efficient, and enjoyable for all stakeholders.
                </CCol>
                <CCol className="pb-3">
                  <h5>
                    <b>Mission: </b>
                  </h5>
                  To empower landlords and property managers with innovative, user-friendly tools
                  that streamline property management processes, enhance tenant satisfaction, and
                  maximize property value. We strive to provide exceptional support and continuous
                  improvements to meet the evolving needs of our clients.
                </CCol>
              </div>
            </CCol>
            <CCol>
              <div className="p-3 text-justify">
                <h5>
                  <b>Core Values: </b>
                </h5>
                <ul>
                  <li>Streamline your operations</li>
                  <li>Improve tenant satisfaction</li>
                  <li>Maximize profits</li>
                  <li>Easily manage properties, tenants, and leases</li>
                  <li>Powerful analytics and reports</li>
                  <li>Integration with popular services</li>
                  <li>Responsive and user-friendly design</li>
                  <li>Secure and private data</li>
                  <li>Multiple languages support</li>
                </ul>
              </div>
            </CCol>
          </CRow>
        </>
      </CContainer>
    </section>
  )
}

export default AboutSection
