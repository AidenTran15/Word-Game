// NameModal.js
import React, { useState } from 'react';
import './NameModal.css';

const NameModal = ({ onSave, onCancel }) => {
    const [name, setName] = useState('');

    const handleSave = () => {
        if (name.trim()) {
            onSave(name);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Enter Your Name</h2>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                />
                <div className="modal-buttons">
                    <button className="save-button" onClick={handleSave}>Save</button>
                    <button className="cancel-button" onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default NameModal;
