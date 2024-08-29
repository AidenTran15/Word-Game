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
  const [showRepeatButton, setShowRepeatButton] = useState(false);
  const [showStartButton, setShowStartButton] = useState(true);
  const [loadingNext, setLoadingNext] = useState(false);

  const person1 = "Aiden";
  const person2 = "Kaylee";

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

      const audioPromises = lines.map((line, index) => {
        const speaker = line.startsWith(`${person1}:`) ? person1 : person2;
        const cleanText = line.replace(`${speaker}:`, '').trim();

        const params = {
          OutputFormat: 'mp3',
          Text: cleanText,
          VoiceId: speaker === person1 ? 'Matthew' : 'Joanna',
          SampleRate: '16000',
        };

        return polly.synthesizeSpeech(params).promise().then(data => {
          const audioBlob = new Blob([data.AudioStream], { type: 'audio/mp3' });
          return URL.createObjectURL(audioBlob);
        });
      });

      const generatedAudioUrls = await Promise.all(audioPromises);
      setAudioUrls(generatedAudioUrls);

    } catch (error) {
      console.error('Error generating conversation:', error);
    } finally {
      setLoading(false);
      setLoadingNext(false);
    }
  };

  const handlePlayConversation = async () => {
    setShowRepeatButton(false);
    setShowStartButton(false);

    if (audioUrls.length > 0) {
      let currentIndex = 0;
  
      const playNextAudio = async () => {
        if (currentIndex < audioUrls.length) {
          const line = conversation[currentIndex];
          const words = line.replace(`${line.startsWith(`${person1}:`) ? person1 : person2}:`, '').trim().split(/\s+/);
  
          try {
            await playAudio(audioUrls[currentIndex], currentIndex, words);
            currentIndex++;
            playNextAudio();
          } catch (error) {
            console.error('Error during audio playback:', error);
            playNextAudio();
          }
        } else {
          setActiveWord({ lineIndex: null, wordIndex: null });
          setShowRepeatButton(true);
        }
      };
  
      playNextAudio();
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
              resolve();
            };
          })
          .catch((error) => {
            console.error('Playback failed:', error);
            resolve();
          });
      } else {
        console.error('Audio playback could not be initiated.');
        resolve();
      }
    });
  };

  const handleNextConversation = () => {
    setLoadingNext(true);
    generateConversation();
    setShowStartButton(true);
    setShowRepeatButton(false);
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

        {showStartButton && (
          <div className="start-conversation-container">
            <button className="start-conversation-button" onClick={handlePlayConversation}>
              Start Conversation
            </button>
          </div>
        )}

        <div className="right-column">
          <div className="conversation-container">
            {loadingNext ? (
              <div className="spinner-container">
                <div className="spinner"></div>
              </div>
            ) : (
              conversation.map((line, lineIndex) => {
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
              })
            )}
          </div>
        </div>

        {showRepeatButton && (
          <div className="repeat-next-conversation-container">
            <button className="repeat-conversation-button" onClick={handlePlayConversation}>
              Repeat Conversation
            </button>
            <button className="next-conversation-button" onClick={handleNextConversation}>
              Next Conversation
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default DailyTalkPage;
