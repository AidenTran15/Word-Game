import React, { useState } from 'react';
import './DailyTalkIntroductionModal.css';

const DailyTalkIntroductionModal = ({ onClose }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => {
      onClose();
      setLoading(false); 
    }, 2000); 
  };

  return (
    <div className="modal-overlay-dt">
      <div className="modal-content-dt">
        <h2>Welcome to Daily Talk!</h2>
        <p>
          Start a new and exciting conversation with Aiden and Kaylee! Each chat brings something different, full of fun and easy to listen to. It's a simple way to enjoy everyday moments.
        </p>
        <button onClick={handleClick} className="modal-button" disabled={loading}>
          {loading ? <div className="spinner-dt"></div> : "Let's Start"}
        </button>
      </div>
    </div>
  );
};

export default DailyTalkIntroductionModal;
