import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './VocabularyCardPage.css';
import VCIntroductionModal from '../VC_IntroductionModal/VC_IntroductionModal';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import DefinitionModal from '../DefinitionModal/DefinitionModal'; // Import your DefinitionModal

const VocabularyCardPage = () => {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [loading, setLoading] = useState(false);
  const [usedWords, setUsedWords] = useState([]); // Store used words
  const [showDefinitionModal, setShowDefinitionModal] = useState(false); // State to control the definition modal
  const [selectedWord, setSelectedWord] = useState(''); // Store the word clicked

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
      setIsFlipped(false);
      setUsedWords([...usedWords, response.data.word]); // Update used words
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

  // Handle when a word is clicked
  const handleWordClick = async (word) => {
    try {
      const response = await axios.post('https://apiwordgame.aidenkiettran.com/validate-word', { word });
      setSelectedWord(word);
      setDefinition(response.data.englishDefinition || 'No definition found.');
      setShowDefinitionModal(true); // Show the definition modal
    } catch (error) {
      console.error('Error fetching definition:', error);
      setDefinition('No definition found.');
      setShowDefinitionModal(true); // Show the definition modal even on error
    }
  };

  return (
    <>
      <Navbar />
      <div className="vocabulary-game-container">
        {showModal && <VCIntroductionModal onClose={handleModalClose} />}
        {!showModal && word && (
          <>
            <h1>Vocabulary Card Game</h1>
            <div className="vocabulary-card-container">
              <div className={`vocabulary-card ${isFlipped ? 'flipped' : ''}`} onClick={handleCardFlip}>
                <div className="card-front">
                  <h2 className="vocabulary-word">{word}</h2>
                </div>
                <div className="card-back">
                  <p>{definition}</p>
                </div>
              </div>
              <button className="next-word-button" onClick={handleNextWord} disabled={loading}>
                {loading ? 'Loading...' : 'Next Word'}
              </button>
            </div>
            <div className="used-words-section">
              <h2>Used Words</h2>
              <p className="tip-text">
                <em>Tip: Click on a word to see the definition.</em>
              </p>
              <div className="words-grid">
                {[...Array(Math.ceil(usedWords.length / 20))].map((_, i) => (
                  <div key={i} className="words-column">
                    <ul>
                      {usedWords.slice(i * 20, (i + 1) * 20).map((usedWord, index) => (
                        <li key={index} onClick={() => handleWordClick(usedWord)}>
                          {usedWord}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <button className="change-topic-button" onClick={() => setShowModal(true)}>
              Change Topic
            </button>
          </>
        )}
      </div>
      <Footer />

      {/* Definition Modal */}
      {showDefinitionModal && (
        <DefinitionModal
          show={showDefinitionModal}
          onClose={() => setShowDefinitionModal(false)}
          definition={definition}
          selectedWord={selectedWord}
        />
      )}
    </>
  );
};

export default VocabularyCardPage;
