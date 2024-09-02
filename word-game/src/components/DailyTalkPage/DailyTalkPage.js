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
    "https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/V_j81fAIx/videoblocks-43z_072_discussing_couple_home_couch_ryxfmzrhu__427504f2121c02a90da99020bb9bcf40__P360.mp4",
    "https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/Sks4W_9Alj1v0vmgb/118z-coupleobsh2-vc0oc38y0c__89e2e01b4c107b237b90cb2d7e1b9cd5__P360.mp4",
    "https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/DHmMj5B/couple-drinking-coffee-and-chatting-in-the-restaurant_n1rd2orz__850c7da8b865b8225d2bf4397eac5c06__P360.mp4",
    "https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/rTl3vg0veiylgd0ih/videoblocks-happy-young-couple-is-chatting-in-the-kitchen-the-family-is-drinking-coffee_sbokq0gkn__c5d824ec4ec02620e1f99fd1b971fe52__P360.mp4",
    "https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/GTYSdDW/videoblocks-young-couple-talking-and-drinking-coffee-on-a-date-in-a-modern-restaurant_h2fclswosx__e7879804164163c6e051fb0c3559394b__P360.mp4",
    "https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/HVzxMQxkil73u47k1/videoblocks-65dbdb9c9014c45dfad80e58_sqwdw_96p__9eafe9df7ae722a4cc1caf9b90b6e518__P360.mp4",
    "https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/B04Gfy1teiz3sdqe6/videoblocks-635982fdbffa5a5e4f9546d7_s1s6gsqhs__b2a94d657d56b82fdf1dab1a5f84c9f8__P360.mp4",
    "https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/BmI6UBJLWj5dnkc7q/videoblocks-112z_4k_19_rd3qsdudq__4695ec5153159087acffe28d1211cb56__P360.mp4",
    "https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/VZpg_YkTgilrvkdxa/videoblocks-224_tmvzdgvkifnlcxvlbmnlidiynq_r9jecgm2q__ccdbfb3ff2a14f79a5e00529f7692989__P360.mp4",
    "https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/GTYSdDW/man-and-woman-in-formal-wear-using-smart-phones-and-talking-at-coffee-break-in-the-cafe_btkltiuex__4a24ba19a4427f14f0ea5858332a1522__P360.mp4",
    "https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/NDcUKEpwx/couple-has-a-pleasant-conversation-at-the-cafe_rtx6mkzac__bec75e0e35543c3fa6112cd9e2067b86__P360.mp4",
    "https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/SNv7Pyhimz0q0vg/videoblocks-644d21f3036bd92338a6b731_hf9wvtue2__75201c08a9415c5a632c16ee450e0c8d__P360.mp4",
    "https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/HTtFscysMjfi6oi5o/videoblocks-211005_cafe_4k_31_bexjumia6__65232aa72a319e8ffd5405d3caee1a18__P360.mp4"
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

// In your DailyTalkPage component

const handlePlayConversation = async () => {
  setShowRepeatButton(false);
  setShowStartButton(false);

  let currentIndex = 0; // Move the declaration of currentIndex here

  if (videoRef.current) {
      videoRef.current.play(); // Start playing the video when the conversation starts

      // Add an event listener to replay the video when it ends
      videoRef.current.onended = () => {
          if (currentIndex < audioUrls.length) { // Replay only if the conversation is not finished
              videoRef.current.play();
          }
      };
  }

  if (audioUrls.length > 0) {

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
                    const lineHeight = activeWordElement.offsetHeight;
                    const containerScrollTop = conversationContainerRef.current.scrollTop;
                    const containerOffsetTop = conversationContainerRef.current.getBoundingClientRect().top;
                    const elementOffsetTop = activeWordElement.getBoundingClientRect().top;
                
                    const offset = lineHeight * 2; // Adjust to position the element at the second or third line
                    const scrollPosition = containerScrollTop + (elementOffsetTop - containerOffsetTop) - offset;
                
                    conversationContainerRef.current.scrollTo({
                      top: scrollPosition,
                      behavior: 'smooth',
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
        {showVideo && (
          <div className="video-container">
            <video key={currentVideoUrl} ref={videoRef} playsInline>
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
