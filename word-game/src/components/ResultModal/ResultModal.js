import React from 'react';
import './ResultModal.css';

function ResultModal({ show, onClose, words }) {
    if (!show) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Words starting with "{words.length > 0 ? words[0][0].toUpperCase() : ''}"</h2>
                <ul>
                    {words.map((word, index) => (
                        <li key={index}>{word}</li>
                    ))}
                </ul>
                <button onClick={onClose} className="close-button">Close</button>
            </div>
        </div>
    );
}

export default ResultModal;
