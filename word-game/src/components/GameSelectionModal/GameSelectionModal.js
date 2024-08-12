import React from 'react';
import { Link } from 'react-router-dom';
import './GameSelectionModal.css';

const GameSelectionModal = ({ onCancel, onSave }) => {
    const handleGameSelection = () => {
        onSave();
    };

    return (
        <div className="modal-overlay-gs">
            <div className="modal-content-gs">
                <h2>Select a Game</h2>
                <div className="modal-buttons">
                    <Link to="/game" className="game-button" onClick={handleGameSelection}>Next Word</Link>
                    <Link to="/synonym-finder" className="game-button" onClick={handleGameSelection}>Synonym Finder</Link>
                </div>
                <button className="cancel-button" onClick={onCancel}>Cancel</button>
            </div>
        </div>
    );
};

export default GameSelectionModal;
