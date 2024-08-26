import React, { useState } from 'react';
import axios from 'axios';

const DailyTalkPage = () => {
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [audio, setAudio] = useState(null);

  const generateConversation = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/generate-daily-talk');
      
      // Assuming the conversation is returned as a single string, split it into lines
      const lines = response.data.conversation.split('\n').filter(line => line.trim() !== '');
      setConversation(lines);

      // Fetch audio using a text-to-speech API like Google Cloud Text-to-Speech
      const audioResponse = await axios.post('https://text-to-speech-api-url', {
        text: response.data.conversation,
        voice: 'en-US-Standard-C'
      });

      setAudio(audioResponse.data.audioUrl);
    } catch (error) {
      console.error('Error generating conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAudio = () => {
    if (audio) {
      const audioElement = new Audio(audio);
      audioElement.play();
    }
  };

  return (
    <div>
      <h1>Daily Talk</h1>
      <button onClick={generateConversation} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Daily Talk'}
      </button>
      
      <div className="conversation-container">
        {conversation.map((line, index) => (
          <p key={index} className={line.startsWith('Alex:') ? 'alex' : 'jamie'}>
            {line}
          </p>
        ))}
      </div>

      {conversation.length > 0 && (
        <button className="play-button" onClick={handlePlayAudio}>
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
  );
};

export default DailyTalkPage;
