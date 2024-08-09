import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import './SynonymFinderPage.css';

const SynonymFinderPage = () => {
  const [question, setQuestion] = useState({});
  const [selectedOption, setSelectedOption] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetchQuestion();
  }, []);

  const fetchQuestion = async () => {
    try {
      console.log('Fetching new question...');
      const response = await axios.get('http://localhost:5000/generate-question');
      console.log('New question data:', response.data);
      setQuestion(response.data);
      setSelectedOption('');
      setFeedback('');
    } catch (error) {
      console.error('Error fetching question:', error);
    }
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    if (option === question.correctAnswer) {
      setFeedback('Correct!');
    } else {
      setFeedback(`Wrong! The correct answer is ${question.correctAnswer}`);
    }
  };

  return (
    <div className="synonym-finder-page">
      <Navbar />
      <div className="synonym-finder-container">
        <h2>Find the Word with a Similar Meaning</h2>
        {question.word && (
          <>
            <p><strong>First Word:</strong> {question.word}</p>
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
