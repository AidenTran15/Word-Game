import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import './GamePage.css';

const GamePage = () => {
    const [category, setCategory] = useState('Fruit');
    const [word, setWord] = useState('');
    const [nextWord, setNextWord] = useState('');
    const [error, setError] = useState(null);
    const [usedWords, setUsedWords] = useState([]);
    const [gameInProgress, setGameInProgress] = useState(true);

    const validateWord = async (wordToValidate) => {
        try {
            const response = await axios.get('https://nscjwcove7.execute-api.ap-southeast-2.amazonaws.com/prod/validate-word', {
                params: { category, word: wordToValidate }
            });
            return response.data.valid;
        } catch (error) {
            setError('Error validating word');
            return false;
        }
    };

    const fetchNextWord = async (userWord) => {
        try {
            const userInputWord = userWord ? userWord : word;
            const response = await axios.get('https://nscjwcove7.execute-api.ap-southeast-2.amazonaws.com/prod/word-game', {
                params: { category, word: userInputWord, usedWords: usedWords.join(',') }
            });

            const { data } = response;
            if (data.nextWord) {
                setNextWord(data.nextWord);
                setError(null);
                setUsedWords([...usedWords, userInputWord.toLowerCase(), data.nextWord.toLowerCase()]);
            } else if (data.message) {
                setNextWord(data.message);
                setError(null);
            } else {
                setError('Unexpected response structure');
            }

            if (data.nextWord && data.nextWord !== 'You won!') {
                setWord('');
            }
        } catch (error) {
            setError('Error fetching next word');
        }
    };

    const handleSubmit = async (e) => {
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

        const isValid = await validateWord(word);
        if (!isValid) {
            setError('The word is incorrect or not in this field.');
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
        setGameInProgress(true);
    };

    const handleSurrender = () => {
        setNextWord('Computer wins!');
        setError(null);
        setGameInProgress(false);
    };

    return (
        <div className="game-page">
            <Navbar />
            <div className="game-container">
                <form onSubmit={handleSubmit} className="game-form">
                    <label htmlFor="category">Select Topic</label>
                    <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} disabled={!gameInProgress}>
                        <option value="Fruit">Fruit</option>
                        <option value="Occupation">Occupation</option>
                    </select>
                    {nextWord && nextWord !== 'You won!' && nextWord !== 'Computer wins!' && (
                        <h2>Next word: {nextWord}</h2>
                    )}
                    {(!nextWord || nextWord === 'You won!' || nextWord === 'Computer wins!') && (
                        <h2>{nextWord}</h2>
                    )}
                    <input 
                        type="text" 
                        value={word}
                        onChange={(e) => setWord(e.target.value)}
                        placeholder="Enter the word"
                        disabled={!gameInProgress}
                    />
                    <div className="button-group">
                        <button type="submit" disabled={!gameInProgress}>Submit</button>
                        <button type="button" onClick={handleSurrender} disabled={!gameInProgress}>Surrender</button>
                    </div>
                    {(!gameInProgress || nextWord === 'You won!') && <button className="reset-button" onClick={handleReset}>Reset</button>}
                </form>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
            <Footer />
        </div>
    );
};

export default GamePage;
