import React, { useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import TopNav from '../components/common/TopNav';
import HeroSection from '../sections/HeroSection';
import AboutSection from '../sections/AboutSection';
import StatsSection from '../sections/StatsSection';
import ServicesSection from '../sections/ServicesSection';
import ClientSection from '../sections/ClientSection';
import PricingSection from '../sections/PricingSection';
import FaqSection from '../sections/FaqSection';
import ContactSection from '../sections/ContactSection';
import NewFooter from '../components/common/NewFooter';

const HomePageWrapper = styled.div`
  overflow-x: hidden;
`;

const SectionWrapper = styled(motion.div)`
  padding: ${props => props.noPadding ? '0' : '100px 50px'};
  position: relative;
  overflow: hidden;
  margin: ${props => props.noMargin ? '0' : '100px -20px'};
  @media (min-width: 768px) {
     padding: ${props => props.noPadding ? '0' : '100px 0px'};
       margin: ${props => props.noMargin ? '0' : '10% 0px'};
  }
`;

const BackgroundImage = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url(${props => props.imageUrl});
    background-size: cover;
    background-position: center;
    z-index: -1;
    opacity: 0.5;
    transition: transform 0.5s ease, opacity 0.5s ease;


  &:hover {
    transform: scale(1.03);
    opacity: 0.7;

  }
`;



const HomePage = () => {
    const heroRef = useRef(null);
    const aboutRef = useRef(null);
    const statsRef = useRef(null);
    const servicesRef = useRef(null);
    const clientsRef = useRef(null);
    const pricingRef = useRef(null);
    const faqRef = useRef(null);
    const contactRef = useRef(null);

    const sectionRefs = {
        hero: heroRef,
        about: aboutRef,
        stats: statsRef,
        services: servicesRef,
        clients: clientsRef,
        pricing: pricingRef,
        faqs: faqRef,
        contact: contactRef,
    };

    const scrollToSection = (section) => {
        sectionRefs[section].current?.scrollIntoView({ behavior: 'smooth' });
    };

    const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeInOut" } },
    };

  const imageUrls = {
        about: 'https://png.pngtree.com/thumb_back/fh260/background/20230615/pngtree-business-modern-banner-background-image_2699746.jpg',
      stats: 'https://png.pngtree.com/thumb_back/fh260/background/20230911/pngtree-abstract-futuristic-technology-background-with-a-dark-style-image_13332683.jpg',
      services: 'https://png.pngtree.com/thumb_back/fh260/background/20230906/pngtree-abstract-modern-tech-banner-background-image_13236282.jpg',
    clients: 'https://png.pngtree.com/thumb_back/fh260/background/20230828/pngtree-modern-banner-design-background-image_12997027.jpg',
      pricing: 'https://png.pngtree.com/thumb_back/fh260/background/20230828/pngtree-modern-banner-design-background-image_12997027.jpg',
      faqs: 'https://png.pngtree.com/thumb_back/fh260/background/20230901/pngtree-modern-dark-technology-banner-background-image_13120253.jpg',
        contact: 'https://png.pngtree.com/thumb_back/fh260/background/20230901/pngtree-modern-dark-technology-banner-background-image_13120253.jpg',
  };


    return (
    <HomePageWrapper>
      <TopNav onNavigate={scrollToSection} />
        <SectionWrapper ref={heroRef} variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} noMargin noPadding>
            <HeroSection />
        </SectionWrapper>
         <SectionWrapper ref={aboutRef} variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <BackgroundImage imageUrl={imageUrls.about} />
            <AboutSection />
        </SectionWrapper>
       <SectionWrapper ref={statsRef} variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <BackgroundImage imageUrl={imageUrls.stats} />
           <StatsSection />
        </SectionWrapper>
      <SectionWrapper ref={servicesRef} variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <BackgroundImage imageUrl={imageUrls.services} />
            <ServicesSection />
        </SectionWrapper>
        <SectionWrapper ref={clientsRef} variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <BackgroundImage imageUrl={imageUrls.clients} />
            <ClientSection />
        </SectionWrapper>
        <SectionWrapper ref={pricingRef} variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
           <BackgroundImage imageUrl={imageUrls.pricing} />
            <PricingSection />
        </SectionWrapper>
        <SectionWrapper ref={faqRef} variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <BackgroundImage imageUrl={imageUrls.faqs} />
           <FaqSection />
      </SectionWrapper>
       <SectionWrapper ref={contactRef} variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
           <BackgroundImage imageUrl={imageUrls.contact} />
         <ContactSection />
        </SectionWrapper>
      <NewFooter />
    </HomePageWrapper>
  );
};

export default HomePage;