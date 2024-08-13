import React, { useState } from 'react';
import './SF_IntroductionModal.css';

const IntroductionModal = ({ onClose, onSelectLevel }) => {
  const [selectedLevel, setSelectedLevel] = useState('easy');

  const handleLevelChange = (e) => {
    setSelectedLevel(e.target.value);
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
          You'll have 45 seconds to answer as many questions as you can. Each correct answer will earn you a point.
        </p>
        <div className="level-selection">
          <label>Select your difficulty level:</label>
          <select value={selectedLevel} onChange={handleLevelChange}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <button onClick={handleStartGame} className="modal-button">Start Game</button>
      </div>
    </div>
  );
};

export default IntroductionModal;
