import React from 'react';
import './UserStats.css';

const UserStats = ({ wordsEntered, record }) => {
    return (
        <div className="user-stats">
            <div className="words-entered">
                <h3>Words Entered</h3>
                <p>{wordsEntered}</p>
            </div>
            <div className="record">
                <h3>Record</h3>
                <p>{record}</p>
            </div>
        </div>
    );
};

export default UserStats;
