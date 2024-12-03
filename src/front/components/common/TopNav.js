import React from 'react'
import { CNavbar, CNavbarBrand, CNavLink, CNavbarNav, CNavItem, CContainer } from '@coreui/react'
import { CButton } from '@coreui/react'
import { Link } from 'react-router-dom'
import logo from '../../../assets/images/logo-dark.png'
import { IoLogIn } from 'react-icons/io5'

const TopNav = () => {
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
        <CNavbarBrand href="#">
          <img src={logo} alt="Beta PMS" width="100" height="auto" />
        </CNavbarBrand>

        <CNavbarNav className="ml-auto">
          <CNavItem>
            <CNavLink href="#hero">Home</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#about">About</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#services">Services</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#clients">Clients</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#pricing">Pricing</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#faqs">FAQs</CNavLink>
          </CNavItem>
          {/* <CNavItem>
            <CNavLink href="#team">Team</CNavLink>
          </CNavItem> */}

          {/* <CDropdown variant="nav-item">
            <CDropdownToggle color="secondary">Dropdown</CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem href="#">Dropdown 1</CDropdownItem>
              <CDropdown>
                <CDropdownToggle>Deep Dropdown</CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem href="#">Deep Dropdown 1</CDropdownItem>
                  <CDropdownItem href="#">Deep Dropdown 2</CDropdownItem>
                  <CDropdownItem href="#">Deep Dropdown 3</CDropdownItem>
                  <CDropdownItem href="#">Deep Dropdown 4</CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
              <CDropdownItem href="#">Dropdown 2</CDropdownItem>
            </CDropdownMenu>
          </CDropdown> */}

          <CNavItem>
            <CNavLink href="#contact">Contact</CNavLink>
          </CNavItem>
        </CNavbarNav>

        <CButton color="primary" href="#about">
          <IoLogIn size={25} style={{ paddingRight: 5 }} />
          Login
        </CButton>
      </CContainer>
    </CNavbar>
  )
}

export default TopNav
