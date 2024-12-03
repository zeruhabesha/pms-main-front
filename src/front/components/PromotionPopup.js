import React, { useState, useEffect } from 'react';
import './PromotionPopup.css'; // For custom styling

const PromotionPopup = ({ title, description, onClose, duration = 10 }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft === 0) {
      onClose(); // Automatically close the popup when time is up
    }

    // Timer logic
    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => Math.max(prevTime - 1, 0));
    }, 1000);

    return () => clearInterval(timerId); // Clean up the interval on component unmount
  }, [timeLeft, onClose]);

  return (
    <div className="promotion-popup">
      <div className="popup-content">
        <div className="timer">Time left: {timeLeft} seconds</div>
        <h2>{title}</h2>
        <p>{description}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default PromotionPopup;
