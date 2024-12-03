import React, { useEffect, useState, useRef } from 'react';
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

  // Animation Variants
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="flex-grow-1">
        <div className="position-relative" style={{ height: '60vh' }}>
          <div
            className="position-absolute w-100 h-100"
            style={{
              backgroundImage:
                'url(https://png.pngtree.com/thumb_back/fw800/background/20220217/pngtree-simple-atmosphere-black-line-promotion-background-image_954276.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div
              className="position-absolute w-100 h-100"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            ></div>
            <motion.h1
              className="text-white d-flex justify-content-center align-items-center h-100"
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1 }}
              style={{ fontSize: '2.5rem', fontWeight: 'bold' }}
            >
              ABOUT US
            </motion.h1>
          </div>
        </div>

        <CContainer className="py-5">
          {/* Main Content */}
          <motion.div
            className="mt-4"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <p className="mb-4 fs-5">
              Welcome to BetaPMS, the ultimate solution for property management. We simplify
              managing your properties, tenants, and maintenance tasks while providing advanced
              analytics to help you make informed decisions.
            </p>
            <motion.h2
              className="text-center fs-3 fw-bold mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              Our Mission
            </motion.h2>
            <p className="mb-4 fs-5">
              At BetaPMS, our mission is to empower property owners and managers by offering an
              easy-to-use platform that integrates every aspect of property management. Our goal is
              to streamline your operations so you can focus on maximizing profits and improving
              tenant satisfaction.
            </p>
          </motion.div>

          <motion.h2
            className="text-center fs-3 fw-bold mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Our Services
          </motion.h2>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <CRow>
              <CCol lg={6} className="mb-4">
                <motion.div variants={fadeInUp}>
                  <CCard className="shadow-sm">
                    <CCardBody>
                      <CCardTitle className="d-flex align-items-center mb-3">
                        <CIcon icon={cilCheckCircle} className="me-2 text-primary" />
                        Tenant Management
                      </CCardTitle>
                      <p>
                        Our platform helps you keep track of tenant information, rental agreements, and
                        payment histories, making it easy to manage tenant relationships.
                      </p>
                    </CCardBody>
                  </CCard>
                </motion.div>
                <motion.div variants={fadeInUp}>
                  <CCard className="shadow-sm my-4">
                    <CCardBody>
                      <CCardTitle className="d-flex align-items-center mb-3">
                        <CIcon icon={cilCheckCircle} className="me-2 text-primary" />
                        Maintenance Tracking
                      </CCardTitle>
                      <p>
                        Streamline your maintenance requests and ensure timely resolution with our
                        maintenance tracking feature, making property upkeep hassle-free.
                      </p>
                    </CCardBody>
                  </CCard>
                </motion.div>
                <motion.div variants={fadeInUp}>
                  <CCard className="shadow-sm">
                    <CCardBody>
                      <CCardTitle className="d-flex align-items-center mb-3">
                        <CIcon icon={cilCheckCircle} className="me-2 text-primary" />
                        Financial Reporting
                      </CCardTitle>
                      <p>
                        Generate detailed financial reports to keep track of income, expenses, and
                        profits, ensuring that you stay on top of your business's financial health.
                      </p>
                    </CCardBody>
                  </CCard>
                </motion.div>
              </CCol>
              <CCol lg={6}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1 }}
                >
                  <CImage
                    src={PropertyManagement}
                    alt="Our Services"
                    className="rounded w-100"
                    style={{ objectFit: 'cover' }}
                  />
                </motion.div>
              </CCol>
            </CRow>
          </motion.div>

          <div className="mt-5">
            <motion.h2
              className="text-center fs-3 fw-bold mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              Why Choose BetaPMS?
            </motion.h2>
            <motion.ul
              className="list-unstyled"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {['Comprehensive Management', 'Customizable Solutions', 'Real-Time Insights', 'Client-Centric Support'].map((item, index) => (
                <motion.li
                  key={index}
                  className="mb-3"
                  variants={fadeInUp}
                >
                  <CIcon icon={cilCheckCircle} className="me-2 text-primary" />
                  <b>{item}:</b> Explanation about {item.toLowerCase()}.
                </motion.li>
              ))}
            </motion.ul>
            <motion.p
              className="fs-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              At BetaPMS, we are dedicated to making property management easier and more efficient
              for you. Contact us to learn more about how we can help manage your property portfolio
              with ease.
            </motion.p>
          </div>

          <div className="mt-5">
            <motion.h2
              className="text-center fs-3 fw-bold mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              Vision and Goal
            </motion.h2>
            <motion.div variants={fadeInUp}>
              <CCard className="bg-primary text-white p-4 rounded shadow-sm">
                <CCardBody>
                  <p className="text-center fs-5">
                    Our vision is to revolutionize property management by providing innovative
                    solutions that improve efficiency and enhance tenant satisfaction. We aim to be
                    the top choice for property management software globally.
                  </p>
                  <p className="text-center fs-5">
                    Our goal is to create a platform that integrates all aspects of property
                    management, making it simple and effective for property owners and managers to
                    oversee their portfolios.
                  </p>
                </CCardBody>
              </CCard>
            </motion.div>
          </div>
        </CContainer>

        <footer
          ref={footerRef}
          className={`transition-opacity ${isFooterVisible ? 'opacity-100' : 'opacity-0'}`}
          style={{ position: 'relative', zIndex: 0 }}
        >
          <Footer />
        </footer>
      </div>
    </div>
  );
};

export default AboutPage;
