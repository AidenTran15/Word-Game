import React, { useState } from 'react';
import './SF_IntroductionModal.css';

const IntroductionModal = ({ onClose, onSelectLevel }) => {
  const [selectedLevel, setSelectedLevel] = useState('easy');

  const handleLevelChange = (level) => {
    setSelectedLevel(level);
  };

  const handleStartGame = () => {
    onSelectLevel(selectedLevel);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content-nw">
        <h2>Welcome to Synonym Finder Game!</h2>
        <p>
          In this game, you'll be given a word, and your goal is to choose the correct synonym from the options provided.
          You'll have 60 seconds to answer as many questions as you can. Each correct answer will earn you a point.
        </p>
        <div className="lmodal-content-nw">
          <h2>Select your difficulty level</h2>
          <div className="level-buttons">
            <button
              className={`level-button ${selectedLevel === 'easy' ? 'active' : ''}`}
              onClick={() => handleLevelChange('easy')}
            >
              Easy
            </button>
            <button
              className={`level-button ${selectedLevel === 'medium' ? 'active' : ''}`}
              onClick={() => handleLevelChange('medium')}
            >
              Medium
            </button>
            <button
              className={`level-button ${selectedLevel === 'hard' ? 'active' : ''}`}
              onClick={() => handleLevelChange('hard')}
            >
              Hard
            </button>
          </div>
        </div>
        <button onClick={handleStartGame} className="modal-button">Start Game</button>
      </div>
    </div>
  );
};

export default IntroductionModal;
