import React, { useState, useEffect } from 'react';
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
import { Link } from 'react-router-dom';
import { IoLogIn } from 'react-icons/io5';
import { FaBars, FaArrowUp } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai'; // Import the close icon
import logo from '../../../assets/images/logo-dark.png';
import styled, { css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';


const StyledNavbar = styled(CNavbar)`
    background-color: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    position: fixed; /* Changed to fixed */
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
    transition: background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out;
    transform: translateY(0);


    &.scrolled {
        background-color: rgba(255, 255, 255, 0.95);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

     &.hidden {
      transform: translateY(-100%);
    }
`;

const StyledNavBrand = styled(CNavbarBrand)`
    margin-right: auto;
     @media (min-width: 768px) {
         margin-right: 0;
    }
`;


const StyledNavToggler = styled(CNavbarToggler)`
  border: none;
  &:focus {
      box-shadow: none;
  }
  @media (min-width: 768px) {
      display: none;
  }
`;

const StyledCollapse = styled(CCollapse)`
  @media (max-width: 767.98px) {
      text-align: center;
  }
`;

const StyledNavLink = styled(CNavLink)`
    cursor: pointer;
    font-weight: 500;
    color: #333; /* Or your desired link color */
    position: relative; /* Added for underline */
    padding: 0.5rem 1rem;
     transition: color 0.3s ease, transform 0.3s ease;

    &:hover {
        color: #007bff;
        transform: scale(1.05);
    }
      &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0;
    height: 2px;
    background-color: #007bff;
    transition: width 0.3s ease;
    }

    &:hover::after{
        width: 100%;
    }
`;

const StyledButton = styled(CButton)`
    white-space: nowrap;
      @media (max-width: 767.98px) {
        margin-top: 10px;
        width: 100%;
  }
`;

const BackToTopButton = styled(motion.button)`
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    z-index: 999;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    opacity: ${({ isvisible }) => isvisible ? 1 : 0};
    pointer-events: ${({ isvisible }) => isvisible ? 'auto' : 'none'};
    transition: opacity 0.3s ease-in-out;

    &:hover {
        background-color: #0056b3;
    }
`;

const BackToTopIcon = styled(FaArrowUp)`
    font-size: 1.2rem;
`;

const TopNav = ({ onNavigate }) => {
    const [visible, setVisible] = useState(false);
    const [isButtonVisible, setIsButtonVisible] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isNavHidden, setIsNavHidden] = useState(false);
    const [prevScrollPos, setPrevScrollPos] = useState(0);



    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.scrollY;
            setIsButtonVisible(currentScrollPos > 300);
            setIsScrolled(currentScrollPos > 100);

             // Handle Navbar hide/show logic
              if (currentScrollPos > 100) {
                setIsNavHidden(prevScrollPos < currentScrollPos );
              } else {
                 setIsNavHidden(false)
               }
             setPrevScrollPos(currentScrollPos);

        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [prevScrollPos]);


  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    <>
      <StyledNavbar
        expand="md"
        colorScheme="light"
          className={`d-flex ${isScrolled ? 'scrolled' : ''} ${isNavHidden ? 'hidden' : ''}`}
      >
        <CContainer>
             <StyledNavBrand href="#hero">
                 <img src={logo} alt="Beta PMS" width="100" height="auto" />
          </StyledNavBrand>


           <StyledNavToggler
              onClick={() => setVisible(!visible)}
              aria-label="Toggle navigation"
            >
               {visible ? <AiOutlineClose size={25} /> : <FaBars size={25} />}
            </StyledNavToggler>


         <StyledCollapse className="navbar-collapse" visible={visible}>
            <CNavbarNav className="ms-auto">
              <CNavItem>
                <StyledNavLink onClick={() => onNavigate('hero')}>Home</StyledNavLink>
              </CNavItem>
              <CNavItem>
                 <StyledNavLink onClick={() => onNavigate('about')}>About</StyledNavLink>
              </CNavItem>
              <CNavItem>
                 <StyledNavLink onClick={() => onNavigate('services')}>Services</StyledNavLink>
              </CNavItem>
              <CNavItem>
                  <StyledNavLink onClick={() => onNavigate('clients')}>Our Clients</StyledNavLink>
              </CNavItem>
              <CNavItem>
                  <StyledNavLink onClick={() => onNavigate('pricing')}>Pricing</StyledNavLink>
              </CNavItem>
             <CNavItem>
                  <StyledNavLink onClick={() => onNavigate('faqs')}>FAQ</StyledNavLink>
              </CNavItem>
              <CNavItem>
                <StyledNavLink onClick={() => onNavigate('contact')}>Contact</StyledNavLink>
              </CNavItem>
            </CNavbarNav>

              <StyledButton
                 color="dark"
                 to="/login"
                 as={Link}
                className="ms-2"
              >
                <IoLogIn size={25} style={{ paddingRight: 5 }} />
                Login
              </StyledButton>
         </StyledCollapse>
        </CContainer>
      </StyledNavbar>


        <AnimatePresence>
            {isButtonVisible && (
                <BackToTopButton
                    onClick={handleScrollToTop}
                    isvisible={isButtonVisible}
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                >
                    <BackToTopIcon />
                </BackToTopButton>
            )}
        </AnimatePresence>
    </>
  );
};

export default TopNav;