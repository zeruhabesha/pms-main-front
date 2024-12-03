import React, { useState, useEffect } from 'react'
import TopNav from '../components/common/TopNav'
import HeroSection from '../sections/HeroSection'
import AboutSection from '../sections/AboutSection'
import StatsSection from '../sections/StatsSection'
import ServicesSection from '../sections/ServicesSection'
import ClientSection from '../sections/ClientSection'
import FaqSection from '../sections/FaqSection'
import ContactSection from '../sections/ContactSection'
import NewFooter from '../components/common/NewFooter'
import { motion } from 'framer-motion'
import { FaArrowUp } from 'react-icons/fa'
import './home.scss'
import PricingSection from '../sections/PricingSection'

const HomePage = () => {
  const [showScrollTop, setShowScrollTop] = useState(false)

  // Handle scroll to show or hide the button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowScrollTop(true)
      } else {
        setShowScrollTop(false)
      }
    }

    window.addEventListener('scroll', handleScroll)

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Scroll back to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <div>
      <TopNav />

      <HeroSection />
      <AboutSection />
      <StatsSection />
      <ServicesSection />
      <ClientSection />
      <PricingSection />
      <FaqSection />
      <ContactSection />
      <NewFooter />

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            width: '50px',
            height: '50px',
            backgroundColor: '#2487ce',
            color: '#fff',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
            zIndex: 1000,
          }}
        >
          <FaArrowUp />
        </motion.div>
      )}
    </div>
  )
}

export default HomePage
