import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import UserStats from '../UserStats/UserStats';
import ResultModal from '../ResultModal/ResultModal';
import DefinitionModal from '../DefinitionModal/DefinitionModal';
import { FaVolumeUp, FaMicrophone } from 'react-icons/fa'; // Import the speaker and microphone icons
import './GamePage.css';

const GamePage = () => {
  const location = useLocation();
  const { userName } = location.state || { userName: 'Player' };
  const [category, setCategory] = useState('Everything');
  const [word, setWord] = useState('');
  const [nextWord, setNextWord] = useState('');
  const [error, setError] = useState(null);
  const [usedWords, setUsedWords] = useState([]);
  const [gameInProgress, setGameInProgress] = useState(true);
  const [wordSubmitted, setWordSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStarted, setGameStarted] = useState(false);
  const [wordsEntered, setWordsEntered] = useState(0);
  const [record, setRecord] = useState(() => {
    const savedRecord = localStorage.getItem('wordGameRecord');
    return savedRecord ? JSON.parse(savedRecord) : 0;
  });
  const [positionUp, setPositionUp] = useState(false);
  const [showResultButton, setShowResultButton] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [resultWords, setResultWords] = useState([]);
  const [showDefinitionModal, setShowDefinitionModal] = useState(false);
  const [definition, setDefinition] = useState('');
  const [gameOver, setGameOver] = useState(false);

  const updateRecord = useCallback(() => {
    if (wordsEntered > record) {
      setRecord(wordsEntered);
      localStorage.setItem('wordGameRecord', JSON.stringify(wordsEntered));
    }
  }, [wordsEntered, record]);

  const handleSurrender = useCallback(() => {
    updateRecord();
    setNextWord('Computer wins!');
    setError(null);
    setGameInProgress(false);
    setShowResultButton(true);
    setGameOver(true);
  }, [updateRecord]);

  const handleWin = () => {
    updateRecord();
    setNextWord(`${userName} won!`);
    setError(null);
    setGameInProgress(false);
    setShowResultButton(true);
    setGameOver(true);
  };

  useEffect(() => {
    if (gameInProgress && gameStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      handleSurrender();
    }
  }, [gameInProgress, gameStarted, timeLeft, handleSurrender]);

  useEffect(() => {
    if (wordSubmitted) {
      setTimeLeft(30);
      setWordSubmitted(false);
    }
  }, [wordSubmitted]);

  const validateWord = async (wordToValidate) => {
    try {
      const response = await axios.get('https://nscjwcove7.execute-api.ap-southeast-2.amazonaws.com/prod/validate-word', {
        params: { category: category === 'Everything' ? '' : category, word: wordToValidate }
      });
      return response.data.valid;
    } catch (error) {
      setError('Error validating word');
      return false;
    }
  };

  const fetchNextWord = async (userWord, attempts = 0) => {
    try {
      if (attempts > 5) { // Avoid infinite recursion
        setNextWord('No more valid words available!');
        setGameInProgress(false);
        setGameOver(true);
        return;
      }

      const userInputWord = userWord ? userWord : word;
      console.log(`Fetching next word for user input: ${userInputWord}, attempts: ${attempts}`);
      const response = await axios.get('https://nscjwcove7.execute-api.ap-southeast-2.amazonaws.com/prod/word-game', {
        params: { category: category === 'Everything' ? '' : category, word: userInputWord, usedWords: usedWords.join(',') }
      });

      const { data } = response;
      console.log('Response data:', data);
      if (data.nextWords) {
        const newWord = data.nextWords[0].toLowerCase();
        if (!usedWords.includes(newWord) && newWord !== userInputWord.toLowerCase()) {
          console.log(`New word accepted: ${newWord}`);
          setNextWord(data.nextWords[0].charAt(0).toUpperCase() + data.nextWords[0].slice(1));
          setError(null);
          setUsedWords([...usedWords, userInputWord.toLowerCase(), newWord]);
          setWordsEntered(wordsEntered + 1);
        } else {
          console.log(`New word rejected (duplicate or same as user input): ${newWord}`);
          fetchNextWord(userInputWord, attempts + 1); // Recursively fetch a new word
        }
      } else if (data.message === 'You won!') {
        handleWin();
      } else if (data.message === 'Computer wins!') {
        handleSurrender();
      } else {
        setError('Unexpected response structure');
      }

      setWord('');
    } catch (error) {
      console.error('Error fetching next word:', error);
      setError('Error fetching next word');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (nextWord && nextWord !== `${userName} won!` && nextWord !== 'Computer wins!') {
      const lastLetter = nextWord[nextWord.length - 1].toLowerCase();
      if (word[0].toLowerCase() !== lastLetter) {
        setError(`The word should start with "${lastLetter.toUpperCase()}"`);
        return;
      }
    }
    if (usedWords.includes(word.toLowerCase())) {
      setError('This word has already been used.');
      return;
    }

    const isValid = await validateWord(word);
    if (!isValid) {
      setError('Invalid word');
      return;
    }

    setWordSubmitted(true);
    if (!gameStarted) {
      setGameStarted(true);
    }
    if (!positionUp) {
      setPositionUp(true);
    }

    fetchNextWord(word);
  };

  const handleReset = () => {
    updateRecord();
    setCategory('Everything');
    setWord('');
    setNextWord('');
    setError(null);
    setUsedWords([]);
    setGameInProgress(true);
    setWordSubmitted(false);
    setTimeLeft(30);
    setGameStarted(false);
    setWordsEntered(0);
    setPositionUp(false);
    setShowResultButton(false);
    setGameOver(false);
  };

  const handleSeeResult = async () => {
    setError(null); // Ensure the error state is cleared
    const lastLetter = usedWords[usedWords.length - 1].slice(-1).toLowerCase();
    console.log(`Last letter for result: '${lastLetter}'`);
    try {
      const response = await axios.get('https://nscjwcove7.execute-api.ap-southeast-2.amazonaws.com/prod/word-game', {
        params: { category: category === 'Everything' ? '' : category, word: lastLetter, usedWords: '' }
      });
      const { data } = response;
      console.log('Response data for result:', data);
      if (data.nextWords) {
        setResultWords(data.nextWords);
      } else {
        setResultWords([]);
      }
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching result words:', error);
      setError('Error fetching result words');
    }
  };

  const handleWordClick = async (word) => {
    if (category === 'Country' || category === 'City') {
      setDefinition(`The word "${word}" is the name of a ${category.toLowerCase()}.`);
      setShowDefinitionModal(true);
    } else {
      try {
        const response = await axios.get('https://api.dictionaryapi.dev/api/v2/entries/en/' + word);
        const { data } = response;
        if (data && data.length > 0 && data[0].meanings && data[0].meanings.length > 0) {
          const definition = data[0].meanings[0].definitions[0].definition;
          setDefinition(definition);
          setShowDefinitionModal(true);
        }
      } catch (error) {
        console.error('Error fetching definition:', error);
        setError('Error fetching definition');
      }
    }
  };

  const handleSpeak = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
  };

  const handleVoiceInput = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.start();

    recognition.onresult = (event) => {
      const spokenWord = event.results[0][0].transcript;
      setWord(spokenWord);
    };

    recognition.onerror = (event) => {
      setError('Error with voice input: ' + event.error);
    };
  };

  return (
    <div className="game-page">
      <Navbar />
      <div className="stats-container">
        <UserStats userName={userName} wordsEntered={wordsEntered} record={record} />
      </div>
      <div className={`game-container ${positionUp ? 'moved-up' : ''}`}>
        <div className="timer-container">
          {gameStarted && gameInProgress && nextWord !== `${userName} won!` && nextWord !== 'Computer wins!' && (
            <svg className="timer-svg" viewBox="0 0 36 36">
              <path
                className="timer-bg"
                d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="timer-fg"
                strokeDasharray={`${(timeLeft / 30) * 100}, 100`}
                d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <text x="18" y="20.35" className="timer-text" textAnchor="middle" dy=".3em">
                {timeLeft}s
              </text>
            </svg>
          )}
        </div>
        <form onSubmit={handleSubmit} className="game-form">
          <label htmlFor="category">Select Topic</label>
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} disabled={!gameInProgress}>
            <option value="Everything">All (Include all topics in the list)</option>
            <option value="Animal">Animal</option>
            <option value="Body">Body</option>
            <option value="Country">Country</option>
            <option value="Emotional&Feeling&Character">Emotional, Feeling and Character</option>
            <option value="Food&Drink">Food and Drink</option>
            <option value="Fruit">Fruit</option>
            <option value="Hobbies">Hobbies</option>
            <option value="Natural">Natural</option>
            <option value="Supermarket">Supermarket</option>
            <option value="Occupation">Occupation</option>
            <option value="Test">Test</option>
          </select>
          {nextWord && nextWord !== `${userName} won!` && nextWord !== 'Computer wins!' && (
            <h2 className="next-word-container">
              Next word: {nextWord}
              <FaVolumeUp onClick={() => handleSpeak(nextWord)} className="speaker-icon" />
            </h2>
          )}
          {(!nextWord || nextWord === `${userName} won!` || nextWord === 'Computer wins!') && (
            <h2>{nextWord}</h2>
          )}
          <div className="input-container">
            <input 
              type="text" 
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="Enter the word"
              disabled={!gameInProgress}
            />
            <FaMicrophone onClick={handleVoiceInput} className="microphone-icon" />
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="button-group">
            <button type="submit" disabled={!gameInProgress}>Submit</button>
            {gameStarted && gameInProgress && nextWord !== `${userName} won!` && nextWord !== 'Computer wins!' && (
              <button type="button" onClick={handleSurrender}>Surrender</button>
            )}
            {(!gameInProgress || gameOver) && (
              <button type="button" onClick={handleReset}>Reset</button>
            )}
          </div>
          {gameOver && (
            <div className="button-group">
              {showResultButton && nextWord !== `${userName} won!` && <button className="result-button" onClick={handleSeeResult}>See result</button>}
            </div>
          )}
        </form>
        {usedWords.length > 0 && (
          <div className="used-words-section">
            <h2>Used Words</h2>
            <div className="words-grid">
              <ul>
                {usedWords.map((word, index) => (
                  <li key={index} onClick={() => handleWordClick(word)}>
                    {word.charAt(0).toUpperCase() + word.slice(1)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
      <Footer />
      <ResultModal show={showModal} onClose={() => setShowModal(false)} words={resultWords} />
      <DefinitionModal show={showDefinitionModal} onClose={() => setShowDefinitionModal(false)} definition={definition} />
    </div>
  );
};

export default GamePage;
