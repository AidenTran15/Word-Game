import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './VocabularyCardPage.css';
import VCIntroductionModal from '../VC_IntroductionModal/VC_IntroductionModal';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import DefinitionModal from '../DefinitionModal/DefinitionModal';

const VocabularyCardPage = () => {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [loading, setLoading] = useState(false);
  const [usedWords, setUsedWords] = useState([]);
  const [showDefinitionModal, setShowDefinitionModal] = useState(false);
  const [selectedWord, setSelectedWord] = useState('');
  const [language, setLanguage] = useState('en');
  const [englishDefinition, setEnglishDefinition] = useState('');
  const [vietnameseDefinition, setVietnameseDefinition] = useState('');
  const [isFavorited, setIsFavorited] = useState(false);
  const [translatedWords, setTranslatedWords] = useState([]);

  useEffect(() => {
    if (selectedTopic) {
      fetchVocabularyWord(selectedTopic);
    }
  }, [selectedTopic]);

  const fetchVocabularyWord = async (topic) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/generate-vocabulary-word', { topic });
      setWord(response.data.word);
      setDefinition(response.data.englishDefinition);
      setEnglishDefinition(response.data.englishDefinition);
      setVietnameseDefinition(response.data.vietnameseDefinition || 'No Vietnamese definition available');
      setIsFlipped(false);
      setUsedWords((prevWords) => [...prevWords, response.data.word]);
      setTranslatedWords((prevWords) => [...prevWords, response.data.vietnameseWord || response.data.word]);
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
    await fetchVocabularyWord(selectedTopic);
  };

  const handleModalClose = (topic) => {
    setSelectedTopic(topic);
    setShowModal(false);
  };

  const handleStarClick = () => {
    setIsFavorited(!isFavorited);
  };

  const toggleLanguage = (e) => {
    e.stopPropagation(); // Prevent the card from flipping when the button is clicked
    const newLanguage = language === 'en' ? 'vi' : 'en';
    setLanguage(newLanguage);
    setDefinition(newLanguage === 'vi' ? vietnameseDefinition : englishDefinition);
  };

  const handleSpeak = (e) => {
    e.stopPropagation(); // Prevent card flip
    if (word) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US'; // Set the language to English
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleWordClick = async (word) => {
    try {
      const response = await axios.post('http://localhost:5000/validate-word', { word });
      const { englishDefinition, vietnameseDefinition } = response.data;

      setEnglishDefinition(englishDefinition);
      setVietnameseDefinition(vietnameseDefinition);
      setSelectedWord(word);
      setDefinition(englishDefinition);
      setShowDefinitionModal(true);
    } catch (error) {
      console.error('Error fetching definition:', error);
      setDefinition('No definition found.');
      setShowDefinitionModal(true);
    }
  };

  return (
    <>
      <Navbar />
      <div className="vocabulary-game-container">
        {showModal && <VCIntroductionModal onClose={handleModalClose} />}
        {!showModal && word && (
          <>
            <h1 className="vocabulary-card-title">Vocabulary Card</h1>

            <div className="vocabulary-card-container">
              <div className={`vocabulary-card ${isFlipped ? 'flipped' : ''}`} onClick={handleCardFlip}>
                <div className="card-front">
                  <div
                    className={`star-icon ${isFavorited ? 'favorited' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStarClick();
                    }}
                  >
                    ★
                  </div>
                  <h2 className="vocabulary-word">{word}</h2>
                  <i
                    className="fas fa-volume-up speaker-icon"
                    onClick={(e) => handleSpeak(e)} // Use the handleSpeak function
                  ></i>
                </div>
                <div className="card-back">
                  <p>{definition}</p>
                  <div className="language-toggle" onClick={(e) => toggleLanguage(e)}>
                    <span className={`toggle-option ${language === 'en' ? 'active' : ''}`}>EN</span>
                    <span className={`toggle-option ${language === 'vi' ? 'active' : ''}`}>VI</span>
                  </div>
                </div>
              </div>
              <button className="next-word-button" onClick={handleNextWord} disabled={loading}>
                {loading ? 'Loading...' : 'Next Word'}
              </button>
            </div>

            <div className="used-words-section">
              <h2>Vocabulary</h2>
              <p className="tip-text">
                <em>Tip: Click on the word to see the definition.</em>
              </p>
              <div className="words-grid">
                {[...Array(Math.ceil(usedWords.length / 20))].map((_, i) => (
                  <div key={i} className="words-column">
                    <ul>
                      {(language === 'en' ? usedWords : translatedWords).slice(i * 20, (i + 1) * 20).map((word, index) => (
                        <li key={index} onClick={() => handleWordClick(word)}>
                          {word}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
      {showDefinitionModal && (
        <DefinitionModal
          show={showDefinitionModal}
          onClose={() => setShowDefinitionModal(false)}
          definition={definition}
          selectedWord={selectedWord}
          language={language}
          toggleLanguage={toggleLanguage}
        />
      )}
    </>
  );
};

export default VocabularyCardPage;
