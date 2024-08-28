import React from 'react';
import './DailyTalkIntroductionModal.css';

const DailyTalkIntroductionModal = ({ onClose }) => {
  return (
    <div className="modal-overlay-dt">
      <div className="modal-content-dt">
        <h2>Welcome to Daily Talk!</h2>
        <p>
        Start a new and exciting conversation with Aiden and Kaylee! Each chat brings something different, full of fun and easy to listen to. It's a simple way to enjoy everyday moments.
        </p>
        <button onClick={onClose} className="modal-button">Let's Start</button>
      </div>
    </div>
  );
};

export default DailyTalkIntroductionModal;
