import React from 'react';
import './DefinitionModal.css';

const DefinitionModal = ({ show, onClose, word, definition }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Word Definition</h2>
        <h3>{word || 'Unknown Word'}</h3> {/* Display the word the user clicked */}
        <p>{definition || 'No definition found.'}</p> {/* Display the definition */}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default DefinitionModal;
