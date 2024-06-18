import React from 'react';
import { useNavigate } from 'react-router-dom';

function WelcomePage() {
  const navigate = useNavigate();

  const handlePlayGame = () => {
    navigate('/game');
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px', background: 'linear-gradient(90deg, rgba(255,0,150,0.3), rgba(0,204,255,0.3))', height: '100vh' }}>
      <h1>Welcome to the Word Game!</h1>
      <p>This is a fun game where you and the computer take turns to enter words. The next word must start with the last letter of the previous word. Try not to use the same word twice!</p>
      <button onClick={handlePlayGame} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>Play Game</button>
    </div>
  );
}

export default WelcomePage;
