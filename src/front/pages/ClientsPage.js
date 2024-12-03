import React, { useState, useEffect, useRef } from 'react';
import {
  CContainer,
  CRow,
  CCol,
  CButton,
  CCard,
  CCardBody,
  CCardTitle,
  CCardText,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
} from '@coreui/react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([
    {
      _id: '1',
      name: 'Sample Company 1',
      description: 'This is a sample company.',
      logoUrl: 'sample-logo.jpg',
      category: 'Tech',
      subcategory: ['Software'],
      status: 'Active',
      website: 'https://www.example.com',
      socialMedia: {
        facebook: 'https://facebook.com/samplecompany1',
        twitter: 'https://twitter.com/samplecompany1',
        linkedin: 'https://linkedin.com/samplecompany1',
        instagram: 'https://instagram.com/samplecompany1',
      },
      contactPerson: {
        name: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '123-456-7890',
      },
    },
  ]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [companiesPerPage] = useState(9);
  const [showModal, setShowModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    const filtered = companies.filter((company) => {
      const matchesSearch =
        !searchQuery ||
        (company.name &&
          company.name.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSearch;
    });
    setFilteredCompanies(filtered);
  }, [searchQuery, companies]);

  const indexOfLastCompany = currentPage * companiesPerPage;
  const indexOfFirstCompany = indexOfLastCompany - companiesPerPage;
  const currentCompanies = filteredCompanies.slice(
    indexOfFirstCompany,
    indexOfLastCompany
  );

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handleShowModal = (company) => {
    setSelectedCompany(company);
    setShowModal(true);
  };
  const handleCloseModal = () => setShowModal(false);

  return (
    <div>
      <Navbar/>
      <div className="position-relative h-60">
        <div
          className="absolute-full w-100 h-100 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              'url(https://png.pngtree.com/thumb_back/fw800/background/20220217/pngtree-simple-atmosphere-black-line-promotion-background-image_954276.jpg)',
          }}
        >
          <div className="absolute-full bg-black opacity-50"></div>
          <h1 className="text-4xl font-bold text-white position-relative z-10 d-flex justify-content-center align-items-center h-100 font-poppins">
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              CLIENTS
            </motion.div>
          </h1>
        </div>
      </div>

      <CContainer className="p-4">
        <CRow>
          <CCol md={3}>
            <CFormInput
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search companies..."
            />
          </CCol>
        </CRow>

        <CRow className="mt-4">
          {currentCompanies.map((company) => (
            <CCol sm={12} md={6} lg={4} key={company._id} className="mb-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                onClick={() => handleShowModal(company)}
              >
                <CCard className="h-100">
                  <img
                    src={company.logoUrl}
                    alt={company.name}
                    className="w-100 h-50 object-cover"
                  />
                  <CCardBody>
                    <CCardTitle>{company.name}</CCardTitle>
                    <CCardText>{company.description}</CCardText>
                    <div className="d-flex justify-content-center mt-2">
                      <CheckCircleIcon className="w-6 h-6 text-green-500" />
                      <span className="ml-2 text-green-500">
                        {company.status}
                      </span>
                    </div>
                  </CCardBody>
                </CCard>
              </motion.div>
            </CCol>
          ))}
        </CRow>

        <CRow className="justify-content-center mt-4">
          <ul className="pagination">
            {Array.from(
              { length: Math.ceil(filteredCompanies.length / companiesPerPage) },
              (_, i) => (
                <li key={i} className="page-item">
                  <CButton
                    onClick={() => handlePageChange(i + 1)}
                    color={currentPage === i + 1 ? 'primary' : 'secondary'}
                    className="mx-1"
                  >
                    {i + 1}
                  </CButton>
                </li>
              )
            )}
          </ul>
        </CRow>
      </CContainer>

      <CModal visible={showModal} onClose={handleCloseModal}>
        <CModalHeader>
          <CModalTitle>{selectedCompany?.name}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedCompany && (
            <>
              <img
                src={selectedCompany.logoUrl}
                className="w-100 h-50 object-cover mb-3"
                alt={selectedCompany.name}
              />
              <p>
                <strong>Category:</strong> {selectedCompany.category}
              </p>
              <p>
                <strong>Website:</strong>{' '}
                <a
                  href={selectedCompany.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {selectedCompany.website}
                </a>
              </p>
              <h5>Social Media Links</h5>
              <p>
                <strong>Facebook:</strong>{' '}
                <a href={selectedCompany.socialMedia.facebook}>
                  {selectedCompany.socialMedia.facebook}
                </a>
              </p>
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCloseModal}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
      <Footer/>
    </div>
  );
};

export default CompaniesPage;