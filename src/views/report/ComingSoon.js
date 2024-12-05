import React, { useState, useEffect } from 'react';
import './ComingSoon.css';

const ComingSoon = () => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  // Function to calculate the remaining time
  function calculateTimeLeft() {
    const targetDate = new Date('2024-12-31T00:00:00'); // Set your target date here
    const now = new Date();
    const difference = targetDate - now;

    let timeLeft = {};
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  }

  // Update the timer every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer); // Cleanup the interval
  }, []);

  const timeComponents = Object.keys(timeLeft).map((interval) => (
    <div key={interval} className="time-box">
      <span className="time-value">{timeLeft[interval] || 0}</span>
      <span className="time-label">{interval.toUpperCase()}</span>
    </div>
  ));

  return (
    <div className="coming-soon">
      <div className="content">
        <div className="logo">🚀</div>
        <h1>We're Coming Soon</h1>
        <p>
          The Report Page is under construction. We're working hard to launch soon. Stay tuned!
        </p>
        <div className="timer">{timeComponents}</div>
        <form className="subscribe-form">
          <input
            type="email"
            placeholder="Enter your email"
            className="email-input"
            required
          />
          <button type="submit" className="subscribe-button">
            Notify Me
          </button>
        </form>
      </div>
    </div>
  );
};

export default ComingSoon;
