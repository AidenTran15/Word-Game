import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import IntroductionModal from '../SF_IntroductionModal/SF_IntroductionModal';
import './SynonymFinderPage.css';

const SynonymFinderPage = () => {
  const [question, setQuestion] = useState({});
  const [selectedOption, setSelectedOption] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showModal, setShowModal] = useState(true); // Initially show the modal

  // Function to fetch the question
  const fetchQuestion = async () => {
    try {
      const response = await axios.get('http://localhost:5000/generate-question');
      setQuestion(response.data);
      setSelectedOption('');
      setFeedback('');
    } catch (error) {
      console.error('Error fetching question:', error);
    }
  };

  // Function to handle modal close
  const closeModal = () => {
    setShowModal(false);
    fetchQuestion(); // Fetch the first question after closing the modal
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    if (option === question.correctAnswer) {
      setFeedback('Correct!');
    } else {
      setFeedback('Wrong!');
    }
  };

  return (
    <div className="synonym-finder-page">
      <Navbar />
      <div className="synonym-finder-container">
        <h2 className="synonym-finder-title">Find the Word with a Similar Meaning</h2>
        {showModal && <IntroductionModal onClose={closeModal} />}
        {!showModal && question.word && (
          <>
            <h3 className="word-title">Word: {question.word}</h3>

            <div className="synonym-options">
              {question.options.map((option, index) => (
                <button 
                  key={index} 
                  onClick={() => handleOptionClick(option)} 
                  disabled={!!selectedOption}
                >
                  {option}
                </button>
              ))}
            </div>
            {feedback && <p className={`synonym-feedback ${feedback === 'Correct!' ? 'synonym-feedback-correct' : ''}`}>{feedback}</p>}
            <button onClick={fetchQuestion}>Next Question</button>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SynonymFinderPage;
