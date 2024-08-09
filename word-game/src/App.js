import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WelcomePage from './components/WelcomePage/WelcomePage';
import GamePage from './components/GamePage/GamePage';
import SynonymFinderPage from './components/SynonymFinderPage/SynonymFinderPage'; // Import the new page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/synonym-finder" element={<SynonymFinderPage />} /> {/* Add the new route */}
      </Routes>
    </Router>
  );
}

export default App;
