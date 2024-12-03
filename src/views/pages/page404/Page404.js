import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook for navigation
import './Page404.css'; // CSS file for animations

const Page404 = () => {
  const [isJumping, setIsJumping] = useState(false);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const navigate = useNavigate(); // Hook to navigate to different routes

  // Handle jump animation
  const handleJump = () => {
    if (!isJumping && !isGameOver) {
      setIsJumping(true);
      setTimeout(() => {
        setIsJumping(false);
      }, 500); // Dino stays "up" for 500ms
    }
  };

  // Handle key press for jump (spacebar)
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.code === 'Space' || event.key === ' ') {
        event.preventDefault(); // Prevent default spacebar action (scrolling)
        handleJump();
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isJumping, isGameOver]);

  // Increase score every second if the game is not over
  useEffect(() => {
    let scoreInterval;
    if (!isGameOver) {
      scoreInterval = setInterval(() => {
        setScore((prevScore) => prevScore + 1);
      }, 100);
    }

    return () => clearInterval(scoreInterval);
  }, [isGameOver]);

  // Handle collision detection
  useEffect(() => {
    const detectCollision = () => {
      const dinoElement = document.querySelector('.dino');
      const cactusElement = document.querySelector('.cactus');

      if (dinoElement && cactusElement) {
        const dinoRect = dinoElement.getBoundingClientRect();
        const cactusRect = cactusElement.getBoundingClientRect();

        if (
          dinoRect.right > cactusRect.left &&
          dinoRect.left < cactusRect.right &&
          dinoRect.bottom > cactusRect.top
        ) {
          setIsGameOver(true);
        }
      }
    };

    const collisionInterval = setInterval(detectCollision, 50);

    return () => clearInterval(collisionInterval);
  }, []);

  const handleRestart = () => {
    setIsGameOver(false);
    setScore(0);
  };

  const handleGoToLogin = () => {
    navigate('/login'); // Navigate to the login page
  };

  return (
    <div className="page404-container">
      <div className="ground" />
      <h1 className="error-text">404</h1>
      <p className="error-message">Oops! You're lost. The page you're looking for was not found.</p>
      <p className="instruction-text">Press the spacebar to make the dino jump!</p>
     
      <div className={`dino ${isJumping ? 'dino-jump' : ''}`} />
      <div className="cactus" />
      <div className="score">Score: {score}</div>

      {isGameOver && (
        <div className="game-over">
          <h2>Game Over</h2>
          <button style={{display:`inline`}} onClick={handleRestart} className="restart-btn">
            Restart
          </button>
          <button  onClick={handleGoToLogin} className="login-btn">
            Go to Login
          </button>
        </div>
      )}
    </div>
  );
};

export default Page404;
