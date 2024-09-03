import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import WordGameHeader from '../../assets/3.png'; // Adjust the path based on your file structure

const Navbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const location = useLocation(); // Get the current location

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <nav className="navbar">
            <img src={WordGameHeader} alt="Word Game" className="header-image" />
            <div className="nav-links">
                <div className="dropdown">
                    <button className="dropdown-toggle blue-button" onClick={toggleDropdown}>
                        More Games <span className="arrow">&#9660;</span> {/* Down arrow icon */}
                    </button>
                    {dropdownOpen && (
                        <div className="dropdown-menu">
                            {location.pathname !== '/game' && (
                                <Link to="/game" className="dropdown-item">Next Word</Link>
                            )}
                            {location.pathname !== '/synonym-finder' && (
                                <Link to="/synonym-finder" className="dropdown-item">Synonym Finder</Link>
                            )}
                            {location.pathname !== '/vocabulary-card' && (
                                <Link to="/vocabulary-card" className="dropdown-item">Vocabulary Card</Link>
                            )}
                            {location.pathname !== '/daily-talk' && (
                                <Link to="/daily-talk" className="dropdown-item">Daily Talk</Link> 
                            )}
                            {location.pathname !== '/friendly-chat' && (  // Add this block for the new feature
                                <Link to="/friendly-chat" className="dropdown-item">friendly-chat</Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
