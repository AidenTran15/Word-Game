import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WelcomePage from './components/WelcomePage/WelcomePage';
import GamePage from './components/GamePage/GamePage';
import SynonymFinderPage from './components/SynonymFinderPage/SynonymFinderPage';
import GameSelectionModal from './components/GameSelectionModal/GameSelectionModal'; // Import the modal

function App() {
  const [showModal, setShowModal] = useState(true);

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <Router>
      {showModal && <GameSelectionModal onCancel={handleCancel} />}
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/synonym-finder" element={<SynonymFinderPage />} />
      </Routes>
    </Router>
  );
}

export default App;
