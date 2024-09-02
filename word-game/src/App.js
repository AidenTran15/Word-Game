import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WelcomePage from './components/WelcomePage/WelcomePage';
import GamePage from './components/GamePage/GamePage';
import SynonymFinderPage from './components/SynonymFinderPage/SynonymFinderPage';
import VocabularyCardPage from './components/VocabularyCardPage/VocabularyCardPage'; // Import the new page
import DailyTalkPage from './components/DailyTalkPage/DailyTalkPage';
import FriendlyChatPage from './components/FriendlyChatPage/FriendlyChatPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/synonym-finder" element={<SynonymFinderPage />} />
        <Route path="/vocabulary-card" element={<VocabularyCardPage />} /> 
        <Route path="/daily-talk" element={<DailyTalkPage />} />
        <Route path="/friendly-chat" element={<FriendlyChatPage />} />
      </Routes>
    </Router>
  );
}

export default App;
