import React from 'react';
import styled from 'styled-components';
import { CContainer, CRow, CCol } from '@coreui/react';
import { motion } from 'framer-motion';
import propertyManagement from '../image/2.jpg';
import propertyManagement2 from '../image/3.jpg';

const Section = styled(motion.section)`
  padding-top: 40px;
  padding-bottom: 40px;
  background-color: #f8f9fa;
  @media (min-width: 768px) {
    padding-top: 60px;
    padding-bottom: 60px;
  }
  overflow: hidden; /* Ensure child animations don't cause overflow */
`;

const StyledContainer = styled(CContainer)`
  /* Add container styles */
`;

const SectionTitleWrapper = styled(motion.div)`
  text-align: center;
  margin-bottom: 40px;
  @media (max-width: 768px) {
    margin-bottom: 30px;
  }
`;

const SectionTitle = styled(motion.h2)`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SectionSubtitle = styled(motion.p)`
  font-size: 1.2rem;
  color: #555;
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ContentRow = styled(CRow)`
  display: flex;
  flex-wrap: wrap; /* Allow items to wrap on smaller screens */
  justify-content: center; /* Center items on the row */
  gap: 20px; /* Add a gap between columns */
`;

const ContentCol = styled(CCol)`
  flex: 1 1 45%;  /* allow columns to take up equal space on larger screen, with a starting width 45% of their container */
  max-width: 500px;  /* Set a max-width so the columns do not get too big on wide screens */
  /* Center-align columns on smaller screens */
  @media (max-width: 768px) {
    flex: 1 1 100%; /* allow the columns to take up the entire width on small screens */
  }
`;


const ContentWrapper = styled(motion.div)`
  padding: 20px;
  transition: box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out;
    background-color: #ffffff;
    border-radius: 8px; /* Added border-radius */
  &:hover {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    transform: translateY(-5px);
  }
`;

const SubTitle = styled.h5`
  font-size: 1.3rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
`;

const StyledList = styled.ul`
  list-style-type: none;
  padding-left: 0;
`;

const ListItem = styled(motion.li)`
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 10px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: -15px;
    top: 50%;
    transform: translateY(-50%);
    width: 8px;
    height: 8px;
    background-color: #007bff;
    border-radius: 50%;
    transition: background-color 0.3s ease, transform 0.3s ease;
  }
  &:hover::before {
    background-color: #0056b3;
    transform: translateY(-50%) scale(1.2);
  }
`;

const AboutSection = () => {
    const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeInOut" } },
    };


    const listItemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeInOut" } },
    };

    const contentWrapperVariants = {
       hidden: { opacity: 0, scale: 0.95 },
      visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeInOut" } },
   }

   const titleVariants = {
       hidden: { opacity: 0, y: -30 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeInOut" } },
   }

  return (
    <Section id="about"
        variants={sectionVariants}
      initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
    >
      <StyledContainer className="py-5">
        <SectionTitleWrapper variants={titleVariants}>
          <SectionTitle >
            About Us
          </SectionTitle>
          <SectionSubtitle>
            A little bit about BetaPMS and its magnificent idea of property
            management.
          </SectionSubtitle>
        </SectionTitleWrapper>

        <ContentRow xs={{ gutterX: 5 }}>
          <ContentCol>
            <ContentWrapper className="p-3 text-justify"  variants={contentWrapperVariants}>
              <CCol className="pb-3">
                <SubTitle>
                  <b>Vision: </b>
                </SubTitle>
                To transform the property management industry by creating a
                future where managing properties is intuitive, efficient, and
                enjoyable for all stakeholders.
              </CCol>
              <CCol className="pb-3">
                <SubTitle>
                  <b>Mission: </b>
                </SubTitle>
                To empower landlords and property managers with innovative,
                user-friendly tools that streamline property management
                processes, enhance tenant satisfaction, and maximize property
                value. We strive to provide exceptional support and continuous
                improvements to meet the evolving needs of our clients.
              </CCol>
            </ContentWrapper>
          </ContentCol>
          <CCol lg={6}>
            <img src={propertyManagement} alt="Property Management" className="img-fluid" />
          </CCol>
          <CCol lg={6}>
            <img src={propertyManagement2} alt="Property Management" className="img-fluid" />
          </CCol>
          <ContentCol>
          
            <ContentWrapper className="p-3 text-justify" variants={contentWrapperVariants}>
              <SubTitle>
                <b>Core Values: </b>
              </SubTitle>
              <StyledList>
                <ListItem  variants={listItemVariants}>Streamline your operations</ListItem>
                <ListItem  variants={listItemVariants}>Improve tenant satisfaction</ListItem>
                <ListItem  variants={listItemVariants}>Maximize profits</ListItem>
                <ListItem  variants={listItemVariants}>
                  Easily manage properties, tenants, and leases
                </ListItem>
                <ListItem  variants={listItemVariants}>Powerful analytics and reports</ListItem>
                  <ListItem  variants={listItemVariants}>Integration with popular services</ListItem>
                <ListItem  variants={listItemVariants}>Responsive and user-friendly design</ListItem>
                <ListItem  variants={listItemVariants}>Secure and private data</ListItem>
                  <ListItem  variants={listItemVariants}>Multiple languages support</ListItem>
              </StyledList>
            </ContentWrapper>
          </ContentCol>
        </ContentRow>
      </StyledContainer>
    </Section>
  );
};

export default AboutSection;