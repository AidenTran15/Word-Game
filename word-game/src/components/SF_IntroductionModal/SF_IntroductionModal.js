import React from 'react';
import './SF_IntroductionModal.css';

const IntroductionModal = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Welcome to the Synonym Finder Game!</h2>
        <p>
          In this game, you'll be given a word, and your goal is to choose the correct synonym from the options provided. 
          You'll have 45 seconds to answer as many questions as you can. Each correct answer will earn you a point.
        </p>
        <button onClick={onClose} className="modal-button">I Understand</button>
      </div>
    </div>
  );
};

export default IntroductionModal;
