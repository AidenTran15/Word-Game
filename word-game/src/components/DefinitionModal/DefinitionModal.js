import React from 'react';
import './DefinitionModal.css';

function DefinitionModal({ show, onClose, definition }) {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Word Definition</h2>
        <p>{definition}</p>
        <button onClick={onClose} className="close-button">Close</button>
      </div>
    </div>
  );
}

export default DefinitionModal;