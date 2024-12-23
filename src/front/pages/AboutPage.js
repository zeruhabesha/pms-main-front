import React, { useEffect, useState, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { cilCheckCircle } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
    CContainer,
    CCard,
    CCardBody,
    CCardTitle,
    CCol,
    CRow,
    CImage,
} from '@coreui/react';
import './AboutPage.scss';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import PropertyManagement from '../image/9.png';


const AboutPageWrapper = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    overflow-x: hidden;
    background-color: #f8f9fa;
`;

const HeroBackground = styled.div`
    position: relative;
    height: 65vh; /* Increased height for more impact */
    overflow: hidden;
    @media (max-width: 768px) {
        height: 50vh;
    }
`;


const zoomIn = keyframes`
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.1);
  }
`;


const HeroImage = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: url('https://png.pngtree.com/thumb_back/fw800/background/20220217/pngtree-simple-atmosphere-black-line-promotion-background-image_954276.jpg');
    background-size: cover;
    background-position: center;
    transition: transform 0.6s ease-in-out; /* Smoother transition */

    &:hover {
        animation: ${zoomIn} 4s linear infinite alternate;
    }
`;


const HeroOverlay = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
`;

const HeroTitle = styled(motion.h1)`
    font-size: 2.8rem; /* Increased font size */
    font-weight: 700; /* Stronger weight */
    text-align: center;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); /* Text shadow for depth */
    letter-spacing: 1.5px;
    @media (max-width: 768px) {
        font-size: 2.2rem;
         letter-spacing: 1px;
    }
`;



const MainContent = styled(CContainer)`
    padding-top: 40px;
    padding-bottom: 40px;
    @media (min-width: 768px) {
        padding-top: 60px;
        padding-bottom: 60px;
    }
`;


const SectionTitle = styled(motion.h2)`
    text-align: center;
    font-size: 2.4rem; /* Increased size */
    font-weight: 700;
    margin-bottom: 25px;
    color: #2c3e50;
    position: relative;
    display: inline-block; /* Ensure the underline fits the text */
     &:before {
        content: '';
        position: absolute;
        left: 50%;
        bottom: -10px;
        width: 60px;
        height: 3px;
        background-color: #007bff; /* Underline color */
        transform: translateX(-50%); /* Center the line */
         border-radius: 2px;
    }

    @media (max-width: 768px) {
        font-size: 2rem;
        margin-bottom: 20px;

    }
`;


const SectionParagraph = styled(motion.p)`
    font-size: 1.2rem;
    color: #555;
    margin-bottom: 20px;
    line-height: 1.7;
    @media (max-width: 768px) {
        font-size: 1.1rem;
    }
`;

const ServiceCard = styled(motion.div)`
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    padding: 25px;
    margin-bottom: 25px;
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;

    &:hover {
        transform: translateY(-8px);
         box-shadow: 0 8px 18px rgba(0, 0, 0, 0.18);
    }
`;


const ServiceCardTitle = styled(CCardTitle)`
    display: flex;
    align-items: center;
    margin-bottom: 18px;
    font-size: 1.4rem;
    color: #333;
    font-weight: 600;
    transition: color 0.3s ease;
`;

const ServiceCardText = styled.p`
    color: #666;
    font-size: 1.1rem;
    line-height: 1.6;
`;


const WhyChooseList = styled(motion.ul)`
    list-style: none;
    padding-left: 0;
    margin-bottom: 30px;
`;

const WhyChooseListItem = styled(motion.li)`
    margin-bottom: 18px;
    font-size: 1.15rem;
    color: #333;
    display: flex;
    align-items: center;
    transition: transform 0.3s ease;

    &:hover{
       transform: translateX(5px);
    }
`;

const VisionCard = styled(motion.div)`
    background-color: #007bff;
    color: #fff;
    padding: 35px;
    border-radius: 12px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
`;

const VisionText = styled(motion.p)`
    font-size: 1.25rem;
    text-align: center;
    margin-bottom: 20px;
    line-height: 1.8;
`;

const ImageContainer = styled(motion.div)`
    overflow: hidden; /* Ensures no overflow during animation */
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.15);
`;

const AnimatedImage = styled(CImage)`
    width: 100%;
    height: auto;
    object-fit: cover;
    transition: transform 0.6s ease;

    &:hover{
         transform: scale(1.05);
    }
`;

const AboutPage = () => {
    const [isFooterVisible, setIsFooterVisible] = useState(false);
    const footerRef = useRef(null);

    const handleScroll = () => {
        const scrollPosition = window.scrollY + window.innerHeight;
        const footerPosition = footerRef.current?.offsetTop;

        if (footerPosition && scrollPosition >= footerPosition) {
            setIsFooterVisible(true);
        } else {
            setIsFooterVisible(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, ease: "easeOut" },
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const cardVariants = {
          initial: { opacity: 0, y: 20, scale: 0.9 },
          animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: 'easeOut'} },
    };


    const imageVariants = {
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1, transition: { duration: 1, ease: "easeOut" } },
        hover: { scale: 1.05, transition: {duration: 0.3, ease: 'easeOut' } }
    }

    return (
        <AboutPageWrapper>
            <Navbar />
            <HeroBackground>
                <HeroImage />
                <HeroOverlay />
                <HeroTitle
                  initial={{ opacity: 0, y: -50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                >
                  ABOUT US
               </HeroTitle>
            </HeroBackground>

            <MainContent>
                {/* Main Content */}
                <motion.div
                    className="mt-4"
                    variants={fadeInUp}
                    initial="initial"
                    animate="animate"
                >
                  <SectionParagraph >
                        Welcome to BetaPMS, the ultimate solution for property management. We simplify
                        managing your properties, tenants, and maintenance tasks while providing advanced
                        analytics to help you make informed decisions.
                    </SectionParagraph>
                  <SectionTitle
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                    >
                        Our Mission
                    </SectionTitle>
                   <SectionParagraph >
                        At BetaPMS, our mission is to empower property owners and managers by offering an
                        easy-to-use platform that integrates every aspect of property management. Our goal is
                        to streamline your operations so you can focus on maximizing profits and improving
                        tenant satisfaction.
                    </SectionParagraph>
                </motion.div>

                 <SectionTitle
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                  >
                    Our Services
                 </SectionTitle>
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                >
                    <CRow>
                        <CCol lg={6} className="mb-4">
                             <ServiceCard variants={cardVariants}>
                                <CCardBody>
                                   <ServiceCardTitle className="d-flex align-items-center mb-3">
                                        <CIcon icon={cilCheckCircle} className="me-2 text-primary" />
                                            Tenant Management
                                    </ServiceCardTitle>
                                    <ServiceCardText >
                                        Our platform helps you keep track of tenant information, rental agreements, and
                                        payment histories, making it easy to manage tenant relationships.
                                    </ServiceCardText>
                                </CCardBody>
                             </ServiceCard>
                             <ServiceCard variants={cardVariants}>
                                <CCardBody>
                                   <ServiceCardTitle className="d-flex align-items-center mb-3">
                                        <CIcon icon={cilCheckCircle} className="me-2 text-primary" />
                                          Maintenance Tracking
                                    </ServiceCardTitle>
                                   <ServiceCardText>
                                        Streamline your maintenance requests and ensure timely resolution with our
                                        maintenance tracking feature, making property upkeep hassle-free.
                                    </ServiceCardText>
                                </CCardBody>
                             </ServiceCard>
                            <ServiceCard variants={cardVariants}>
                                  <CCardBody>
                                    <ServiceCardTitle className="d-flex align-items-center mb-3">
                                        <CIcon icon={cilCheckCircle} className="me-2 text-primary" />
                                        Financial Reporting
                                    </ServiceCardTitle>
                                     <ServiceCardText>
                                       Generate detailed financial reports to keep track of income, expenses, and
                                       profits, ensuring that you stay on top of your business's financial health.
                                    </ServiceCardText>
                                </CCardBody>
                            </ServiceCard>
                        </CCol>
                       <CCol lg={6}>
                            <ImageContainer
                                  variants={imageVariants}
                                    initial="initial"
                                    animate="animate"
                                    whileHover="hover"
                             >
                                <AnimatedImage
                                    src={PropertyManagement}
                                    alt="Our Services"
                                    className="rounded w-100"
                                    style={{ objectFit: 'cover' }}
                                />
                            </ImageContainer>
                        </CCol>
                    </CRow>
                </motion.div>

                <div className="mt-5">
                   <SectionTitle
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                    >
                      Why Choose BetaPMS?
                    </SectionTitle>
                  <WhyChooseList
                      variants={staggerContainer}
                      initial="initial"
                      animate="animate"
                    >
                        {['Comprehensive Management', 'Customizable Solutions', 'Real-Time Insights', 'Client-Centric Support'].map((item, index) => (
                            <WhyChooseListItem
                                key={index}
                                variants={fadeInUp}
                            >
                                <CIcon icon={cilCheckCircle} className="me-2 text-primary" />
                                <b>{item}:</b> Explanation about {item.toLowerCase()}.
                            </WhyChooseListItem>
                        ))}
                  </WhyChooseList>
                   <SectionParagraph
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                    >
                        At BetaPMS, we are dedicated to making property management easier and more efficient
                        for you. Contact us to learn more about how we can help manage your property portfolio
                        with ease.
                    </SectionParagraph>
                </div>

                 <div className="mt-5">
                   <SectionTitle
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                    >
                        Vision and Goal
                    </SectionTitle>
                   <motion.div variants={fadeInUp}>
                        <VisionCard>
                            <CCardBody>
                                <VisionText>
                                    Our vision is to revolutionize property management by providing innovative
                                    solutions that improve efficiency and enhance tenant satisfaction. We aim to be
                                    the top choice for property management software globally.
                                </VisionText>
                                <VisionText>
                                    Our goal is to create a platform that integrates all aspects of property
                                    management, making it simple and effective for property owners and managers to
                                    oversee their portfolios.
                                </VisionText>
                            </CCardBody>
                        </VisionCard>
                    </motion.div>
                </div>
            </MainContent>

             <footer
                ref={footerRef}
                className={`transition-opacity ${isFooterVisible ? 'opacity-100' : 'opacity-0'}`}
                style={{ position: 'relative', zIndex: 0 }}
            >
                <Footer />
            </footer>
        </AboutPageWrapper>
    );
};

export default AboutPage;