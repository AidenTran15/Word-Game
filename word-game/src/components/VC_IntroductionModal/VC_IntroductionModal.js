import React, { useState } from 'react';
import './VC_IntroductionModal.css';

// Import your local images
import travelImage from '../../assets/travel.png';
import schoolImage from '../../assets/school.png';  
import occupationImage from '../../assets/occupation.png';  
import airportImage from '../../assets/airport.png'; 
import animalsImage from '../../assets/animals.png';  
import weatherImage from '../../assets/weather.png';  
import transportationImage from '../../assets/transportation.png';  
import sportsImage from '../../assets/sports.png';  
import hobbiesImage from '../../assets/hobbies.png';  
import emotionImage from '../../assets/emotion.png'; 
import healthImage from '../../assets/health.png';  
import hospitalityImage from '../../assets/hospitality.png';  

const topics = [
  { name: 'Travel', image: travelImage },
  { name: 'School', image: schoolImage },
  { name: 'Occupation', image: occupationImage },
  { name: 'Airport', image: airportImage },
  { name: 'Animals', image: animalsImage },
  { name: 'Weather', image: weatherImage },
  { name: 'Transportation', image: transportationImage },
  { name: 'Sports', image: sportsImage },
  { name: 'Hobbies', image: hobbiesImage },
  { name: 'Emotion', image: emotionImage },
  { name: 'Health', image: healthImage },
  { name: 'Hospitality', image: hospitalityImage },
];

const VCIntroductionModal = ({ onClose, isInitialModal }) => {
  const [selectedTopic, setSelectedTopic] = useState('');

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    onClose(topic); // Immediately start the game when a topic is selected
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
      </div>
    </div>
  );
};

export default VCIntroductionModal;
