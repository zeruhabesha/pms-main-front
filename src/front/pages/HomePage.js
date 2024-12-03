import React, { useRef } from 'react'
import TopNav from '../components/common/TopNav'
import HeroSection from '../sections/HeroSection'
import AboutSection from '../sections/AboutSection'
import StatsSection from '../sections/StatsSection'
import ServicesSection from '../sections/ServicesSection'
import ClientSection from '../sections/ClientSection'
import PricingSection from '../sections/PricingSection'
import FaqSection from '../sections/FaqSection'
import ContactSection from '../sections/ContactSection'
import NewFooter from '../components/common/NewFooter'

const HomePage = () => {
  const heroRef = useRef(null)
  const aboutRef = useRef(null)
  const statsRef = useRef(null)
  const servicesRef = useRef(null)
  const clientsRef = useRef(null)
  const pricingRef = useRef(null)
  const faqRef = useRef(null)
  const contactRef = useRef(null)

  const scrollToSection = (section) => {
    switch (section) {
      case 'hero':
        heroRef.current?.scrollIntoView({ behavior: 'smooth' })
        break
      case 'about':
        aboutRef.current?.scrollIntoView({ behavior: 'smooth' })
        break
      case 'stats':
        statsRef.current?.scrollIntoView({ behavior: 'smooth' })
        break
      case 'services':
        servicesRef.current?.scrollIntoView({ behavior: 'smooth' })
        break
      case 'clients':
        clientsRef.current?.scrollIntoView({ behavior: 'smooth' })
        break
      case 'pricing':
        pricingRef.current?.scrollIntoView({ behavior: 'smooth' })
        break
      case 'faqs':
        faqRef.current?.scrollIntoView({ behavior: 'smooth' })
        break
      case 'contact':
        contactRef.current?.scrollIntoView({ behavior: 'smooth' })
        break
      default:
        break
    }
  }

  return (
    <div>
      <TopNav onNavigate={scrollToSection} />

      <div ref={heroRef}>
        <HeroSection />
      </div>
      <div ref={aboutRef}>
        <AboutSection />
      </div>
      <div ref={statsRef}>
        <StatsSection />
      </div>
      <div ref={servicesRef}>
        <ServicesSection />
      </div>
      <div ref={clientsRef}>
        <ClientSection />
      </div>
      <div ref={pricingRef}>
        <PricingSection />
      </div>
      <div ref={faqRef}>
        <FaqSection />
      </div>
      <div ref={contactRef}>
        <ContactSection />
      </div>
      <NewFooter />
    </div>
  )
}

export default HomePage
