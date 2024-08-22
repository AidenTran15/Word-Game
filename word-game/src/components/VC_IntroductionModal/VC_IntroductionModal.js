import React, { useState } from 'react';
import './VC_IntroductionModal.css';  // Assuming the path is correct

const topics = [
  { name: 'Travel', image: 'travel.jpg' },
  { name: 'School', image: 'school.jpg' },
  { name: 'Supermarket', image: 'supermarket.jpg' },
  { name: 'Occupation', image: 'occupation.jpg' },
  { name: 'Airport', image: 'airport.jpg' },
  { name: 'Animals', image: 'animals.jpg' },
  { name: 'Weather', image: 'weather.jpg' },
  { name: 'Transportation', image: 'transportation.jpg' },
  { name: 'Sports', image: 'sports.jpg' },
  { name: 'Hobbies', image: 'hobbies.jpg' },
  { name: 'Emotion', image: 'emotion.jpg' },
  { name: 'Shopping', image: 'shopping.jpg' },
  { name: 'Health', image: 'health.jpg' },
  { name: 'Hospitality', image: 'hospitality.jpg' },
  { name: 'Restaurant', image: 'restaurant.jpg' }
];

const VCIntroductionModal = ({ onClose, isInitialModal }) => {
  const [selectedTopic, setSelectedTopic] = useState('');

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
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
      <div className="modal-content-expanded">
        {isInitialModal && (
          <>
            <h2>Welcome to Vocabulary Card Game!</h2>
            <p>
              In this game, you'll learn new words related to a specific topic.
              Each card will show a word, and you can flip it to see its definition.
              Select a topic to get started!
            </p>
          </>
        )}
        <div className="topic-selection">
          <h2>{isInitialModal ? 'Select your topic' : 'Select the topic'}</h2>
          <div className="topic-buttons">
            {topics.map((topic) => (
              <button
                key={topic.name}
                className={`topic-button ${selectedTopic === topic.name ? 'selected' : ''}`}
                style={{ backgroundImage: `url(${topic.image})` }}
                onClick={() => handleTopicSelect(topic.name)}
              >
                {topic.name}
              </button>
            ))}
          </div>
        </div>
        <button onClick={handleStartGame} className="modal-button">
          {isInitialModal ? 'Start Game' : 'Change Topic'}
        </button>
      </div>
    </div>
  );
};

export default VCIntroductionModal;
