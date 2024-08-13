import React, { useState } from 'react';
import './VC_IntroductionModal.css';  // Assuming the path is correct

const VCIntroductionModal = ({ onClose }) => {
  const [selectedTopic, setSelectedTopic] = useState('');

  const handleTopicChange = (event) => {
    setSelectedTopic(event.target.value);
  };

  const handleStartGame = () => {
    if (selectedTopic) {
      onClose(selectedTopic);
    } else {
      alert("Please select a topic to start the game.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content-nw">
        <h2>Welcome to Vocabulary Card Game!</h2>
        <p>
          In this game, you'll learn new words related to a specific topic. 
          Each card will show a word, and you can flip it to see its definition.
          Select a topic to get started!
        </p>
        <div className="topic-selection">
          <h2>Select your topic</h2>
          <select value={selectedTopic} onChange={handleTopicChange} className="topic-dropdown">
            <option value="" disabled>Select a topic</option>
            <option value="Travel">Travel</option>
            <option value="School">School</option>
            <option value="Fruit">Fruit</option>
            <option value="Supermarket">Supermarket</option>
            <option value="Occupation">Occupation</option>
            <option value="Airport">Airport</option>
            <option value="Animals">Animals</option>
            <option value="Weather">Weather</option>
            <option value="Transportation">Transportation</option>
            <option value="Sports">Sports</option>
            <option value="Hobbies">Hobbies</option>
            <option value="Emotion">Emotion</option>
            <option value="Shopping">Shopping</option>
            <option value="Health">Health</option>
            <option value="Hospitality">Hospitality</option>
            <option value="Restaurant">Restaurant</option>
          </select>
        </div>
        <button onClick={handleStartGame} className="modal-button">Start Game</button>
      </div>
    </div>
  );
};

export default VCIntroductionModal;
