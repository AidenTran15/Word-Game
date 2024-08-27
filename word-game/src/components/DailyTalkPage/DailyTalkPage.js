import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar'; // Import Navbar component
import Footer from '../Footer/Footer'; // Import Footer component
import DailyTalkIntroductionModal from '../DailyTalkIntroductionModal/DailyTalkIntroductionModal'; // Import the modal
import './DailyTalkPage.css'; // Import the CSS

const DailyTalkPage = () => {
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [voices, setVoices] = useState([]);
  const [alexVoice, setAlexVoice] = useState(null);
  const [jamieVoice, setJamieVoice] = useState(null);
  const [showModal, setShowModal] = useState(true); // Modal visibility state

  const person1 = "Aiden";
  const person2 = "Kaylee";

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
      setShowModal(false); // Close the modal after generating the conversation
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

      {showModal && (
        <DailyTalkIntroductionModal onClose={generateConversation} />
      )}

      <div className="main-content">
        <div className="left-column">
          <h1 className="daily-talk-title">Daily Talk</h1>
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
              Play Conversation
            </button>
          )}
        </div>
        
        <div className="right-column">
          <div className="conversation-container">
            {conversation.map((line, index) => (
              <div key={index} className={line.startsWith(`${person1}:`) ? 'chat-bubble aiden-bubble' : 'chat-bubble kaylee-bubble'}>
                <p className="bubble-text">{line}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DailyTalkPage;
