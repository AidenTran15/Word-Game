import React, { useState, useRef } from 'react';
import axios from 'axios';
import AWS from 'aws-sdk';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import './FriendlyChatPage.css';

AWS.config.update({
  region: process.env.REACT_APP_AWS_REGION,
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
});

const polly = new AWS.Polly();

const FriendlyChatPage = () => {
  const [userInput, setUserInput] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [aiMode, setAiMode] = useState('Chat'); // Default mode is 'Chat'
  const recognitionRef = useRef(null);

  const handleModeChange = (e) => {
    setAiMode(e.target.value);
    if (e.target.value === 'AI-Interview') {
      startInterview();
    }
  };

  const startInterview = async () => {
    try {
      const response = await axios.post('http://localhost:5000/start-interview');
      const firstQuestion = response.data.question;
      setConversation([{ role: 'ai', content: firstQuestion }]);
    } catch (error) {
      console.error('Error starting interview:', error);
    }
  };

  const startSpeechRecognition = () => {
    if (!recognitionRef.current) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const speechResult = event.results[0][0].transcript;
        setUserInput(speechResult);

        // Hide the waveform and show the input field again when speech ends
        setIsSpeaking(false);
      };

      recognitionRef.current.onend = () => {
        // Hide the waveform and show the input field again when speech ends
        setIsSpeaking(false);
      };
    }

    // Show the waveform and hide the input field when speech starts
    setIsSpeaking(true);
    recognitionRef.current.start();
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsSpeaking(false); // Ensure waveform is hidden when speech is manually stopped
    }
  };

  const handleSubmit = async () => {
    if (userInput.trim() === '') return;

    setConversation((prev) => [...prev, { role: 'user', content: userInput }]);

    try {
      const response = await axios.post('http://localhost:5000/converse', { userInput });
      const aiResponse = response.data.response;

      setConversation((prev) => [...prev, { role: 'ai', content: aiResponse }]);

      const pollyParams = {
        OutputFormat: 'mp3',
        Text: aiResponse,
        VoiceId: 'Joanna',
      };

      polly.synthesizeSpeech(pollyParams, (err, data) => {
        if (err) {
          console.error('Error synthesizing speech:', err);
        } else if (data.AudioStream) {
          const uInt8Array = new Uint8Array(data.AudioStream);
          const audioBlob = new Blob([uInt8Array.buffer], { type: 'audio/mp3' });
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          audio.play();
        }
      });

      setUserInput('');
    } catch (error) {
      console.error('Error communicating with AI:', error);
    }
  };

  return (
    <div className="page-container">
      <Navbar />
      {/* Dropdown for AI mode */}
      <select className="ai-mode-dropdown" onChange={handleModeChange} value={aiMode}>
        <option value="Chat">Chat</option>
        <option value="AI-Interview">AI-Interview</option>
      </select>
      <div className="content-wrap">
        <div className="chat-container">
          <div className="input-section">
            <button 
              onMouseDown={startSpeechRecognition} 
              onMouseUp={stopSpeechRecognition} 
              className="speak-button">
              🎤
            </button>
            <div className="input-wrapper">
              {!isSpeaking ? (
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Type message or use the mic"
                  className="user-input"
                />
              ) : (
                <div className="waveform">
                  <div className="bar"></div>
                  <div className="bar"></div>
                  <div className="bar"></div>
                  <div className="bar"></div>
                  <div className="bar"></div>
                  <div className="bar"></div>
                  <div className="bar"></div>
                </div>
              )}
            </div>
            <button onClick={handleSubmit} className="send-button"></button>
          </div>
          <div className="conversation-section">
            {conversation.map((entry, index) => (
              <div key={index} className={entry.role}>
                <strong>{entry.role === 'user' ? 'You' : 'AI'}:</strong> {entry.content}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FriendlyChatPage;
