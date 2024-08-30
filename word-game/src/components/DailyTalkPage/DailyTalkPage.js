import React, { useState, useEffect, useRef } from 'react';
import AWS from 'aws-sdk';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import DailyTalkIntroductionModal from '../DailyTalkIntroductionModal/DailyTalkIntroductionModal';
import DefinitionModal from '../DefinitionModal/DefinitionModal';
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
  const [selectedWord, setSelectedWord] = useState('');
  const [showDefinitionModal, setShowDefinitionModal] = useState(false);
  const [language, setLanguage] = useState('en');
  const [definition, setDefinition] = useState('');
  const [englishDefinition, setEnglishDefinition] = useState('');
  const [vietnameseDefinition, setVietnameseDefinition] = useState('');
  const [showVideo, setShowVideo] = useState(false); 
  const [currentVideoUrl, setCurrentVideoUrl] = useState(null);

  const videoRef = useRef(null);
  const conversationContainerRef = useRef(null); // Create a ref for the conversation container

  const person1 = "Aiden";
  const person2 = "Kaylee";

  const videoUrls = [
    "https://videos.pond5.com/two-happy-multiethnic-friends-standing-footage-125239637_main_xxl.mp4",
    "https://videos.pond5.com/two-young-good-friends-met-footage-105081696_main_xxl.mp4",
  ];

  AWS.config.update({
    region: process.env.REACT_APP_AWS_REGION,
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  });

  const polly = new AWS.Polly();

  useEffect(() => {
    selectRandomVideo();
  }, []);

  const selectRandomVideo = () => {
    const randomIndex = Math.floor(Math.random() * videoUrls.length);
    setCurrentVideoUrl(videoUrls[randomIndex]);
  };

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

    if (videoRef.current) {
      videoRef.current.play(); // Start playing the video when the conversation starts
    }

    if (audioUrls.length > 0) {
      let currentIndex = 0;

      const playNextAudio = async () => {
        if (currentIndex < audioUrls.length) {
          const line = conversation[currentIndex];
          const words = line
            .replace(`${line.startsWith(`${person1}:`) ? person1 : person2}:`, '') 
            .trim()
            .split(' ')
            .filter(Boolean);

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
          if (videoRef.current) {
            videoRef.current.pause(); // Pause the video when the conversation ends
          }
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
            const wordDuration = audio.duration / words.length;

            const interval = setInterval(() => {
              const currentTime = audio.currentTime;
              const expectedTime = wordDuration * wordIndex;

              if (currentTime >= expectedTime && wordIndex < words.length) {
                setActiveWord({ lineIndex, wordIndex });

                // Scroll the container to the active word
                if (conversationContainerRef.current) {
                  const activeWordElement = document.querySelector(
                    `.line-${lineIndex} .word-${wordIndex}`
                  );
                  if (activeWordElement) {
                    activeWordElement.scrollIntoView({
                      behavior: 'smooth',
                      block: 'center',
                    });
                  }
                }

                wordIndex++;
              }

              if (wordIndex >= words.length) {
                clearInterval(interval);
              }
            }, wordDuration * 1000);

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
    selectRandomVideo();
    generateConversation();
    setShowStartButton(true);
    setShowRepeatButton(false);
    setShowVideo(false);
    setTimeout(() => {
      setShowVideo(true);
    }, 100);
  };

  const handleWordClick = async (word) => {
    try {
      const response = await axios.post('https://apiwordgame.aidenkiettran.com/validate-word', {
        word: word.trim(),
      });
      const { englishDefinition, vietnameseDefinition } = response.data;

      setEnglishDefinition(englishDefinition);
      setVietnameseDefinition(vietnameseDefinition);
      setSelectedWord(word);
      setDefinition(englishDefinition);
      setShowDefinitionModal(true);
    } catch (error) {
      console.error('Error fetching definition:', error);
      setDefinition('No definition found.');
      setShowDefinitionModal(true);
    }
  };

  const toggleLanguage = () => {
    setLanguage((prevLanguage) => (prevLanguage === 'en' ? 'vi' : 'en'));
    setDefinition(language === 'en' ? vietnameseDefinition : englishDefinition);
  };

  const handleModalClose = (showVideo) => {
    if (showVideo) {
      setShowVideo(true);
    }
    generateConversation();
  };

  return (
    <div className="wrapper">
      <Navbar />

      {showModal && (
        <DailyTalkIntroductionModal onClose={handleModalClose} />
      )}

      <div className="main-content">
        <div className="left-column">
          <h1 className="daily-talk-title">Daily Talk</h1>
        </div>

        {showVideo && (
          <div className="video-container">
            <video key={currentVideoUrl} ref={videoRef} controls>
              <source src={currentVideoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        <div className="right-column">
          <div className="conversation-container" ref={conversationContainerRef}>
            {conversation.map((line, lineIndex) => {
              const speaker = line.startsWith(`${person1}:`) ? person1 : person2;
              const words = line
                .replace(`${speaker}:`, '')
                .trim()
                .split(' ')
                .filter(Boolean);
              return (
                <div key={lineIndex} className={`message-block ${speaker === person1 ? 'message-block-left' : 'message-block-right'} line-${lineIndex}`}>
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
                          className={`word-${wordIndex} ${activeWord.lineIndex === lineIndex && activeWord.wordIndex === wordIndex ? 'active-word' : ''}`}
                          onClick={() => handleWordClick(word.trim())}
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

        {showStartButton && (
          <div className="start-conversation-container">
            <button className="start-conversation-button" onClick={handlePlayConversation}>
              Start Reading
            </button>
            <button className="next-conversation-button" onClick={handleNextConversation}>
              Next
            </button>
          </div>
        )}

        {loadingNext ? (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        ) : (
          showRepeatButton && (
            <div className="repeat-next-conversation-container">
              <button className="icon-button repeat-button" onClick={handlePlayConversation} title="Repeat Conversation">
                <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="40px" height="40px">
                  <path d="M12 5V1L7 6l5 5V7c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6H4c0 4.418 3.582 8 8 8s8-3.582 8-8-3.582-8-8-8z"/>
                </svg>
              </button>
              <button className="icon-button next-icon-button" onClick={handleNextConversation} title="Next Conversation">
                <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="40px" height="40px">
                  <path d="M9 4l10 8-10 8z"/>
                </svg>
              </button>
            </div>
          )
        )}
      </div>

      <Footer />

      <DefinitionModal 
        show={showDefinitionModal} 
        onClose={() => setShowDefinitionModal(false)} 
        selectedWord={selectedWord} 
        language={language}
        toggleLanguage={toggleLanguage}
        definition={definition}
      />
    </div>
  );
};

export default DailyTalkPage;
