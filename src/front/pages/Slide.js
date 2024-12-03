import React from 'react';
import { CCarouselItem, CCarouselCaption, CButton } from '@coreui/react';
import { FaArrowRight } from 'react-icons/fa';

const Slide = ({ image, title, description, link }) => {
  return (
    <CCarouselItem>
      <img className="d-block w-100" src={image.src} alt={title} />
      <CCarouselCaption className="d-none d-md-block">
        <h3>{title}</h3>
        <p>{description}</p>
        <CButton color="primary" href={link}>
          Learn More <FaArrowRight className="ml-2" />
        </CButton>
      </CCarouselCaption>
    </CCarouselItem>
  );
};

export default Slide;