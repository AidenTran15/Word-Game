import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NameModal from '../NameModal/NameModal';

function WelcomePage() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handlePlayGame = () => {
    setShowModal(true);
  };

  const handleSaveName = (name) => {
    setShowModal(false);
    navigate('/game', { state: { userName: name } });
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to Word Game!</h1>
      <p style={styles.description}>
        This is a fun game where you and the computer take turns to enter words. The next word must start with the last letter of the previous word. Try not to use the same word twice!
      </p>
      <button onClick={handlePlayGame} style={styles.button}>Play Game</button>
      {showModal && <NameModal onSave={handleSaveName} onCancel={handleCancel} />}
      <div style={styles.floatingElement1}></div>
      <div style={styles.floatingElement2}></div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    padding: '50px',
    background: 'linear-gradient(90deg, rgba(0,123,255,0.3), rgba(0,123,255,0.6))',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    position: 'relative',
    overflow: 'hidden',
  },
  title: {
    fontSize: '48px',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
    marginBottom: '20px',
    animation: 'fadeInDown 1s',
  },
  description: {
    fontSize: '20px',
    maxWidth: '600px',
    marginBottom: '40px',
    lineHeight: '1.6',
    animation: 'fadeIn 2s',
  },
  button: {
    padding: '15px 30px',
    fontSize: '18px',
    cursor: 'pointer',
    borderRadius: '25px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
    transition: 'transform 0.3s, background-color 0.3s',
    position: 'relative', // Ensure the button is above the floating elements
    zIndex: 2, // Ensure the button is above the floating elements
  },
  floatingElement1: {
    width: '150px',
    height: '150px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '50%',
    position: 'absolute',
    top: '10%',
    left: '15%',
    animation: 'float 6s ease-in-out infinite',
    zIndex: 1, // Ensure it is below the button
  },
  floatingElement2: {
    width: '200px',
    height: '200px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '50%',
    position: 'absolute',
    bottom: '20%',
    right: '10%',
    animation: 'float 8s ease-in-out infinite',
    zIndex: 1, // Ensure it is below the button
  },
  '@keyframes fadeInDown': {
    from: {
      opacity: 0,
      transform: 'translateY(-20px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
  '@keyframes fadeIn': {
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  },
  '@keyframes float': {
    '0%': {
      transform: 'translateY(0)',
    },
    '50%': {
      transform: 'translateY(-20px)',
    },
    '100%': {
      transform: 'translateY(0)',
    },
  },
};

export default WelcomePage;
