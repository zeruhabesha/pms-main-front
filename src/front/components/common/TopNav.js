import React from 'react'
import {
  CNavbar,
  CNavbarBrand,
  CNavLink,
  CNavbarNav,
  CNavItem,
  CContainer,
} from '@coreui/react'
import logo from '../../../assets/images/logo-dark.png'

const TopNav = ({ onNavigate }) => {
  return (
    <CNavbar
      expand="md"
      colorScheme="light"
      className="sticky-top d-flex justify-content-between"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.1)', // Transparent white background
        backdropFilter: 'blur(10px)', // Adds a blur effect
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Optional: subtle shadow for visibility
      }}
    >
      <CContainer>
        <CNavbarBrand href="#hero">
          <img src={logo} alt="Beta PMS" width="100" height="auto" />
        </CNavbarBrand>

        <CNavbarNav className="ml-auto">
          <CNavItem>
            <CNavLink onClick={() => onNavigate('hero')}>Home</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink onClick={() => onNavigate('about')}>About</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink onClick={() => onNavigate('stats')}>Stats</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink onClick={() => onNavigate('services')}>Services</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink onClick={() => onNavigate('clients')}>Clients</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink onClick={() => onNavigate('pricing')}>Pricing</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink onClick={() => onNavigate('faqs')}>FAQs</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink onClick={() => onNavigate('contact')}>Contact</CNavLink>
          </CNavItem>
        </CNavbarNav>
      </CContainer>
    </CNavbar>
  )
}

export default TopNav
