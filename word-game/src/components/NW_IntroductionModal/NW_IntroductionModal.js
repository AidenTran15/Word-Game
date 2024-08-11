import React from 'react';
import './NW_IntroductionModal.css';

const NW_IntroductionModal = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Welcome to Next Word Game!</h2>
        <p>
          This is a fun game where you and the computer take turns to enter words.
          The next word must start with the last letter of the previous word. Try not to use the same word twice!
        </p>
        <button onClick={onClose} className="modal-button">I Understand</button>
      </div>
    </div>
  );
};

export default NW_IntroductionModal;
