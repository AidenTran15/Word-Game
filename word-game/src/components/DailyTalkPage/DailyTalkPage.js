import React, { useState, useEffect } from 'react';
import AWS from 'aws-sdk';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import DailyTalkIntroductionModal from '../DailyTalkIntroductionModal/DailyTalkIntroductionModal';
import boyAvatar from '../../assets/boy-avatar.png';
import girlAvatar from '../../assets/girl-avatar.png';
import './DailyTalkPage.css';

const DailyTalkPage = () => {
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [audioUrls, setAudioUrls] = useState([]);
  const [activeWord, setActiveWord] = useState({ lineIndex: null, wordIndex: null });

  const person1 = "Aiden";
  const person2 = "Kaylee";

  // Configure AWS Polly with environment variables
  AWS.config.update({
    region: process.env.REACT_APP_AWS_REGION,
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  });

  const polly = new AWS.Polly();

  const generateConversation = async () => {
    setLoading(true);
    try {
      const response = await axios.post('https://apiwordgame.aidenkiettran.com/generate-daily-talk');
      let conversationText = response.data.conversation;

      conversationText = conversationText.replace(/Person 1:/g, `${person1}:`);
      conversationText = conversationText.replace(/Person 2:/g, `${person2}:`);

      const lines = conversationText.split('\n').filter(line => line.trim() !== '');
      setConversation(lines);
      setShowModal(false);

      // Generate speech for each line in the conversation
      const audioPromises = lines.map((line, index) => {
        const speaker = line.startsWith(`${person1}:`) ? person1 : person2;
        const cleanText = line.replace(`${speaker}:`, '').trim();

        const params = {
          OutputFormat: 'mp3',
          Text: cleanText,
          VoiceId: speaker === person1 ? 'Matthew' : 'Joanna',
          SampleRate: '16000',
        };

        // Use Polly to synthesize speech for each line
        return polly.synthesizeSpeech(params).promise().then(data => {
          const audioBlob = new Blob([data.AudioStream], { type: 'audio/mp3' });
          return URL.createObjectURL(audioBlob);
        });
      });

      // Wait for all audio URLs to be generated
      const generatedAudioUrls = await Promise.all(audioPromises);
      setAudioUrls(generatedAudioUrls);

    } catch (error) {
      console.error('Error generating conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayConversation = async () => {
    if (audioUrls.length > 0) {
      let currentIndex = 0;
  
      const playNextAudio = async () => {
        if (currentIndex < audioUrls.length) {
          const line = conversation[currentIndex];
          const words = line.replace(`${line.startsWith(`${person1}:`) ? person1 : person2}:`, '').trim().split(/\s+/);
  
          try {
            await playAudio(audioUrls[currentIndex], currentIndex, words); // Play current audio
            currentIndex++; // Move to the next audio
            playNextAudio(); // Immediately play the next audio
          } catch (error) {
            console.error('Error during audio playback:', error);
            playNextAudio(); // Try to play the next audio even if there was an error
          }
        } else {
          // Reset active word once all audios are played
          setActiveWord({ lineIndex: null, wordIndex: null });
        }
      };
  
      playNextAudio(); // Start the playback chain
    }
  };
  
  const playAudio = (url, lineIndex, words) => {
    return new Promise((resolve) => {
      const audio = new Audio(url);
  
      const playPromise = audio.play();
  
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            let wordIndex = 0;
            const interval = setInterval(() => {
              const currentTime = audio.currentTime;
              const wordDuration = audio.duration / words.length;
  
              if (currentTime >= wordDuration * wordIndex && wordIndex < words.length) {
                setActiveWord({ lineIndex, wordIndex });
                wordIndex++;
              }
  
              if (wordIndex >= words.length) {
                clearInterval(interval);
              }
            }, 100);
  
            audio.onended = () => {
              clearInterval(interval);
              resolve(); // Resolve the promise immediately after the audio ends
            };
          })
          .catch((error) => {
            console.error('Playback failed:', error);
            resolve(); // Resolve the promise even if playback fails
          });
      } else {
        console.error('Audio playback could not be initiated.');
        resolve();
      }
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
        </div>

        <div className="right-column">
          <div className="conversation-container">
            {conversation.map((line, lineIndex) => {
              const speaker = line.startsWith(`${person1}:`) ? person1 : person2;
              const words = line.replace(`${speaker}:`, '').trim().split(/\s+/);
              return (
                <div key={lineIndex} className={speaker === person1 ? 'message-block-left' : 'message-block-right'}>
                  <img
                    src={speaker === person1 ? boyAvatar : girlAvatar}
                    alt={`${speaker} avatar`}
                    className="avatar"
                  />
                  <div className={speaker === person1 ? 'chat-bubble aiden-bubble' : 'chat-bubble kaylee-bubble'}>
                    <p className="bubble-text">
                      {words.map((word, wordIndex) => (
                        <span
                          key={wordIndex}
                          className={
                            activeWord.lineIndex === lineIndex && activeWord.wordIndex === wordIndex
                              ? 'active-word'
                              : ''
                          }
                        >
                          {word}{' '}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {conversation.length > 0 && (
          <div className="icon-buttons">
            <button className="circle-play-button" onClick={handlePlayConversation}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="40px" height="40px">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
            <button className="circle-next-button" onClick={generateConversation}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="40px" height="40px">
                <path d="M10 6l6 6-6 6-1.42-1.42L13.16 12 8.58 7.42z" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default DailyTalkPage;
