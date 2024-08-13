import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import IntroductionModal from '../SF_IntroductionModal/SF_IntroductionModal';
import DefinitionModal from '../DefinitionModal/DefinitionModal';
import './SynonymFinderPage.css';

const SynonymFinderPage = () => {
  const [question, setQuestion] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [showModal, setShowModal] = useState(true);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [usedWords, setUsedWords] = useState([]);
  const [showDefinitionModal, setShowDefinitionModal] = useState(false);
  const [definition, setDefinition] = useState('');
  const [englishDefinition, setEnglishDefinition] = useState('');
  const [vietnameseDefinition, setVietnameseDefinition] = useState('');
  const [phonetic, setPhonetic] = useState('');
  const [selectedWord, setSelectedWord] = useState('');
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    if (timeLeft > 0 && !showModal && !gameOver) {
      const timer = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
    }
  }, [timeLeft, showModal, gameOver]);

  const fetchQuestion = async () => {
    if (loading || gameOver) return;
    setLoading(true);
    try {
      const response = await axios.get('https://apiwordgame.aidenkiettran.com/generate-question');
      setQuestion(response.data);
      setSelectedOption(null);
      setFeedback('');
      setUsedWords((prevUsedWords) => [
        ...prevUsedWords,
        response.data.word,
        ...response.data.options,
      ]);
    } catch (error) {
      console.error('Error fetching question:', error);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    fetchQuestion();
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    if (option === question.correctAnswer) {
      setFeedback('Correct!');
      setScore(score + 1);
    } else {
      setTimeout(() => {
        setFeedback(`Wrong! The correct word is ${question.correctAnswer}.`);
      }, 1000);
    }
  };

  const getButtonClass = (option) => {
    if (selectedOption === null) return '';
    if (option === question.correctAnswer) return 'correct';
    if (option === selectedOption) return 'incorrect';
    return '';
  };

  const handlePlayAgain = () => {
    setScore(0);
    setTimeLeft(60);
    setGameOver(false);
    setUsedWords([]);
    fetchQuestion();
  };

  const handleWordClick = async (word) => {
    try {
      const response = await axios.post('https://apiwordgame.aidenkiettran.com/validate-word', {
        word,
      });
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

  const toggleLanguage = () => {
    setLanguage((prevLanguage) => (prevLanguage === 'en' ? 'vi' : 'en'));
    setDefinition(language === 'en' ? vietnameseDefinition : englishDefinition);
  };

  return (
    <div className="synonym-finder-page">
      {showModal && <IntroductionModal onClose={closeModal} />}
      {!showModal && (
        <>
          <Navbar />
          <div className="synonym-finder-container">
            <h2 className="synonym-finder-title">Find the Word with a Similar Meaning</h2>
            {!gameOver && (
              <>
                <div className="timer-container">
                  <svg className="timer-svg" viewBox="0 0 36 36">
                    <path
                      className="timer-bg"
                      d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="timer-fg"
                      strokeDasharray={`${(timeLeft / 60) * 100}, 100`}
                      d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <text x="18" y="20.35" className="timer-text" textAnchor="middle" dy=".3em">
                      {timeLeft}s
                    </text>
                  </svg>
                </div>
                <h3 className="word-title">Word: {question.word}</h3>
                <div className="synonym-options">
                  {question.options &&
                    question.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleOptionClick(option)}
                        disabled={selectedOption !== null || loading}
                        className={`${getButtonClass(option)} ${selectedOption === option ? 'selected' : ''}`}
                      >
                        {option}
                      </button>
                    ))}
                </div>
                {feedback && (
                  <h3
                    className={`synonym-feedback synonym-feedback-visible ${
                      feedback.startsWith('Correct') ? 'synonym-feedback-correct' : ''
                    }`}
                  >
                    {feedback}
                  </h3>
                )}

                <button className="next-question-button" onClick={fetchQuestion} disabled={selectedOption === null || loading}>
                  {loading ? 'Loading...' : 'Next Question'}
                </button>
              </>
            )}
            {gameOver && (
              <div className="game-over">
                <h3>Game Over! Your total score is: {score}</h3>
                <button onClick={handlePlayAgain} className="play-again-button">
                  Play Again
                </button>
              </div>
            )}
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
                    {usedWords.slice(i * 20, (i + 1) * 20).map((word, index) => (
                      <li key={index} onClick={() => handleWordClick(word)}>
                        {word}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <Footer />
        </>
      )}
      <DefinitionModal
        show={showDefinitionModal}
        onClose={() => setShowDefinitionModal(false)}
        definition={definition}
        selectedWord={selectedWord}
        language={language}
        toggleLanguage={toggleLanguage}
      />
    </div>
  );
};

export default SynonymFinderPage;
