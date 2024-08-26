import React, { useState } from 'react';
import axios from 'axios';

const DailyTalkPage = () => {
  const [conversation, setConversation] = useState('');
  const [loading, setLoading] = useState(false);
  const [audio, setAudio] = useState(null);

  const generateConversation = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/generate-daily-talk');
      setConversation(response.data.conversation);

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
      {conversation && (
        <div>
          <p>{conversation}</p>
          <button onClick={handlePlayAudio} disabled={!audio}>
            Play Conversation
          </button>
        </div>
      )}
    </div>
  );
};

export default DailyTalkPage;
