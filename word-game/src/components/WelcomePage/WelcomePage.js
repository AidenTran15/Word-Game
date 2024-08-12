import React, { useState } from 'react';
import GameSelectionModal from '../GameSelectionModal/GameSelectionModal';

function WelcomePage() {
  const [showModal, setShowModal] = useState(true);

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleGameSelection = () => {
    setShowModal(false);
  };

  return (
    <div style={styles.container}>
      {showModal && <GameSelectionModal onCancel={handleCancel} onSave={handleGameSelection} />}
      <div style={styles.floatingElement1}></div>
      <div style={styles.floatingElement2}></div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
    background: 'linear-gradient(90deg, rgba(0,123,255,0.3), rgba(0,123,255,0.6))',
    minHeight: '100vh',
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
  },
  description: {
    fontSize: '20px',
    maxWidth: '600px',
    marginBottom: '40px',
    lineHeight: '1.6',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  floatingElement1: {
    width: '150px',
    height: '150px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '50%',
    position: 'absolute',
    top: '10%',
    left: '15%',
  },
  floatingElement2: {
    width: '200px',
    height: '200px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '50%',
    position: 'absolute',
    bottom: '20%',
    right: '10%',
  },
};

export default WelcomePage;
