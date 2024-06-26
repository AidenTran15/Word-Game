import React from 'react';
import './Navbar.css';
import WordGameHeader from '../../assets/3.png'; // Adjust the path based on your file structure

const Navbar = () => {
    return (
        <nav className="navbar">
            <img src={WordGameHeader} alt="Word Game" className="header-image" />
        </nav>
    );
};

export default Navbar;
