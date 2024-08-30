import React, { useState, useEffect } from 'react';
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
  const [showVideo, setShowVideo] = useState(false); // State to manage video visibility
  const [currentVideoUrl, setCurrentVideoUrl] = useState(null);


  const person1 = "Aiden";
  const person2 = "Kaylee";

  const videoUrls = [
    "https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/VZpg_YkTgilrvkdxa/videoblocks-224_tmvzdgvkifnlcxvlbmnlidiynq_r9jecgm2q__ccdbfb3ff2a14f79a5e00529f7692989__P360.mp4",
    "https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/qmraJpx/videoblocks-m1430v093_4k_rpksakgqn__4730eb51fc1fb5f4cc3e43c417b82b32__P360.mp4",
    "https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/qmraJpx/videoblocks-m1430v099_4k_rpujx4zch__592661030867b94bd414a99255c7f9fe__P360.mp4",
    "https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/SNv7Pyhimz0q0vg/videoblocks-stylish-young-man-chatting-with-girlfriend-in-the-park-on-sunny-summer-day-couple-in-love-talking-outdoors-wearing-similar-casual-clothes-sun-shines-on-the-background_s5vzup5z___9aa0f60245b925b04652e8518ea63bc4__P360.mp4",   

    "https://videos.pond5.com/conversation-between-two-friends-street-footage-273366371_main_xxl.mp4"   

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
    setShowVideo(true); // Show the video when the conversation starts
    setShowRepeatButton(false);
    setShowStartButton(false);

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
    generateConversation();
    setShowStartButton(true);
    setShowRepeatButton(false);
    selectRandomVideo(); 
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

        {showVideo && (
          <div className="video-container">
            <video controls autoPlay loop width="100%">
              <source src={currentVideoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}


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

        <div className="right-column">
          <div className="conversation-container">
            {conversation.map((line, lineIndex) => {
              const speaker = line.startsWith(`${person1}:`) ? person1 : person2;
              const words = line
                .replace(`${speaker}:`, '')
                .trim()
                .split(' ')
                .filter(Boolean);
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
                            word.trim() && activeWord.lineIndex === lineIndex && activeWord.wordIndex === wordIndex
                              ? 'active-word'
                              : ''
                          }
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
