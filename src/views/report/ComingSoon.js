import React, { useState, useEffect } from 'react';
import './ComingSoon.css'; // Keep your CSS file or update as you prefer
import { FaRocket, FaEnvelope, FaBell } from 'react-icons/fa'; // Icons for flair

const ComingSoon = () => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [subscriptionMessage, setSubscriptionMessage] = useState('');


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

    const handleInputChange = (event) => {
        const { value } = event.target;
        setEmail(value);
        // Simple email validation
        setIsEmailValid(/^\S+@\S+\.\S+$/.test(value));
      };

    const handleSubscription = (event) => {
        event.preventDefault();
        if (isEmailValid) {
            setSubscriptionMessage('Thank you for subscribing! We will notify you when it will be ready.');
             setTimeout(() => {
                setSubscriptionMessage(''); // Clear message after a few seconds
                setEmail('');
             }, 5000);
        }
         else {
            setSubscriptionMessage('Please enter a valid email address.');
         }
    }

  const timeComponents = Object.keys(timeLeft).map((interval) => (
     <div key={interval} className="time-box">
        <span className="time-value">{timeLeft[interval] || 0}</span>
         <span className="time-label">{interval.toUpperCase()}</span>
     </div>
  ));

  return (
      <div className="coming-soon">
          <div className="content">
              <div className="logo-container"> {/* Container for logo and icon */}
                <FaRocket className="logo-icon" />
                <h1 className="title">We're Launching Soon</h1>
              </div>
               <p className="subtitle">
                 The Report Page is under construction. We're working hard to launch soon. Stay tuned!
               </p>
               <div className="timer-container"> {/* Container for timer */}
                   {timeComponents}
                </div>
              <form className="subscribe-form" onSubmit={handleSubscription}>
                  <div className="input-container"> {/* Container for input and icon */}
                    <FaEnvelope className="input-icon" />
                    <input
                         type="email"
                         placeholder="Enter your email"
                         className={`email-input ${!isEmailValid && 'input-error'}`}
                         value={email}
                         onChange={handleInputChange}
                         required
                     />
                   </div>
                  <button type="submit" className="subscribe-button">
                      <FaBell className="button-icon"/> Notify Me
                  </button>
               </form>
                 {subscriptionMessage && <p className="message">{subscriptionMessage}</p>}
           </div>
       </div>
  );
};

export default ComingSoon;