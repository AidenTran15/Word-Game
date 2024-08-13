import React, { useState } from 'react';
import axios from 'axios';
import './VocabularyCardPage.css';

const topics = [
  'Travel', 'School', 'Fruit', 'Supermarket', 'Occupation', 'Airport', 'Animals', 
  'Weather', 'Transportation', 'Sports', 'Hobbies', 'Emotion', 'Shopping', 
  'Health', 'Hospitality', 'Restaurant'
];

const VocabularyCardPage = () => {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);

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

  return (
    <div className="vocabulary-game-container">
      <h1>Vocabulary Card Game</h1>
      <h2>Select a Topic</h2>
      <div className="topic-selection">
        {topics.map((topic) => (
          <button key={topic} onClick={() => handleTopicSelect(topic)}>
            {topic}
          </button>
        ))}
      </div>
      {word && (
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
      )}
    </div>
  );
};

export default VocabularyCardPage;
