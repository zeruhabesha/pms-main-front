import React from 'react';
import styled from 'styled-components';
import { CContainer, CRow, CCol, CButton } from '@coreui/react';
import { motion } from 'framer-motion';
import { BiCommand } from 'react-icons/bi';
import { FaGem } from 'react-icons/fa';
import { BsFillEaselFill, BsFillGeoAltFill } from 'react-icons/bs';
import BGHero from '../../assets/images/hero-bg-abstract.jpg';
import WhySection from './WhySection';

const Section = styled(motion.section)`
  position: relative;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 0rem;
  overflow: hidden; /* Ensure background image does not overflow */
    height: 250vh; /* Default height for smaller screens */
     @media (min-width: 768px) {
       height: 130vh; /* Adjusted height for screens 768px or larger */
  }
`;

const BackgroundImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
    object-position: center; /* Ensure image stays centered */
  z-index: -1;
  opacity: 0.7;
  transition: transform 0.8s ease, opacity 0.8s ease;
  &:hover{
     transform: scale(1.02);
      opacity: 1;
  }
`;

const StyledContainer = styled(CContainer)`
    position: relative;
    z-index: 1; /* Ensure content stays above background */
`;

const Title = styled(motion.h1)`
  font-size: 2.5rem;
  font-weight: bold;
  color: #343a40;
  margin-bottom: 0rem;
    transition: color 0.3s ease, transform 0.3s ease;
   &:hover {
       color: #007bff;
       transform: translateY(-3px)
   }

    @media (max-width: 768px) {
        font-size: 2rem;
    }

`;

const Subtitle = styled(motion.p)`
  font-size: 1.25rem;
  color: #6c757d;
  margin-bottom: 0rem;
    transition: transform 0.3s ease;
    &:hover{
        transform: translateY(-2px);
    }

    @media (max-width: 768px) {
        font-size: 1.1rem;
    }
`;

const StyledButton = styled(motion(CButton))`
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  transition: transform 0.3s ease;
    &:hover {
        transform: scale(1.05);
    }
`;


const HeroSection = () => {
    const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeInOut" } },
    };

    return (
    <Section
      id="hero"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
    >
      <BackgroundImage src={BGHero} alt="Background" />

      <StyledContainer>
        <CRow className="justify-content-center">
          <CCol xl={7} lg={9}>
            <Title>
              Holistic Property Mgmnt Solutions
            </Title>
            <Subtitle>
              Streamline your property management tasks with our modern and intuitive platform.
              Manage tenants, leases, maintenance, and payments all in one place.
            </Subtitle>
          </CCol>
        </CRow>
        <div className="text-center mt-4">
          <StyledButton
            color="dark"
            size="lg"
            href="#about"
          >
            Get Started
          </StyledButton>
        </div>
      </StyledContainer>

      <WhySection />
    </Section>
  );
};

export default HeroSection;