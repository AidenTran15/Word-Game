import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import './GamePage.css';

function GamePage() {
  const [category, setCategory] = useState('Fruit');
  const [word, setWord] = useState('');
  const [nextWord, setNextWord] = useState('');
  const [error, setError] = useState(null);
  const [usedWords, setUsedWords] = useState([]);

  const validateWord = async (wordToValidate) => {
    try {
      console.log(`Validating word for category: ${category}, word: ${wordToValidate}`);
      const response = await axios.get('https://nscjwcove7.execute-api.ap-southeast-2.amazonaws.com/prod/validate-word', {
        params: { category, word: wordToValidate }
      });
      console.log('Validation Response:', response);

      const { data } = response;
      return data.valid;
    } catch (error) {
      console.error('Error validating word', error);
      setError('Error validating word');
      return false;
    }
  };

  const fetchNextWord = async (userWord) => {
    try {
      const userInputWord = userWord ? userWord : word;
      console.log(`Fetching next word for category: ${category}, word: ${userInputWord}`);
      const response = await axios.get('https://nscjwcove7.execute-api.ap-southeast-2.amazonaws.com/prod/word-game', {
        params: { category, word: userInputWord, usedWords: usedWords.join(',') }
      });
      console.log('Response:', response);

      const { data } = response;
      if (data.nextWord) {
        setNextWord(data.nextWord);
        setError(null);
        setUsedWords(prevWords => [...prevWords, userInputWord.toLowerCase(), data.nextWord.toLowerCase()]);
      } else if (data.message) {
        setNextWord(data.message);
        setError(null);
      } else {
        setError('Unexpected response structure');
        console.error('Unexpected response structure:', data);
      }

      if (data.nextWord && data.nextWord !== 'You won!') {
        setWord('');
      }
    } catch (error) {
      console.error('Error fetching next word', error);
      setError('Error fetching next word');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(`Form submitted with word: ${word}`);

    if (nextWord && nextWord !== 'You won!') {
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
    console.log('Is word valid:', isValid);

    if (!isValid) {
      setError('The word is incorrect or not in this field.');
      return;
    }

    fetchNextWord(word);
  };

  const handleReset = () => {
    setCategory('Fruit');
    setWord('');
    setNextWord('');
    setError(null);
    setUsedWords([]);
  };

  const handleSurrender = () => {
    setNextWord('Computer wins!');
    setError(null);
  };

  return (
    <div className="game-page">
      <Navbar />
      <div className="game-content">
        <h1>{nextWord ? `Next Word: ${nextWord}` : 'Enter a Word'}</h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <input 
            type="text" 
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="Enter a word"
            style={{ padding: '10px', fontSize: '16px', marginBottom: '10px', width: '200px' }}
            disabled={nextWord === 'You won!' || nextWord === 'Computer wins!'}
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '10px', fontSize: '16px', marginBottom: '10px', width: '200px' }} disabled={nextWord && nextWord !== 'You won!' && nextWord !== 'Computer wins!'}>
            <option value="Fruit">Fruit</option>
            <option value="Occupation">Occupation</option>
          </select>
          <button type="submit" style={{ padding: '10px 20px', fontSize: '16px' }} disabled={nextWord === 'You won!' || nextWord === 'Computer wins!'}>Submit</button>
          {(nextWord === 'You won!' || nextWord === 'Computer wins!') && <button onClick={handleReset} style={{ padding: '10px 20px', fontSize: '16px', marginTop: '10px' }}>Reset</button>}
        </form>
        <button onClick={handleSurrender} style={{ padding: '10px 20px', fontSize: '16px', marginTop: '10px' }}>Surrender</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {usedWords.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h2>Used Words:</h2>
            <ul>
              {usedWords.map((usedWord, index) => (
                <li key={index}>{usedWord}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default GamePage;
