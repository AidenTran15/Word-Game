// UserStats.js
import React from 'react';
import './UserStats.css';

const UserStats = ({ userName, wordsEntered, record }) => {
    return (
        <div className="user-stats-container">
            <div className="user-stats">
                <div className="stats">
                <div className="stat">
                        <h3>Your</h3>
                        <p>Record</p>
                        <p className="stat-value">{record}</p>
                    </div>
                    <div className="divider"></div>
                    <div className="stat">
                        <h3>Your</h3>
                        <p>Points</p>
                        <p className="stat-value">{wordsEntered}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserStats;
