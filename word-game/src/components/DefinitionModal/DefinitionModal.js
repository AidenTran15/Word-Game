import React from 'react';
import './DefinitionModal.css';

const DefinitionModal = ({ show, onClose, definition, word, language, toggleLanguage }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Word Definition</h2>
        <h3>{word}</h3> {/* Display the clicked word */}
        <div className="language-toggle">
          <button onClick={toggleLanguage} className="toggle-button">
            {language === 'en' ? 'VI' : 'EN'}
          </button>
        </div>
        <h3>{definition || 'No definition found.'}</h3> {/* Display the definition based on the language */}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default DefinitionModal;
