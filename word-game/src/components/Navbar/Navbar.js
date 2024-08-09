import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import WordGameHeader from '../../assets/3.png'; // Adjust the path based on your file structure

const Navbar = () => {
    return (
        <nav className="navbar">
            <img src={WordGameHeader} alt="Word Game" className="header-image" />
            <div className="nav-links">
                <Link to="/game" className="nav-link">NextWord</Link>
                <Link to="/synonym-finder" className="nav-link">Synonym-Finder</Link>
            </div>
        </nav>
    );
};

export default Navbar;
