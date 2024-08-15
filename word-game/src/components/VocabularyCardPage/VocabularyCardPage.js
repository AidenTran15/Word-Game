import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './VocabularyCardPage.css';
import VCIntroductionModal from '../VC_IntroductionModal/VC_IntroductionModal';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const VocabularyCardPage = () => {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isInitialModal, setIsInitialModal] = useState(true);  // New state to track initial modal display

  useEffect(() => {
    if (selectedTopic) {
      console.log("Fetching first word for the selected topic:", selectedTopic);
      fetchVocabularyWord(selectedTopic);
    }
  }, [selectedTopic]);

  const fetchVocabularyWord = async (topic) => {
    console.log("Fetching word for topic:", topic);
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/generate-vocabulary-word', { topic });
      console.log("Fetched word:", response.data.word);
      setWord(response.data.word);
      setDefinition(response.data.englishDefinition);
      setIsFlipped(false);
    } catch (error) {
      console.error('Error fetching vocabulary word:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNextWord = async () => {
    console.log("Fetching next word for topic:", selectedTopic);
    await fetchVocabularyWord(selectedTopic);
  };

  const handleModalClose = (topic) => {
    console.log("Selected topic:", topic);
    setSelectedTopic(topic);
    setShowModal(false);
    setIsInitialModal(false);  // Set to false after the first time
  };

  const handleChangeTopic = () => {
    setShowModal(true);
  };

  return (
    <>
      <Navbar />
      <div className="vocabulary-game-container">
        {showModal && (
          <VCIntroductionModal 
            onClose={handleModalClose} 
            isInitialModal={isInitialModal} 
          />
        )}

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
              <button 
                className="next-word-button" 
                onClick={handleNextWord}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Next Word'}
              </button>
            </div>
            <button 
              className="change-topic-button" 
              onClick={handleChangeTopic}
            >
              Change Topic
            </button>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default VocabularyCardPage;
