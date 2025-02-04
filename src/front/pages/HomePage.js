import React, { useRef } from 'react';
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
import clients from '../image/7.jpg';
import stats from '../image/a.jpg';
import faqs from '../image/29.jpg';

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
        about: '/assets/about-bg.jpg',
        stats: '/assets/stats-bg.jpg',
        services: '/assets/services-bg.jpg',
        clients: '/assets/clients-bg.jpg',
        pricing: '/assets/pricing-bg.jpg',
        faqs: '/assets/faqs-bg.jpg',
        contact: '/assets/contact-bg.jpg',
    };

    return (
        <div className="overflow-x-hidden">
            <TopNav onNavigate={scrollToSection} />

            <motion.div
                ref={heroRef}
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="relative overflow-hidden pt-0 pb-0 md:pt-0 md:pb-0"
            >
                <HeroSection />
            </motion.div>

            <motion.div
                ref={aboutRef}
                variants={sectionVariants}
                 initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="relative overflow-hidden py-16 px-8 md:py-24 md:px-0 hover:bg-gray-100 transition-colors duration-300"
            >
              <div
                    className="absolute inset-0 bg-cover bg-center z-[-1] opacity-30 transition-transform duration-500 ease-in-out pointer-events-none hover:opacity-50 hover:scale-[1.02]"
                    style={{ backgroundImage: `url(${imageUrls.about})` }}
                />
                <AboutSection />
            </motion.div>

           <motion.div
                ref={statsRef}
                variants={sectionVariants}
                 initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="relative overflow-hidden py-16 px-8 md:py-24 md:px-0 hover:bg-gray-100 transition-colors duration-300"
            >
              <div
                    className="absolute inset-0 bg-cover bg-center z-[-1] opacity-30 transition-transform duration-500 ease-in-out pointer-events-none hover:opacity-50 hover:scale-[1.02]"
                    style={{ backgroundImage: `url(${stats})` }}
                />
                 <StatsSection />
            </motion.div>


           <motion.div
                ref={servicesRef}
               variants={sectionVariants}
                 initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="relative overflow-hidden py-16 px-8 md:py-24 md:px-0 hover:bg-gray-100 transition-colors duration-300"
            >
                 <div
                    className="absolute inset-0 bg-cover bg-center z-[-1] opacity-30 transition-transform duration-500 ease-in-out pointer-events-none hover:opacity-50 hover:scale-[1.02]"
                    style={{ backgroundImage: `url(${imageUrls.services})` }}
                />
                <ServicesSection />
            </motion.div>

            <motion.div
                ref={clientsRef}
               variants={sectionVariants}
                 initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
               className="relative overflow-hidden py-16 px-8 md:py-24 md:px-0 hover:bg-gray-100 transition-colors duration-300"
            >
                <div
                    className="absolute inset-0 bg-cover bg-center z-[-1] opacity-30 transition-transform duration-500 ease-in-out pointer-events-none hover:opacity-50 hover:scale-[1.02]"
                    style={{ backgroundImage: `url(${clients})` }}
                />
                <ClientSection />
            </motion.div>

            <motion.div
                ref={pricingRef}
              variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="relative overflow-hidden py-16 px-8 md:py-24 md:px-0 hover:bg-gray-100 transition-colors duration-300"

            >
                 <div
                    className="absolute inset-0 bg-cover bg-center z-[-1] opacity-30 transition-transform duration-500 ease-in-out pointer-events-none hover:opacity-50 hover:scale-[1.02]"
                    style={{ backgroundImage: `url(${imageUrls.pricing})` }}
                />
                <PricingSection />
            </motion.div>

           <motion.div
               ref={faqRef}
                variants={sectionVariants}
                 initial="hidden"
                whileInView="visible"
               viewport={{ once: true }}
               className="relative overflow-hidden py-16 px-8 md:py-24 md:px-0 hover:bg-gray-100 transition-colors duration-300"

            >
                <div
                      className="absolute inset-0 bg-cover bg-center z-[-1] opacity-30 transition-transform duration-500 ease-in-out pointer-events-none hover:opacity-50 hover:scale-[1.02]"
                      style={{ backgroundImage: `url(${faqs})` }}
                />
                 <FaqSection />
            </motion.div>

            <motion.div
                ref={contactRef}
                variants={sectionVariants}
                 initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
               className="relative overflow-hidden py-16 px-8 md:py-24 md:px-0 hover:bg-gray-100 transition-colors duration-300"
            >
                <div
                      className="absolute inset-0 bg-cover bg-center z-[-1] opacity-30 transition-transform duration-500 ease-in-out pointer-events-none hover:opacity-50 hover:scale-[1.02]"
                      style={{ backgroundImage: `url(${imageUrls.contact})` }}
                />
                 <ContactSection />
            </motion.div>

            <NewFooter />
        </div>
    );
};

export default HomePage;