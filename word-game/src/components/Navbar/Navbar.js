import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import WordGameHeader from '../../assets/3.png'; // Adjust the path based on your file structure

const Navbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <nav className="navbar">
            <img src={WordGameHeader} alt="Word Game" className="header-image" />
            <div className="nav-links">
                <div className="dropdown">
                    <button className="dropdown-button" onClick={toggleDropdown}>
                        More Game
                    </button>
                    {dropdownOpen && (
                        <div className="dropdown-content">
                            <Link to="/game" className="dropdown-item">Next Word</Link>
                            <Link to="/synonym-finder" className="dropdown-item">Synonym Finder</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
