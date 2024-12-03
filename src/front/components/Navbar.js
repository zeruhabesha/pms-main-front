import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import './CustomNavbar.css'; // Import the custom CSS file

const CustomNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`navbar1 ${scrolled ? 'scrolled' : ''}`}>
      <div className="container1">
        <Link to="/" className="navbar1-brand">
          BETA PMS
        </Link>
        <div className="navbar1-toggle" onClick={toggleMenu}>
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </div>
        <div className={`navbar1-collapse ${isOpen ? 'show' : ''}`}>
        <ul className="navbar1-nav">
  {['/', '/about', '/clients', '/service', '/contact', '/login'].map((path, index) => {
    const labels = ['Home', 'About', 'Clients', 'Service', 'Contact', 'Login'];
    return (
      <li key={index} className="nav1-item">
        <Link to={path} className="nav1-link">
          {labels[index]}
        </Link>
        {/* Tooltip element */}
        <span className="tooltip1">{labels[index]} Tooltip</span>
      </li>
    );
  })}
</ul>
        </div>
      </div>
    </nav>
  );
};

export default CustomNavbar;
