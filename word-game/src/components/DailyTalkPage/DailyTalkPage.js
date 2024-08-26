import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar'; // Import Navbar component
import Footer from '../Footer/Footer'; // Import Footer component
import './DailyTalkPage.css'; // Import the CSS

const DailyTalkPage = () => {
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);

  // Define the names for Person 1 and Person 2
  const person1 = "Alex";
  const person2 = "Jamie";

  const generateConversation = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/generate-daily-talk');
      
      // Replace "Person 1" and "Person 2" with the actual names
      let conversationText = response.data.conversation;
      conversationText = conversationText.replace(/Person 1:/g, `${person1}:`);
      conversationText = conversationText.replace(/Person 2:/g, `${person2}:`);

      // Split the conversation into lines
      const lines = conversationText.split('\n').filter(line => line.trim() !== '');
      setConversation(lines);
    } catch (error) {
      console.error('Error generating conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayConversation = () => {
    const synth = window.speechSynthesis;
    const fullConversation = conversation.join(' ');
    const utterance = new SpeechSynthesisUtterance(fullConversation);

    utterance.lang = 'en-US';
    utterance.rate = 1;
    utterance.pitch = 1;

    synth.speak(utterance);
  };

  return (
    <div className="wrapper">
      <Navbar />

      <div className="main-content">
        <h1>Daily Talk</h1>
        <button onClick={generateConversation} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Daily Talk'}
        </button>
        
        <div className="conversation-container">
          {conversation.map((line, index) => (
            <p key={index} className={line.startsWith(`${person1}:`) ? 'alex' : 'jamie'}>
              {line}
            </p>
          ))}
        </div>

        {conversation.length > 0 && (
          <button className="play-button" onClick={handlePlayConversation}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="white" 
              width="24px" 
              height="24px"
            >
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default DailyTalkPage;
