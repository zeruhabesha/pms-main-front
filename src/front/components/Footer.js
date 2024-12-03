import React from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import logo from '../image/logo.png';
import {
  CFooter,
  CContainer,
  CRow,
  CCol,
  CListGroup,
  CListGroupItem,
  CLink,
} from '@coreui/react';

const Footer = ({ isFixed }) => {
  return (
    <CFooter
      className={`bg-dark text-white py-4 ${
        isFixed ? 'position-fixed bottom-0 start-0 end-0' : ''
      } shadow-lg`}
    >
      <CContainer fluid>
        <CRow>
          {/* About Us Section */}
          <CCol xs={12} md={4} className="mb-4">
            <img src={logo} alt="logo" className="mb-3" style={{ width: '150px', height: 'auto' }} />
            <h3 className="h5 mb-3">About BetaPMS</h3>
            <p className="text-white">
              BetaPMS is an innovative property management system designed to simplify rental management, tenant communication, and property maintenance. Our goal is to make property management seamless and efficient.
            </p>
          </CCol>

          {/* Quick Links Section */}
          <CCol xs={12} md={4} className="mb-4">
            <h3 className="h5 mb-3">Quick Links</h3>
            <CListGroup flush>
              {['About', 'Features', 'Pricing', 'Support', 'Contact'].map(link => (
                <CListGroupItem key={link} className="p-0 bg-transparent border-0">
                  <CLink 
                    href={`/${link.toLowerCase()}`} 
                    className="text-white d-block py-1"
                  >
                    {link}
                  </CLink>
                </CListGroupItem>
              ))}
            </CListGroup>
          </CCol>

          {/* Contact Info Section */}
          <CCol xs={12} md={4} className="mb-4">
            <h3 className="h5 mb-3">Contact Info</h3>
            <p className="text-white">Email: info@betapms.com</p>
            <p className="text-white">Phone: +251-911-123 789</p>
            <p className="text-white">
              Address: 789 BetaPMS Avenue, Addis Ababa, Ethiopia
            </p>
            <div className="d-flex gap-3">
              {[
                { icon: <FaFacebookF />, link: "https://facebook.com" },
                { icon: <FaTwitter />, link: "https://twitter.com" },
                { icon: <FaLinkedinIn />, link: "https://linkedin.com" },
              ].map(({ icon, link }) => (
                <CLink 
                  key={link} 
                  href={link} 
                  className="text-white"
                  style={{ fontSize: '1.25rem' }}
                >
                  {icon}
                </CLink>
              ))}
            </div>
          </CCol>
        </CRow>

        <div className="border-top mt-4 pt-3 text-center">
          <p className="text-white">
            &copy; 2024 BetaPMS. All rights reserved.
          </p>
        </div>
      </CContainer>
    </CFooter>
  );
};

export default Footer;
