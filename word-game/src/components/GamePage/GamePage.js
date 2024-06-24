import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import UserStats from '../UserStats/UserStats'; // Import the UserStats component
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
    }, [updateRecord]);

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

    const fetchNextWord = async (userWord) => {
        try {
            const userInputWord = userWord ? userWord : word;
            const response = await axios.get('https://nscjwcove7.execute-api.ap-southeast-2.amazonaws.com/prod/word-game', {
                params: { category: category === 'Everything' ? '' : category, word: userInputWord, usedWords: usedWords.join(',') }
            });

            const { data } = response;
            if (data.nextWord) {
                setNextWord(data.nextWord.charAt(0).toUpperCase() + data.nextWord.slice(1));
                setError(null);
                setUsedWords([...usedWords, userInputWord.toLowerCase(), data.nextWord.toLowerCase()]);
                setWordsEntered(wordsEntered + 1);
            } else if (data.message) {
                setNextWord(data.message);
                setError(null);
            } else {
                setError('Unexpected response structure');
            }

            if (data.nextWord && data.nextWord !== `${userName} won!`) {
                setWord('');
            }
        } catch (error) {
            setError('Error fetching next word');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (nextWord && nextWord !== `${userName} won!`) {
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

        setUsedWords([...usedWords, word.toLowerCase()]);
        fetchNextWord(word);
        setWordSubmitted(true);
        if (!gameStarted) {
            setGameStarted(true);
        }
        if (!positionUp) {
            setPositionUp(true);
        }
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
    };

    return (
        <div className="game-page">
            <Navbar />
            <div className="stats-container">
                <UserStats userName={userName} wordsEntered={wordsEntered} record={record} />
            </div>
            <div className={`game-container ${positionUp ? 'moved-up' : ''}`}>
                <div className="timer-container">
                    {gameStarted && gameInProgress && (
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
                        <option value="Emotional&Feeling&Character">Emotional, Feeling and Character</option>
                        <option value="Food&Drink">Food and Drink</option>
                        <option value="Fruit">Fruit</option>
                        <option value="Hobbies">Hobbies</option>
                        <option value="Natural">Natural</option>
                        <option value="Supermarket">Supermarket</option>
                        <option value="Occupation">Occupation</option>
                    </select>
                    {nextWord && nextWord !== `${userName} won!` && nextWord !== 'Computer wins!' && (
                        <h2>Next word: {nextWord}</h2>
                    )}
                    {(!nextWord || nextWord === `${userName} won!` || nextWord === 'Computer wins!') && (
                        <h2>{nextWord}</h2>
                    )}
                    <input 
                        type="text" 
                        value={word}
                        onChange={(e) => setWord(e.target.value)}
                        placeholder="Enter the word"
                        disabled={!gameInProgress}
                    />
                    {error && <p className="error-message">{error}</p>}
                    <div className="button-group">
                        <button type="submit" disabled={!gameInProgress}>Submit</button>
                        {gameStarted && gameInProgress && (
                            <button type="button" onClick={handleSurrender}>Surrender</button>
                        )}
                    </div>
                    {(!gameInProgress || nextWord === `${userName} won!` || nextWord === 'Computer wins!') && (
                        <button className="reset-button" onClick={handleReset}>Reset</button>
                    )}
                </form>
                {usedWords.length > 0 && (
                    <div className="used-words-section">
                        <h2>Used Words</h2>
                        <div className="words-grid">
                            {Array.from({ length: Math.ceil(usedWords.length / 20) }).map((_, colIndex) => (
                                <ul key={colIndex}>
                                    {usedWords.slice(colIndex * 20, (colIndex + 1) * 20).map((word, index) => (
                                        <li key={index}>{word.charAt(0).toUpperCase() + word.slice(1)}</li>
                                    ))}
                                </ul>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default GamePage;
