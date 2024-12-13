import React from 'react';
import '../btn.scss';

const FlipButton = ({ frontText, backText, onClick }) => {
  return (
    <a href="#" className="btn-flip" data-front={frontText} data-back={backText} onClick={onClick}></a>
  );
};

export default FlipButton;
