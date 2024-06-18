import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [category, setCategory] = useState('Fruit');
  const [word, setWord] = useState('');
  const [nextWord, setNextWord] = useState('');
  const [error, setError] = useState(null);
  const [usedWords, setUsedWords] = useState([]);

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
        setUsedWords(prevWords => [...prevWords, data.nextWord]);
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

  const handleSubmit = (e) => {
    e.preventDefault();
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
    setUsedWords([...usedWords, word.toLowerCase()]);
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
    <div className="App" style={{ background: 'linear-gradient(90deg, rgba(255,0,150,0.3), rgba(0,204,255,0.3))', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
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
  );
}

export default App;
