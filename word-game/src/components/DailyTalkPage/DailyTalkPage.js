import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar'; // Import Navbar component
import Footer from '../Footer/Footer'; // Import Footer component
import './DailyTalkPage.css'; // Import the CSS

const DailyTalkPage = () => {
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [voices, setVoices] = useState([]);
  const [alexVoice, setAlexVoice] = useState(null);
  const [jamieVoice, setJamieVoice] = useState(null);

  const person1 = "Alex";
  const person2 = "Jamie";

  // Load the available voices
  useEffect(() => {
    const loadVoices = () => {
      const synth = window.speechSynthesis;
      const availableVoices = synth.getVoices();

      // Log the available voices for debugging
      console.log(availableVoices);

      // Select specific voices based on the system's available voices
      const alexSelectedVoice = availableVoices.find(voice => voice.name.includes('Alex') || voice.name.includes('Male')) || availableVoices[0];
      const jamieSelectedVoice = availableVoices.find(voice => voice.name.includes('Female') || voice.name.includes('Samantha') || voice.name.includes('Google UK English Female')) || availableVoices[1];

      setVoices(availableVoices);
      setAlexVoice(alexSelectedVoice); // Assign voice for Alex
      setJamieVoice(jamieSelectedVoice); // Assign voice for Jamie
    };

    // Load voices and set event listener for voice changes
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    } else {
      loadVoices();
    }
  }, []);

  const generateConversation = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/generate-daily-talk');
      
      let conversationText = response.data.conversation;
      conversationText = conversationText.replace(/Person 1:/g, `${person1}:`);
      conversationText = conversationText.replace(/Person 2:/g, `${person2}:`);

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

    // Iterate over each line in the conversation and use different voices
    conversation.forEach(line => {
      let utterance;

      if (line.startsWith(`${person1}:`)) {
        utterance = new SpeechSynthesisUtterance(line.replace(`${person1}:`, ''));
        utterance.voice = alexVoice; // Assign specific voice to Alex
      } else if (line.startsWith(`${person2}:`)) {
        utterance = new SpeechSynthesisUtterance(line.replace(`${person2}:`, ''));
        utterance.voice = jamieVoice; // Assign specific voice to Jamie
      }

      // Set language and other properties for the voice
      utterance.lang = 'en-US';
      utterance.rate = 1;
      utterance.pitch = 1;

      // Speak the line
      synth.speak(utterance);
    });
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
