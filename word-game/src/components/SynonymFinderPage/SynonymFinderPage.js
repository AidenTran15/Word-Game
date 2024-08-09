import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import IntroductionModal from '../SF_IntroductionModal/SF_IntroductionModal';
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
      const response = await axios.get('http://localhost:5000/generate-question');
      setQuestion(response.data);
      setSelectedOption(null);
      setFeedback('');
      setUsedWords((prevUsedWords) => [
        ...prevUsedWords, 
        response.data.word,
        ...response.data.options
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
      setFeedback(`Wrong! The correct word is ${question.correctAnswer}.`);
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

  return (
    <div className="synonym-finder-page">
      <Navbar />
      <div className="synonym-finder-container">
        <h2 className="synonym-finder-title">Find the Word with a Similar Meaning</h2>
        {showModal && <IntroductionModal onClose={closeModal} />}
        {!showModal && !gameOver && (
          <>
            <div className="timer">Time Left: {timeLeft} seconds</div>
            <h3 className="word-title">Word: {question.word}</h3>
            <div className="synonym-options">
              {question.options && question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  disabled={selectedOption !== null || loading}
                  className={getButtonClass(option)}
                >
                  {option}
                </button>
              ))}
            </div>
            {feedback && <h3 className={`synonym-feedback ${feedback.startsWith('Correct') ? 'synonym-feedback-correct' : ''}`}>{feedback}</h3>}

            <button onClick={fetchQuestion} disabled={selectedOption === null || loading}>
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
      {!showModal && (
        <div className="used-words-section">
          <h2>Used Words</h2>
          <div className="words-grid">
            {[...Array(Math.ceil(usedWords.length / 20))].map((_, i) => (
              <div key={i} className="words-column">
                <ul>
                  {usedWords.slice(i * 20, (i + 1) * 20).map((word, index) => (
                    <li key={index}>{word}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default SynonymFinderPage;
