// IntroductionModal.js
import React from 'react';
import './SF_IntroductionModal.css';

const IntroductionModal = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Welcome to the Synonym Finder Game!</h2>
        <p>
          In this game, you'll be given a word, and your goal is to choose the correct synonym from the options provided. 
          If you choose the correct synonym, you'll receive positive feedback. If not, the correct answer will be shown to you.
        </p>
        <p>Are you ready to test your vocabulary skills?</p>
        <button onClick={onClose} className="modal-button">I Understand</button>
      </div>
    </div>
  );
};

export default IntroductionModal;
