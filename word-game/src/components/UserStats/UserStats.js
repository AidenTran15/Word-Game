import React from 'react';
import './UserStats.css';

const UserStats = ({ wordsEntered, record }) => {
    return (
        <div className="user-stats-container">
            <div className="user-stats">
                <div className="stats">
                    <div className="stat">
                        <h3>Words Entered</h3>
                        <p>{wordsEntered}</p>
                    </div>
                    <div className="divider"></div>
                    <div className="stat">
                        <h3>Record</h3>
                        <p>{record}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserStats;
