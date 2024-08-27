import React from 'react';
import './DailyTalkIntroductionModal.css';

const DailyTalkIntroductionModal = ({ onClose }) => {
  return (
    <div className="modal-overlay-dt">
      <div className="modal-content-dt">
        <h2>Welcome to Daily Talk!</h2>
        <p>
          Generate a conversation that happens in daily life and have fun listening to it! 
          Each conversation is unique and engaging, featuring two characters, Aiden and Kaylee.
        </p>
        <button onClick={onClose} className="modal-button">Let's Start</button>
      </div>
    </div>
  );
};

export default DailyTalkIntroductionModal;
