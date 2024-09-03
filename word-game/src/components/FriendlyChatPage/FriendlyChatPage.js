import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar'; // Adjust the path as needed
import Footer from '../Footer/Footer'; // Adjust the path as needed
import './FriendlyChatPage.css'; // Import the CSS file for styling

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

      setConversation((prev) => [...prev, { role: 'ai', content: aiResponse }]);
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
