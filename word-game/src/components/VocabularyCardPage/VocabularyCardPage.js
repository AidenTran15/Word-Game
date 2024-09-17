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
  const [vietnameseWord, setVietnameseWord] = useState(''); // Add this to hold the Vietnamese translation of the word
  const [isFavorited, setIsFavorited] = useState(false);
  const [translatedWords, setTranslatedWords] = useState([]);

  useEffect(() => {
    if (selectedTopic) {
      fetchVocabularyWord(selectedTopic);
    }
  }, [selectedTopic]);

  useEffect(() => {
    setupSwipeDetection();
  }, [word]);

  const fetchVocabularyWord = async (topic) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/generate-vocabulary-word', { topic });
      setWord(response.data.word);
      setDefinition(response.data.englishDefinition);
      setEnglishDefinition(response.data.englishDefinition);
      setVietnameseDefinition(response.data.vietnameseDefinition || 'No Vietnamese definition available');
      setVietnameseWord(response.data.vietnameseWord || 'No Vietnamese word available'); // Store the Vietnamese word
      setIsFlipped(false);
      setUsedWords((prevWords) => [...prevWords, response.data.word]);
      setTranslatedWords((prevWords) => [...prevWords, response.data.vietnameseWord || response.data.word]);
    } catch (error) {
      console.error('Error fetching vocabulary word:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupSwipeDetection = () => {
    const card = document.querySelector('.vocabulary-card');

    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchMove = (e) => {
      touchEndX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = () => {
      if (touchStartX - touchEndX > 50) {
        // Swipe left
        console.log("Swipe left ignored");
      }

      if (touchEndX - touchStartX > 50) {
        // Swipe right - Load next word
        handleNextWord();
      }
    };

    if (card) {
      card.addEventListener('touchstart', handleTouchStart);
      card.addEventListener('touchmove', handleTouchMove);
      card.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      if (card) {
        card.removeEventListener('touchstart', handleTouchStart);
        card.removeEventListener('touchmove', handleTouchMove);
        card.removeEventListener('touchend', handleTouchEnd);
      }
    };
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

  const toggleLanguage = async (e) => {
    e.stopPropagation(); // Prevent the card from flipping when clicking the language toggle
  
    const newLanguage = language === 'en' ? 'vi' : 'en';
    setLanguage(newLanguage);
  
    if (newLanguage === 'vi') {
      // If switching to Vietnamese, fetch the Vietnamese word
      if (!vietnameseWord || vietnameseWord === 'No Vietnamese word available') {
        try {
          const response = await axios.post('http://localhost:5000/translate-word', { word });
          console.log('Translation API response:', response.data); // Debugging the API response
  
          if (response.data && response.data.vietnameseTranslation) {
            setVietnameseWord(response.data.vietnameseTranslation);
            setDefinition(response.data.vietnameseTranslation);
          } else {
            setVietnameseWord('No Vietnamese word available');
            setDefinition('No Vietnamese word available');
          }
        } catch (error) {
          console.error('Error fetching Vietnamese word:', error);
          setVietnameseWord('No Vietnamese word available');
          setDefinition('No Vietnamese word available');
        }
      } else {
        // If Vietnamese word is already fetched, just set it
        setDefinition(vietnameseWord);
      }
    } else {
      // If switching back to English, display the English word
      setDefinition(englishDefinition);
    }
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
                      e.stopPropagation(); // Prevent card flip when clicking the star icon
                      handleStarClick();
                    }}
                  >
                    ★
                  </div>
                  <h2 className="vocabulary-word">{word}</h2>
                  <i
                    className="fas fa-volume-up speaker-icon"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card flip when clicking the speaker icon
                      handleSpeak(e);
                    }}
                  ></i>
                </div>
                <div className="card-back">
                  <p>{definition}</p>
                  <div className="language-toggle" onClick={(e) => {
                    e.stopPropagation(); // Prevent card flip when clicking the language toggle
                    toggleLanguage(e);
                  }}>
                    <span className={`toggle-option ${language === 'en' ? 'active' : ''}`}>EN</span>
                    <span className={`toggle-option ${language === 'vi' ? 'active' : ''}`}>VI</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Word Button */}
            <button 
              className="next-word-button" 
              onClick={handleNextWord} 
              onTouchStart={handleNextWord} // Add touch event handler
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Next Word'}
            </button>

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
