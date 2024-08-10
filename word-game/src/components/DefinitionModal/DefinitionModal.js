import React from 'react';
import './DefinitionModal.css';

const DefinitionModal = ({ show, onClose, definition }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Word Definition</h2>
        <p>{definition || 'No definition found.'}</p> {/* Ensure the definition is rendered here */}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};


export default DefinitionModal;
