import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [category, setCategory] = useState('Fruit');
  const [word, setWord] = useState('');
  const [nextWord, setNextWord] = useState('');
  const [error, setError] = useState(null);

  const fetchNextWord = async () => {
    try {
      console.log(`Fetching next word for category: ${category}, word: ${word}`);
      const response = await axios.get('https://nscjwcove7.execute-api.ap-southeast-2.amazonaws.com/prod/word-game', {
        params: { category, word }
      });
      console.log('Response:', response);

      // Handle the response data
      const { data } = response;
      if (data.nextWord) {
        setNextWord(data.nextWord);
        setError(null);
      } else if (data.message) {
        setNextWord(data.message);
        setError(null);
      } else {
        setError('Unexpected response structure');
        console.error('Unexpected response structure:', data);
      }

      // Update the word input to the next word
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
    fetchNextWord();
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
          disabled={nextWord === 'You won!'}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '10px', fontSize: '16px', marginBottom: '10px', width: '200px' }} disabled={nextWord && nextWord !== 'You won!'}>
          <option value="Fruit">Fruit</option>
          <option value="Occupation">Occupation</option>
        </select>
        <button type="submit" style={{ padding: '10px 20px', fontSize: '16px' }} disabled={nextWord === 'You won!'}>Submit</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default App;
