import React, { useState } from 'react';
import axios from 'axios';
import AWS from 'aws-sdk';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import AIImage from '../../assets/AI-image.jpg';
import './FriendlyChatPage.css';

AWS.config.update({
  region: process.env.REACT_APP_AWS_REGION,
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
});

const polly = new AWS.Polly();

const FriendlyChatPage = () => {
  const [userInput, setUserInput] = useState('');
  const [conversation, setConversation] = useState([]);

  const handleSpeech = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setUserInput(speechResult);
    };
  };

  const handleSubmit = async () => {
    if (userInput.trim() === '') return;

    setConversation((prev) => [...prev, { role: 'user', content: userInput }]);

    try {
      const response = await axios.post('http://localhost:5000/converse', { userInput });
      const aiResponse = response.data.response;

      // Add AI response to the conversation
      setConversation((prev) => [...prev, { role: 'ai', content: aiResponse }]);

      // Convert AI response to speech using AWS Polly
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
      <div className="content-wrap">
        <div className="chat-container">
          <h1>Casual Talk</h1>
          <div className="ai-image-container">
            <img src={AIImage} alt="AI" className="ai-image" />
          </div>
          <div className="input-section">
            <button onClick={handleSpeech}>🎤 Speak</button>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your message or use the mic"
            />
            <button onClick={handleSubmit}>Send</button>
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
