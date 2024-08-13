import React from 'react';
import './DefinitionModal.css';

const DefinitionModal = ({ show, onClose, definition, selectedWord, language, toggleLanguage }) => {
  if (!show) return null;

  const handleSpeak = () => {
    if (selectedWord) {
      const utterance = new SpeechSynthesisUtterance(selectedWord);
      utterance.lang = 'en-US'; // Set language to English
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="modal-overlay-dm">
      <div className="modal-content-dm">
        <h2>Word Definition</h2>
        <div className="word-section">
          <h3>{selectedWord || 'No word selected'}</h3>
          {selectedWord && (
            <button className="speak-button" onClick={handleSpeak}>
              <i className="fas fa-volume-up"></i> {/* Font Awesome speaker icon */}
            </button>
          )}
        </div>
        <h4>{definition || 'No definition found.'}</h4>
        <button onClick={toggleLanguage}>
          {language === 'en' ? 'View in Vietnamese' : 'View in English'}
        </button>
        <button onClick={onClose} style={{ marginTop: '20px' }}>Close</button>
      </div>
    </div>
  );
};

export default DefinitionModal;
