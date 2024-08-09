import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import IntroductionModal from '../SF_IntroductionModal/SF_IntroductionModal';
import './SynonymFinderPage.css';

const SynonymFinderPage = () => {
  const [question, setQuestion] = useState({});
  const [selectedOption, setSelectedOption] = useState(null); // Use null instead of an empty string for clarity
  const [feedback, setFeedback] = useState('');
  const [showModal, setShowModal] = useState(true);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);

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
      setSelectedOption(null); // Reset selected option when a new question is loaded
      setFeedback('');
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
    console.log('Option clicked:', option); // Debug
    setSelectedOption(option);
    if (option === question.correctAnswer) {
      console.log('Correct answer selected'); // Debug
      setFeedback('Correct!');
      setScore(score + 1);
    } else {
      console.log('Incorrect answer selected'); // Debug
      setFeedback('Wrong!');
    }
  };

  const getButtonClass = (option) => {
    console.log('Button class check for option:', option); // Debug
    if (selectedOption === null) return ''; // No option selected yet
    if (option === question.correctAnswer) return 'correct'; // Apply correct class to the correct answer
    if (option === selectedOption) return 'incorrect'; // Apply incorrect class to the selected option if it's wrong
    return ''; // Default no class
  };

  const handlePlayAgain = () => {
    setScore(0);
    setTimeLeft(60);
    setGameOver(false);
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
                  disabled={selectedOption !== null || loading} // Disable buttons after selection
                  className={getButtonClass(option)}
                >
                  {option}
                </button>
              ))}
            </div>
            {feedback && <p className={`synonym-feedback ${feedback === 'Correct!' ? 'synonym-feedback-correct' : ''}`}>{feedback}</p>}
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
      <Footer />
    </div>
  );
};

export default SynonymFinderPage;
