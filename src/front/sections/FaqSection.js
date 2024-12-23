import React, { useState } from 'react';
import styled from 'styled-components';
import { CContainer, CRow, CCol } from '@coreui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { BiChevronRight } from 'react-icons/bi';

const FaqSectionWrapper = styled.section`
  padding: 3rem 0;
  overflow: hidden; /* To prevent potential overlapping of animations */
`;

const SectionTitleContainer = styled(CContainer)`
  margin-bottom: 2rem;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #2d3748; /* Darker text color */
`;

const SectionSubtitle = styled.p`
  color: #718096; /* Muted text color */
  font-size: 1rem;
`;


const FaqItemsContainer = styled(CContainer)`
`;

const FaqRow = styled(CRow)`
    justify-content: center;
`;

const FaqCol = styled(CCol)`
`;

const FaqList = styled.div`
   display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;


const FaqItemWrapper = styled(motion.div)`
     border: 1px solid ${({ isActive }) => (isActive ? '#2487ce' : '#ddd')};
     border-radius: 8px;
    padding: 1rem 1.5rem;
    background-color: ${({ isActive }) => (isActive ? '#e8f4fc' : '#fff')};
    position: relative;
    cursor: pointer;
    transition: all 0.3s ease;
`;



const FaqQuestion = styled.h3`
    font-size: 1.2rem;
    font-weight: bold;
    color: ${({ isActive }) => (isActive ? '#2487ce' : '#333')};
    margin-bottom: ${({ isActive }) => (isActive ? '0.5rem' : '0')};
    transition: color 0.3s ease;
`;

const FaqAnswer = styled(motion.div)`
    margin-top: 0.5rem;
    color: #555;
    font-size: 0.95rem;
    overflow: hidden;
`;

const ToggleIcon = styled(BiChevronRight)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
  color: ${({ isActive }) => (isActive ? '#2487ce' : '#aaa')};
  transition: transform 0.3s ease, color 0.3s ease;
    transform: ${({ isActive }) => (isActive ? 'rotate(90deg)' : 'rotate(0)')};
`;



const FaqSection = () => {
    const faqData = [
        {
            id: 1,
            question: 'How can I add a new property to the system?',
            answer:
              'Go to the Property Management section, enter the property details, and upload relevant media like images and floor plans.',
          },
          {
            id: 2,
            question: 'Do tenants have access to their lease agreements?',
            answer:
              'Yes, tenants can view and electronically sign their lease agreements through their dedicated portal.',
          },
          {
            id: 3,
            question: 'What actions are taken for overdue payments?',
            answer:
              'Automated reminders are sent to the tenant, and late fees can be applied if necessary.',
          },
          {
            id: 4,
            question: 'How are maintenance requests processed?',
            answer:
              'Tenants can submit maintenance requests, which are then reviewed and assigned to the appropriate staff for resolution.',
          },
    ];

  const [activeId, setActiveId] = useState(null);

  const toggleFaq = (id) => {
    setActiveId((prevId) => (prevId === id ? null : id));
  };

  const itemVariants = {
      open: {  height: 'auto', opacity: 1, },
      closed: { height: 0, opacity: 0 },
  }

  return (
    <FaqSectionWrapper id="faq">
      <SectionTitleContainer>
        <SectionTitle>Frequently Asked Questions</SectionTitle>
        <SectionSubtitle>
          Necessitatibus eius consequatur ex aliquid fuga eum quidem sint consectetur velit
        </SectionSubtitle>
      </SectionTitleContainer>

       <FaqItemsContainer>
            <FaqRow>
                <FaqCol lg={10}>
                    <FaqList>
                        {faqData.map((faq) => (
                         <FaqItemWrapper
                            key={faq.id}
                            onClick={() => toggleFaq(faq.id)}
                             isActive={activeId === faq.id}
                             whileHover={{ scale: 1.02 }}
                               whileTap={{ scale: 0.98 }}
                            >
                              <FaqQuestion  isActive={activeId === faq.id} >
                                {faq.question}
                            </FaqQuestion>
                             <AnimatePresence>
                                 {activeId === faq.id && (
                                     <FaqAnswer
                                         variants={itemVariants}
                                        initial="closed"
                                         animate="open"
                                        exit="closed"
                                     >
                                        {faq.answer}
                                    </FaqAnswer>
                                 )}
                             </AnimatePresence>
                                 <ToggleIcon isActive={activeId === faq.id} />
                        </FaqItemWrapper>
                      ))}
                  </FaqList>
            </FaqCol>
      </FaqRow>
    </FaqItemsContainer>
    </FaqSectionWrapper>
  );
};

export default FaqSection;