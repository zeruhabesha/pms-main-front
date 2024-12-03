import React, { useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';

const AnimatedIcon = ({ link }) => {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 300); // Reset the animation after 300ms
  };

  return (
    <a
      href={link}
      className="bg-blue-600 px-4 py-2 no-underline rounded text-white hover:bg-blue-700 flex items-center justify-center"
      onClick={handleClick}
    >
      <FaArrowRight className={`transition-transform duration-300 ${clicked ? 'scale-125' : 'scale-100'}`} />
    </a>
  );
};

export default AnimatedIcon;
