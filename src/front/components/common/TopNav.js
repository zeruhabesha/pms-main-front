import React, { useState } from 'react';
import {
  CNavbar,
  CNavbarBrand,
  CNavLink,
  CNavbarNav,
  CNavItem,
  CContainer,
  CButton,
  CNavbarToggler,
  CCollapse,
} from '@coreui/react';
import { Link } from 'react-router-dom'; // Import the Link component
import { IoLogIn } from 'react-icons/io5'; // Import the IoLogIn icon
import { FaBars } from 'react-icons/fa'; // Hamburger icon
import logo from '../../../assets/images/logo-dark.png';

const TopNav = ({ onNavigate }) => {
  const [visible, setVisible] = useState(false); // State for collapsible navbar

  return (
    <CNavbar
      expand="md"
      colorScheme="light"
      className="sticky-top d-flex"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.1)', // Transparent white background
        backdropFilter: 'blur(10px)', // Adds blur effect
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow for visibility
      }}
    >
      <CContainer>
        {/* Logo */}
        <CNavbarBrand href="#hero">
          <img src={logo} alt="Beta PMS" width="100" height="auto" />
        </CNavbarBrand>

        {/* Toggler Button */}
        <CNavbarToggler
          onClick={() => setVisible(!visible)}
          aria-label="Toggle navigation"
        >
          <FaBars size={25} />
        </CNavbarToggler>

        {/* Collapsible Navigation */}
        <CCollapse className="navbar-collapse" visible={visible}>
          <CNavbarNav className="ms-auto"> {/* Align items to the right */}
            <CNavItem>
              <CNavLink onClick={() => onNavigate('hero')}>Home</CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink onClick={() => onNavigate('about')}>About</CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink onClick={() => onNavigate('services')}>Services</CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink onClick={() => onNavigate('clients')}>Our Clients</CNavLink> {/* Added "Our Clients" */}
            </CNavItem>
            <CNavItem>
              <CNavLink onClick={() => onNavigate('pricing')}>Pricing</CNavLink> {/* Added "Pricing" */}
            </CNavItem>
            <CNavItem>
              <CNavLink onClick={() => onNavigate('faqs')}>FAQ</CNavLink> {/* Added "FAQ" */}
            </CNavItem>
            <CNavItem>
              <CNavLink onClick={() => onNavigate('contact')}>Contact</CNavLink>
            </CNavItem>
          </CNavbarNav>

          {/* Login Button */}
          <CButton
            color="dark"
            to="/login"
            as={Link}
            className="ms-2" // Slight spacing for the button
            style={{ whiteSpace: 'nowrap' }} // Ensures text doesn't wrap
          >
            <IoLogIn size={25} style={{ paddingRight: 5 }} />
            Login
          </CButton>
        </CCollapse>
      </CContainer>
    </CNavbar>
  );
};

export default TopNav;
