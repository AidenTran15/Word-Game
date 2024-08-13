import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './VocabularyCardPage.css';
import VC_IntroductionModal from '../VC_IntroductionModal/VC_IntroductionModal';
import Navbar from '../Navbar/Navbar'; // Import Navbar
import Footer from '../Footer/Footer'; // Import Footer

const VocabularyCardPage = () => {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
  const [showModal, setShowModal] = useState(true); // State to control modal visibility

  const handleTopicSelect = async (topic) => {
    setSelectedTopic(topic);
    await fetchVocabularyWord(topic);
  };

  const fetchVocabularyWord = async (topic) => {
    try {
      const response = await axios.post('http://localhost:5000/generate-vocabulary-word', { topic });
      setWord(response.data.word);
      setDefinition(response.data.englishDefinition);
      setIsFlipped(false);
    } catch (error) {
      console.error('Error fetching vocabulary word:', error);
    }
  };

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNextWord = async () => {
    await fetchVocabularyWord(selectedTopic);
  };

  const handleModalClose = (topic) => {
    setSelectedTopic(topic);
    setShowModal(false); // Close the modal
    fetchVocabularyWord(topic); // Fetch the first word for the selected topic
  };

  return (
    <>
      <Navbar /> {/* Add Navbar here */}
      <div className="vocabulary-game-container">
        {showModal && <VC_IntroductionModal onClose={handleModalClose} onSelectTopic={setSelectedTopic} />}
        
        {!showModal && word && (
          <>
            <h1>Vocabulary Card Game</h1>
            <div className="vocabulary-card-container">
              <div 
                className={`vocabulary-card ${isFlipped ? 'flipped' : ''}`} 
                onClick={handleCardFlip}
              >
                <div className="card-front">
                  <h2>{word}</h2>
                </div>
                <div className="card-back">
                  <p>{definition}</p>
                </div>
              </div>
              <button className="next-word-button" onClick={handleNextWord}>Next Word</button>
            </div>
          </>
        )}
      </div>
      <Footer /> {/* Add Footer here */}
    </>
  );
};

export default VocabularyCardPage;
