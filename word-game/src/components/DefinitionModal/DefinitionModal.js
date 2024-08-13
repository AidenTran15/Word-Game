import React from 'react';
import './DefinitionModal.css';

const DefinitionModal = ({ show, onClose, definition, selectedWord, language, toggleLanguage }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay-dm">
      <div className="modal-content-dm">
        <h2>Word Definition</h2>
        <h3>{selectedWord || 'No word selected'}</h3> {/* Display the selected word */}
        <h4>{definition || 'No definition found.'}</h4>
        <button onClick={toggleLanguage}>
          {language === 'en' ? 'View in Vietnamese' : 'View in English'}
        </button>
        <button onClick={onClose} style={{ marginTop: '20px' }}>Close</button> {/* Added marginTop for spacing */}
      </div>
    </div>
  );
};

export default DefinitionModal;
