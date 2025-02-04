import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Page404.css';

// Import SVG Runner & Jump Line
// import { ReactComponent as RunnerSVG } from '../../../assets/images/runner.svg';
// import JumpLineSVG from '../../../assets/images/jump_line.svg';
// import RunnerSVG from '../../../assets/images/runner.svg';

import JumpLineSVG from '../../../assets/images/jump_line.svg';
import RunnerSVG from '../../../assets/images/runner.svg';




const Page404 = () => {
  const [isJumping, setIsJumping] = useState(false);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const navigate = useNavigate();

  // Handle jump animation
  const handleJump = () => {
    if (!isJumping && !isGameOver) {
      setIsJumping(true);
      setTimeout(() => {
        setIsJumping(false);
      }, 500);
    }
  };

  // Handle key press for jump
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.code === 'Space' || event.key === ' ') {
        event.preventDefault();
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

  // Collision Detection
  useEffect(() => {
    const detectCollision = () => {
      const dinoElement = document.querySelector('.dino');
      const jumpLineElement = document.querySelector('.jump-line');

      if (dinoElement && jumpLineElement) {
        const dinoRect = dinoElement.getBoundingClientRect();
        const jumpLineRect = jumpLineElement.getBoundingClientRect();

        if (
          dinoRect.right > jumpLineRect.left &&
          dinoRect.left < jumpLineRect.right &&
          dinoRect.bottom > jumpLineRect.top
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
        navigate('/login');
    };

  return (
    <div className="page404-container">
      <div className="ground" />
      <h1 className="error-text">404</h1>
      <p className="error-message">Oops! You're lost. The page you're looking for was not found.</p>
      <p className="instruction-text">Press the spacebar to make the runner jump!</p>
       
      <div className={`dino ${isJumping ? 'dino-jump' : ''}`}>
      <img src={RunnerSVG} alt="Runner" className="dino" />
      </div>
      <div className="jump-line">
      <img src={JumpLineSVG} alt="Jump Line" className="jump-line" />
      </div>
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